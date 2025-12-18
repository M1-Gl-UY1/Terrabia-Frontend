/**
 * Service de gestion du producteur
 * Gère les produits, commandes et statistiques du producteur
 *
 * Note: Certains endpoints ne sont pas encore implémentés côté backend.
 * Voir docs/API_REQUIREMENTS.md pour la liste complète.
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Produit, CreateProduitRequest, Commande, Categorie, StatutCommande } from '../types/Backend';
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
   * Endpoint: GET /api/produits/vendeur/{idVendeur}
   */
  async getMyProducts(vendeurId: number): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info('📦 Récupération des produits du producteur', { vendeurId });

      // Essayer d'abord l'endpoint dédié vendeur
      const response = await apiClient.get<Produit[]>(
        API_CONFIG.ENDPOINTS.VENDEUR.GET_PRODUCTS(vendeurId)
      );

      if (response.success && response.data) {
        logger.success('✅ Produits récupérés', { count: response.data.length });
        return response;
      }

      // Fallback: Si l'endpoint vendeur n'existe pas (403/404),
      // utiliser GET /api/produits et filtrer côté client
      if (response.status === 403 || response.status === 404) {
        logger.warn('⚠️ Endpoint vendeur non disponible, fallback sur /api/produits');

        const allProductsResponse = await apiClient.get<Produit[]>(
          API_CONFIG.ENDPOINTS.PRODUITS.GET_ALL
        );

        if (allProductsResponse.success && allProductsResponse.data) {
          const myProducts = allProductsResponse.data.filter(
            (produit) => produit.vendeur?.idUser === vendeurId
          );

          logger.success('✅ Produits filtrés', {
            total: allProductsResponse.data.length,
            filtered: myProducts.length,
          });

          return {
            success: true,
            data: myProducts,
            status: 200,
          };
        }

        return allProductsResponse;
      }

      return response;
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
   * Endpoint: POST /api/produits (multipart/form-data)
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
        // Si pas d'image, créer un placeholder (l'API requiert le champ image)
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
   * Endpoint: PUT /api/produits/{idProduit}
   */
  async updateProduct(
    productId: number,
    productData: Partial<CreateProduitRequest>,
    imageFile?: {
      uri: string;
      type: string;
      name: string;
    }
  ): Promise<ApiResponse<Produit>> {
    try {
      logger.info('📝 Mise à jour du produit', { productId });

      // Construire les query params pour les champs modifiés
      const params: Record<string, string> = {};
      if (productData.nom) params.nom = productData.nom;
      if (productData.prix) params.prix = productData.prix.toString();
      if (productData.quantite !== undefined) params.quantite = productData.quantite.toString();
      if (productData.description) params.description = productData.description;
      if (productData.idCategorie) params.idCategorie = productData.idCategorie.toString();

      const queryParams = new URLSearchParams(params);
      const url = `${API_CONFIG.ENDPOINTS.PRODUITS.UPDATE(productId)}?${queryParams.toString()}`;

      let response: ApiResponse<Produit>;

      if (imageFile) {
        // Si nouvelle image, utiliser multipart
        const formData = new FormData();
        formData.append('image', {
          uri: imageFile.uri,
          type: imageFile.type,
          name: imageFile.name,
        } as any);

        response = await apiClient.uploadMultipart<Produit>(url, formData);
      } else {
        // Sinon, requête PUT standard
        response = await apiClient.put<Produit>(url);
      }

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
   * Endpoint: DELETE /api/produits/{idProduit}
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
   * Endpoint: GET /api/commandes/vendeur/{idVendeur}
   */
  async getMyOrders(vendeurId: number): Promise<ApiResponse<Commande[]>> {
    try {
      logger.info('📋 Récupération des commandes du producteur', { vendeurId });

      const response = await apiClient.get<Commande[]>(
        API_CONFIG.ENDPOINTS.VENDEUR.GET_ORDERS(vendeurId)
      );

      if (response.success && response.data) {
        logger.success('✅ Commandes récupérées', { count: response.data.length });
        return response;
      }

      // Si l'endpoint n'existe pas encore (403/404), retourner une liste vide
      if (response.status === 403 || response.status === 404) {
        logger.warn('⚠️ Endpoint commandes vendeur non disponible');
        return {
          success: true,
          data: [],
          status: 200,
        };
      }

      return response;
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
   * Endpoint: GET /api/vendeur/{idVendeur}/stats
   */
  async getStats(vendeurId: number): Promise<ApiResponse<ProducerStats>> {
    try {
      logger.info('📊 Récupération des statistiques', { vendeurId });

      // Essayer d'abord l'endpoint stats dédié
      const response = await apiClient.get<ProducerStats>(
        API_CONFIG.ENDPOINTS.VENDEUR.GET_STATS(vendeurId)
      );

      if (response.success && response.data) {
        logger.success('✅ Statistiques récupérées');
        return response;
      }

      // Fallback: calculer les stats localement si l'endpoint n'existe pas
      if (response.status === 403 || response.status === 404) {
        logger.warn('⚠️ Endpoint stats non disponible, calcul local');

        // Récupérer les produits pour calculer les stats
        const productsResponse = await this.getMyProducts(vendeurId);
        const ordersResponse = await this.getMyOrders(vendeurId);

        const products = productsResponse.data || [];
        const orders = ordersResponse.data || [];

        // Calculer les stats
        const pendingOrders = orders.filter(
          (o) => o.statut === StatutCommande.EN_ATTENTE
        ).length;

        const totalRevenue = orders
          .filter((o) => o.statut === StatutCommande.PAYEE || o.statut === StatutCommande.LIVREE)
          .reduce((sum, o) => sum + o.montantTotal, 0);

        const stats: ProducerStats = {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          averageRating:
            products.length > 0
              ? products.reduce((acc, p) => acc + (p.vendeur?.note || 0), 0) / products.length
              : 0,
        };

        logger.success('✅ Statistiques calculées localement', stats);

        return {
          success: true,
          data: stats,
          status: 200,
        };
      }

      return response;
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
   * Endpoint: GET /api/categories
   */
  async getCategories(): Promise<ApiResponse<Categorie[]>> {
    try {
      logger.info('📁 Récupération des catégories');

      const response = await apiClient.get<Categorie[]>(
        API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL
      );

      // Vérifier que response.data est un tableau valide
      if (response.success && Array.isArray(response.data)) {
        logger.success('✅ Catégories récupérées', { count: response.data.length });
        return response;
      }

      // Si response.data n'est pas un tableau (ex: "No response content")
      if (response.success && !Array.isArray(response.data)) {
        logger.warn('⚠️ Réponse invalide du backend (non-tableau), utilisation des données par défaut');

        const defaultCategories: Categorie[] = [
          { idCat: 1, nomCat: 'Fruits' },
          { idCat: 2, nomCat: 'Légumes' },
          { idCat: 3, nomCat: 'Céréales' },
          { idCat: 4, nomCat: 'Tubercules' },
          { idCat: 5, nomCat: 'Épices' },
          { idCat: 6, nomCat: 'Produits laitiers' },
          { idCat: 7, nomCat: 'Viandes' },
          { idCat: 8, nomCat: 'Poissons' },
        ];

        return {
          success: true,
          data: defaultCategories,
          status: 200,
        };
      }

      // Si l'endpoint n'existe pas ou erreur HTTP, retourner des catégories par défaut
      if (!response.success && (response.status === 403 || response.status === 404 || response.status === 500)) {
        logger.warn('⚠️ Endpoint catégories non disponible, utilisation des données par défaut', {
          status: response.status,
          error: response.error,
        });

        const defaultCategories: Categorie[] = [
          { idCat: 1, nomCat: 'Fruits' },
          { idCat: 2, nomCat: 'Légumes' },
          { idCat: 3, nomCat: 'Céréales' },
          { idCat: 4, nomCat: 'Tubercules' },
          { idCat: 5, nomCat: 'Épices' },
          { idCat: 6, nomCat: 'Produits laitiers' },
          { idCat: 7, nomCat: 'Viandes' },
          { idCat: 8, nomCat: 'Poissons' },
        ];

        return {
          success: true,
          data: defaultCategories,
          status: 200,
        };
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

  /**
   * Met à jour le statut d'une commande
   * Endpoint: PUT /api/commandes/{idCommande}/statut
   */
  async updateOrderStatus(
    orderId: number,
    statut: StatutCommande
  ): Promise<ApiResponse<Commande>> {
    try {
      logger.info('📝 Mise à jour du statut de la commande', { orderId, statut });

      const response = await apiClient.put<Commande>(
        API_CONFIG.ENDPOINTS.COMMANDES.UPDATE_STATUT(orderId),
        { statut }
      );

      if (response.success) {
        logger.success('✅ Statut mis à jour');
      } else {
        logger.error('❌ Échec mise à jour statut', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la mise à jour du statut', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du statut',
      };
    }
  }
}

export const producerService = new ProducerService();
export default producerService;
