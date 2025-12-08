/**
 * Service de gestion du panier
 * Permet de gérer le panier d'achat de l'utilisateur
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Panier, AddToPanierRequest } from '../types/Backend';
import logger from '../utils/logger';

class PanierService {
  /**
   * Récupère le panier actif de l'acheteur
   * @param idAcheteur - ID de l'acheteur
   * @returns Le panier actif
   */
  async getPanier(idAcheteur: number): Promise<ApiResponse<Panier>> {
    try {
      logger.info(`🛒 Récupération du panier de l'acheteur ${idAcheteur}`);

      const response = await apiClient.get<Panier>(API_CONFIG.ENDPOINTS.PANIER.GET(idAcheteur));

      if (response.success && response.data) {
        logger.success(`✅ Panier récupéré - ${response.data.articles.length} articles`);
      } else {
        logger.error('❌ Échec de récupération du panier', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération du panier', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Ajoute un produit au panier
   * @param idAcheteur - ID de l'acheteur
   * @param data - Données du produit à ajouter (idProduit, quantité)
   * @returns Le panier mis à jour
   */
  async addToPanier(idAcheteur: number, data: AddToPanierRequest): Promise<ApiResponse<Panier>> {
    try {
      logger.info(`🛒 Ajout d'un produit au panier`, {
        idAcheteur,
        idProduit: data.idProduit,
        quantite: data.quantite,
      });

      const response = await apiClient.post<Panier>(API_CONFIG.ENDPOINTS.PANIER.ADD(idAcheteur), data);

      if (response.success && response.data) {
        logger.success(`✅ Produit ajouté au panier - Total: ${response.data.articles.length} articles`);
      } else {
        logger.error('❌ Échec d\'ajout au panier', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de l\'ajout au panier', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Supprime une ligne du panier
   * @param idLignePanier - ID de la ligne de panier à supprimer
   * @returns Réponse de l'API
   */
  async removeLigne(idLignePanier: number): Promise<ApiResponse<void>> {
    try {
      logger.info(`🛒 Suppression de la ligne ${idLignePanier} du panier`);

      const response = await apiClient.delete<void>(API_CONFIG.ENDPOINTS.PANIER.REMOVE_LINE(idLignePanier));

      if (response.success) {
        logger.success(`✅ Ligne ${idLignePanier} supprimée du panier`);
      } else {
        logger.error('❌ Échec de suppression de la ligne', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la suppression de la ligne', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Calcule le montant total du panier
   * @param panier - Le panier
   * @returns Le montant total
   */
  calculateTotal(panier: Panier): number {
    return panier.articles.reduce((total, ligne) => {
      return total + ligne.produit.prix * ligne.quantite;
    }, 0);
  }
}

// Instance singleton du service de panier
export const panierService = new PanierService();

export default panierService;
