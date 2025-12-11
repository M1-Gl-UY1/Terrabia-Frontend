/**
 * Configuration de l'API Backend Terrabia
 *
 * Ce fichier définit tous les endpoints de l'API.
 * Voir docs/API_REQUIREMENTS.md pour la documentation complète.
 */

export const API_CONFIG = {
  // URL de base - changer selon l'environnement
  BASE_URL: __DEV__
    ? 'https://terrabia-backend-g2ym.onrender.com'
    : 'https://terrabia-backend-g2ym.onrender.com',

  // Configuration des timeouts
  TIMEOUT: 180000, // 180 secondes (3 minutes) - Le backend Render peut être lent au démarrage (cold start)

  // Nombre de tentatives en cas d'échec
  RETRY_ATTEMPTS: 3,

  // Délai entre les tentatives (ms)
  RETRY_DELAY: 1000,

  // Endpoints de l'API
  ENDPOINTS: {
    // ==========================================
    // AUTHENTIFICATION
    // ==========================================
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
    },

    // ==========================================
    // CATÉGORIES
    // ==========================================
    CATEGORIES: {
      GET_ALL: '/api/categories',
    },

    // ==========================================
    // PRODUITS
    // ==========================================
    PRODUITS: {
      GET_ALL: '/api/produits',
      GET_BY_ID: (id: number) => `/api/produits/${id}`,
      GET_BY_CATEGORY: (idCat: number) => `/api/produits/categorie/${idCat}`,
      GET_BY_VENDEUR: (idVendeur: number) => `/api/produits/vendeur/${idVendeur}`,
      CREATE: '/api/produits',
      UPDATE: (id: number) => `/api/produits/${id}`,
      DELETE: (id: number) => `/api/produits/${id}`,
    },

    // ==========================================
    // PANIER
    // ==========================================
    PANIER: {
      GET: (idAcheteur: number) => `/api/panier/${idAcheteur}`,
      ADD: (idAcheteur: number) => `/api/panier/${idAcheteur}/add`,
      UPDATE_LINE: (idLignePanier: number) => `/api/panier/ligne/${idLignePanier}`,
      REMOVE_LINE: (idLignePanier: number) => `/api/panier/ligne/${idLignePanier}`,
      CLEAR: (idAcheteur: number) => `/api/panier/${idAcheteur}/clear`,
    },

    // ==========================================
    // COMMANDES
    // ==========================================
    COMMANDES: {
      PASSER: (idAcheteur: number) => `/api/commandes/passer/${idAcheteur}`,
      GET_BY_ID: (idCommande: number) => `/api/commandes/${idCommande}`,
      HISTORIQUE: (idAcheteur: number) => `/api/commandes/historique/${idAcheteur}`,
      GET_BY_VENDEUR: (idVendeur: number) => `/api/commandes/vendeur/${idVendeur}`,
      UPDATE_STATUT: (idCommande: number) => `/api/commandes/${idCommande}/statut`,
    },

    // ==========================================
    // PAIEMENT
    // ==========================================
    PAIEMENT: {
      PAYER: '/api/paiement/payer',
      GET_STATUS: (idPaiement: number) => `/api/paiement/${idPaiement}`,
    },

    // ==========================================
    // VENDEUR / PRODUCTEUR
    // ==========================================
    VENDEUR: {
      GET_PROFILE: (idVendeur: number) => `/api/vendeur/${idVendeur}`,
      UPDATE_PROFILE: (idVendeur: number) => `/api/vendeur/${idVendeur}`,
      GET_STATS: (idVendeur: number) => `/api/vendeur/${idVendeur}/stats`,
      GET_PRODUCTS: (idVendeur: number) => `/api/produits/vendeur/${idVendeur}`,
      GET_ORDERS: (idVendeur: number) => `/api/commandes/vendeur/${idVendeur}`,
    },

    // ==========================================
    // CHAT (futur)
    // ==========================================
    CHAT: {
      SEND: (idExpediteur: number) => `/api/chat/send?idExpediteur=${idExpediteur}`,
      CONVERSATIONS: (idUser: number) => `/api/chat/conversations?idUser=${idUser}`,
      MESSAGES: (idConversation: number) => `/api/chat/messages/${idConversation}`,
    },
  },

  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default API_CONFIG;
