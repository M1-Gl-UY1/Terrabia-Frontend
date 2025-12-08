// ==========================================
// ENUMS - Énumérations du backend
// ==========================================

export enum Role {
  ADMIN = 'ADMIN',
  VENDEUR = 'VENDEUR',
  ACHETEUR = 'ACHETEUR',
}

export enum Sexe {
  HOMME = 'HOMME',
  FEMME = 'FEMME',
}

export enum ModePaiement {
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
  ORANGE_MONEY = 'ORANGE_MONEY',
  MTN_MOMO = 'MTN_MOMO',
}

export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  PAYEE = 'PAYEE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE',
}

export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  ECHOUE = 'ECHOUE',
  ANNULE = 'ANNULE',
}

export enum StatutPanier {
  ACTIF = 'ACTIF',
  ARCHIVE = 'ARCHIVE',
}

export enum StatutMessage {
  ENVOYE = 'ENVOYE',
  LU = 'LU',
  ARCHIVE = 'ARCHIVE',
}

// ==========================================
// ENTITÉS - Modèles de données
// ==========================================

/**
 * Utilisateur de base (classe parent)
 */
export interface Utilisateur {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  ville: string;
  sexe: Sexe;
  role: Role;
}

/**
 * Acheteur (hérite d'Utilisateur)
 */
export interface Acheteur extends Utilisateur {
  role: Role.ACHETEUR;
}

/**
 * Vendeur (hérite d'Utilisateur avec champs supplémentaires)
 */
export interface Vendeur extends Utilisateur {
  role: Role.VENDEUR;
  numeroCni: string;
  note: number;
}

/**
 * Catégorie de produit
 */
export interface Categorie {
  idCat: number;
  nomCat: string;
}

/**
 * Produit
 */
export interface Produit {
  idProduit: number;
  nom: string;
  prix: number;
  quantite: number;
  description?: string;
  photoUrl?: string;
  categorie: Categorie;
  vendeur: Vendeur;
}

/**
 * Ligne de panier
 */
export interface LignePanier {
  id: number;
  produit: Produit;
  quantite: number;
}

/**
 * Panier
 */
export interface Panier {
  idPanier: number;
  statut: StatutPanier;
  acheteur: Acheteur;
  articles: LignePanier[];
}

/**
 * Ligne de commande
 */
export interface LigneCommande {
  id: number;
  produit: Produit;
  quantite: number;
  prixUnitaire: number;
}

/**
 * Agence de livraison
 */
export interface AgenceLivraison {
  idAgence: number;
  nom: string;
  adresse: string;
}

/**
 * Commande
 */
export interface Commande {
  idCommande: number;
  dateCommande: string; // ISO 8601 format
  montantTotal: number;
  statut: StatutCommande;
  acheteur: Acheteur;
  agenceLivraison?: AgenceLivraison;
  details: LigneCommande[];
}

/**
 * Paiement
 */
export interface Paiement {
  idPaiement: number;
  montant: number;
  datePaiement: string; // ISO 8601 format
  modePaiement: ModePaiement;
  statut: StatutPaiement;
  referenceTransaction: string;
  commandeId: number;
}

/**
 * Message
 */
export interface Message {
  idMessage: number;
  contenu: string;
  dateEnvoi: string; // ISO 8601 format
  statut: StatutMessage;
  emetteurId: number;
  emetteurNom: string;
  conversationId: number;
}

/**
 * Conversation
 */
export interface Conversation {
  idConversation: number;
  participants: Utilisateur[];
  messages: Message[];
}

// ==========================================
// REQUÊTES - Données envoyées au backend
// ==========================================

/**
 * Données d'inscription
 */
export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  numTel: string;
  ville: string;
  sexe: Sexe;
  role: Role.ACHETEUR | Role.VENDEUR;
  numeroCni?: string; // Obligatoire pour VENDEUR
}

/**
 * Données de connexion
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Données de création de produit
 */
export interface CreateProduitRequest {
  nom: string;
  prix: number;
  quantite: number;
  description?: string;
  photoUrl?: string;
  idCategorie: number;
  idVendeur: number;
}

/**
 * Données d'ajout au panier
 */
export interface AddToPanierRequest {
  idProduit: number;
  quantite: number;
}

/**
 * Données d'envoi de message
 */
export interface SendMessageRequest {
  idDestinataire: number;
  contenu: string;
}

/**
 * Données de paiement
 */
export interface PayerRequest {
  commandeId: number;
  modePaiement: ModePaiement;
  devise: string;
  numeroTelephone?: string; // Requis pour ORANGE_MONEY et MTN_MOMO
}

// ==========================================
// RÉPONSES - Données reçues du backend
// ==========================================

/**
 * Réponse de connexion
 */
export interface LoginResponse {
  token: string;
  role: Role;
  idUser: number;
  nom: string;
}

/**
 * Réponse d'erreur générique
 */
export interface ErrorResponse {
  message: string;
  status?: number;
}

/**
 * Réponse de validation d'erreurs (pour les formulaires)
 */
export interface ValidationErrorResponse {
  [field: string]: string;
}
