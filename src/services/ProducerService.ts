/**
 * Service de gestion du producteur
 * Gère les produits, commandes et statistiques du producteur
 *
 * Note: Le backend n'a pas d'endpoints spécifiques pour les vendeurs.
 * On utilise les endpoints existants et on filtre côté client.
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Produit, CreateProduitRequest, Commande, Categorie } from '../types/Backend';
import logger from '../utils/logger';

export interface ProducerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageRating: number;
}

export interface ProducerProduct extends Produit {
  totalSold?: number;
}

class ProducerService {
  /**
   * Récupère tous les produits du producteur
   * Note: Utilise GET /api/produits et filtre par vendeur.idUser côté client
   */
  async getMyProducts(vendeurId: number): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info('📦 Récupération des produits du producteur', { vendeurId });

      // Récupérer tous les produits depuis l'API
      const response = await apiClient.get<Produit[]>(
        API_CONFIG.ENDPOINTS.PRODUITS.GET_ALL
      );

      if (response.success && response.data) {
        // Filtrer les produits par vendeur côté client
        const myProducts = response.data.filter(
          (produit) => produit.vendeur?.idUser === vendeurId
        );

        logger.success('✅ Produits récupérés', {
          total: response.data.length,
          filtered: myProducts.length
        });

        return {
          success: true,
          data: myProducts,
          status: response.status,
        };
      } else {
        logger.error('❌ Échec récupération produits', { error: response.error });
        return response;
      }
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des produits', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des produits',
      };
    }
  }

  /**
   * Crée un nouveau produit avec image
   * L'API attend les paramètres en query string et l'image en multipart/form-data
   */
  async createProduct(
    productData: Omit<CreateProduitRequest, 'photoUrl'>,
    imageFile?: {
      uri: string;
      type: string;
      name: string;
    }
  ): Promise<ApiResponse<Produit>> {
    try {
      logger.info('➕ Création d\'un nouveau produit', { nom: productData.nom });

      // Construire l'URL avec les paramètres en query string
      const queryParams = new URLSearchParams({
        nom: productData.nom,
        prix: productData.prix.toString(),
        quantite: productData.quantite.toString(),
        description: productData.description || '',
        idCategorie: productData.idCategorie.toString(),
      });

      const url = `${API_CONFIG.ENDPOINTS.PRODUITS.CREATE}?${queryParams.toString()}`;

      // Créer le FormData avec l'image
      const formData = new FormData();

      if (imageFile) {
        formData.append('image', {
          uri: imageFile.uri,
          type: imageFile.type,
          name: imageFile.name,
        } as any);
      } else {
        // Si pas d'image, créer un blob vide (l'API requiert le champ image)
        // On envoie une image par défaut ou un placeholder
        formData.append('image', {
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          type: 'image/png',
          name: 'placeholder.png',
        } as any);
      }

      const response = await apiClient.uploadMultipart<Produit>(url, formData);

      if (response.success) {
        logger.success('✅ Produit créé avec succès', { id: response.data?.idProduit });
      } else {
        logger.error('❌ Échec création produit', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la création du produit', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du produit',
      };
    }
  }

  /**
   * Met à jour un produit existant
   */
  async updateProduct(productId: number, productData: Partial<CreateProduitRequest>): Promise<ApiResponse<Produit>> {
    try {
      logger.info('📝 Mise à jour du produit', { productId });

      const response = await apiClient.put<Produit>(
        `${API_CONFIG.ENDPOINTS.PRODUITS.CREATE}/${productId}`,
        productData
      );

      if (response.success) {
        logger.success('✅ Produit mis à jour');
      } else {
        logger.error('❌ Échec mise à jour produit', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la mise à jour du produit', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du produit',
      };
    }
  }

  /**
   * Supprime un produit
   */
  async deleteProduct(productId: number): Promise<ApiResponse<void>> {
    try {
      logger.info('🗑️ Suppression du produit', { productId });

      const response = await apiClient.delete<void>(
        API_CONFIG.ENDPOINTS.PRODUITS.DELETE(productId)
      );

      if (response.success) {
        logger.success('✅ Produit supprimé');
      } else {
        logger.error('❌ Échec suppression produit', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la suppression du produit', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du produit',
      };
    }
  }

  /**
   * Récupère les commandes du producteur
   * Note: Le backend n'a pas d'endpoint pour les commandes vendeur.
   * On retourne une liste vide pour l'instant.
   * TODO: Demander au backend d'ajouter GET /api/commandes/vendeur/{id}
   */
  async getMyOrders(vendeurId: number): Promise<ApiResponse<Commande[]>> {
    try {
      logger.info('📋 Récupération des commandes du producteur', { vendeurId });

      // Le backend n'a pas d'endpoint pour les commandes par vendeur
      // On retourne une liste vide avec un message informatif
      logger.warn('⚠️ Endpoint commandes vendeur non disponible dans le backend');

      return {
        success: true,
        data: [],
        status: 200,
      };
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des commandes', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des commandes',
      };
    }
  }

  /**
   * Récupère les statistiques du producteur
   * Note: Le backend n'a pas d'endpoint stats. On calcule les stats localement.
   */
  async getStats(vendeurId: number): Promise<ApiResponse<ProducerStats>> {
    try {
      logger.info('📊 Récupération des statistiques', { vendeurId });

      // Récupérer les produits du vendeur pour calculer les stats
      const productsResponse = await this.getMyProducts(vendeurId);

      if (productsResponse.success && productsResponse.data) {
        const products = productsResponse.data;

        // Calculer les statistiques à partir des produits
        const stats: ProducerStats = {
          totalProducts: products.length,
          totalOrders: 0, // Pas d'accès aux commandes vendeur
          totalRevenue: 0, // Pas d'accès aux commandes vendeur
          pendingOrders: 0, // Pas d'accès aux commandes vendeur
          averageRating: products.length > 0
            ? products.reduce((acc, p) => acc + (p.vendeur?.note || 0), 0) / products.length
            : 0,
        };

        logger.success('✅ Statistiques calculées localement', stats);

        return {
          success: true,
          data: stats,
          status: 200,
        };
      } else {
        // Si on ne peut pas récupérer les produits, retourner des stats à zéro
        return {
          success: true,
          data: {
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            averageRating: 0,
          },
          status: 200,
        };
      }
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des statistiques', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des statistiques',
      };
    }
  }

  /**
   * Récupère toutes les catégories disponibles
   */
  async getCategories(): Promise<ApiResponse<Categorie[]>> {
    try {
      logger.info('📁 Récupération des catégories');

      const response = await apiClient.get<Categorie[]>(
        API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL
      );

      if (response.success) {
        logger.success('✅ Catégories récupérées', { count: response.data?.length });
      } else {
        logger.error('❌ Échec récupération catégories', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des catégories', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des catégories',
      };
    }
  }
}

export const producerService = new ProducerService();
export default producerService;
