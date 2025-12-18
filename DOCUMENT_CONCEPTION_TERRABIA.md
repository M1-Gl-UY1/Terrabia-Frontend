# DOCUMENT DE CONCEPTION

# TERRABIA

## Application Mobile de Commerce de Produits Agricoles Locaux

---

**Version:** 1.0
**Date:** Décembre 2025
**Auteurs:** Équipe de développement Terrabia
**Statut:** Production

---

<div style="page-break-after: always;"></div>

## TABLE DES MATIÈRES

1. [RÉSUMÉ EXÉCUTIF](#1-résumé-exécutif)
2. [INTRODUCTION](#2-introduction)
   - 2.1 [Contexte du projet](#21-contexte-du-projet)
   - 2.2 [Problématique](#22-problématique)
   - 2.3 [Objectifs](#23-objectifs)
3. [ANALYSE FONCTIONNELLE](#3-analyse-fonctionnelle)
   - 3.1 [Acteurs du système](#31-acteurs-du-système)
   - 3.2 [Cas d'utilisation](#32-cas-dutilisation)
   - 3.3 [Fonctionnalités principales](#33-fonctionnalités-principales)
4. [ARCHITECTURE SYSTÈME](#4-architecture-système)
   - 4.1 [Architecture globale](#41-architecture-globale)
   - 4.2 [Architecture Frontend (Mobile)](#42-architecture-frontend-mobile)
   - 4.3 [Architecture Backend (API REST)](#43-architecture-backend-api-rest)
5. [CONCEPTION DE LA BASE DE DONNÉES](#5-conception-de-la-base-de-données)
   - 5.1 [Modèle conceptuel de données (MCD)](#51-modèle-conceptuel-de-données-mcd)
   - 5.2 [Modèle logique de données (MLD)](#52-modèle-logique-de-données-mld)
   - 5.3 [Dictionnaire des données](#53-dictionnaire-des-données)
6. [TECHNOLOGIES UTILISÉES](#6-technologies-utilisées)
   - 6.1 [Frontend Mobile](#61-frontend-mobile)
   - 6.2 [Backend API](#62-backend-api)
   - 6.3 [Base de données](#63-base-de-données)
   - 6.4 [Outils de développement](#64-outils-de-développement)
7. [SPÉCIFICATIONS DÉTAILLÉES](#7-spécifications-détaillées)
   - 7.1 [Module Authentification](#71-module-authentification)
   - 7.2 [Module Produits](#72-module-produits)
   - 7.3 [Module Panier et Commandes](#73-module-panier-et-commandes)
   - 7.4 [Module Messagerie](#74-module-messagerie)
   - 7.5 [Module Paiement](#75-module-paiement)
8. [SÉCURITÉ](#8-sécurité)
   - 8.1 [Authentification JWT](#81-authentification-jwt)
   - 8.2 [Gestion des rôles](#82-gestion-des-rôles)
   - 8.3 [Sécurité des données](#83-sécurité-des-données)
9. [DESIGN ET INTERFACE UTILISATEUR](#9-design-et-interface-utilisateur)
   - 9.1 [Charte graphique](#91-charte-graphique)
   - 9.2 [Navigation](#92-navigation)
   - 9.3 [Responsive Design](#93-responsive-design)
10. [DÉPLOIEMENT](#10-déploiement)
    - 10.1 [Infrastructure](#101-infrastructure)
    - 10.2 [CI/CD](#102-cicd)
    - 10.3 [Monitoring](#103-monitoring)
11. [TESTS](#11-tests)
    - 11.1 [Tests unitaires](#111-tests-unitaires)
    - 11.2 [Tests d'intégration](#112-tests-dintégration)
    - 11.3 [Tests end-to-end](#113-tests-end-to-end)
12. [ANNEXES](#12-annexes)
    - 12.1 [Diagrammes](#121-diagrammes)
    - 12.2 [Documentation API](#122-documentation-api)
    - 12.3 [Glossaire](#123-glossaire)

---

<div style="page-break-after: always;"></div>

## 1. RÉSUMÉ EXÉCUTIF

**Terrabia** est une application mobile innovante développée en React Native qui révolutionne la distribution des produits agricoles locaux au Cameroun. La plateforme connecte directement les producteurs locaux avec les consommateurs, éliminant les intermédiaires et garantissant la fraîcheur des produits.

### Points clés

- **Plateforme:** Application mobile cross-platform (iOS & Android)
- **Architecture:** Client-serveur avec API REST
- **Technologie Frontend:** React Native 0.81 + TypeScript
- **Technologie Backend:** Spring Boot 3.5.8 + Java 17
- **Base de données:** PostgreSQL
- **Authentification:** JWT (JSON Web Tokens)
- **Déploiement:** Render.com (Backend) + App Stores (Mobile)

### Bénéfices

- **Pour les producteurs:** Accès direct au marché, meilleure valorisation des produits
- **Pour les consommateurs:** Produits frais, traçabilité, soutien à l'agriculture locale
- **Impact économique:** Réduction des coûts, création d'emplois, développement rural

---

<div style="page-break-after: always;"></div>

## 2. INTRODUCTION

### 2.1 Contexte du projet

L'agriculture représente une part importante de l'économie camerounaise, avec de nombreux petits producteurs répartis sur tout le territoire. Cependant, ces producteurs font face à des défis majeurs dans la commercialisation de leurs produits :

- Manque d'accès direct aux consommateurs
- Dépendance aux intermédiaires qui réduisent leurs marges
- Difficultés de stockage et de conservation
- Absence de visibilité sur le marché

Parallèlement, les consommateurs urbains recherchent de plus en plus des produits frais, locaux et traçables, mais n'ont pas de canal direct pour accéder aux producteurs.

### 2.2 Problématique

**Comment créer une plateforme numérique qui facilite la connexion directe entre producteurs agricoles locaux et consommateurs, tout en garantissant la qualité, la traçabilité et la fraîcheur des produits ?**

### 2.3 Objectifs

#### Objectifs généraux

1. Développer une application mobile intuitive et performante
2. Créer un écosystème numérique pour le commerce agricole local
3. Améliorer les revenus des producteurs locaux
4. Faciliter l'accès des consommateurs aux produits frais

#### Objectifs spécifiques

1. **Pour les producteurs (Vendeurs):**
   - Créer un profil et catalogue de produits
   - Gérer les stocks et les prix en temps réel
   - Recevoir et traiter les commandes
   - Communiquer directement avec les clients
   - Suivre les statistiques de vente

2. **Pour les consommateurs (Acheteurs):**
   - Parcourir les produits par catégorie
   - Passer des commandes en ligne
   - Effectuer des paiements sécurisés
   - Suivre l'état de leurs commandes
   - Contacter les producteurs

3. **Pour la plateforme:**
   - Assurer la sécurité des transactions
   - Garantir la disponibilité du service (99.9%)
   - Faciliter la livraison via des agences partenaires
   - Collecter des données pour améliorer le service

---

<div style="page-break-after: always;"></div>

## 3. ANALYSE FONCTIONNELLE

### 3.1 Acteurs du système

Le système Terrabia compte trois types d'acteurs principaux :

#### 1. **Acheteur (Client)**
- Personne physique utilisant l'application pour acheter des produits agricoles
- Peut naviguer, rechercher, commander et payer
- Peut communiquer avec les vendeurs via la messagerie intégrée

#### 2. **Vendeur (Producteur)**
- Agriculteur ou producteur local proposant ses produits
- Possède un numéro CNI vérifié
- Gère son catalogue de produits, ses stocks et ses commandes
- Dispose d'une note/évaluation basée sur la satisfaction client

#### 3. **Administrateur** (future implémentation)
- Gère la plateforme et les utilisateurs
- Modère les contenus
- Analyse les statistiques globales

#### 4. **Agence de Livraison**
- Partenaire logistique assurant la livraison des commandes
- Reçoit les informations de livraison
- Confirme les livraisons

### 3.2 Cas d'utilisation

Le système offre les cas d'utilisation suivants :

#### Pour l'Acheteur

1. **S'inscrire / Se connecter**
   - Créer un compte avec email et mot de passe
   - Se connecter avec ses identifiants
   - Récupérer son mot de passe

2. **Parcourir les produits**
   - Voir tous les produits disponibles
   - Filtrer par catégorie
   - Rechercher un produit spécifique
   - Voir les détails d'un produit

3. **Gérer son panier**
   - Ajouter des produits au panier
   - Modifier les quantités
   - Supprimer des articles
   - Voir le total

4. **Passer une commande**
   - Choisir une agence de livraison
   - Confirmer la commande
   - Effectuer le paiement

5. **Effectuer un paiement**
   - Payer par carte bancaire
   - Payer via Orange Money
   - Payer via MTN Mobile Money

6. **Suivre ses commandes**
   - Voir l'historique des commandes
   - Consulter le statut d'une commande
   - Voir les détails de chaque commande

7. **Communiquer**
   - Envoyer des messages aux vendeurs
   - Recevoir des réponses
   - Consulter l'historique des conversations

#### Pour le Vendeur

1. **S'inscrire / Se connecter**
   - Créer un compte vendeur avec numéro CNI
   - Se connecter

2. **Gérer ses produits**
   - Ajouter un nouveau produit avec photo
   - Modifier un produit existant
   - Supprimer un produit
   - Mettre à jour le stock

3. **Gérer les catégories**
   - Créer de nouvelles catégories
   - Assigner des produits aux catégories

4. **Gérer les commandes**
   - Voir les commandes reçues
   - Changer le statut d'une commande
   - Consulter les détails d'une commande

5. **Consulter les statistiques**
   - Nombre total de produits
   - Nombre de commandes
   - Revenu total
   - Commandes en attente
   - Note moyenne

6. **Communiquer**
   - Répondre aux messages des clients
   - Consulter les conversations

### 3.3 Fonctionnalités principales

#### Module Authentification
- Inscription avec validation d'email
- Connexion sécurisée (JWT)
- Gestion de profil
- Distinction Acheteur/Vendeur

#### Module Catalogue Produits
- Affichage des produits par catégorie
- Recherche et filtres avancés
- Détails produit avec photos
- Gestion des stocks en temps réel

#### Module Panier et Commandes
- Ajout/suppression d'articles
- Calcul automatique du total
- Validation de commande
- Suivi du statut

#### Module Paiement
- Intégration Orange Money
- Intégration MTN Mobile Money
- Paiement par carte bancaire
- Sécurisation des transactions

#### Module Messagerie
- Chat en temps réel entre acheteur et vendeur
- Historique des conversations
- Notifications de nouveaux messages

#### Module Livraison
- Sélection d'agence de livraison
- Suivi de livraison
- Confirmation de réception

---

<div style="page-break-after: always;"></div>

## 4. ARCHITECTURE SYSTÈME

### 4.1 Architecture globale

Terrabia suit une architecture **client-serveur** moderne avec séparation claire entre le frontend mobile et le backend API.

```
┌─────────────────────────────────────────────────────────┐
│                    COUCHE PRÉSENTATION                   │
│                                                          │
│   ┌──────────────────┐         ┌──────────────────┐    │
│   │   Application    │         │   Application    │    │
│   │   iOS (React     │         │   Android (React │    │
│   │   Native)        │         │   Native)        │    │
│   └────────┬─────────┘         └────────┬─────────┘    │
│            │                            │               │
└────────────┼────────────────────────────┼───────────────┘
             │                            │
             └────────────┬───────────────┘
                          │
                   HTTPS / REST API
                          │
┌─────────────────────────┼───────────────────────────────┐
│                    COUCHE MÉTIER                         │
│                         │                                │
│   ┌─────────────────────▼──────────────────────────┐    │
│   │       API REST Backend (Spring Boot)           │    │
│   │                                                 │    │
│   │  ┌──────────────┐  ┌──────────────────────┐   │    │
│   │  │ Controllers  │  │ Security (JWT)       │   │    │
│   │  └──────┬───────┘  └──────────────────────┘   │    │
│   │         │                                      │    │
│   │  ┌──────▼───────┐  ┌──────────────────────┐   │    │
│   │  │  Services    │  │  DTOs / Validators   │   │    │
│   │  └──────┬───────┘  └──────────────────────┘   │    │
│   │         │                                      │    │
│   │  ┌──────▼───────┐                             │    │
│   │  │ Repositories │                             │    │
│   │  └──────┬───────┘                             │    │
│   └─────────┼────────────────────────────────────┘    │
└─────────────┼──────────────────────────────────────────┘
              │
              │ JPA / Hibernate
              │
┌─────────────▼──────────────────────────────────────────┐
│                  COUCHE DONNÉES                         │
│                                                         │
│   ┌─────────────────────────────────────────────┐     │
│   │     PostgreSQL Database (Render.com)         │     │
│   │                                              │     │
│   │  Tables: utilisateur, produit, commande,    │     │
│   │  panier, categorie, message, paiement, etc. │     │
│   └─────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  SERVICES EXTERNES                       │
│                                                          │
│   • Orange Money API (Paiement)                         │
│   • MTN Mobile Money API (Paiement)                     │
│   • Services de stockage d'images (uploads/)            │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Architecture Frontend (Mobile)

L'application mobile suit une architecture **modulaire** basée sur les meilleures pratiques React Native.

#### Structure des dossiers

```
src/
├── assets/               # Images, icônes, logos
│   ├── images/
│   │   ├── logo.png
│   │   └── ...
│   └── icons/
│       └── ...
├── components/           # Composants réutilisables
│   ├── common/          # Composants génériques
│   ├── cards/           # Cartes de produits, etc.
│   └── forms/           # Éléments de formulaire
├── navigation/          # Configuration de navigation
│   └── AppNavigator.tsx
├── screens/             # Écrans de l'application
│   ├── Auth/
│   ├── Home/
│   ├── Product/
│   ├── Cart/
│   ├── Order/
│   ├── Profile/
│   ├── Chat/
│   └── Producer/
├── services/            # Services API
│   ├── AuthService.ts
│   ├── ProductService.ts
│   ├── CartService.ts
│   ├── OrderService.ts
│   ├── PaymentService.ts
│   └── ChatService.ts
├── utils/               # Utilitaires
│   ├── apiClient.ts     # Client HTTP centralisé
│   ├── logger.ts        # Système de logging
│   └── validators.ts    # Validation de données
├── types/               # Définitions TypeScript
│   ├── Backend.ts       # Types backend
│   └── Payment.ts       # Types paiement
└── config/              # Configuration
    └── api.config.ts    # Configuration API
```

#### Flux de données

```
┌──────────────┐
│   Screen     │  ← Affiche les données à l'utilisateur
└──────┬───────┘
       │
       │ appelle
       ▼
┌──────────────┐
│   Service    │  ← Logique métier et appels API
└──────┬───────┘
       │
       │ utilise
       ▼
┌──────────────┐
│  apiClient   │  ← Client HTTP centralisé
└──────┬───────┘
       │
       │ envoie requête
       ▼
┌──────────────┐
│  Backend API │  ← Traite et renvoie les données
└──────────────┘
```

### 4.3 Architecture Backend (API REST)

Le backend suit l'architecture **MVC** (Model-View-Controller) avec une séparation en couches.

#### Structure des packages

```
com.m1sigl.terrabia/
├── config/                      # Configuration
│   ├── SecurityConfig.java      # Configuration Spring Security
│   ├── WebConfig.java           # Configuration CORS, uploads
│   └── OpenApiConfig.java       # Configuration Swagger
├── controllers/                 # Contrôleurs REST
│   ├── AuthController.java
│   ├── ProduitController.java
│   ├── CategorieController.java
│   ├── CommandeController.java
│   ├── PanierController.java
│   ├── PaiementController.java
│   └── MessageController.java
├── models/                      # Entités JPA
│   ├── Utilisateur.java
│   ├── Acheteur.java
│   ├── Vendeur.java
│   ├── Produit.java
│   ├── Categorie.java
│   ├── Commande.java
│   ├── Panier.java
│   ├── Paiement.java
│   └── Message.java
├── repository/                  # Repositories JPA
│   ├── UtilisateurRepository.java
│   ├── ProduitRepository.java
│   ├── CategorieRepository.java
│   └── ...
├── services/                    # Services métier
│   ├── AuthService.java
│   ├── ProduitService.java
│   ├── CommandeService.java
│   └── ...
├── security/                    # Sécurité JWT
│   ├── JwtUtils.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
└── TerrabiaApplication.java    # Point d'entrée
```

#### Flux de requête

```
Client Mobile
     │
     │ HTTP Request (JSON + JWT)
     ▼
[SecurityFilter] ← Vérifie le JWT
     │
     │ Token valide
     ▼
[Controller] ← Reçoit la requête, valide les données
     │
     │ Appelle
     ▼
[Service] ← Logique métier, règles de gestion
     │
     │ Utilise
     ▼
[Repository] ← Accès aux données (JPA)
     │
     │ Requête SQL
     ▼
[PostgreSQL Database]
     │
     │ Résultat
     ▼
[Service] ← Transforme les données
     │
     │ Retourne
     ▼
[Controller] ← Formate la réponse JSON
     │
     │ HTTP Response (JSON)
     ▼
Client Mobile
```

---

<div style="page-break-after: always;"></div>

## 5. CONCEPTION DE LA BASE DE DONNÉES

### 5.1 Modèle conceptuel de données (MCD)

Le modèle conceptuel représente les entités principales du système et leurs relations.

**Voir Annexe 12.1.1 - Diagramme de classes UML**

#### Entités principales

1. **Utilisateur** (classe abstraite)
   - Informations de base communes à tous les utilisateurs
   - Spécialisée en Acheteur et Vendeur

2. **Acheteur** (hérite de Utilisateur)
   - Peut avoir plusieurs paniers
   - Peut passer plusieurs commandes
   - Peut envoyer des messages

3. **Vendeur** (hérite de Utilisateur)
   - Possède un numéro CNI
   - A une note/évaluation
   - Peut ajouter plusieurs produits

4. **Produit**
   - Appartient à une catégorie
   - Créé par un vendeur
   - Peut être dans plusieurs paniers
   - Peut constituer plusieurs lignes de commande

5. **Categorie**
   - Contient plusieurs produits

6. **Panier**
   - Appartient à un acheteur
   - Contient plusieurs produits (via ligne_panier)

7. **Commande**
   - Passée par un acheteur
   - Livrée par une agence
   - Contient plusieurs produits (via ligne_commande)
   - Associée à un paiement

8. **Paiement**
   - Associé à une commande
   - Utilise un mode de paiement (CB, Orange Money, MTN)

9. **Message**
   - Envoyé par un utilisateur (émetteur)
   - Reçu par un utilisateur (récepteur)
   - Fait partie d'une conversation

10. **Conversation**
    - Entre plusieurs utilisateurs
    - Contient plusieurs messages

11. **Agence_Livraison**
    - Assure la livraison de plusieurs commandes

### 5.2 Modèle logique de données (MLD)

**Voir Annexe 12.1.2 - Schéma de base de données**

#### Tables principales

**utilisateur** (Table d'héritage)
- id_user (PK) : BIGINT
- nom : VARCHAR(50)
- prenom : VARCHAR(50)
- email : VARCHAR(100) UNIQUE
- password : VARCHAR(255) (hash BCrypt)
- num_tel : VARCHAR(20)
- ville : VARCHAR(50)
- sexe : ENUM('HOMME', 'FEMME')
- role : ENUM('ACHETEUR', 'VENDEUR', 'ADMIN')
- statut : VARCHAR(20)
- numero_cni : VARCHAR(20) (nullable, requis pour VENDEUR)
- note : DECIMAL(2,1) (nullable, pour VENDEUR)
- created_at : TIMESTAMP
- updated_at : TIMESTAMP

**categorie_P**
- id_cat (PK) : BIGINT
- nom_cat : VARCHAR(50) NOT NULL

**produit**
- id_produit (PK) : BIGINT
- nom : VARCHAR(100) NOT NULL
- prix : DECIMAL(10,2) NOT NULL
- quantite : INT NOT NULL
- description : TEXT
- photo_url : VARCHAR(255)
- id_cat (FK) : BIGINT → categorie_P
- id_user_vendeur (FK) : BIGINT → utilisateur
- created_at : TIMESTAMP
- updated_at : TIMESTAMP

**panier**
- id_panier (PK) : BIGINT
- id_user (FK) : BIGINT → utilisateur
- statut : ENUM('ACTIF', 'ARCHIVE')
- created_at : TIMESTAMP

**ligne_panier**
- id (PK) : BIGINT
- id_panier (FK) : BIGINT → panier
- id_produit (FK) : BIGINT → produit
- quantite : INT NOT NULL

**commande**
- id_commande (PK) : BIGINT
- id_user (FK) : BIGINT → utilisateur
- id_agence (FK) : BIGINT → agence_livraison (nullable)
- date_commande : TIMESTAMP
- montant_total : DECIMAL(10,2)
- statut : ENUM('EN_ATTENTE', 'PAYEE', 'LIVREE', 'ANNULEE')
- created_at : TIMESTAMP

**ligne_commande**
- id (PK) : BIGINT
- id_commande (FK) : BIGINT → commande
- id_produit (FK) : BIGINT → produit
- quantite : INT NOT NULL
- prix_unitaire : DECIMAL(10,2) NOT NULL

**paiement**
- id_paiement (PK) : BIGINT
- id_commande (FK) : BIGINT → commande
- montant : DECIMAL(10,2)
- date_paiement : TIMESTAMP
- mode_paiement : ENUM('CARTE_BANCAIRE', 'ORANGE_MONEY', 'MTN_MOMO')
- statut : ENUM('EN_ATTENTE', 'VALIDE', 'ECHOUE', 'ANNULE')
- reference_transaction : VARCHAR(100)

**conversation**
- id_conversation (PK) : BIGINT
- created_at : TIMESTAMP

**participant**
- id_user (FK) : BIGINT → utilisateur
- id_conversation (FK) : BIGINT → conversation
- PRIMARY KEY (id_user, id_conversation)

**message**
- id_message (PK) : BIGINT
- id_conversation (FK) : BIGINT → conversation
- id_emetteur (FK) : BIGINT → utilisateur
- contenu : TEXT NOT NULL
- date_envoi : TIMESTAMP
- statut : ENUM('ENVOYE', 'LU', 'ARCHIVE')

**agence_livraison**
- id_agence (PK) : BIGINT
- nom : VARCHAR(100)
- adresse : VARCHAR(255)

### 5.3 Dictionnaire des données

| Donnée | Type | Taille | Contrainte | Description |
|--------|------|--------|------------|-------------|
| id_user | BIGINT | 8 bytes | PK, AUTO_INCREMENT | Identifiant unique utilisateur |
| email | VARCHAR | 100 | UNIQUE, NOT NULL | Email de connexion |
| password | VARCHAR | 255 | NOT NULL | Mot de passe hashé (BCrypt) |
| nom | VARCHAR | 50 | NOT NULL | Nom de famille |
| prenom | VARCHAR | 50 | NOT NULL | Prénom |
| num_tel | VARCHAR | 20 | NOT NULL | Numéro de téléphone |
| ville | VARCHAR | 50 | NOT NULL | Ville de résidence |
| sexe | ENUM | - | NOT NULL | HOMME ou FEMME |
| role | ENUM | - | NOT NULL | ACHETEUR, VENDEUR, ADMIN |
| numero_cni | VARCHAR | 20 | NULLABLE | Numéro CNI (obligatoire VENDEUR) |
| note | DECIMAL | (2,1) | NULLABLE | Note vendeur (0.0 à 5.0) |
| id_produit | BIGINT | 8 bytes | PK, AUTO_INCREMENT | Identifiant produit |
| prix | DECIMAL | (10,2) | NOT NULL, > 0 | Prix unitaire en FCFA |
| quantite | INT | 4 bytes | NOT NULL, >= 0 | Stock disponible |
| photo_url | VARCHAR | 255 | NULLABLE | URL de l'image produit |
| montant_total | DECIMAL | (10,2) | NOT NULL | Montant total commande |
| statut_commande | ENUM | - | NOT NULL | EN_ATTENTE, PAYEE, LIVREE, ANNULEE |
| mode_paiement | ENUM | - | NOT NULL | CARTE_BANCAIRE, ORANGE_MONEY, MTN_MOMO |
| reference_transaction | VARCHAR | 100 | NULLABLE | Référence paiement externe |

---

<div style="page-break-after: always;"></div>

## 6. TECHNOLOGIES UTILISÉES

### 6.1 Frontend Mobile

#### Framework principal
- **React Native 0.81.0** - Framework cross-platform pour iOS et Android
- **TypeScript 5.8.3** - Typage statique pour meilleure maintenabilité

#### Navigation
- **@react-navigation/native 6.1.17** - Navigation principale
- **@react-navigation/native-stack 6.10.0** - Stack navigation
- **@react-navigation/bottom-tabs 6.6.1** - Tab navigation

#### State Management
- **@reduxjs/toolkit 2.8.2** - Gestion d'état centralisée
- **react-redux 9.2.0** - Bindings React pour Redux

#### UI/UX
- **lucide-react-native 0.539.0** - Icônes modernes
- **react-native-vector-icons 10.3.0** - Icônes personnalisées
- **react-native-svg 15.12.1** - Support SVG

#### Fonctionnalités natives
- **@react-native-async-storage/async-storage 2.2.0** - Stockage local
- **react-native-image-picker 8.2.1** - Sélection d'images
- **react-native-gesture-handler 2.20.2** - Gestes tactiles
- **react-native-bootsplash 6.3.10** - Splash screen natif

### 6.2 Backend API

#### Framework
- **Spring Boot 3.5.8** - Framework Java moderne
- **Java 17** - LTS avec nouvelles features

#### Base de données
- **Spring Data JPA** - ORM et abstraction données
- **Hibernate** - Implémentation JPA
- **PostgreSQL Driver** - Connecteur PostgreSQL

#### Sécurité
- **Spring Security 6** - Authentification et autorisations
- **JWT (JSON Web Tokens)** - Tokens stateless
- **BCrypt** - Hashage des mots de passe

#### Documentation
- **Swagger/OpenAPI 3** - Documentation API interactive
- **SpringDoc OpenAPI UI** - Interface Swagger UI

#### Build et Packaging
- **Maven 3.9+** - Gestion des dépendances
- **Spring Boot Maven Plugin** - Build exécutable

### 6.3 Base de données

- **PostgreSQL 15** - SGBD relationnel open-source
- **Hébergement:** Render.com (instance managée)
- **Connexions:** Pool de connexions HikariCP

### 6.4 Outils de développement

#### IDE et Éditeurs
- **Visual Studio Code** - Développement frontend
- **IntelliJ IDEA / Eclipse** - Développement backend
- **Android Studio** - Build et test Android
- **Xcode** - Build et test iOS

#### Contrôle de version
- **Git** - Gestion de versions
- **GitHub** - Hébergement du code source

#### Test et Debug
- **React DevTools** - Debug React Native
- **Flipper** - Debug mobile
- **Postman** - Test API REST
- **Jest** - Tests unitaires

#### CI/CD
- **GitHub Actions** (potentiel) - Intégration continue
- **Render.com** - Déploiement automatique backend

---

<div style="page-break-after: always;"></div>

## 7. SPÉCIFICATIONS DÉTAILLÉES

### 7.1 Module Authentification

#### 7.1.1 Inscription

**Endpoint:** `POST /api/auth/register`

**Données requises:**
- Nom, prénom
- Email (unique)
- Mot de passe (min 8 caractères)
- Numéro de téléphone
- Ville, sexe
- Rôle (ACHETEUR ou VENDEUR)
- Numéro CNI (si VENDEUR)

**Traitement:**
1. Validation des données
2. Vérification unicité email
3. Hashage du mot de passe (BCrypt)
4. Création utilisateur en base
5. Envoi email de confirmation (future)

**Réponse:**
```json
{
  "message": "Acheteur inscrit avec succès !"
}
```

#### 7.1.2 Connexion

**Endpoint:** `POST /api/auth/login`

**Données requises:**
- Email
- Mot de passe

**Traitement:**
1. Recherche utilisateur par email
2. Vérification mot de passe (BCrypt)
3. Génération token JWT (validité 30 jours)
4. Retour token + infos utilisateur

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ACHETEUR",
  "idUser": 1,
  "nom": "Dupont"
}
```

**Token JWT contient:**
- Subject: email utilisateur
- Claims: role, userId
- Expiration: 30 jours
- Signature: HS256

### 7.2 Module Produits

#### 7.2.1 Lister tous les produits

**Endpoint:** `GET /api/produits`

**Authentification:** Requise

**Réponse:**
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
      "nomCat": "Fruits"
    },
    "vendeur": {
      "idUser": 2,
      "nom": "Kamdem",
      "prenom": "Paul",
      "note": 4.5
    }
  }
]
```

#### 7.2.2 Créer un produit (Vendeur uniquement)

**Endpoint:** `POST /api/produits`

**Content-Type:** `multipart/form-data`

**Paramètres:**
- `nom` (String) : Nom du produit
- `prix` (Double) : Prix en FCFA
- `quantite` (Integer) : Stock initial
- `description` (String) : Description
- `idCategorie` (Long) : ID catégorie
- `image` (File) : Photo du produit

**Traitement:**
1. Vérification rôle VENDEUR
2. Validation des données
3. Upload et stockage de l'image
4. Création produit en base
5. Retour produit créé

#### 7.2.3 Mettre à jour un produit

**Endpoint:** `PUT /api/produits/{idProduit}`

**Autorisations:** Uniquement le propriétaire (vendeur)

**Paramètres:** Mêmes que création (tous optionnels)

#### 7.2.4 Supprimer un produit

**Endpoint:** `DELETE /api/produits/{idProduit}`

**Autorisations:** Uniquement le propriétaire (vendeur)

**Traitement:**
1. Vérification propriété
2. Suppression en base
3. Suppression image associée

### 7.3 Module Panier et Commandes

#### 7.3.1 Ajouter au panier

**Endpoint:** `POST /api/panier/ajouter`

**Données:**
```json
{
  "idProduit": 1,
  "quantite": 2
}
```

**Traitement:**
1. Récupération panier actif de l'acheteur
2. Vérification stock disponible
3. Ajout ou mise à jour ligne panier
4. Retour panier mis à jour

#### 7.3.2 Voir le panier

**Endpoint:** `GET /api/panier`

**Réponse:**
```json
{
  "idPanier": 1,
  "statut": "ACTIF",
  "articles": [
    {
      "id": 1,
      "produit": {
        "idProduit": 1,
        "nom": "Bananes plantains",
        "prix": 500.0
      },
      "quantite": 2
    }
  ],
  "total": 1000.0
}
```

#### 7.3.3 Valider le panier (créer commande)

**Endpoint:** `POST /api/commandes/valider`

**Données:**
```json
{
  "idAgence": 1
}
```

**Traitement:**
1. Récupération panier actif
2. Vérification stocks pour tous les articles
3. Calcul montant total
4. Création commande avec statut EN_ATTENTE
5. Création lignes de commande
6. Archivage du panier
7. Retour commande créée

**Réponse:**
```json
{
  "idCommande": 1,
  "dateCommande": "2025-12-15T10:30:00Z",
  "montantTotal": 1000.0,
  "statut": "EN_ATTENTE",
  "details": [...]
}
```

#### 7.3.4 Voir mes commandes

**Endpoint:** `GET /api/commandes/mes-commandes`

**Réponse:** Liste des commandes de l'acheteur

#### 7.3.5 Voir détail d'une commande

**Endpoint:** `GET /api/commandes/{idCommande}`

**Autorisations:** Uniquement propriétaire (acheteur) ou vendeur concerné

### 7.4 Module Messagerie

#### 7.4.1 Envoyer un message

**Endpoint:** `POST /api/messages/envoyer`

**Données:**
```json
{
  "idDestinataire": 2,
  "contenu": "Bonjour, est-ce que le produit est disponible ?"
}
```

**Traitement:**
1. Recherche conversation existante entre émetteur et destinataire
2. Si aucune conversation : création nouvelle conversation
3. Création message dans la conversation
4. Notification destinataire (future: push notification)

#### 7.4.2 Voir mes conversations

**Endpoint:** `GET /api/messages/conversations`

**Réponse:**
```json
[
  {
    "idConversation": 1,
    "participants": [
      {"idUser": 1, "nom": "Dupont"},
      {"idUser": 2, "nom": "Kamdem"}
    ],
    "dernierMessage": {
      "contenu": "Merci !",
      "dateEnvoi": "2025-12-15T11:00:00Z"
    }
  }
]
```

#### 7.4.3 Voir messages d'une conversation

**Endpoint:** `GET /api/messages/conversation/{idConversation}`

**Réponse:**
```json
{
  "idConversation": 1,
  "messages": [
    {
      "idMessage": 1,
      "emetteur": {"idUser": 1, "nom": "Dupont"},
      "contenu": "Bonjour",
      "dateEnvoi": "2025-12-15T10:00:00Z",
      "statut": "LU"
    }
  ]
}
```

### 7.5 Module Paiement

#### 7.5.1 Effectuer un paiement

**Endpoint:** `POST /api/paiements/payer`

**Données:**
```json
{
  "commandeId": 1,
  "modePaiement": "ORANGE_MONEY",
  "devise": "XAF",
  "numeroTelephone": "+237698765432"
}
```

**Traitement:**
1. Vérification que la commande est EN_ATTENTE
2. Appel API du fournisseur de paiement (Orange Money / MTN)
3. Création enregistrement paiement avec statut EN_ATTENTE
4. Attente confirmation du fournisseur (webhook ou polling)
5. Mise à jour statut paiement et commande

**Modes de paiement supportés:**
- **CARTE_BANCAIRE** : Via gateway de paiement
- **ORANGE_MONEY** : API Orange Money
- **MTN_MOMO** : API MTN Mobile Money

**Réponse:**
```json
{
  "idPaiement": 1,
  "statut": "EN_ATTENTE",
  "referenceTransaction": "OM-12345678",
  "urlPaiement": "https://payment.orangemoney.cm/..."
}
```

---

<div style="page-break-after: always;"></div>

## 8. SÉCURITÉ

### 8.1 Authentification JWT

#### Fonctionnement

1. **Connexion:**
   - Utilisateur envoie email + mot de passe
   - Backend vérifie les credentials
   - Si valide : génération token JWT signé

2. **Requêtes suivantes:**
   - Client inclut token dans header `Authorization: Bearer {token}`
   - Backend vérifie la signature du token
   - Si valide : extraction userId et role
   - Autorisation d'accès aux ressources

3. **Expiration:**
   - Token valide 30 jours
   - Après expiration : reconnexion requise

#### Structure du token JWT

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user@example.com",
  "iat": 1702647600,
  "exp": 1705239600,
  "userId": 1,
  "role": "ACHETEUR"
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

### 8.2 Gestion des rôles

#### Rôles disponibles

1. **ACHETEUR**
   - Peut consulter produits
   - Peut ajouter au panier
   - Peut passer commandes
   - Peut effectuer paiements
   - Peut envoyer messages

2. **VENDEUR**
   - Tous les droits ACHETEUR +
   - Peut créer/modifier/supprimer ses produits
   - Peut gérer les catégories
   - Peut voir ses commandes
   - Peut consulter ses statistiques

3. **ADMIN** (futur)
   - Tous les droits
   - Peut modérer utilisateurs
   - Peut voir statistiques globales

#### Contrôle d'accès

**Annotations Spring Security:**
```java
@PreAuthorize("hasRole('VENDEUR')")
public ResponseEntity<?> createProduct() { }

@PreAuthorize("hasRole('ACHETEUR')")
public ResponseEntity<?> addToCart() { }

@PreAuthorize("hasAnyRole('ACHETEUR', 'VENDEUR')")
public ResponseEntity<?> viewProducts() { }
```

### 8.3 Sécurité des données

#### Mots de passe

- **Hashage:** BCrypt avec salt automatique
- **Coût:** 12 rounds (équilibre sécurité/performance)
- **Jamais stockés en clair**
- **Jamais retournés dans les réponses API**

#### Données sensibles

- **Numéros CNI:** Chiffrés en base (future amélioration)
- **Informations paiement:** Jamais stockées (tokens tiers)
- **Tokens JWT:** Stockés uniquement côté client (AsyncStorage)

#### Protection CSRF

- **Non applicable:** API REST stateless sans cookies
- **Protection via:** Vérification token JWT unique par utilisateur

#### CORS (Cross-Origin Resource Sharing)

Configuration actuelle:
```java
@CrossOrigin("*")  // Autorise toutes les origines
```

**Production:** Limiter aux domaines autorisés:
```java
@CrossOrigin(origins = {
  "https://app.terrabia.cm",
  "https://admin.terrabia.cm"
})
```

#### HTTPS

- **Obligatoire en production:** Toutes les communications chiffrées
- **Certificat SSL:** Fourni par Render.com
- **Redirection:** HTTP → HTTPS automatique

#### Validation des entrées

- **Backend:** Annotations Jakarta Validation
  ```java
  @NotBlank(message = "Le nom est obligatoire")
  @Size(min = 2, max = 50)
  private String nom;
  ```

- **Frontend:** Validation avant envoi API
  ```typescript
  if (!email || !isValidEmail(email)) {
    throw new Error("Email invalide");
  }
  ```

#### Prévention injections SQL

- **JPA/Hibernate:** Requêtes paramétrées automatiques
- **Pas de requêtes SQL brutes**

---

<div style="page-break-after: always;"></div>

## 9. DESIGN ET INTERFACE UTILISATEUR

### 9.1 Charte graphique

#### Couleurs

**Palette principale:**
- **Orange principal:** `#F27A22`
  - Boutons primaires
  - Appels à l'action
  - Éléments actifs

- **Orange clair:** `#F59E0B`
  - Backgrounds secondaires
  - Section hero

- **Vert:** `#10B981`
  - Indicateurs de succès
  - États actifs
  - Badges "Disponible"

**Couleurs neutres:**
- **Gris foncé:** `#1F2937` - Texte principal
- **Gris moyen:** `#6B7280` - Texte secondaire
- **Gris clair:** `#F3F4F6` - Backgrounds
- **Blanc:** `#FFFFFF` - Cartes, modales

**Couleurs sémantiques:**
- **Succès:** `#10B981` (vert)
- **Erreur:** `#EF4444` (rouge)
- **Avertissement:** `#F59E0B` (orange)
- **Information:** `#3B82F6` (bleu)

#### Typographie

**Famille de polices:** System default (San Francisco iOS / Roboto Android)

**Tailles:**
- **H1:** 28px, poids 700 (gras) - Titres principaux
- **H2:** 24px, poids 700 - Titres secondaires
- **H3:** 20px, poids 600 - Sous-titres
- **Body:** 16px, poids 400 - Texte courant
- **Body Small:** 14px, poids 400 - Texte secondaire
- **Caption:** 12px, poids 500 - Labels, badges

#### Espacements

Système d'espacement basé sur multiples de 8:
- **XS:** 4px
- **S:** 8px
- **M:** 16px
- **L:** 24px
- **XL:** 32px
- **XXL:** 48px

#### Coins arrondis

- **Boutons:** 8px
- **Cartes:** 12px
- **Images:** 8px
- **Badges:** 16px (arrondi complet)

#### Ombres

```css
shadow-sm: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2
}

shadow-md: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4
}

shadow-lg: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 8
}
```

### 9.2 Navigation

#### Structure de navigation

```
AppNavigator (Stack)
│
├─ SplashScreen
│
├─ AuthNavigator (Stack)
│  ├─ LoginScreen
│  ├─ RegisterScreen
│  └─ ForgotPasswordScreen
│
└─ MainNavigator (Bottom Tabs)
   │
   ├─ HomeStack (Stack)
   │  ├─ HomeScreen
   │  ├─ ProductDetailScreen
   │  └─ SearchScreen
   │
   ├─ CategoriesStack (Stack)
   │  ├─ CategoriesScreen
   │  └─ CategoryProductsScreen
   │
   ├─ CartStack (Stack)
   │  ├─ CartScreen
   │  ├─ CheckoutScreen
   │  ├─ PaymentScreen
   │  └─ PaymentSuccessScreen
   │
   ├─ OrdersStack (Stack)
   │  ├─ OrderHistoryScreen
   │  └─ OrderDetailScreen
   │
   └─ ProfileStack (Stack)
      ├─ ProfileScreen
      ├─ ConversationsScreen
      ├─ ChatScreen
      └─ (Si VENDEUR):
          ├─ ProducerDashboardScreen
          ├─ ProducerProductsScreen
          ├─ ProducerOrdersScreen
          └─ CategoriesManagementScreen
```

#### Bottom Tab Bar

**Onglets pour ACHETEUR:**
1. Accueil (icône: Home)
2. Catégories (icône: Grid)
3. Panier (icône: ShoppingCart) + Badge quantité
4. Profil (icône: User)

**Onglets pour VENDEUR:**
1. Tableau de bord (icône: BarChart)
2. Produits (icône: Package)
3. Commandes (icône: ShoppingBag)
4. Profil (icône: User)

### 9.3 Responsive Design

#### Breakpoints

- **Small:** < 375px (iPhone SE)
- **Medium:** 375px - 414px (iPhone standard)
- **Large:** > 414px (iPhone Plus, iPad)

#### Adaptation

- **Grilles de produits:**
  - Small: 1 colonne
  - Medium: 2 colonnes
  - Large: 3 colonnes

- **Espacements:**
  - Réduction automatique sur petits écrans
  - Padding minimum: 16px

- **Images:**
  - Tailles adaptatives
  - Lazy loading pour performance

---

<div style="page-break-after: always;"></div>

## 10. DÉPLOIEMENT

### 10.1 Infrastructure

#### Backend API

**Plateforme:** Render.com

**Configuration:**
- **Service Type:** Web Service
- **Environment:** Production
- **Region:** Frankfurt, Germany (Europe)
- **Instance Type:** Starter (512 MB RAM)
- **Build Command:** `./mvnw clean package`
- **Start Command:** `java -jar target/terrabia-0.0.1-SNAPSHOT.jar`

**Variables d'environnement:**
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=postgresql://...
JWT_SECRET=...
ORANGE_MONEY_API_KEY=...
MTN_MOMO_API_KEY=...
```

**Base de données:**
- **Type:** PostgreSQL 15
- **Hébergement:** Render.com (même région que backend)
- **Sauvegarde:** Quotidienne automatique

#### Application Mobile

**Distribution:**
- **Google Play Store** (Android)
- **Apple App Store** (iOS)

**Build:**
- **Android:** Gradle + APK/AAB signing
- **iOS:** Xcode + Certificate provisioning

### 10.2 CI/CD

#### Process de déploiement backend

1. **Développement:**
   - Branche `develop`
   - Tests locaux

2. **Staging:**
   - Merge vers `main`
   - Déploiement automatique Render
   - Tests d'intégration

3. **Production:**
   - Tag version (v1.0.0)
   - Déploiement production Render

#### Process de déploiement mobile

1. **Build:**
   - Version bump (package.json)
   - Build release (Android + iOS)

2. **Test:**
   - Tests sur devices réels
   - Beta testing (TestFlight / Google Play Beta)

3. **Release:**
   - Soumission App Store / Play Store
   - Review et validation
   - Publication

### 10.3 Monitoring

#### Logs Backend

- **Spring Boot Logging:** Fichiers logs rotatifs
- **Render Logs:** Dashboard Render.com
- **Niveaux:**
  - ERROR: Erreurs critiques
  - WARN: Avertissements
  - INFO: Informations générales
  - DEBUG: Debug (dev uniquement)

#### Métriques

**Backend:**
- Temps de réponse API
- Taux d'erreur
- Nombre de requêtes/minute
- Utilisation mémoire/CPU

**Mobile:**
- Crashs application
- Temps de chargement écrans
- Utilisation réseau
- Taille de l'app

#### Alertes

- **Downtime backend:** Email immédiat
- **Erreur 5xx:** Notification si > 10/min
- **Crash mobile:** Rapport quotidien

---

<div style="page-break-after: always;"></div>

## 11. TESTS

### 11.1 Tests unitaires

#### Backend (JUnit 5 + Mockito)

**Services testés:**
```java
@SpringBootTest
class ProduitServiceTest {
    @Test
    void testCreateProduct_Success() {
        // Arrange
        Produit produit = new Produit(...);

        // Act
        Produit result = produitService.create(produit);

        // Assert
        assertNotNull(result.getIdProduit());
        assertEquals("Bananes", result.getNom());
    }

    @Test
    void testCreateProduct_InvalidData_ThrowsException() {
        // Arrange
        Produit produit = new Produit();
        produit.setPrix(-100.0); // Prix négatif

        // Act & Assert
        assertThrows(ValidationException.class, () -> {
            produitService.create(produit);
        });
    }
}
```

**Couverture cible:** > 80%

#### Frontend (Jest + React Native Testing Library)

**Services testés:**
```typescript
describe('ProductService', () => {
  it('should fetch products successfully', async () => {
    // Arrange
    const mockProducts = [
      { idProduit: 1, nom: 'Bananes', prix: 500 }
    ];
    mockApiClient.get.mockResolvedValue({
      success: true,
      data: mockProducts
    });

    // Act
    const result = await ProductService.getAllProducts();

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].nom).toBe('Bananes');
  });
});
```

### 11.2 Tests d'intégration

#### Backend

**Tests des endpoints:**
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ProduitControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllProducts_ReturnsProductList() throws Exception {
        mockMvc.perform(get("/api/produits")
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].nom").exists());
    }
}
```

#### Frontend

**Tests de navigation:**
- Vérifier transitions entre écrans
- Tester deep linking
- Valider état persistant

### 11.3 Tests end-to-end

#### Scénarios critiques

1. **Parcours acheteur complet:**
   - Inscription
   - Connexion
   - Navigation catalogue
   - Ajout au panier
   - Passage de commande
   - Paiement
   - Suivi commande

2. **Parcours vendeur complet:**
   - Inscription vendeur
   - Connexion
   - Ajout produit avec photo
   - Réception commande
   - Changement statut
   - Messagerie avec acheteur

#### Outils

- **Detox** (React Native E2E)
- **Appium** (alternative cross-platform)

---

<div style="page-break-after: always;"></div>

## 12. ANNEXES

### 12.1 Diagrammes

#### 12.1.1 Diagramme de cas d'utilisation

*Voir fichier: `diagrammes/WhatsApp Image 2025-12-15 à 11.58.58_67371269.jpg`*

Ce diagramme présente les interactions entre les acteurs (Utilisateur, Acheteur, Vendeur, Agence_Livraison) et les différentes fonctionnalités du système.

**Acteurs et relations:**
- **Utilisateur** (généralisation) → Acheteur, Vendeur
- **Acheteur** → Peut participer à des conversations, envoyer des messages, payer, avoir un panier, passer des commandes
- **Vendeur** → Peut ajouter des produits
- **Agence_Livraison** → Peut livrer des commandes

**Cas d'utilisation principaux:**
- Participer (conversations)
- Envoyer (messages)
- Contenir (messages dans conversations)
- Avoir (panier)
- Contenir (produits dans panier)
- Payer (commandes)
- Constituer (lignes de commande)
- Livrer (commandes)
- Appartenir (produits à catégories)
- Ajouter (produits par vendeurs)

#### 12.1.2 Diagramme de classes

*Voir fichier: `diagrammes/WhatsApp Image 2025-12-15 à 11.58.58_b129f28a.jpg`*

Ce diagramme présente le modèle orienté objet complet avec toutes les classes et leurs relations.

**Classes principales:**
- **Utilisateur** (classe abstraite)
  - Attributs: idUser, nom, prenom, statut, email, numeroTelephone, sexe, ville
  - Spécialisations: Acheteur, Vendeur (avec partition)

- **Vendeur**
  - Attributs supplémentaires: note, numeroCni

- **Produit**
  - Attributs: idProduit, nom, prix, stock

- **Categorie_P**
  - Attributs: idCategorie, nomCategorie

- **Panier**
  - Attributs: idPanier, statut

- **Commande**
  - Attributs: idCommande

- **Message**
  - Attributs: idMessage, emetteur, receveur, statut, contenue (sic)

- **Conversation**
  - Attributs: idConversation

- **Agence_Livraison**
  - Attributs: idAgence

**Relations:**
- Utilisateur ←(1,1)→ Conversation ←(2,2)→ (participer)
- Utilisateur ←(1,1)→ Message ←(1,1)→ (envoyer)
- Conversation ←(1,1)→ Message ←(1,*)→ (contenir)
- Acheteur ←(1,1)→ Panier ←(1,*)→ (avoir)
- Panier ←(*)→ Produit ←(*)→ (contenir)
- Acheteur ←(1,1)→ Commande ←(1,*)→ (payer)
- Commande ←(1,*)→ Produit ←(*)→ (constituer)
- Agence_Livraison ←(1,1)→ Commande ←(*)→ (livrer)
- Categorie_P ←(1,1)→ Produit ←(0,n)→ (Appartenir)
- Vendeur ←(1,1)→ Produit ←(1,n)→ (ajouter)

#### 12.1.3 Schéma de base de données

*Voir fichier: `diagrammes/WhatsApp Image 2025-12-15 à 11.58.59_d06174ef.jpg`*

Ce diagramme présente le modèle relationnel physique de la base de données avec les tables, colonnes, clés primaires et étrangères.

**Tables:**
- **User** (id_user PK, nom, prenom, statut, email, Numtel, sexe, ville_)
- **Acheteur** (id_user PK/FK → User)
- **vendeur** (id_user PK/FK → User, note, numeroCni)
- **Panier** (idPanier PK, statut, id_user FK → User)
- **contenir** (table association: id_produit FK → produit, idPanier FK → Panier)
- **produit** (id_produit PK, nom, prix, quantite, idCat FK → categorie_P, id_user FK → vendeur)
- **categorie_P** (idCat PK, nomcat)
- **constituer** (table association: id_produit FK → produit, id_commande FK → commande)
- **commande** (id_commande PK, ID_Agence FK → Agence_Livraison, id_user FK → User)
- **Agence_Livraison** (ID_Agence PK)
- **message** (idMessage PK, emetteur, receveur, statut, contenue, id_user FK → User, idConversaton FK → conversation)
- **participer** (table association: id_user FK → User, idConversaton FK → conversation)
- **conversation** (idConversaton PK)

### 12.2 Documentation API

#### Accès Swagger UI

**URL:** `https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/`

La documentation interactive Swagger permet de :
- Consulter tous les endpoints disponibles
- Voir les modèles de données
- Tester les requêtes directement
- Voir les exemples de réponses

#### Endpoints principaux

**Authentification** (`/api/auth`)
- POST `/register` - Inscription
- POST `/login` - Connexion

**Produits** (`/api/produits`)
- GET `/` - Lister tous les produits
- GET `/{id}` - Détail d'un produit
- GET `/categorie/{idCat}` - Produits par catégorie
- GET `/vendeur/{idVendeur}` - Produits d'un vendeur
- POST `/` - Créer un produit (VENDEUR)
- PUT `/{id}` - Modifier un produit (VENDEUR)
- DELETE `/{id}` - Supprimer un produit (VENDEUR)

**Catégories** (`/api/categories`)
- GET `/` - Lister toutes les catégories
- POST `/` - Créer une catégorie (VENDEUR)

**Panier** (`/api/panier`)
- GET `/` - Voir son panier
- POST `/ajouter` - Ajouter au panier
- PUT `/modifier` - Modifier quantité
- DELETE `/retirer/{idLigne}` - Retirer du panier

**Commandes** (`/api/commandes`)
- POST `/valider` - Créer commande depuis panier
- GET `/mes-commandes` - Historique commandes acheteur
- GET `/vendeur/{idVendeur}` - Commandes reçues vendeur
- GET `/{id}` - Détail commande
- PUT `/{id}/statut` - Changer statut (VENDEUR)

**Paiements** (`/api/paiements`)
- POST `/payer` - Effectuer un paiement

**Messages** (`/api/messages`)
- GET `/conversations` - Lister conversations
- GET `/conversation/{id}` - Messages d'une conversation
- POST `/envoyer` - Envoyer un message

### 12.3 Glossaire

**Termes techniques:**

- **API REST:** Interface de programmation applicative suivant les principes REST (Representational State Transfer)
- **JWT:** JSON Web Token, standard pour créer des tokens d'accès sécurisés
- **ORM:** Object-Relational Mapping, technique de conversion entre objets et base de données relationnelle
- **CORS:** Cross-Origin Resource Sharing, mécanisme de sécurité des navigateurs
- **BCrypt:** Algorithme de hashage de mots de passe
- **Redux:** Bibliothèque de gestion d'état pour applications JavaScript
- **Stack Navigation:** Navigation par empilement d'écrans
- **Tab Navigation:** Navigation par onglets

**Termes métier:**

- **Acheteur:** Client utilisant la plateforme pour acheter des produits
- **Vendeur:** Producteur agricole vendant ses produits sur la plateforme
- **Panier:** Collection temporaire de produits avant commande
- **Commande:** Ensemble de produits commandés et payés
- **Ligne de commande:** Un produit dans une commande (avec quantité)
- **Agence de livraison:** Partenaire logistique assurant la livraison
- **Conversation:** Échange de messages entre deux utilisateurs
- **Note:** Évaluation d'un vendeur par les acheteurs (0-5 étoiles)

**Abréviations:**

- **CNI:** Carte Nationale d'Identité
- **FCFA:** Franc CFA (devise)
- **MCD:** Modèle Conceptuel de Données
- **MLD:** Modèle Logique de Données
- **PK:** Primary Key (Clé primaire)
- **FK:** Foreign Key (Clé étrangère)
- **DTO:** Data Transfer Object
- **CRUD:** Create, Read, Update, Delete

---

<div style="page-break-after: always;"></div>

## CONCLUSION

### Synthèse du projet

Terrabia représente une solution complète et moderne pour révolutionner le commerce agricole local au Cameroun. Le projet combine une application mobile performante développée en React Native avec une API backend robuste construite sur Spring Boot et PostgreSQL.

### Points forts

1. **Architecture solide:**
   - Séparation claire frontend/backend
   - API REST bien structurée
   - Base de données relationnelle normalisée

2. **Sécurité:**
   - Authentification JWT
   - Gestion des rôles
   - Hashage BCrypt
   - HTTPS obligatoire

3. **Expérience utilisateur:**
   - Interface intuitive
   - Navigation fluide
   - Design moderne et cohérent

4. **Fonctionnalités complètes:**
   - Gestion produits et catalogue
   - Panier et commandes
   - Paiements multiples (CB, Mobile Money)
   - Messagerie intégrée

### Évolutions futures

#### Court terme (3-6 mois)
- Notifications push
- Système de notation/avis produits
- Filtres avancés de recherche
- Géolocalisation des producteurs
- Tracking de livraison en temps réel

#### Moyen terme (6-12 mois)
- Application web (admin dashboard)
- Statistiques et analytics avancées
- Programme de fidélité
- Promotions et codes promo
- Multi-langues (FR/EN)

#### Long terme (1-2 ans)
- Intelligence artificielle (recommandations)
- Blockchain pour traçabilité
- Extension à d'autres pays (CEMAC)
- Marketplace B2B (restaurants, hôtels)
- Application pour agences de livraison

### Impact attendu

**Social:**
- Amélioration des revenus des producteurs (+30% estimé)
- Création d'emplois dans la logistique
- Renforcement de l'agriculture locale

**Économique:**
- Réduction des coûts pour les consommateurs (-15% estimé)
- Développement du commerce numérique
- Contribution au PIB numérique

**Environnemental:**
- Réduction du gaspillage alimentaire
- Circuits courts (moins de transport)
- Valorisation de l'agriculture durable

---

**Document généré le:** Décembre 2025
**Version:** 1.0
**Statut:** Final

---

**Contact:**
- **Email:** contact@terrabia.cm
- **Site web:** https://terrabia.cm
- **Support:** support@terrabia.cm

---

© 2025 Terrabia. Tous droits réservés.
