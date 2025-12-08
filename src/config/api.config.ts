/**
 * Configuration de l'API Backend Terrabia
 */

export const API_CONFIG = {
  // URL de base - changer selon l'environnement
  BASE_URL: __DEV__
    ? 'https://terrabia-backend-g2ym.onrender.com' // Production (même en dev pour les tests)
    : 'https://terrabia-backend-g2ym.onrender.com', // Production

  // Configuration des timeouts
  TIMEOUT: 180000, // 180 secondes (3 minutes) - Le backend Render peut être lent au démarrage (cold start)

  // Nombre de tentatives en cas d'échec
  RETRY_ATTEMPTS: 3,

  // Délai entre les tentatives (ms)
  RETRY_DELAY: 1000,

  // Endpoints de l'API
  ENDPOINTS: {
    // Authentification
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
    },

    // Produits
    PRODUITS: {
      GET_ALL: '/api/produits',
      GET_BY_CATEGORY: (idCat: number) => `/api/produits/categorie/${idCat}`,
      CREATE: '/api/produits',
      DELETE: (id: number) => `/api/produits/${id}`,
    },

    // Panier
    PANIER: {
      GET: (idAcheteur: number) => `/api/panier/${idAcheteur}`,
      ADD: (idAcheteur: number) => `/api/panier/${idAcheteur}/add`,
      REMOVE_LINE: (idLignePanier: number) => `/api/panier/ligne/${idLignePanier}`,
    },

    // Commandes
    COMMANDES: {
      PASSER: (idAcheteur: number) => `/api/commandes/passer/${idAcheteur}`,
      HISTORIQUE: (idAcheteur: number) => `/api/commandes/historique/${idAcheteur}`,
    },

    // Chat
    CHAT: {
      SEND: (idExpediteur: number) => `/api/chat/send?idExpediteur=${idExpediteur}`,
      CONVERSATIONS: (idUser: number) => `/api/chat/conversations?idUser=${idUser}`,
      MESSAGES: (idConversation: number) => `/api/chat/messages/${idConversation}`,
    },

    // Paiement
    PAIEMENT: {
      PAYER: '/api/paiement/payer',
    },
  },

  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export default API_CONFIG;
