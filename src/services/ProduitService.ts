/**
 * Service de gestion des produits
 * Permet de récupérer, créer et supprimer des produits
 *
 * Note: Inclut un fallback avec données par défaut si le backend n'est pas disponible.
 * Voir docs/API_REQUIREMENTS.md pour la documentation complète.
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Produit, CreateProduitRequest, Categorie } from '../types/Backend';
import logger from '../utils/logger';

// Données par défaut pour le développement (à supprimer quand le backend est prêt)
const DEFAULT_PRODUCTS: Produit[] = [
  {
    idProduit: 1,
    nom: 'Tomates fraîches',
    prix: 1500,
    quantite: 50,
    description: 'Tomates bio cultivées localement, riches en vitamines',
    photoUrl: 'https://images.unsplash.com/photo-1546470427-0d4db154cdb8?w=400',
    categorie: { idCat: 2, nomCat: 'Légumes' },
    vendeur: {
      idUser: 5,
      nom: 'Nguyen',
      prenom: 'Marie',
      email: 'marie@example.com',
      numTel: '237655000000',
      ville: 'Douala',
      sexe: 'FEMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI123456',
      note: 4.5,
    },
  },
  {
    idProduit: 2,
    nom: 'Mangues Kent',
    prix: 2500,
    quantite: 30,
    description: 'Mangues sucrées et juteuses du Nord Cameroun',
    photoUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
    categorie: { idCat: 1, nomCat: 'Fruits' },
    vendeur: {
      idUser: 5,
      nom: 'Nguyen',
      prenom: 'Marie',
      email: 'marie@example.com',
      numTel: '237655000000',
      ville: 'Douala',
      sexe: 'FEMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI123456',
      note: 4.5,
    },
  },
  {
    idProduit: 3,
    nom: 'Plantains mûrs',
    prix: 1000,
    quantite: 100,
    description: 'Plantains mûrs parfaits pour les alokos',
    photoUrl: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=400',
    categorie: { idCat: 4, nomCat: 'Tubercules' },
    vendeur: {
      idUser: 6,
      nom: 'Kamdem',
      prenom: 'Pierre',
      email: 'pierre@example.com',
      numTel: '237677000000',
      ville: 'Yaoundé',
      sexe: 'HOMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI789012',
      note: 4.8,
    },
  },
  {
    idProduit: 4,
    nom: 'Piment frais',
    prix: 500,
    quantite: 200,
    description: 'Piment rouge frais très piquant',
    photoUrl: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400',
    categorie: { idCat: 5, nomCat: 'Épices' },
    vendeur: {
      idUser: 6,
      nom: 'Kamdem',
      prenom: 'Pierre',
      email: 'pierre@example.com',
      numTel: '237677000000',
      ville: 'Yaoundé',
      sexe: 'HOMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI789012',
      note: 4.8,
    },
  },
  {
    idProduit: 5,
    nom: 'Maïs frais',
    prix: 800,
    quantite: 80,
    description: 'Épis de maïs frais de la ferme',
    photoUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
    categorie: { idCat: 3, nomCat: 'Céréales' },
    vendeur: {
      idUser: 7,
      nom: 'Fouda',
      prenom: 'Jeanne',
      email: 'jeanne@example.com',
      numTel: '237699000000',
      ville: 'Bafoussam',
      sexe: 'FEMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI345678',
      note: 4.2,
    },
  },
  {
    idProduit: 6,
    nom: 'Avocats',
    prix: 1200,
    quantite: 40,
    description: 'Avocats mûrs et crémeux',
    photoUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400',
    categorie: { idCat: 1, nomCat: 'Fruits' },
    vendeur: {
      idUser: 7,
      nom: 'Fouda',
      prenom: 'Jeanne',
      email: 'jeanne@example.com',
      numTel: '237699000000',
      ville: 'Bafoussam',
      sexe: 'FEMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI345678',
      note: 4.2,
    },
  },
  {
    idProduit: 7,
    nom: 'Oignons',
    prix: 600,
    quantite: 150,
    description: 'Oignons rouges de qualité',
    photoUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400',
    categorie: { idCat: 2, nomCat: 'Légumes' },
    vendeur: {
      idUser: 5,
      nom: 'Nguyen',
      prenom: 'Marie',
      email: 'marie@example.com',
      numTel: '237655000000',
      ville: 'Douala',
      sexe: 'FEMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI123456',
      note: 4.5,
    },
  },
  {
    idProduit: 8,
    nom: 'Ignames',
    prix: 2000,
    quantite: 25,
    description: 'Ignames blanches de première qualité',
    photoUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400',
    categorie: { idCat: 4, nomCat: 'Tubercules' },
    vendeur: {
      idUser: 6,
      nom: 'Kamdem',
      prenom: 'Pierre',
      email: 'pierre@example.com',
      numTel: '237677000000',
      ville: 'Yaoundé',
      sexe: 'HOMME' as any,
      role: 'VENDEUR' as any,
      numeroCni: 'CNI789012',
      note: 4.8,
    },
  },
];

const DEFAULT_CATEGORIES: Categorie[] = [
  { idCat: 1, nomCat: 'Fruits' },
  { idCat: 2, nomCat: 'Légumes' },
  { idCat: 3, nomCat: 'Céréales' },
  { idCat: 4, nomCat: 'Tubercules' },
  { idCat: 5, nomCat: 'Épices' },
  { idCat: 6, nomCat: 'Produits laitiers' },
  { idCat: 7, nomCat: 'Viandes' },
  { idCat: 8, nomCat: 'Poissons' },
];

class ProduitService {
  /**
   * Récupère tous les produits
   * Endpoint: GET /api/produits
   */
  async getAllProduits(): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info('📦 Récupération de tous les produits');

      const response = await apiClient.get<Produit[]>(API_CONFIG.ENDPOINTS.PRODUITS.GET_ALL);

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} produits récupérés`);
        return response;
      }

      // Fallback: utiliser les données par défaut si le backend n'est pas disponible
      if (response.status === 403 || response.status === 404 || !response.data) {
        logger.warn('⚠️ Backend non disponible, utilisation des données par défaut');
        return {
          success: true,
          data: DEFAULT_PRODUCTS,
          status: 200,
        };
      }

      logger.error('❌ Échec de récupération des produits', { error: response.error });
      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des produits', error);
      // En cas d'erreur réseau, retourner les données par défaut
      return {
        success: true,
        data: DEFAULT_PRODUCTS,
        status: 200,
      };
    }
  }

  /**
   * Récupère un produit par son ID
   * Endpoint: GET /api/produits/{id}
   */
  async getProduitById(idProduit: number): Promise<ApiResponse<Produit>> {
    try {
      logger.info(`📦 Récupération du produit ${idProduit}`);

      const response = await apiClient.get<Produit>(
        API_CONFIG.ENDPOINTS.PRODUITS.GET_BY_ID(idProduit)
      );

      if (response.success && response.data) {
        logger.success('✅ Produit récupéré');
        return response;
      }

      // Fallback: chercher dans les données par défaut
      if (response.status === 403 || response.status === 404) {
        const product = DEFAULT_PRODUCTS.find((p) => p.idProduit === idProduit);
        if (product) {
          return {
            success: true,
            data: product,
            status: 200,
          };
        }
      }

      return response;
    } catch (error: any) {
      logger.error(`❌ Erreur lors de la récupération du produit ${idProduit}`, error);
      // Fallback
      const product = DEFAULT_PRODUCTS.find((p) => p.idProduit === idProduit);
      if (product) {
        return {
          success: true,
          data: product,
          status: 200,
        };
      }
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Récupère les produits d'une catégorie spécifique
   * Endpoint: GET /api/produits/categorie/{idCategorie}
   */
  async getProduitsByCategorie(idCategorie: number): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info(`📦 Récupération des produits de la catégorie ${idCategorie}`);

      const response = await apiClient.get<Produit[]>(
        API_CONFIG.ENDPOINTS.PRODUITS.GET_BY_CATEGORY(idCategorie)
      );

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} produits récupérés pour la catégorie ${idCategorie}`);
        return response;
      }

      // Fallback: filtrer les données par défaut
      if (response.status === 403 || response.status === 404) {
        logger.warn('⚠️ Backend non disponible, filtrage des données par défaut');
        const filteredProducts = DEFAULT_PRODUCTS.filter(
          (p) => p.categorie.idCat === idCategorie
        );
        return {
          success: true,
          data: filteredProducts,
          status: 200,
        };
      }

      logger.error('❌ Échec de récupération des produits', { error: response.error });
      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des produits par catégorie', error);
      // Fallback
      const filteredProducts = DEFAULT_PRODUCTS.filter(
        (p) => p.categorie.idCat === idCategorie
      );
      return {
        success: true,
        data: filteredProducts,
        status: 200,
      };
    }
  }

  /**
   * Récupère toutes les catégories
   * Endpoint: GET /api/categories
   */
  async getAllCategories(): Promise<ApiResponse<Categorie[]>> {
    try {
      logger.info('📁 Récupération des catégories');

      const response = await apiClient.get<Categorie[]>(
        API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL
      );

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} catégories récupérées`);
        return response;
      }

      // Fallback
      if (response.status === 403 || response.status === 404) {
        logger.warn('⚠️ Backend non disponible, utilisation des catégories par défaut');
        return {
          success: true,
          data: DEFAULT_CATEGORIES,
          status: 200,
        };
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération des catégories', error);
      return {
        success: true,
        data: DEFAULT_CATEGORIES,
        status: 200,
      };
    }
  }

  /**
   * Crée un nouveau produit (réservé aux vendeurs)
   * Endpoint: POST /api/produits (multipart/form-data)
   */
  async createProduit(produitData: CreateProduitRequest): Promise<ApiResponse<Produit>> {
    try {
      logger.info('📦 Création d\'un nouveau produit', { nom: produitData.nom });

      const response = await apiClient.post<Produit>(
        API_CONFIG.ENDPOINTS.PRODUITS.CREATE,
        produitData
      );

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
   * Endpoint: DELETE /api/produits/{idProduit}
   */
  async deleteProduit(idProduit: number): Promise<ApiResponse<void>> {
    try {
      logger.info(`📦 Suppression du produit ${idProduit}`);

      const response = await apiClient.delete<void>(
        API_CONFIG.ENDPOINTS.PRODUITS.DELETE(idProduit)
      );

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

  /**
   * Recherche des produits par nom/description
   */
  async searchProduits(query: string): Promise<ApiResponse<Produit[]>> {
    try {
      logger.info(`🔍 Recherche de produits: "${query}"`);

      // Récupérer tous les produits et filtrer côté client
      const response = await this.getAllProduits();

      if (response.success && response.data) {
        const lowerQuery = query.toLowerCase();
        const filteredProducts = response.data.filter(
          (p) =>
            p.nom.toLowerCase().includes(lowerQuery) ||
            (p.description && p.description.toLowerCase().includes(lowerQuery))
        );

        logger.success(`✅ ${filteredProducts.length} produits trouvés`);
        return {
          success: true,
          data: filteredProducts,
          status: 200,
        };
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la recherche de produits', error);
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
