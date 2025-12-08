/**
 * Service de gestion des paiements
 * Permet d'initier des paiements pour les commandes
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Paiement, PayerRequest } from '../types/Backend';
import logger from '../utils/logger';

class PaiementService {
  /**
   * Initie un paiement pour une commande
   * @param data - Données du paiement (commandeId, modePaiement, devise, etc.)
   * @returns Le paiement créé
   */
  async payer(data: PayerRequest): Promise<ApiResponse<Paiement>> {
    try {
      logger.info(`💳 Initiation du paiement pour la commande ${data.commandeId}`, {
        modePaiement: data.modePaiement,
        devise: data.devise,
      });

      const response = await apiClient.post<Paiement>(API_CONFIG.ENDPOINTS.PAIEMENT.PAYER, data);

      if (response.success && response.data) {
        logger.success(`✅ Paiement ${response.data.statut}`, {
          idPaiement: response.data.idPaiement,
          montant: response.data.montant,
          statut: response.data.statut,
          referenceTransaction: response.data.referenceTransaction,
        });
      } else {
        logger.error('❌ Échec du paiement', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors du paiement', error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue',
      };
    }
  }
}

// Instance singleton du service de paiements
export const paiementService = new PaiementService();

export default paiementService;
