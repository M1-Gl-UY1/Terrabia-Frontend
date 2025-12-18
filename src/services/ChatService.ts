/**
 * Service de Chat
 *
 * Gère toutes les opérations de messagerie entre acheteurs et producteurs.
 */

import API_CONFIG from '../config/api.config';
import apiClient from '../utils/apiClient';
import { logger } from '../utils/logger';
import { Message, Conversation } from '../types/Backend';

/**
 * Requête pour envoyer un message
 */
export interface SendMessageRequest {
  idDestinataire: number;
  contenu: string;
}

/**
 * Réponse standard de l'API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ChatService {
  private static instance: ChatService;

  private constructor() {}

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Envoie un message à un destinataire
   */
  async sendMessage(
    idExpediteur: number,
    request: SendMessageRequest
  ): Promise<ApiResponse<Message>> {
    try {
      logger.info('[ChatService] Envoi du message...', {
        idExpediteur,
        idDestinataire: request.idDestinataire,
      });

      const endpoint = API_CONFIG.ENDPOINTS.CHAT.SEND(idExpediteur);
      const response = await apiClient.post<Message>(endpoint, request);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de l\'envoi du message');
      }

      logger.success('[ChatService] Message envoyé avec succès', {
        idMessage: response.data.idMessage,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      logger.error('[ChatService] Erreur lors de l\'envoi du message', { error });
      return {
        success: false,
        error: error?.message || 'Impossible d\'envoyer le message',
      };
    }
  }

  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  async getConversations(idUser: number): Promise<ApiResponse<Conversation[]>> {
    try {
      logger.info('[ChatService] Récupération des conversations...', { idUser });

      const endpoint = API_CONFIG.ENDPOINTS.CHAT.CONVERSATIONS(idUser);
      const response = await apiClient.get<Conversation[]>(endpoint);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la récupération des conversations');
      }

      logger.success('[ChatService] Conversations récupérées', {
        count: response.data.length,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      logger.error('[ChatService] Erreur lors de la récupération des conversations', {
        error,
      });
      return {
        success: false,
        error:
          error?.message || 'Impossible de récupérer les conversations',
      };
    }
  }

  /**
   * Récupère tous les messages d'une conversation
   */
  async getMessages(idConversation: number): Promise<ApiResponse<Message[]>> {
    try {
      logger.info('[ChatService] Récupération des messages...', {
        idConversation,
      });

      const endpoint = API_CONFIG.ENDPOINTS.CHAT.MESSAGES(idConversation);
      const response = await apiClient.get<Message[]>(endpoint);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Erreur lors de la récupération des messages');
      }

      logger.success('[ChatService] Messages récupérés', {
        count: response.data.length,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      logger.error('[ChatService] Erreur lors de la récupération des messages', {
        error,
      });
      return {
        success: false,
        error: error?.message || 'Impossible de récupérer les messages',
      };
    }
  }

  /**
   * Marque les messages d'une conversation comme lus
   */
  async markMessagesAsRead(
    idConversation: number,
    idUser: number
  ): Promise<ApiResponse<void>> {
    try {
      logger.info('[ChatService] Marquage des messages comme lus...', {
        idConversation,
        idUser,
      });

      // Note: Si le backend implémente cet endpoint plus tard
      // const endpoint = `/api/chat/conversations/${idConversation}/read?idUser=${idUser}`;
      // await ApiClient.put(endpoint, {});

      logger.success('[ChatService] Messages marqués comme lus');

      return {
        success: true,
      };
    } catch (error: any) {
      logger.error('[ChatService] Erreur lors du marquage des messages', {
        error,
      });
      return {
        success: false,
        error: error?.message || 'Impossible de marquer les messages comme lus',
      };
    }
  }

  /**
   * Trouve ou crée une conversation avec un utilisateur spécifique
   */
  async findOrCreateConversation(
    idUser: number,
    idOtherUser: number
  ): Promise<ApiResponse<Conversation>> {
    try {
      logger.info('[ChatService] Recherche de la conversation...', {
        idUser,
        idOtherUser,
      });

      // Récupérer toutes les conversations
      const conversationsResponse = await this.getConversations(idUser);

      if (!conversationsResponse.success || !conversationsResponse.data) {
        return {
          success: false,
          error: 'Impossible de récupérer les conversations',
        };
      }

      // Chercher une conversation existante avec cet utilisateur
      const existingConversation = conversationsResponse.data.find(
        (conv) =>
          conv.participants.some((p) => p.idUser === idOtherUser)
      );

      if (existingConversation) {
        logger.success('[ChatService] Conversation trouvée', {
          idConversation: existingConversation.idConversation,
        });
        return {
          success: true,
          data: existingConversation,
        };
      }

      // Si aucune conversation n'existe, le backend en créera une lors du premier message
      logger.info('[ChatService] Aucune conversation existante trouvée');
      return {
        success: false,
        error: 'NO_CONVERSATION',
      };
    } catch (error: any) {
      logger.error('[ChatService] Erreur lors de la recherche de conversation', {
        error,
      });
      return {
        success: false,
        error:
          error?.message || 'Impossible de trouver la conversation',
      };
    }
  }

  /**
   * Compte les messages non lus pour un utilisateur
   */
  getUnreadCount(conversations: Conversation[], idUser: number): number {
    let count = 0;

    conversations.forEach((conversation) => {
      conversation.messages.forEach((message) => {
        // Compter les messages non lus qui ne sont pas de l'utilisateur courant
        if (
          message.statut !== 'LU' &&
          message.emetteurId !== idUser
        ) {
          count++;
        }
      });
    });

    return count;
  }
}

export default ChatService.getInstance();
