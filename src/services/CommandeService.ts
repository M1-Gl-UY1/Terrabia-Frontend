/**
 * Service de gestion des commandes
 * Permet de passer des commandes et consulter l'historique
 */

import apiClient, { ApiResponse } from '../utils/apiClient';
import API_CONFIG from '../config/api.config';
import { Commande } from '../types/Backend';
import logger from '../utils/logger';

class CommandeService {
  /**
   * Passe une commande à partir du panier actif
   * @param idAcheteur - ID de l'acheteur
   * @returns La commande créée
   */
  async passerCommande(idAcheteur: number): Promise<ApiResponse<Commande>> {
    try {
      logger.info(`📝 Passage de commande pour l'acheteur ${idAcheteur}`);

      const response = await apiClient.post<Commande>(API_CONFIG.ENDPOINTS.COMMANDES.PASSER(idAcheteur));

      if (response.success && response.data) {
        logger.success(`✅ Commande passée avec succès`, {
          idCommande: response.data.idCommande,
          montantTotal: response.data.montantTotal,
          statut: response.data.statut,
        });
      } else {
        logger.error('❌ Échec du passage de commande', { error: response.error });
      }

      return response;
    } catch (error: any) {
      logger.error('❌ Erreur lors du passage de commande', error);
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
  async getHistorique(idAcheteur: number): Promise<ApiResponse<Commande[]>> {
    try {
      logger.info(`📝 Récupération de l'historique des commandes pour l'acheteur ${idAcheteur}`);

      const response = await apiClient.get<Commande[]>(API_CONFIG.ENDPOINTS.COMMANDES.HISTORIQUE(idAcheteur));

      if (response.success && response.data) {
        logger.success(`✅ ${response.data.length} commandes récupérées`);
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
}

// Instance singleton du service de commandes
export const commandeService = new CommandeService();

export default commandeService;
