# Documentation API TERRABIA Backend

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Authentification](#authentification)
3. [Endpoints disponibles](#endpoints-disponibles)
4. [Modèles de données](#modèles-de-données)
5. [Codes d'erreur](#codes-derreur)
6. [Exemples d'utilisation](#exemples-dutilisation)

---

## Vue d'ensemble

**API TERRABIA** est une plateforme e-commerce développée avec **Spring Boot 3.5.8** et **Java 17**.

### Informations générales
- **URL de base (production)**: `https://terrabia-backend-g2ym.onrender.com`
- **URL de base (développement)**: `http://localhost:8080`
- **Format des données**: JSON
- **Authentification**: JWT (JSON Web Token)
- **Durée de validité du token**: 30 jours
- **Documentation Swagger**: `https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/`
- **CORS**: Activé pour tous les domaines (`*`)

### Architecture
L'API suit une architecture REST avec les principes suivants:
- **Stateless**: Pas de session côté serveur, tout est géré via JWT
- **Séparation des rôles**: ADMIN, VENDEUR, ACHETEUR
- **Base de données**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate

---

## Authentification

L'API utilise l'authentification JWT (JSON Web Token). Tous les endpoints nécessitent un token valide sauf les endpoints d'authentification (`/api/auth/**`).

### Comment s'authentifier

#### 1. Inscription (Register)

**Endpoint**: `POST /api/auth/register`

**Description**: Créer un nouveau compte utilisateur (Vendeur ou Acheteur)

**Corps de la requête**:
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123",
  "numTel": "+237698765432",
  "ville": "Yaoundé",
  "sexe": "HOMME",
  "role": "ACHETEUR",
  "numeroCni": "123456789"
}
```

**Paramètres**:
- `nom` (String, obligatoire): Nom de famille
- `prenom` (String, obligatoire): Prénom
- `email` (String, obligatoire): Adresse email unique
- `password` (String, obligatoire): Mot de passe (sera hashé avec BCrypt)
- `numTel` (String, obligatoire): Numéro de téléphone
- `ville` (String, obligatoire): Ville de résidence
- `sexe` (Enum, obligatoire): `HOMME` ou `FEMME`
- `role` (Enum, obligatoire): `VENDEUR` ou `ACHETEUR`
- `numeroCni` (String, optionnel): Numéro de CNI (obligatoire pour les VENDEUR)

**Réponse succès** (200 OK):
```json
"Acheteur inscrit avec succès !"
```
ou
```json
"Vendeur inscrit avec succès !"
```

**Réponse erreur** (400 Bad Request):
```json
"Erreur: Email déjà utilisé !"
```

---

#### 2. Connexion (Login)

**Endpoint**: `POST /api/auth/login`

**Description**: Se connecter et obtenir un token JWT

**Corps de la requête**:
```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

**Paramètres**:
- `email` (String, obligatoire): Adresse email
- `password` (String, obligatoire): Mot de passe

**Réponse succès** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ACHETEUR",
  "idUser": 1,
  "nom": "Dupont"
}
```

**Réponse erreur** (401 Unauthorized):
```json
"Email ou mot de passe incorrect"
```

---

### Utiliser le token JWT

Une fois connecté, vous devez inclure le token dans toutes vos requêtes:

**Header à ajouter**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Exemple avec cURL**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:8080/api/produits
```

**Exemple avec JavaScript (fetch)**:
```javascript
fetch('http://localhost:8080/api/produits', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
```

---

## Endpoints disponibles

### Module Produits

#### 1. Récupérer tous les produits

**Endpoint**: `GET /api/produits`

**Description**: Récupère la liste de tous les produits disponibles

**Authentification**: Requise

**Réponse succès** (200 OK):
```json
[
  {
    "idProduit": 1,
    "nom": "Bananes plantains",
    "prix": 500.0,
    "quantite": 100,
    "description": "Bananes fraîches du jour",
    "photoUrl": "https://example.com/bananes.jpg",
    "categorie": {
      "idCat": 1,
      "nomCat": "Fruits et Légumes"
    },
    "vendeur": {
      "idUser": 2,
      "nom": "Kamdem",
      "prenom": "Paul",
      "email": "paul@example.com",
      "numTel": "+237698765432",
      "ville": "Douala",
      "numeroCni": "123456789",
      "note": 4.5
    }
  }
]
```

---

#### 2. Récupérer les produits par catégorie

**Endpoint**: `GET /api/produits/categorie/{idCat}`

**Description**: Récupère tous les produits d'une catégorie spécifique

**Authentification**: Requise

**Paramètres URL**:
- `idCat` (Long, obligatoire): ID de la catégorie

**Exemple**: `GET /api/produits/categorie/1`

**Réponse succès** (200 OK):
```json
[
  {
    "idProduit": 1,
    "nom": "Bananes plantains",
    "prix": 500.0,
    "quantite": 100,
    "description": "Bananes fraîches du jour",
    "photoUrl": "https://example.com/bananes.jpg",
    "categorie": {...},
    "vendeur": {...}
  }
]
```

---

#### 3. Créer un produit (VENDEUR uniquement)

**Endpoint**: `POST /api/produits`

**Description**: Créer un nouveau produit (réservé aux vendeurs)

**Authentification**: Requise (VENDEUR)

**Corps de la requête**:
```json
{
  "nom": "Bananes plantains",
  "prix": 500.0,
  "quantite": 100,
  "description": "Bananes fraîches du jour",
  "photoUrl": "https://example.com/bananes.jpg",
  "idCategorie": 1,
  "idVendeur": 2
}
```

**Paramètres**:
- `nom` (String, obligatoire): Nom du produit
- `prix` (Double, obligatoire): Prix unitaire
- `quantite` (Integer, obligatoire): Stock disponible
- `description` (String, optionnel): Description du produit
- `photoUrl` (String, optionnel): URL de la photo du produit
- `idCategorie` (Long, obligatoire): ID de la catégorie
- `idVendeur` (Long, obligatoire): ID du vendeur qui crée le produit

**Réponse succès** (200 OK):
```json
{
  "idProduit": 15,
  "nom": "Bananes plantains",
  "prix": 500.0,
  "quantite": 100,
  "description": "Bananes fraîches du jour",
  "photoUrl": "https://example.com/bananes.jpg",
  "categorie": {...},
  "vendeur": {...}
}
```

**Réponse erreur** (500 Internal Server Error):
```json
"Catégorie inconnue"
```
ou
```json
"Vendeur inconnu"
```

---

#### 4. Supprimer un produit

**Endpoint**: `DELETE /api/produits/{id}`

**Description**: Supprimer un produit existant

**Authentification**: Requise

**Paramètres URL**:
- `id` (Long, obligatoire): ID du produit à supprimer

**Exemple**: `DELETE /api/produits/5`

**Réponse succès** (200 OK):
```
(Réponse vide)
```

---

### Module Panier

#### 1. Récupérer le panier actif d'un acheteur

**Endpoint**: `GET /api/panier/{idAcheteur}`

**Description**: Récupère le panier actif de l'acheteur (ou le crée s'il n'existe pas)

**Authentification**: Requise

**Paramètres URL**:
- `idAcheteur` (Long, obligatoire): ID de l'acheteur

**Exemple**: `GET /api/panier/1`

**Réponse succès** (200 OK):
```json
{
  "idPanier": 1,
  "statut": "ACTIF",
  "acheteur": {
    "idUser": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@example.com",
    "numTel": "+237698765432",
    "ville": "Yaoundé"
  },
  "articles": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Bananes plantains",
        "prix": 500.0,
        "quantite": 100,
        "description": "Bananes fraîches du jour",
        "photoUrl": "https://example.com/bananes.jpg"
      },
      "quantite": 5
    }
  ]
}
```

---

#### 2. Ajouter un produit au panier

**Endpoint**: `POST /api/panier/{idAcheteur}/add`

**Description**: Ajouter un produit au panier ou augmenter sa quantité s'il existe déjà

**Authentification**: Requise

**Paramètres URL**:
- `idAcheteur` (Long, obligatoire): ID de l'acheteur

**Corps de la requête**:
```json
{
  "idProduit": 1,
  "quantite": 3
}
```

**Paramètres**:
- `idProduit` (Long, obligatoire): ID du produit à ajouter
- `quantite` (Integer, obligatoire): Quantité à ajouter (doit être > 0)

**Exemple**: `POST /api/panier/1/add`

**Réponse succès** (200 OK):
```json
{
  "idPanier": 1,
  "statut": "ACTIF",
  "acheteur": {...},
  "articles": [
    {
      "id": 1,
      "produit": {...},
      "quantite": 8
    }
  ]
}
```

---

#### 3. Supprimer une ligne du panier

**Endpoint**: `DELETE /api/panier/ligne/{idLignePanier}`

**Description**: Supprimer complètement une ligne du panier

**Authentification**: Requise

**Paramètres URL**:
- `idLignePanier` (Long, obligatoire): ID de la ligne de panier à supprimer

**Exemple**: `DELETE /api/panier/ligne/1`

**Réponse succès** (200 OK):
```
(Réponse vide)
```

---

### Module Commandes

#### 1. Passer une commande

**Endpoint**: `POST /api/commandes/passer/{idAcheteur}`

**Description**: Transformer le panier actif en commande

**Authentification**: Requise

**Paramètres URL**:
- `idAcheteur` (Long, obligatoire): ID de l'acheteur

**Exemple**: `POST /api/commandes/passer/1`

**Fonctionnement**:
1. Récupère le panier actif de l'acheteur
2. Vérifie que le panier contient des articles
3. Crée une commande avec le statut `EN_ATTENTE`
4. Transforme chaque ligne de panier en ligne de commande
5. Calcule le montant total
6. Vide le panier (archive ou supprime les lignes)

**Réponse succès** (200 OK):
```json
{
  "idCommande": 1,
  "dateCommande": "2025-12-04T10:30:00",
  "montantTotal": 2500.0,
  "statut": "EN_ATTENTE",
  "acheteur": {
    "idUser": 1,
    "nom": "Dupont",
    "prenom": "Jean"
  },
  "agenceLivraison": null,
  "details": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Bananes plantains"
      },
      "quantite": 5,
      "prixUnitaire": 500.0
    }
  ]
}
```

**Réponse erreur** (400 Bad Request):
```json
"Le panier est vide !"
```

---

#### 2. Récupérer l'historique des commandes

**Endpoint**: `GET /api/commandes/historique/{idAcheteur}`

**Description**: Récupère toutes les commandes passées par un acheteur

**Authentification**: Requise

**Paramètres URL**:
- `idAcheteur` (Long, obligatoire): ID de l'acheteur

**Exemple**: `GET /api/commandes/historique/1`

**Réponse succès** (200 OK):
```json
[
  {
    "idCommande": 1,
    "dateCommande": "2025-12-04T10:30:00",
    "montantTotal": 2500.0,
    "statut": "PAYEE",
    "acheteur": {...},
    "agenceLivraison": null,
    "details": [...]
  },
  {
    "idCommande": 2,
    "dateCommande": "2025-12-03T14:15:00",
    "montantTotal": 1500.0,
    "statut": "LIVREE",
    "acheteur": {...},
    "agenceLivraison": {...},
    "details": [...]
  }
]
```

---

### Module Chat / Messagerie

#### 1. Envoyer un message

**Endpoint**: `POST /api/chat/send?idExpediteur={id}`

**Description**: Envoyer un message à un autre utilisateur (crée automatiquement une conversation si elle n'existe pas)

**Authentification**: Requise

**Paramètres Query**:
- `idExpediteur` (Long, obligatoire): ID de l'expéditeur

**Corps de la requête**:
```json
{
  "idDestinataire": 2,
  "contenu": "Bonjour, votre produit est-il toujours disponible ?"
}
```

**Paramètres**:
- `idDestinataire` (Long, obligatoire): ID du destinataire
- `contenu` (String, obligatoire): Contenu du message (ne peut pas être vide)

**Exemple**: `POST /api/chat/send?idExpediteur=1`

**Réponse succès** (200 OK):
```json
{
  "idMessage": 1,
  "contenu": "Bonjour, votre produit est-il toujours disponible ?",
  "dateEnvoi": "2025-12-04T10:30:00",
  "statut": "ENVOYE",
  "emetteurId": 1,
  "emetteurNom": "Dupont Jean",
  "conversationId": 1
}
```

**Réponse erreur** (400 Bad Request):
```json
{
  "idDestinataire": "l'ID du destinataire est obligatoire",
  "contenu": "le message ne peut pas être vide"
}
```

---

#### 2. Récupérer mes conversations

**Endpoint**: `GET /api/chat/conversations?idUser={id}`

**Description**: Récupère toutes les conversations auxquelles participe l'utilisateur

**Authentification**: Requise

**Paramètres Query**:
- `idUser` (Long, obligatoire): ID de l'utilisateur

**Exemple**: `GET /api/chat/conversations?idUser=1`

**Réponse succès** (200 OK):
```json
[
  {
    "idConversation": 1,
    "participants": [
      {
        "idUser": 1,
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean@example.com"
      },
      {
        "idUser": 2,
        "nom": "Kamdem",
        "prenom": "Paul",
        "email": "paul@example.com"
      }
    ],
    "messages": [...]
  }
]
```

---

#### 3. Récupérer l'historique d'une conversation

**Endpoint**: `GET /api/chat/messages/{idConversation}`

**Description**: Récupère tous les messages d'une conversation, triés par date d'envoi

**Authentification**: Requise

**Paramètres URL**:
- `idConversation` (Long, obligatoire): ID de la conversation

**Exemple**: `GET /api/chat/messages/1`

**Réponse succès** (200 OK):
```json
[
  {
    "idMessage": 1,
    "contenu": "Bonjour, votre produit est-il toujours disponible ?",
    "dateEnvoi": "2025-12-04T10:30:00",
    "statut": "LU",
    "emetteurId": 1,
    "emetteurNom": "Dupont Jean",
    "conversationId": 1
  },
  {
    "idMessage": 2,
    "contenu": "Oui, il est disponible !",
    "dateEnvoi": "2025-12-04T10:35:00",
    "statut": "LU",
    "emetteurId": 2,
    "emetteurNom": "Kamdem Paul",
    "conversationId": 1
  }
]
```

---

### Module Paiement

#### 1. Initier un paiement

**Endpoint**: `POST /api/paiement/payer`

**Description**: Initier un paiement pour une commande

**Authentification**: Requise

**Corps de la requête**:
```json
{
  "commandeId": 1,
  "modePaiement": "ORANGE_MONEY",
  "devise": "XAF",
  "numeroTelephone": "+237698765432"
}
```

**Paramètres**:
- `commandeId` (Long, obligatoire): ID de la commande à payer
- `modePaiement` (Enum, obligatoire): `CARTE_BANCAIRE`, `ORANGE_MONEY`, ou `MTN_MOMO`
- `devise` (String, obligatoire): Devise du paiement (ex: "XAF", "EUR", "USD")
- `numeroTelephone` (String, optionnel): Numéro de téléphone (requis pour Orange Money et MTN MoMo)

**Fonctionnement**:
1. Récupère la commande
2. Crée un paiement avec le statut `EN_ATTENTE`
3. Génère une référence de transaction unique (UUID)
4. Simule un appel à une API externe de paiement (délai de 2 secondes)
5. Met à jour le statut du paiement selon la réponse
6. Si succès, met à jour le statut de la commande à `PAYEE`

**Réponse succès** (200 OK):
```json
{
  "idPaiement": 1,
  "montant": 2500.0,
  "datePaiement": "2025-12-04T10:30:00",
  "modePaiement": "ORANGE_MONEY",
  "statut": "VALIDE",
  "referenceTransaction": "550e8400-e29b-41d4-a716-446655440000",
  "commandeId": 1
}
```

**Réponse échec** (200 OK):
```json
{
  "idPaiement": 1,
  "montant": 2500.0,
  "datePaiement": "2025-12-04T10:30:00",
  "modePaiement": "ORANGE_MONEY",
  "statut": "ECHOUE",
  "referenceTransaction": "550e8400-e29b-41d4-a716-446655440000",
  "commandeId": 1
}
```

**Note importante**: Le paiement est actuellement simulé. Dans un environnement de production, cette méthode devrait intégrer une véritable API de paiement (Stripe, PayPal, Orange Money API, MTN MoMo API, etc.).

---

## Modèles de données

### Énumérations (Enums)

#### Role_
```
- ADMIN
- VENDEUR
- ACHETEUR
```

#### Sexe
```
- HOMME
- FEMME
```

#### ModePaiement
```
- CARTE_BANCAIRE
- ORANGE_MONEY
- MTN_MOMO
```

#### StatutCommande
```
- EN_ATTENTE (commande créée mais non payée)
- PAYEE (commande payée)
- LIVREE (commande livrée)
- ANNULEE (commande annulée)
```

#### StatutPaiement
```
- EN_ATTENTE (paiement en cours de traitement)
- VALIDE (paiement réussi)
- ECHOUE (paiement échoué)
- ANNULE (paiement annulé)
```

#### StatutPanier
```
- ACTIF (panier en cours d'utilisation)
- ARCHIVE (panier archivé après transformation en commande)
```

#### StatutMessage
```
- ENVOYE (message envoyé)
- LU (message lu par le destinataire)
- ARCHIVE (message archivé)
```

---

### Entités principales

#### Utilisateur (classe parent)
```json
{
  "idUser": Long,
  "nom": String,
  "prenom": String,
  "email": String (unique),
  "password": String (hashé avec BCrypt),
  "numTel": String,
  "ville": String,
  "sexe": Sexe,
  "role": Role_
}
```

#### Acheteur (extends Utilisateur)
Hérite de tous les champs d'Utilisateur + relations:
- `panier`: Panier (OneToMany)
- `commandes`: List<Commande> (OneToMany)

#### Vendeur (extends Utilisateur)
Hérite de tous les champs d'Utilisateur + champs spécifiques:
```json
{
  "numeroCni": String,
  "note": Double
}
```
Relations:
- `produits`: List<Produit> (OneToMany)

#### Produit
```json
{
  "idProduit": Long,
  "nom": String,
  "prix": Double,
  "quantite": Integer,
  "description": String,
  "photoUrl": String,
  "categorie": Categorie,
  "vendeur": Vendeur
}
```

#### Panier
```json
{
  "idPanier": Long,
  "statut": StatutPanier,
  "acheteur": Acheteur,
  "articles": List<LignePanier>
}
```

#### LignePanier
```json
{
  "id": Long,
  "panier": Panier,
  "produit": Produit,
  "quantite": Integer
}
```

#### Commande
```json
{
  "idCommande": Long,
  "dateCommande": LocalDateTime,
  "montantTotal": Double,
  "statut": StatutCommande,
  "acheteur": Acheteur,
  "agenceLivraison": AgenceLivraison (nullable),
  "details": List<LigneCommande>
}
```

#### LigneCommande
```json
{
  "id": Long,
  "commande": Commande,
  "produit": Produit,
  "quantite": Integer,
  "prixUnitaire": Double
}
```

#### Message
```json
{
  "idMessage": Long,
  "contenu": String,
  "dateEnvoi": LocalDateTime,
  "statut": StatutMessage,
  "emetteur": Utilisateur,
  "conversation": Conversation
}
```

#### Conversation
```json
{
  "idConversation": Long,
  "participants": List<Utilisateur> (ManyToMany),
  "messages": List<Message>
}
```

#### Paiement
```json
{
  "idPaiement": Long,
  "montant": Double,
  "datePaiement": LocalDateTime,
  "modePaiement": ModePaiement,
  "statut": StatutPaiement,
  "referenceTransaction": String (UUID),
  "commandeId": Long
}
```

#### Categorie
```json
{
  "idCat": Long,
  "nomCat": String
}
```

#### AgenceLivraison
```json
{
  "idAgence": Long,
  "nom": String,
  "adresse": String
}
```

---

## Codes d'erreur

### Codes HTTP utilisés

| Code | Signification | Cas d'utilisation |
|------|---------------|-------------------|
| 200 | OK | Requête réussie |
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Token JWT manquant ou invalide |
| 403 | Forbidden | Accès refusé (rôle insuffisant) |
| 404 | Not Found | Ressource introuvable |
| 500 | Internal Server Error | Erreur serveur |

### Messages d'erreur courants

**Authentification**:
- `"Email ou mot de passe incorrect"` - Identifiants invalides
- `"Erreur: Email déjà utilisé !"` - Email déjà enregistré
- `"Token JWT expiré"` - Token expiré (après 30 jours)
- `"Token JWT invalide"` - Token malformé ou falsifié

**Produits**:
- `"Catégorie inconnue"` - ID de catégorie invalide
- `"Vendeur inconnu"` - ID de vendeur invalide
- `"Produit introuvable"` - ID de produit invalide

**Panier / Commandes**:
- `"Le panier est vide !"` - Tentative de passer commande avec panier vide
- `"Quantité insuffisante en stock"` - Stock insuffisant

**Messages**:
- `"l'ID du destinataire est obligatoire"` - ID destinataire manquant
- `"le message ne peut pas être vide"` - Contenu du message vide
- `"Utilisateur introuvable"` - Expéditeur ou destinataire invalide

**Paiement**:
- `"Commande introuvable"` - ID de commande invalide
- `"Le paiement a échoué"` - Échec du paiement externe

---

## Exemples d'utilisation

### Scénario complet: De l'inscription à la commande

#### 1. Inscription d'un acheteur
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "password": "motdepasse123",
    "numTel": "+237698765432",
    "ville": "Yaoundé",
    "sexe": "HOMME",
    "role": "ACHETEUR"
  }'
```

#### 2. Connexion
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "motdepasse123"
  }'
```

**Réponse**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ACHETEUR",
  "idUser": 1,
  "nom": "Dupont"
}
```

#### 3. Récupérer tous les produits
```bash
curl -X GET http://localhost:8080/api/produits \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Ajouter un produit au panier
```bash
curl -X POST http://localhost:8080/api/panier/1/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "idProduit": 1,
    "quantite": 3
  }'
```

#### 5. Voir le panier
```bash
curl -X GET http://localhost:8080/api/panier/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 6. Passer la commande
```bash
curl -X POST http://localhost:8080/api/commandes/passer/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse**:
```json
{
  "idCommande": 1,
  "dateCommande": "2025-12-04T10:30:00",
  "montantTotal": 1500.0,
  "statut": "EN_ATTENTE",
  "acheteur": {...},
  "details": [...]
}
```

#### 7. Payer la commande
```bash
curl -X POST http://localhost:8080/api/paiement/payer \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "commandeId": 1,
    "modePaiement": "ORANGE_MONEY",
    "devise": "XAF",
    "numeroTelephone": "+237698765432"
  }'
```

#### 8. Consulter l'historique des commandes
```bash
curl -X GET http://localhost:8080/api/commandes/historique/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Exemple avec JavaScript (React / Vue / Angular)

#### Service d'authentification
```javascript
const API_URL = 'http://localhost:8080/api';

class AuthService {
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (data.token) {
      // Sauvegarder le token dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.idUser);
      localStorage.setItem('role', data.role);
    }

    return data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }
}

export default new AuthService();
```

#### Service produits
```javascript
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api';

class ProduitService {
  async getAllProduits() {
    const response = await fetch(`${API_URL}/produits`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.json();
  }

  async getProduitsByCategorie(idCategorie) {
    const response = await fetch(`${API_URL}/produits/categorie/${idCategorie}`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.json();
  }

  async createProduit(produitData) {
    const response = await fetch(`${API_URL}/produits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthService.getToken()}`
      },
      body: JSON.stringify(produitData)
    });
    return response.json();
  }

  async deleteProduit(idProduit) {
    const response = await fetch(`${API_URL}/produits/${idProduit}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.ok;
  }
}

export default new ProduitService();
```

#### Service panier
```javascript
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api';

class PanierService {
  async getPanier() {
    const userId = AuthService.getUserId();
    const response = await fetch(`${API_URL}/panier/${userId}`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.json();
  }

  async addToPanier(idProduit, quantite) {
    const userId = AuthService.getUserId();
    const response = await fetch(`${API_URL}/panier/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthService.getToken()}`
      },
      body: JSON.stringify({ idProduit, quantite })
    });
    return response.json();
  }

  async removeLigne(idLignePanier) {
    const response = await fetch(`${API_URL}/panier/ligne/${idLignePanier}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.ok;
  }
}

export default new PanierService();
```

#### Service commandes
```javascript
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api';

class CommandeService {
  async passerCommande() {
    const userId = AuthService.getUserId();
    const response = await fetch(`${API_URL}/commandes/passer/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async getHistorique() {
    const userId = AuthService.getUserId();
    const response = await fetch(`${API_URL}/commandes/historique/${userId}`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.json();
  }
}

export default new CommandeService();
```

#### Service chat
```javascript
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api';

class ChatService {
  async envoyerMessage(idDestinataire, contenu) {
    const userId = AuthService.getUserId();
    const response = await fetch(`${API_URL}/chat/send?idExpediteur=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthService.getToken()}`
      },
      body: JSON.stringify({ idDestinataire, contenu })
    });
    return response.json();
  }

  async getMesConversations() {
    const userId = AuthService.getUserId();
    const response = await fetch(`${API_URL}/chat/conversations?idUser=${userId}`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.json();
  }

  async getMessages(idConversation) {
    const response = await fetch(`${API_URL}/chat/messages/${idConversation}`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    return response.json();
  }
}

export default new ChatService();
```

#### Service paiement
```javascript
import AuthService from './AuthService';

const API_URL = 'http://localhost:8080/api';

class PaiementService {
  async payer(commandeId, modePaiement, devise, numeroTelephone = null) {
    const response = await fetch(`${API_URL}/paiement/payer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthService.getToken()}`
      },
      body: JSON.stringify({
        commandeId,
        modePaiement,
        devise,
        numeroTelephone
      })
    });
    return response.json();
  }
}

export default new PaiementService();
```

---

### Exemple d'utilisation dans un composant React

```javascript
import React, { useState, useEffect } from 'react';
import ProduitService from './services/ProduitService';
import PanierService from './services/PanierService';
import CommandeService from './services/CommandeService';

function ShoppingPage() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState(null);

  useEffect(() => {
    loadProduits();
    loadPanier();
  }, []);

  const loadProduits = async () => {
    try {
      const data = await ProduitService.getAllProduits();
      setProduits(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  const loadPanier = async () => {
    try {
      const data = await PanierService.getPanier();
      setPanier(data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    }
  };

  const ajouterAuPanier = async (idProduit, quantite) => {
    try {
      await PanierService.addToPanier(idProduit, quantite);
      loadPanier(); // Recharger le panier
      alert('Produit ajouté au panier !');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  const passerCommande = async () => {
    try {
      const commande = await CommandeService.passerCommande();
      alert(`Commande passée ! ID: ${commande.idCommande}, Montant: ${commande.montantTotal} XAF`);
      loadPanier(); // Recharger le panier (maintenant vide)
    } catch (error) {
      console.error('Erreur commande:', error);
      alert(error.message || 'Erreur lors de la commande');
    }
  };

  return (
    <div>
      <h1>Produits disponibles</h1>
      <div className="produits">
        {produits.map(produit => (
          <div key={produit.idProduit} className="produit-card">
            <img src={produit.photoUrl} alt={produit.nom} />
            <h3>{produit.nom}</h3>
            <p>{produit.description}</p>
            <p className="prix">{produit.prix} XAF</p>
            <p>Stock: {produit.quantite}</p>
            <button onClick={() => ajouterAuPanier(produit.idProduit, 1)}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      <h2>Mon panier</h2>
      {panier && panier.articles && panier.articles.length > 0 ? (
        <div>
          {panier.articles.map(ligne => (
            <div key={ligne.id} className="ligne-panier">
              <span>{ligne.produit.nom}</span>
              <span>x{ligne.quantite}</span>
              <span>{ligne.produit.prix * ligne.quantite} XAF</span>
            </div>
          ))}
          <button onClick={passerCommande}>Passer commande</button>
        </div>
      ) : (
        <p>Votre panier est vide</p>
      )}
    </div>
  );
}

export default ShoppingPage;
```

---

## Notes importantes pour l'intégration

### Sécurité
1. **HTTPS en production**: Assurez-vous d'utiliser HTTPS en production pour protéger les tokens JWT
2. **Stockage du token**: Stockez le token de manière sécurisée (localStorage, sessionStorage, ou cookie httpOnly)
3. **Expiration**: Le token expire après 30 jours. Gérez le renouvellement ou la reconnexion
4. **Validation côté client**: Validez toujours les données avant envoi pour éviter les erreurs

### Performance
1. **Pagination**: Pour les grandes listes (produits, commandes), envisagez d'implémenter la pagination
2. **Cache**: Mettez en cache les données rarement modifiées (catégories, produits)
3. **Optimisation des requêtes**: Limitez les appels API inutiles

### Gestion des erreurs
1. **Intercepteurs**: Créez des intercepteurs pour gérer automatiquement les erreurs 401 (token expiré)
2. **Messages utilisateur**: Affichez des messages d'erreur clairs et en français
3. **Retry logic**: Implémentez une logique de réessai pour les requêtes échouées

### WebSocket (future amélioration)
L'API supporte WebSocket pour le chat en temps réel. Pour l'activer:
- Endpoint WebSocket: `ws://localhost:8080/ws-chat`
- Documentation WebSocket à venir

### Variables d'environnement recommandées
```javascript
// .env ou config.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3
};
```

---

## Support et contact

Pour toute question ou problème d'intégration:
- **Documentation Swagger**: Accédez à `/swagger-ui/index.html` pour une documentation interactive
- **Logs**: Consultez les logs de votre application pour déboger les erreurs
- **Tests**: Utilisez Postman ou Insomnia pour tester les endpoints avant intégration

---

**Dernière mise à jour**: 4 décembre 2025
**Version API**: 1.0.0
**Framework**: Spring Boot 3.5.8
**Base de données**: PostgreSQL
