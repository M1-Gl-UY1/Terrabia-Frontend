# Terrabia - Spécifications API Backend

## Introduction

Ce document décrit tous les endpoints API nécessaires pour le fonctionnement complet de l'application mobile Terrabia. Le backend doit implémenter ces endpoints pour permettre une intégration complète.

**Base URL:** `https://terrabia-backend-g2ym.onrender.com`

**Authentification:** JWT Bearer Token (header `Authorization: Bearer <token>`)

---

## Table des matières

1. [Authentification](#1-authentification)
2. [Catégories](#2-catégories)
3. [Produits](#3-produits)
4. [Panier](#4-panier)
5. [Commandes](#5-commandes)
6. [Paiements](#6-paiements)
7. [Vendeurs/Producteurs](#7-vendeursproducteurs)
8. [Modèles de données](#8-modèles-de-données)
9. [Codes d'erreur](#9-codes-derreur)

---

## 1. Authentification

### 1.1 Inscription
```
POST /api/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nom": "string",
  "prenom": "string",
  "email": "string",
  "password": "string",
  "numTel": "string",
  "ville": "string",
  "sexe": "HOMME | FEMME",
  "role": "ACHETEUR | VENDEUR",
  "numeroCni": "string (obligatoire si role=VENDEUR)"
}
```

**Réponse succès (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "idUser": 123,
  "nom": "Kamdem",
  "prenom": "Emile",
  "role": "ACHETEUR"
}
```

**Erreurs:**
- `400` - Données invalides
- `409` - Email déjà utilisé

---

### 1.2 Connexion
```
POST /api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "string",
  "password": "string"
}
```

**Réponse succès (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "idUser": 123,
  "nom": "Kamdem",
  "prenom": "Emile",
  "role": "ACHETEUR | VENDEUR",
  "email": "user@example.com",
  "numTel": "237600000000",
  "ville": "Yaoundé"
}
```

**Erreurs:**
- `401` - Identifiants invalides
- `404` - Utilisateur non trouvé

---

## 2. Catégories

### 2.1 Liste des catégories
```
GET /api/categories
```

**Authentification:** Optionnelle (public)

**Réponse succès (200):**
```json
[
  {
    "idCat": 1,
    "nomCat": "Fruits"
  },
  {
    "idCat": 2,
    "nomCat": "Légumes"
  },
  {
    "idCat": 3,
    "nomCat": "Céréales"
  },
  {
    "idCat": 4,
    "nomCat": "Tubercules"
  },
  {
    "idCat": 5,
    "nomCat": "Épices"
  }
]
```

---

## 3. Produits

### 3.1 Liste de tous les produits
```
GET /api/produits
```

**Authentification:** Optionnelle (public)

**Query Parameters (optionnels):**
- `page` (int) - Numéro de page (défaut: 0)
- `size` (int) - Taille de page (défaut: 20)
- `search` (string) - Recherche par nom/description

**Réponse succès (200):**
```json
[
  {
    "idProduit": 1,
    "nom": "Tomates fraîches",
    "prix": 1500.0,
    "quantite": 50,
    "description": "Tomates bio cultivées localement",
    "photoUrl": "https://example.com/images/tomates.jpg",
    "categorie": {
      "idCat": 2,
      "nomCat": "Légumes"
    },
    "vendeur": {
      "idUser": 5,
      "nom": "Nguyen",
      "prenom": "Marie",
      "email": "marie@example.com",
      "numTel": "237655000000",
      "ville": "Douala",
      "note": 4.5
    }
  }
]
```

---

### 3.2 Produits par catégorie
```
GET /api/produits/categorie/{idCategorie}
```

**Authentification:** Optionnelle (public)

**Path Parameters:**
- `idCategorie` (int64) - ID de la catégorie

**Réponse succès (200):**
```json
[
  {
    "idProduit": 1,
    "nom": "Tomates fraîches",
    "prix": 1500.0,
    "quantite": 50,
    "description": "Tomates bio",
    "photoUrl": "https://example.com/images/tomates.jpg",
    "categorie": {
      "idCat": 2,
      "nomCat": "Légumes"
    },
    "vendeur": {
      "idUser": 5,
      "nom": "Nguyen",
      "prenom": "Marie",
      "note": 4.5
    }
  }
]
```

---

### 3.3 Détails d'un produit
```
GET /api/produits/{idProduit}
```

**Authentification:** Optionnelle (public)

**Path Parameters:**
- `idProduit` (int64) - ID du produit

**Réponse succès (200):**
```json
{
  "idProduit": 1,
  "nom": "Tomates fraîches",
  "prix": 1500.0,
  "quantite": 50,
  "description": "Tomates bio cultivées localement, riches en vitamines",
  "photoUrl": "https://example.com/images/tomates.jpg",
  "categorie": {
    "idCat": 2,
    "nomCat": "Légumes"
  },
  "vendeur": {
    "idUser": 5,
    "nom": "Nguyen",
    "prenom": "Marie",
    "email": "marie@example.com",
    "numTel": "237655000000",
    "ville": "Douala",
    "note": 4.5
  }
}
```

**Erreurs:**
- `404` - Produit non trouvé

---

### 3.4 Créer un produit (Vendeur)
```
POST /api/produits
```

**Authentification:** Requise (VENDEUR uniquement)

**Content-Type:** `multipart/form-data`

**Query Parameters:**
- `nom` (string, required) - Nom du produit
- `prix` (double, required) - Prix en FCFA
- `quantite` (int32, required) - Quantité en stock
- `description` (string, required) - Description du produit
- `idCategorie` (int64, required) - ID de la catégorie

**Body (multipart/form-data):**
- `image` (file, required) - Image du produit (JPG, PNG, max 5MB)

**Réponse succès (201):**
```json
{
  "idProduit": 15,
  "nom": "Mangues",
  "prix": 2000.0,
  "quantite": 30,
  "description": "Mangues sucrées du Nord",
  "photoUrl": "https://storage.example.com/products/mangues_123.jpg",
  "categorie": {
    "idCat": 1,
    "nomCat": "Fruits"
  },
  "vendeur": {
    "idUser": 5,
    "nom": "Nguyen",
    "prenom": "Marie"
  }
}
```

**Erreurs:**
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Non autorisé (pas VENDEUR)

---

### 3.5 Modifier un produit (Vendeur)
```
PUT /api/produits/{idProduit}
```

**Authentification:** Requise (propriétaire du produit)

**Content-Type:** `multipart/form-data`

**Query Parameters (tous optionnels):**
- `nom` (string) - Nouveau nom
- `prix` (double) - Nouveau prix
- `quantite` (int32) - Nouvelle quantité
- `description` (string) - Nouvelle description
- `idCategorie` (int64) - Nouvelle catégorie

**Body (multipart/form-data, optionnel):**
- `image` (file) - Nouvelle image

**Réponse succès (200):**
```json
{
  "idProduit": 15,
  "nom": "Mangues Kent",
  "prix": 2500.0,
  "quantite": 25,
  "description": "Mangues Kent premium",
  "photoUrl": "https://storage.example.com/products/mangues_123_v2.jpg",
  "categorie": {
    "idCat": 1,
    "nomCat": "Fruits"
  },
  "vendeur": {
    "idUser": 5,
    "nom": "Nguyen",
    "prenom": "Marie"
  }
}
```

---

### 3.6 Supprimer un produit (Vendeur)
```
DELETE /api/produits/{idProduit}
```

**Authentification:** Requise (propriétaire du produit)

**Path Parameters:**
- `idProduit` (int64) - ID du produit

**Réponse succès (200):**
```json
{
  "message": "Produit supprimé avec succès"
}
```

**Erreurs:**
- `404` - Produit non trouvé
- `403` - Non autorisé

---

## 4. Panier

### 4.1 Récupérer le panier
```
GET /api/panier/{idAcheteur}
```

**Authentification:** Requise

**Path Parameters:**
- `idAcheteur` (int64) - ID de l'acheteur

**Réponse succès (200):**
```json
{
  "idPanier": 1,
  "statut": "ACTIF",
  "acheteur": {
    "idUser": 123,
    "nom": "Kamdem",
    "prenom": "Emile"
  },
  "articles": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Tomates fraîches",
        "prix": 1500.0,
        "quantite": 50,
        "photoUrl": "https://example.com/tomates.jpg",
        "vendeur": {
          "idUser": 5,
          "nom": "Nguyen",
          "prenom": "Marie"
        }
      },
      "quantite": 3
    }
  ]
}
```

**Note:** Si le panier n'existe pas, en créer un vide automatiquement.

---

### 4.2 Ajouter au panier
```
POST /api/panier/{idAcheteur}/add
```

**Authentification:** Requise

**Path Parameters:**
- `idAcheteur` (int64) - ID de l'acheteur

**Body (JSON):**
```json
{
  "idProduit": 1,
  "quantite": 2
}
```

**Réponse succès (200):**
```json
{
  "idPanier": 1,
  "statut": "ACTIF",
  "articles": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Tomates fraîches",
        "prix": 1500.0,
        "photoUrl": "https://example.com/tomates.jpg"
      },
      "quantite": 5
    }
  ]
}
```

**Règles:**
- Si le produit est déjà dans le panier, augmenter la quantité
- Vérifier que la quantité demandée est disponible en stock

---

### 4.3 Modifier la quantité d'un article
```
PUT /api/panier/ligne/{idLignePanier}
```

**Authentification:** Requise

**Path Parameters:**
- `idLignePanier` (int64) - ID de la ligne du panier

**Body (JSON):**
```json
{
  "quantite": 5
}
```

**Réponse succès (200):**
```json
{
  "id": 1,
  "produit": {
    "idProduit": 1,
    "nom": "Tomates fraîches",
    "prix": 1500.0
  },
  "quantite": 5
}
```

---

### 4.4 Supprimer un article du panier
```
DELETE /api/panier/ligne/{idLignePanier}
```

**Authentification:** Requise

**Path Parameters:**
- `idLignePanier` (int64) - ID de la ligne du panier

**Réponse succès (200):**
```
(Corps vide ou message de confirmation)
```

---

### 4.5 Vider le panier
```
DELETE /api/panier/{idAcheteur}/clear
```

**Authentification:** Requise

**Path Parameters:**
- `idAcheteur` (int64) - ID de l'acheteur

**Réponse succès (200):**
```json
{
  "message": "Panier vidé avec succès"
}
```

---

## 5. Commandes

### 5.1 Passer une commande
```
POST /api/commandes/passer/{idAcheteur}
```

**Authentification:** Requise

**Path Parameters:**
- `idAcheteur` (int64) - ID de l'acheteur

**Body (JSON, optionnel):**
```json
{
  "idAgenceLivraison": 1,
  "adresseLivraison": "Rue 123, Yaoundé",
  "modeLivraison": "DOMICILE | POINT_RELAIS"
}
```

**Réponse succès (201):**
```json
{
  "idCommande": 456,
  "dateCommande": "2025-12-09T19:30:00Z",
  "montantTotal": 15000.0,
  "statut": "EN_ATTENTE",
  "acheteur": {
    "idUser": 123,
    "nom": "Kamdem",
    "prenom": "Emile",
    "email": "emile@example.com",
    "numTel": "237600000000",
    "ville": "Yaoundé"
  },
  "details": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Tomates fraîches",
        "prix": 1500.0,
        "photoUrl": "https://example.com/tomates.jpg",
        "vendeur": {
          "idUser": 5,
          "nom": "Nguyen",
          "prenom": "Marie"
        }
      },
      "quantite": 3,
      "prixUnitaire": 1500.0
    }
  ]
}
```

**Règles:**
- Créer la commande à partir du panier actif
- Vider le panier après création
- Décrémenter le stock des produits
- Statut initial: `EN_ATTENTE`

---

### 5.2 Historique des commandes (Acheteur)
```
GET /api/commandes/historique/{idAcheteur}
```

**Authentification:** Requise

**Path Parameters:**
- `idAcheteur` (int64) - ID de l'acheteur

**Query Parameters (optionnels):**
- `statut` (string) - Filtrer par statut (EN_ATTENTE, PAYEE, LIVREE, ANNULEE)
- `page` (int) - Numéro de page
- `size` (int) - Taille de page

**Réponse succès (200):**
```json
[
  {
    "idCommande": 456,
    "dateCommande": "2025-12-09T19:30:00Z",
    "montantTotal": 15000.0,
    "statut": "PAYEE",
    "details": [
      {
        "id": 1,
        "produit": {
          "idProduit": 1,
          "nom": "Tomates fraîches",
          "prix": 1500.0,
          "photoUrl": "https://example.com/tomates.jpg",
          "vendeur": {
            "idUser": 5,
            "nom": "Nguyen"
          }
        },
        "quantite": 3,
        "prixUnitaire": 1500.0
      }
    ]
  }
]
```

---

### 5.3 Détails d'une commande
```
GET /api/commandes/{idCommande}
```

**Authentification:** Requise

**Path Parameters:**
- `idCommande` (int64) - ID de la commande

**Réponse succès (200):**
```json
{
  "idCommande": 456,
  "dateCommande": "2025-12-09T19:30:00Z",
  "montantTotal": 15000.0,
  "statut": "PAYEE",
  "acheteur": {
    "idUser": 123,
    "nom": "Kamdem",
    "prenom": "Emile",
    "email": "emile@example.com",
    "numTel": "237600000000",
    "ville": "Yaoundé"
  },
  "agenceLivraison": {
    "idAgence": 1,
    "nom": "Point Relais Yaoundé Centre",
    "adresse": "Avenue Kennedy, Yaoundé"
  },
  "details": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Tomates fraîches",
        "prix": 1500.0,
        "photoUrl": "https://example.com/tomates.jpg",
        "vendeur": {
          "idUser": 5,
          "nom": "Nguyen",
          "prenom": "Marie"
        }
      },
      "quantite": 3,
      "prixUnitaire": 1500.0
    }
  ]
}
```

---

### 5.4 Commandes d'un vendeur
```
GET /api/commandes/vendeur/{idVendeur}
```

**Authentification:** Requise (VENDEUR)

**Path Parameters:**
- `idVendeur` (int64) - ID du vendeur

**Query Parameters (optionnels):**
- `statut` (string) - Filtrer par statut
- `page` (int) - Numéro de page
- `size` (int) - Taille de page

**Réponse succès (200):**
```json
[
  {
    "idCommande": 456,
    "dateCommande": "2025-12-09T19:30:00Z",
    "montantTotal": 4500.0,
    "statut": "PAYEE",
    "acheteur": {
      "idUser": 123,
      "nom": "Kamdem",
      "prenom": "Emile",
      "ville": "Yaoundé"
    },
    "details": [
      {
        "id": 1,
        "produit": {
          "idProduit": 1,
          "nom": "Tomates fraîches",
          "prix": 1500.0
        },
        "quantite": 3,
        "prixUnitaire": 1500.0
      }
    ]
  }
]
```

**Note:** Retourne uniquement les commandes contenant des produits du vendeur connecté.

---

### 5.5 Mettre à jour le statut d'une commande (Vendeur)
```
PUT /api/commandes/{idCommande}/statut
```

**Authentification:** Requise (VENDEUR ou ADMIN)

**Path Parameters:**
- `idCommande` (int64) - ID de la commande

**Body (JSON):**
```json
{
  "statut": "LIVREE"
}
```

**Réponse succès (200):**
```json
{
  "idCommande": 456,
  "statut": "LIVREE",
  "message": "Statut mis à jour avec succès"
}
```

---

## 6. Paiements

### 6.1 Initier un paiement
```
POST /api/paiement/payer
```

**Authentification:** Requise

**Body (JSON):**
```json
{
  "commandeId": 456,
  "modePaiement": "ORANGE_MONEY | MTN_MOMO | CARTE_BANCAIRE",
  "devise": "XAF",
  "numeroTelephone": "237655000000"
}
```

**Note:** `numeroTelephone` requis pour ORANGE_MONEY et MTN_MOMO

**Réponse succès (200):**
```json
{
  "idPaiement": 789,
  "montant": 15000.0,
  "datePaiement": "2025-12-09T19:35:00Z",
  "modePaiement": "ORANGE_MONEY",
  "statut": "EN_ATTENTE",
  "referenceTransaction": "TXN-2025-789456",
  "commandeId": 456
}
```

**Statuts de paiement:**
- `EN_ATTENTE` - En attente de validation
- `VALIDE` - Paiement réussi
- `ECHOUE` - Paiement échoué
- `ANNULE` - Paiement annulé

---

### 6.2 Vérifier le statut d'un paiement
```
GET /api/paiement/{idPaiement}
```

**Authentification:** Requise

**Path Parameters:**
- `idPaiement` (int64) - ID du paiement

**Réponse succès (200):**
```json
{
  "idPaiement": 789,
  "montant": 15000.0,
  "datePaiement": "2025-12-09T19:35:00Z",
  "modePaiement": "ORANGE_MONEY",
  "statut": "VALIDE",
  "referenceTransaction": "TXN-2025-789456",
  "commandeId": 456
}
```

---

### 6.3 Callback de paiement (Webhook)
```
POST /api/paiement/callback
```

**Authentification:** Signature du provider (Orange/MTN)

**Body:** Dépend du provider de paiement

**Comportement:**
- Valider la signature
- Mettre à jour le statut du paiement
- Si VALIDE: mettre à jour le statut de la commande à PAYEE

---

## 7. Vendeurs/Producteurs

### 7.1 Produits du vendeur
```
GET /api/produits/vendeur/{idVendeur}
```

**Authentification:** Requise

**Path Parameters:**
- `idVendeur` (int64) - ID du vendeur

**Réponse succès (200):**
```json
[
  {
    "idProduit": 1,
    "nom": "Tomates fraîches",
    "prix": 1500.0,
    "quantite": 50,
    "description": "Tomates bio",
    "photoUrl": "https://example.com/tomates.jpg",
    "categorie": {
      "idCat": 2,
      "nomCat": "Légumes"
    }
  }
]
```

---

### 7.2 Statistiques du vendeur
```
GET /api/vendeur/{idVendeur}/stats
```

**Authentification:** Requise (VENDEUR)

**Path Parameters:**
- `idVendeur` (int64) - ID du vendeur

**Réponse succès (200):**
```json
{
  "totalProducts": 15,
  "totalOrders": 45,
  "totalRevenue": 675000.0,
  "pendingOrders": 5,
  "averageRating": 4.5,
  "monthlyRevenue": [
    { "month": "2025-01", "revenue": 50000 },
    { "month": "2025-02", "revenue": 75000 }
  ]
}
```

---

### 7.3 Profil du vendeur
```
GET /api/vendeur/{idVendeur}
```

**Authentification:** Optionnelle (public pour les infos de base)

**Path Parameters:**
- `idVendeur` (int64) - ID du vendeur

**Réponse succès (200):**
```json
{
  "idUser": 5,
  "nom": "Nguyen",
  "prenom": "Marie",
  "email": "marie@example.com",
  "numTel": "237655000000",
  "ville": "Douala",
  "note": 4.5,
  "nombreProduits": 15,
  "nombreVentes": 45
}
```

---

### 7.4 Modifier le profil vendeur
```
PUT /api/vendeur/{idVendeur}
```

**Authentification:** Requise (propriétaire)

**Body (JSON):**
```json
{
  "nom": "string",
  "prenom": "string",
  "numTel": "string",
  "ville": "string"
}
```

**Réponse succès (200):**
```json
{
  "idUser": 5,
  "nom": "Nguyen",
  "prenom": "Marie",
  "message": "Profil mis à jour avec succès"
}
```

---

## 8. Modèles de données

### 8.1 Enums

#### Role
```
ADMIN | VENDEUR | ACHETEUR
```

#### Sexe
```
HOMME | FEMME
```

#### StatutCommande
```
EN_ATTENTE | PAYEE | LIVREE | ANNULEE
```

#### StatutPaiement
```
EN_ATTENTE | VALIDE | ECHOUE | ANNULE
```

#### ModePaiement
```
CARTE_BANCAIRE | ORANGE_MONEY | MTN_MOMO
```

#### StatutPanier
```
ACTIF | VALIDE | ANNULE
```

---

### 8.2 Schémas

#### Utilisateur
```typescript
{
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  ville: string;
  sexe: "HOMME" | "FEMME";
  role: "ADMIN" | "VENDEUR" | "ACHETEUR";
}
```

#### Vendeur (extends Utilisateur)
```typescript
{
  ...Utilisateur,
  numeroCni: string;
  note: number; // 0.0 - 5.0
}
```

#### Categorie
```typescript
{
  idCat: number;
  nomCat: string;
}
```

#### Produit
```typescript
{
  idProduit: number;
  nom: string;
  prix: number;
  quantite: number;
  description: string;
  photoUrl: string;
  categorie: Categorie;
  vendeur: Vendeur;
}
```

#### LignePanier
```typescript
{
  id: number;
  produit: Produit;
  quantite: number;
}
```

#### Panier
```typescript
{
  idPanier: number;
  statut: "ACTIF" | "VALIDE" | "ANNULE";
  acheteur: Utilisateur;
  articles: LignePanier[];
}
```

#### LigneCommande
```typescript
{
  id: number;
  produit: Produit;
  quantite: number;
  prixUnitaire: number;
}
```

#### Commande
```typescript
{
  idCommande: number;
  dateCommande: string; // ISO 8601
  montantTotal: number;
  statut: "EN_ATTENTE" | "PAYEE" | "LIVREE" | "ANNULEE";
  acheteur: Utilisateur;
  agenceLivraison?: AgenceLivraison;
  details: LigneCommande[];
}
```

#### Paiement
```typescript
{
  idPaiement: number;
  montant: number;
  datePaiement: string; // ISO 8601
  modePaiement: "CARTE_BANCAIRE" | "ORANGE_MONEY" | "MTN_MOMO";
  statut: "EN_ATTENTE" | "VALIDE" | "ECHOUE" | "ANNULE";
  referenceTransaction: string;
  commandeId: number;
}
```

---

## 9. Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide (données manquantes ou incorrectes) |
| 401 | Non authentifié (token manquant ou invalide) |
| 403 | Non autorisé (permissions insuffisantes) |
| 404 | Ressource non trouvée |
| 409 | Conflit (ex: email déjà utilisé) |
| 422 | Entité non traitable (ex: stock insuffisant) |
| 500 | Erreur serveur interne |

### Format des erreurs
```json
{
  "error": "Code d'erreur",
  "message": "Description lisible de l'erreur",
  "timestamp": "2025-12-09T19:30:00Z"
}
```

---

## 10. Résumé des endpoints à implémenter

### Endpoints MANQUANTS (à ajouter au backend)

| Méthode | Endpoint | Description | Priorité |
|---------|----------|-------------|----------|
| GET | `/api/categories` | Liste des catégories | **CRITIQUE** |
| GET | `/api/produits` | Liste de tous les produits | **CRITIQUE** |
| GET | `/api/produits/{id}` | Détails d'un produit | HAUTE |
| GET | `/api/produits/vendeur/{idVendeur}` | Produits d'un vendeur | HAUTE |
| PUT | `/api/produits/{id}` | Modifier un produit | MOYENNE |
| GET | `/api/commandes/{id}` | Détails d'une commande | HAUTE |
| GET | `/api/commandes/vendeur/{idVendeur}` | Commandes d'un vendeur | **CRITIQUE** |
| PUT | `/api/commandes/{id}/statut` | Modifier statut commande | MOYENNE |
| PUT | `/api/panier/ligne/{id}` | Modifier quantité article | MOYENNE |
| DELETE | `/api/panier/{idAcheteur}/clear` | Vider le panier | BASSE |
| GET | `/api/vendeur/{id}/stats` | Stats du vendeur | **CRITIQUE** |
| GET | `/api/vendeur/{id}` | Profil vendeur | MOYENNE |
| PUT | `/api/vendeur/{id}` | Modifier profil vendeur | BASSE |
| GET | `/api/paiement/{id}` | Statut d'un paiement | MOYENNE |

### Endpoints EXISTANTS (déjà implémentés)

| Méthode | Endpoint | Statut |
|---------|----------|--------|
| POST | `/api/auth/register` | OK |
| POST | `/api/auth/login` | OK |
| POST | `/api/produits` | OK (multipart) |
| DELETE | `/api/produits/{id}` | OK |
| GET | `/api/produits/categorie/{id}` | OK |
| GET | `/api/panier/{idAcheteur}` | OK |
| POST | `/api/panier/{idAcheteur}/add` | OK |
| DELETE | `/api/panier/ligne/{id}` | OK |
| POST | `/api/commandes/passer/{idAcheteur}` | OK |
| GET | `/api/commandes/historique/{idAcheteur}` | OK |
| POST | `/api/paiement/payer` | OK |

---

## Notes pour le développeur backend

1. **Sécurité:** Tous les endpoints (sauf auth et consultation publique) nécessitent un token JWT valide.

2. **CORS:** Autoriser les requêtes depuis l'application mobile.

3. **Validation:** Valider toutes les entrées utilisateur côté serveur.

4. **Images:** Utiliser un service de stockage cloud (AWS S3, Cloudinary) pour les images des produits.

5. **Pagination:** Implémenter la pagination pour les listes longues (produits, commandes).

6. **Devise:** Tous les montants sont en FCFA (XAF).

7. **Dates:** Format ISO 8601 (ex: `2025-12-09T19:30:00Z`).

---

**Document généré le:** 09/12/2025
**Version:** 1.0
**Application:** Terrabia Mobile
