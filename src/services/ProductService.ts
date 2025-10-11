import { Product, ProductResponse } from '../types/Product';
import { mockProducts } from '../data/mockProducts';

/**
 * Service pour gérer les produits
 * Ce service utilise des données mockées pour le moment
 * Plus tard, il sera facile de remplacer par de vrais appels API
 */
class ProductService {
  /**
   * Simule un délai réseau (optionnel)
   */
  private async simulateNetworkDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Récupère tous les produits
   */
  async getAllProducts(): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return mockProducts;
  }

  /**
   * Récupère les produits en offre du jour (les 3 premiers)
   */
  async getDailyOffers(): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return mockProducts.slice(0, 3);
  }

  /**
   * Récupère les produits recommandés
   */
  async getRecommendedProducts(): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return mockProducts;
  }

  /**
   * Récupère un produit par son ID
   */
  async getProductById(id: string): Promise<Product | undefined> {
    await this.simulateNetworkDelay();
    return mockProducts.find(product => product.id === id);
  }

  /**
   * Recherche des produits par nom
   */
  async searchProducts(query: string): Promise<Product[]> {
    await this.simulateNetworkDelay();
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Récupère les produits par catégorie
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    await this.simulateNetworkDelay();
    return mockProducts.filter(product => product.category === category);
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