/**
 * Service de gestion du panier
 * Synchronise le panier local (Redux) avec le backend
 */

import { panierService } from './PanierService';
import { mapProduitToProduct } from '../utils/dataMapper';
import { Product } from '../types/Product';
import logger from '../utils/logger';
import { CartItem } from '../store/cartSlice';

class CartService {
  /**
   * Charge le panier depuis le backend
   * @param idAcheteur - ID de l'acheteur connecté
   * @returns Liste des items du panier au format frontend
   */
  async loadCartFromBackend(idAcheteur: number): Promise<CartItem[]> {
    try {
      logger.info(`🛒 Chargement du panier pour l'acheteur ${idAcheteur}`);

      const response = await panierService.getPanier(idAcheteur);

      if (response.success && response.data) {
        // Convertir les LignePanier du backend en CartItem frontend
        const cartItems: CartItem[] = response.data.articles.map(ligne => {
          const product = mapProduitToProduct(ligne.produit);
          return {
            ...product,
            quantity: ligne.quantite,
            selected: false, // Par défaut non sélectionné
          };
        });

        logger.success(`✅ Panier chargé - ${cartItems.length} articles`);
        return cartItems;
      }

      logger.error('❌ Échec de chargement du panier', { error: response.error });
      return [];
    } catch (error) {
      logger.error('❌ Erreur lors du chargement du panier', error);
      return [];
    }
  }

  /**
   * Ajoute un produit au panier (backend)
   * @param idAcheteur - ID de l'acheteur
   * @param idProduit - ID du produit à ajouter
   * @param quantite - Quantité à ajouter
   * @returns true si succès, false sinon
   */
  async addToCart(idAcheteur: number, idProduit: number, quantite: number): Promise<boolean> {
    try {
      const response = await panierService.addToPanier(idAcheteur, {
        idProduit,
        quantite,
      });

      if (response.success) {
        logger.success(`✅ Produit ${idProduit} ajouté au panier`);
        return true;
      }

      logger.error('❌ Échec d\'ajout au panier', { error: response.error });
      return false;
    } catch (error) {
      logger.error('❌ Erreur lors de l\'ajout au panier', error);
      return false;
    }
  }

  /**
   * Supprime une ligne du panier (backend)
   * @param idLignePanier - ID de la ligne à supprimer
   * @returns true si succès, false sinon
   */
  async removeFromCart(idLignePanier: number): Promise<boolean> {
    try {
      const response = await panierService.removeLigne(idLignePanier);

      if (response.success) {
        logger.success(`✅ Ligne ${idLignePanier} supprimée du panier`);
        return true;
      }

      logger.error('❌ Échec de suppression', { error: response.error });
      return false;
    } catch (error) {
      logger.error('❌ Erreur lors de la suppression', error);
      return false;
    }
  }

  /**
   * Calcule le montant total des items sélectionnés
   * @param items - Items du panier
   * @returns Montant total
   */
  calculateTotal(items: CartItem[]): number {
    return items
      .filter(item => item.selected)
      .reduce((total, item) => total + item.priceNumeric * item.quantity, 0);
  }

  /**
   * Formate le prix pour l'affichage
   * @param price - Prix numérique
   * @returns Prix formaté
   */
  formatPrice(price: number): string {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  }
}

// Instance singleton
export const cartService = new CartService();

export default cartService;
