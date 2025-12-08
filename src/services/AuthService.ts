/**
 * Service d'authentification
 * Gère l'inscription, la connexion et la déconnexion
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { RegisterRequest, LoginRequest, LoginResponse } from '../types/Backend';
import logger from '../utils/logger';

class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   * @param userData - Données d'inscription
   * @returns Réponse de l'API
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<string>> {
    try {
      logger.info('🔐 Tentative d\'inscription', {
        email: userData.email,
        role: userData.role,
      });

      const response = await apiClient.post<string>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData, false);

      if (response.success) {
        logger.success('✅ Inscription réussie', { email: userData.email });
      } else {
        logger.error('❌ Échec de l\'inscription', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de l\'inscription', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de l\'inscription',
      };
    }
  }

  /**
   * Connexion d'un utilisateur
   * @param credentials - Identifiants de connexion (email, password)
   * @returns Réponse de l'API avec le token et les infos utilisateur
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      logger.info('🔐 Tentative de connexion', { email: credentials.email });

      const response = await apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials, false);

      if (response.success && response.data) {
        // Sauvegarder le token et les infos utilisateur
        await apiClient.saveToken(response.data.token);
        await apiClient.saveUserInfo(response.data.idUser, response.data.role, response.data.nom);

        logger.success('✅ Connexion réussie', {
          userId: response.data.idUser,
          role: response.data.role,
          nom: response.data.nom,
        });
      } else {
        logger.error('❌ Échec de connexion', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la connexion', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la connexion',
      };
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      logger.info('🔐 Déconnexion en cours');

      // Supprimer toutes les données utilisateur
      await apiClient.clearUserData();

      logger.success('✅ Déconnexion réussie');
    } catch (error: any) {
      logger.error('❌ Erreur lors de la déconnexion', error);
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns true si connecté, false sinon
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await apiClient.getToken();
      return token !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<{ userId: string | null; role: string | null; name: string | null }> {
    return await apiClient.getUserInfo();
  }
}

// Instance singleton du service d'authentification
export const authService = new AuthService();

export default authService;
