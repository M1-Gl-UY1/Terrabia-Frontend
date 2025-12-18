/**
 * Service de Gestion des Catégories
 *
 * Gère toutes les opérations liées aux catégories de produits.
 */

import API_CONFIG from '../config/api.config';
import apiClient from '../utils/apiClient';
import { logger } from '../utils/logger';
import { Categorie } from '../types/Backend';

/**
 * Requête pour créer une catégorie
 */
export interface CreateCategoryRequest {
  nomCat: string;
}

/**
 * Réponse standard de l'API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class CategoryService {
  private static instance: CategoryService;

  private constructor() {}

  static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  /**
   * Récupère toutes les catégories
   */
  async getAllCategories(): Promise<ApiResponse<Categorie[]>> {
    try {
      logger.info('[CategoryService] Récupération des catégories...');

      const endpoint = API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL;
      const response = await apiClient.get<Categorie[]>(endpoint);

      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de la récupération des catégories');
      }

      // Gérer le cas où response.data est une string "No response content"
      let categories: Categorie[] = [];

      if (Array.isArray(response.data)) {
        categories = response.data;
      } else if (typeof response.data === 'string') {
        logger.warn('[CategoryService] Réponse vide du backend, retour tableau vide');
        categories = [];
      } else {
        logger.warn('[CategoryService] Format de réponse inattendu:', { data: response.data });
        categories = [];
      }

      logger.success('[CategoryService] Catégories récupérées', {
        count: categories.length,
      });

      return {
        success: true,
        data: categories,
      };
    } catch (error: any) {
      logger.error('[CategoryService] Erreur lors de la récupération des catégories', {
        error,
      });
      return {
        success: false,
        error: error?.message || 'Impossible de récupérer les catégories',
      };
    }
  }

  /**
   * Crée une nouvelle catégorie
   */
  async createCategory(
    request: CreateCategoryRequest
  ): Promise<ApiResponse<Categorie>> {
    try {
      logger.info('[CategoryService] Création de la catégorie...', {
        nomCat: request.nomCat,
      });

      // Construire l'objet complet pour le backend
      const payload = {
        nomCat: request.nomCat,
        produits: [], // Tableau vide au lieu de null
      };

      logger.info('[CategoryService] Payload envoyé:', payload);

      const endpoint = API_CONFIG.ENDPOINTS.CATEGORIES.CREATE;
      const response = await apiClient.post<Categorie>(endpoint, payload);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la création de la catégorie');
      }

      logger.success('[CategoryService] Catégorie créée avec succès', {
        idCat: response.data.idCat,
        nomCat: response.data.nomCat,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      logger.error('[CategoryService] Erreur lors de la création de la catégorie', {
        error,
      });
      return {
        success: false,
        error: error?.message || 'Impossible de créer la catégorie',
      };
    }
  }

  /**
   * Vérifie si une catégorie existe déjà par son nom
   */
  async categoryExists(nomCat: string): Promise<boolean> {
    try {
      const response = await this.getAllCategories();

      if (!response.success || !response.data) {
        return false;
      }

      // Vérifier que nomCat existe avant d'appeler toLowerCase()
      return response.data.some(
        (cat) => cat.nomCat && cat.nomCat.toLowerCase() === nomCat.toLowerCase()
      );
    } catch (error) {
      logger.error('[CategoryService] Erreur lors de la vérification de la catégorie', {
        error,
      });
      return false;
    }
  }

  /**
   * Recherche une catégorie par son ID
   */
  async getCategoryById(idCat: number): Promise<ApiResponse<Categorie>> {
    try {
      const response = await this.getAllCategories();

      if (!response.success || !response.data) {
        return {
          success: false,
          error: 'Impossible de récupérer les catégories',
        };
      }

      const category = response.data.find((cat) => cat.idCat === idCat);

      if (!category) {
        return {
          success: false,
          error: 'Catégorie non trouvée',
        };
      }

      return {
        success: true,
        data: category,
      };
    } catch (error: any) {
      logger.error('[CategoryService] Erreur lors de la recherche de la catégorie', {
        error,
      });
      return {
        success: false,
        error: error?.message || 'Impossible de trouver la catégorie',
      };
    }
  }
}

export default CategoryService.getInstance();
