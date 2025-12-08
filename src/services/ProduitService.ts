/**
 * Service de gestion des produits
 * Permet de récupérer, créer et supprimer des produits
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Produit, CreateProduitRequest } from '../types/Backend';
import logger from '../utils/logger';

class ProduitService {
  /**
   * Récupère tous les produits
   * @returns Liste des produits
   */
  async getAllProduits(): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info('📦 Récupération de tous les produits');

      const response = await apiClient.get<Produit[]>(API_CONFIG.ENDPOINTS.PRODUITS.GET_ALL);

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} produits récupérés`);
      } else {
        logger.error('❌ Échec de récupération des produits', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des produits', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Récupère les produits d'une catégorie spécifique
   * @param idCategorie - ID de la catégorie
   * @returns Liste des produits de la catégorie
   */
  async getProduitsByCategorie(idCategorie: number): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info(`📦 Récupération des produits de la catégorie ${idCategorie}`);

      const response = await apiClient.get<Produit[]>(API_CONFIG.ENDPOINTS.PRODUITS.GET_BY_CATEGORY(idCategorie));

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} produits récupérés pour la catégorie ${idCategorie}`);
      } else {
        logger.error('❌ Échec de récupération des produits', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des produits par catégorie', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Crée un nouveau produit (réservé aux vendeurs)
   * @param produitData - Données du produit à créer
   * @returns Le produit créé
   */
  async createProduit(produitData: CreateProduitRequest): Promise<ApiResponse<Produit>> {
    try {
      logger.info('📦 Création d\'un nouveau produit', { nom: produitData.nom });

      const response = await apiClient.post<Produit>(API_CONFIG.ENDPOINTS.PRODUITS.CREATE, produitData);

      if (response.success && response.data) {
        logger.success('✅ Produit créé avec succès', {
          id: response.data.idProduit,
          nom: response.data.nom,
        });
      } else {
        logger.error('❌ Échec de création du produit', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la création du produit', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Supprime un produit
   * @param idProduit - ID du produit à supprimer
   * @returns Réponse de l'API
   */
  async deleteProduit(idProduit: number): Promise<ApiResponse<void>> {
    try {
      logger.info(`📦 Suppression du produit ${idProduit}`);

      const response = await apiClient.delete<void>(API_CONFIG.ENDPOINTS.PRODUITS.DELETE(idProduit));

      if (response.success) {
        logger.success(`✅ Produit ${idProduit} supprimé avec succès`);
      } else {
        logger.error('❌ Échec de suppression du produit', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la suppression du produit', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }
}

// Instance singleton du service de produits
export const produitService = new ProduitService();

export default produitService;
