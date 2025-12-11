import { Product, ProductResponse } from '../types/Product';
import { produitService } from './ProduitService';
import { mapProduitsToProducts, mapProduitToProduct } from '../utils/dataMapper';
import { Categorie } from '../types/Backend';
import logger from '../utils/logger';

/**
 * Service pour gérer les produits
 * Utilise le backend via ProduitService et adapte les données au format frontend
 */
class ProductService {
  /**
   * Récupère tous les produits depuis le backend
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await produitService.getAllProduits();

      if (response.success && response.data) {
        return mapProduitsToProducts(response.data);
      }

      logger.error('Échec de récupération des produits', { error: response.error });
      return [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits', error);
      return [];
    }
  }

  /**
   * Récupère toutes les catégories
   */
  async getAllCategories(): Promise<Categorie[]> {
    try {
      const response = await produitService.getAllCategories();

      if (response.success && response.data) {
        return response.data;
      }

      logger.error('Échec de récupération des catégories', { error: response.error });
      return [];
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories', error);
      return [];
    }
  }

  /**
   * Récupère les produits en offre du jour (les 6 premiers)
   */
  async getDailyOffers(): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      // Retourne les 6 premiers produits comme offres du jour
      return products.slice(0, 6);
    } catch (error) {
      logger.error('Erreur lors de la récupération des offres du jour', error);
      return [];
    }
  }

  /**
   * Récupère les produits recommandés (tous les produits pour l'instant)
   */
  async getRecommendedProducts(): Promise<Product[]> {
    return await this.getAllProducts();
  }

  /**
   * Récupère un produit par son ID
   */
  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const products = await this.getAllProducts();
      return products.find(product => product.id === id);
    } catch (error) {
      logger.error(`Erreur lors de la récupération du produit ${id}`, error);
      return undefined;
    }
  }

  /**
   * Recherche des produits par nom
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      const lowerQuery = query.toLowerCase();
      return products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      logger.error('Erreur lors de la recherche de produits', error);
      return [];
    }
  }

  /**
   * Récupère les produits par catégorie
   */
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      return products.filter(product => product.category.toLowerCase() === categoryName.toLowerCase());
    } catch (error) {
      logger.error(`Erreur lors de la récupération des produits de la catégorie ${categoryName}`, error);
      return [];
    }
  }

  /**
   * Récupère les produits par ID de catégorie (utilise l'API backend directement)
   */
  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    try {
      const response = await produitService.getProduitsByCategorie(categoryId);

      if (response.success && response.data) {
        return mapProduitsToProducts(response.data);
      }

      logger.error('Échec de récupération des produits par catégorie', { error: response.error });
      return [];
    } catch (error) {
      logger.error(`Erreur lors de la récupération des produits de la catégorie ${categoryId}`, error);
      return [];
    }
  }
}

// Export d'une instance unique (Singleton)
export const productService = new ProductService();

// Pour faciliter la transition vers l'API plus tard :
// 1. Remplacer le contenu des méthodes par des appels fetch/axios
// 2. Garder la même interface (signatures des méthodes)
// 3. Ajouter la gestion des erreurs
// Exemple pour plus tard :
/*
async getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}
*/