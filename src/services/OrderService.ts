/**
 * Service de gestion des commandes
 * Permet de créer, consulter et gérer les commandes
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Commande, Paiement, ModePaiement, PayerRequest } from '../types/Backend';
import logger from '../utils/logger';

export interface CreateOrderResponse {
  commande: Commande;
  message: string;
}

export interface PaymentResponse {
  paiement: Paiement;
  message: string;
}

class OrderService {
  /**
   * Passe une commande à partir du panier de l'acheteur
   * @param idAcheteur - ID de l'acheteur
   * @param idAgenceLivraison - ID de l'agence de livraison (optionnel)
   * @returns La commande créée
   */
  async createOrder(
    idAcheteur: number,
    idAgenceLivraison?: number
  ): Promise<ApiResponse<Commande>> {
    try {
      logger.info(`📦 Création de commande pour l'acheteur ${idAcheteur}`);

      const url = idAgenceLivraison
        ? `${API_CONFIG.ENDPOINTS.COMMANDES.PASSER(idAcheteur)}?idAgence=${idAgenceLivraison}`
        : API_CONFIG.ENDPOINTS.COMMANDES.PASSER(idAcheteur);

      const response = await apiClient.post<Commande>(url, {});

      if (response.success && response.data) {
        logger.success(`✅ Commande créée - ID: ${response.data.idCommande}`);
      } else {
        logger.error('❌ Échec de création de la commande', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la création de la commande', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Récupère l'historique des commandes d'un acheteur
   * @param idAcheteur - ID de l'acheteur
   * @returns Liste des commandes
   */
  async getOrderHistory(idAcheteur: number): Promise<ApiResponse<Commande[]>> {
    try {
      logger.info(`📋 Récupération de l'historique des commandes de l'acheteur ${idAcheteur}`);

      const response = await apiClient.get<Commande[]>(
        API_CONFIG.ENDPOINTS.COMMANDES.HISTORIQUE(idAcheteur)
      );

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} commande(s) récupérée(s)`);
      } else {
        logger.error('❌ Échec de récupération de l\'historique', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors de la récupération de l\'historique', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }

  /**
   * Effectue le paiement d'une commande
   * @param paymentData - Données de paiement
   * @returns Détails du paiement
   */
  async payOrder(paymentData: PayerRequest): Promise<ApiResponse<Paiement>> {
    try {
      logger.info(`💳 Paiement de la commande ${paymentData.commandeId}`, {
        mode: paymentData.modePaiement,
      });

      const response = await apiClient.post<Paiement>(
        API_CONFIG.ENDPOINTS.PAIEMENT.PAYER,
        paymentData
      );

      if (response.success && response.data) {
        logger.success(`✅ Paiement effectué - Référence: ${response.data.referenceTransaction}`);
      } else {
        logger.error('❌ Échec du paiement', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors du paiement', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors du paiement',
      };
    }
  }

  /**
   * Calcule le total d'une commande
   * @param commande - La commande
   * @returns Le montant total
   */
  calculateOrderTotal(commande: Commande): number {
    return commande.details.reduce((total, ligne) => {
      return total + ligne.prixUnitaire * ligne.quantite;
    }, 0);
  }

  /**
   * Formate le statut de la commande pour affichage
   * @param statut - Statut de la commande
   * @returns Libellé formaté
   */
  formatOrderStatus(statut: string): { label: string; color: string } {
    const statusMap: { [key: string]: { label: string; color: string } } = {
      EN_ATTENTE: { label: 'En attente', color: '#F59E0B' },
      PAYEE: { label: 'Payée', color: '#3B82F6' },
      LIVREE: { label: 'Livrée', color: '#10B981' },
      ANNULEE: { label: 'Annulée', color: '#EF4444' },
    };
    return statusMap[statut] || { label: statut, color: '#6B7280' };
  }

  /**
   * Formate la date de commande pour affichage
   * @param dateString - Date ISO
   * @returns Date formatée
   */
  formatOrderDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

// Instance singleton du service de commandes
export const orderService = new OrderService();

export default orderService;
