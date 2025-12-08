/**
 * Client HTTP pour les requêtes API avec gestion automatique:
 * - des tokens JWT
 * - du logging
 * - des retry en cas d'échec
 * - des timeouts
 */

import API_CONFIG from '../config/api.config';
import logger from './logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const STORAGE_KEYS = {
  TOKEN: '@terrabia_token',
  USER_ID: '@terrabia_user_id',
  USER_ROLE: '@terrabia_user_role',
  USER_NAME: '@terrabia_user_name',
};

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }

  /**
   * Sauvegarde le token JWT
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      logger.debug('Token saved successfully');
    } catch (error) {
      logger.error('Failed to save token', error);
    }
  }

  /**
   * Récupère le token JWT
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      return token;
    } catch (error) {
      logger.error('Failed to get token', error);
      return null;
    }
  }

  /**
   * Supprime le token JWT (déconnexion)
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      logger.debug('Token removed successfully');
    } catch (error) {
      logger.error('Failed to remove token', error);
    }
  }

  /**
   * Sauvegarde les informations utilisateur
   */
  async saveUserInfo(userId: number, role: string, name: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.USER_ID, userId.toString()],
        [STORAGE_KEYS.USER_ROLE, role],
        [STORAGE_KEYS.USER_NAME, name],
      ]);
      logger.debug('User info saved successfully', { userId, role, name });
    } catch (error) {
      logger.error('Failed to save user info', error);
    }
  }

  /**
   * Récupère les informations utilisateur
   */
  async getUserInfo(): Promise<{ userId: string | null; role: string | null; name: string | null }> {
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.USER_NAME,
      ]);

      return {
        userId: values[0][1],
        role: values[1][1],
        name: values[2][1],
      };
    } catch (error) {
      logger.error('Failed to get user info', error);
      return { userId: null, role: null, name: null };
    }
  }

  /**
   * Supprime toutes les données utilisateur (déconnexion complète)
   */
  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.USER_ID,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.USER_NAME,
      ]);
      logger.debug('User data cleared successfully');
    } catch (error) {
      logger.error('Failed to clear user data', error);
    }
  }

  /**
   * Prépare les headers de la requête
   */
  private async prepareHeaders(
    customHeaders?: Record<string, string>,
    requiresAuth: boolean = true,
  ): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    // Ajouter le token JWT si nécessaire
    if (requiresAuth) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Effectue une requête HTTP avec gestion des erreurs et retry
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const {
      method,
      url,
      data,
      headers: customHeaders,
      requiresAuth = true,
      timeout = API_CONFIG.TIMEOUT,
    } = config;

    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    const headers = await this.prepareHeaders(customHeaders, requiresAuth);

    // Log de la requête
    logger.apiRequest(method, fullURL, data, headers);

    try {
      // Créer un contrôleur pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      // Ajouter le body pour POST, PUT, PATCH
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestOptions.body = JSON.stringify(data);
      }

      // Effectuer la requête
      const response = await fetch(fullURL, requestOptions);

      // Arrêter le timeout
      clearTimeout(timeoutId);

      // Récupérer le corps de la réponse
      const contentType = response.headers.get('content-type');
      let responseData: any;

      // Toujours récupérer le contenu en texte d'abord
      const textContent = await response.text();

      // Essayer de parser en JSON si le Content-Type l'indique
      if (contentType && contentType.includes('application/json') && textContent) {
        try {
          responseData = JSON.parse(textContent);
        } catch (jsonError) {
          // Si le parsing JSON échoue, utiliser le texte brut
          logger.debug('Response is text instead of JSON', {
            status: response.status,
            contentType,
            text: textContent.substring(0, 200),
          });
          responseData = textContent;
        }
      } else {
        // Si pas de Content-Type JSON ou texte vide
        responseData = textContent || 'No response content';
      }

      // Vérifier le statut de la réponse
      if (response.ok) {
        // Succès (2xx)
        logger.apiResponse(method, fullURL, response.status, responseData);

        return {
          success: true,
          data: responseData,
          status: response.status,
        };
      } else {
        // Erreur HTTP (4xx, 5xx)
        let errorMessage: string;

        if (typeof responseData === 'string') {
          // Si c'est du texte brut, l'utiliser directement
          // Nettoyer le message si c'est du HTML
          if (responseData.includes('<!DOCTYPE') || responseData.includes('<html')) {
            errorMessage = 'Erreur serveur, veuillez réessayer';
          } else {
            // Texte brut du serveur (ex: "Email already exists")
            errorMessage = responseData.trim();
          }
        } else {
          errorMessage = responseData?.message || responseData?.error || 'Une erreur est survenue';
        }

        logger.apiError(method, fullURL, {
          status: response.status,
          message: errorMessage,
          data: responseData,
          contentType,
        });

        return {
          success: false,
          error: errorMessage,
          status: response.status,
          data: responseData,
        };
      }
    } catch (error: any) {
      // Erreur réseau ou timeout
      let errorMessage: string;

      if (error.name === 'AbortError') {
        errorMessage = 'Le serveur met trop de temps à répondre. Veuillez patienter et réessayer.';
      } else if (error.message?.includes('Network request failed')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else {
        errorMessage = error.message || 'Erreur réseau';
      }

      logger.apiError(method, fullURL, error);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Méthodes raccourcies pour les différents types de requêtes
   */

  async get<T = any>(url: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, requiresAuth });
  }

  async post<T = any>(url: string, data?: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, requiresAuth });
  }

  async put<T = any>(url: string, data?: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, requiresAuth });
  }

  async delete<T = any>(url: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, requiresAuth });
  }

  async patch<T = any>(url: string, data?: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, requiresAuth });
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();

export default apiClient;
