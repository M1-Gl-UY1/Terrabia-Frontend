# Guide d'intégration du backend Terrabia

Ce document récapitule toutes les modifications effectuées pour intégrer le backend Terrabia dans l'application React Native.

## Résumé des modifications

### 1. Structure des types TypeScript

**Fichier créé** : `src/types/Backend.ts`

- Définit tous les types et interfaces correspondant au backend
- Énumérations : `Role`, `Sexe`, `ModePaiement`, `StatutCommande`, `StatutPaiement`, `StatutPanier`, `StatutMessage`
- Interfaces : `Utilisateur`, `Acheteur`, `Vendeur`, `Produit`, `Panier`, `Commande`, `Paiement`, `Message`, `Conversation`
- Types de requêtes : `RegisterRequest`, `LoginRequest`, `CreateProduitRequest`, `AddToPanierRequest`, `PayerRequest`
- Types de réponses : `LoginResponse`, `ErrorResponse`, `ValidationErrorResponse`

### 2. Système de logging

**Fichier créé** : `src/utils/logger.ts`

- Logger singleton pour tracer toutes les opérations
- Niveaux de log : INFO, SUCCESS, WARNING, ERROR, DEBUG
- Méthodes spécifiques pour les API : `apiRequest`, `apiResponse`, `apiError`
- Formatage avec emojis pour une meilleure lisibilité
- Actif uniquement en développement par défaut

### 3. Configuration de l'API

**Fichier créé** : `src/config/api.config.ts`

- URL de base du backend : `https://terrabia-backend-g2ym.onrender.com`
- Configuration des timeouts et retry
- Endpoints organisés par module :
  - Authentification (`/api/auth/*`)
  - Produits (`/api/produits/*`)
  - Panier (`/api/panier/*`)
  - Commandes (`/api/commandes/*`)
  - Chat (`/api/chat/*`)
  - Paiement (`/api/paiement/*`)

### 4. Client HTTP (API Client)

**Fichier créé** : `src/utils/apiClient.ts`

- Client HTTP singleton avec gestion automatique :
  - Ajout du token JWT dans les headers
  - Gestion des timeouts
  - Logging automatique des requêtes/réponses
  - Gestion des erreurs
- Méthodes : `get`, `post`, `put`, `delete`, `patch`
- Gestion du stockage local avec AsyncStorage :
  - Token JWT
  - ID utilisateur
  - Rôle utilisateur
  - Nom utilisateur

**Package ajouté** : `@react-native-async-storage/async-storage`

### 5. Redux - Slice d'authentification

**Fichier créé** : `src/store/authSlice.ts`

- Gestion de l'état d'authentification dans Redux
- State : `isAuthenticated`, `isLoading`, `user`, `token`, `error`
- Actions : `setUser`, `logout`, `setError`, `clearError`, `setLoading`
- Thunk asynchrone : `checkAuthStatus` pour vérifier l'authentification au démarrage

**Fichier modifié** : `src/store/index.ts`

- Ajout du reducer `auth` au store Redux

### 6. Services API

#### AuthService (`src/services/AuthService.ts`)

- `register()` : Inscription d'un nouvel utilisateur
- `login()` : Connexion avec email/mot de passe
- `logout()` : Déconnexion
- `isAuthenticated()` : Vérification de la connexion
- `getCurrentUser()` : Récupération des infos utilisateur

#### ProduitService (`src/services/ProduitService.ts`)

- `getAllProduits()` : Récupère tous les produits
- `getProduitsByCategorie()` : Récupère les produits par catégorie
- `createProduit()` : Crée un nouveau produit (vendeurs uniquement)
- `deleteProduit()` : Supprime un produit

#### PanierService (`src/services/PanierService.ts`)

- `getPanier()` : Récupère le panier actif de l'acheteur
- `addToPanier()` : Ajoute un produit au panier
- `removeLigne()` : Supprime une ligne du panier
- `calculateTotal()` : Calcule le montant total du panier

#### CommandeService (`src/services/CommandeService.ts`)

- `passerCommande()` : Passe une commande à partir du panier
- `getHistorique()` : Récupère l'historique des commandes

#### PaiementService (`src/services/PaiementService.ts`)

- `payer()` : Initie un paiement pour une commande

### 7. Écrans créés/modifiés

#### SplashScreen (`src/screens/SplashScreen.tsx`)

- Écran de démarrage avec vérification de l'authentification
- Redirige vers `OnboardingInitialScreen` si non connecté
- Redirige vers `MainTabs` si connecté

#### OnboardingInitialScreen (`src/screens/Onboarding/OnboardingInitialScreen.tsx`)

- Premier écran d'onboarding
- Boutons "S'inscrire" et "Se connecter"
- Bouton "Découvrir" pour voir les slides d'onboarding

#### LoginScreen (`src/screens/Registration/LoginScreen.tsx`)

- Écran de connexion avec validation
- Champs : Email, Mot de passe
- Placeholders explicites
- Gestion des erreurs
- Intégration avec AuthService et Redux

#### SignUpScreen (`src/screens/Registration/SignUpScreen.tsx`)

- Écran d'inscription complet
- Champs : Nom, Prénom, Email, Téléphone, Ville, Sexe, Mot de passe, Confirmation mot de passe
- Placeholders explicites (ex: "+237698765432" pour le téléphone)
- Validation complète des champs
- Intégration avec AuthService

#### OTPVerificationScreen (`src/screens/Registration/OTPVerificationScreen.tsx`)

- Écran de vérification OTP (préparé pour future implémentation)
- Champ à 6 chiffres
- Bouton "Renvoyer le code"

#### VerificationSuccessScreen (`src/screens/Registration/VerificationSuccessScreen.tsx`)

- Écran de succès de vérification
- Redirection automatique vers MainTabs

#### ProfileScreen (modifié) (`src/screens/ProfileScreen.tsx`)

- Ajout de la fonctionnalité de déconnexion
- Affichage des informations utilisateur depuis Redux
- Bouton "Se déconnecter" avec confirmation

### 8. Navigation mise à jour

**Fichier modifié** : `src/navigation/AppNavigator.tsx`

- Ajout de l'écran `Splash` comme écran initial
- Organisation des écrans par catégories :
  - Démarrage (Splash)
  - Onboarding (4 écrans + Initial)
  - Authentification (Login, SignUp, OTP, Success)
  - Application principale (MainTabs, etc.)
- Ajout du type `Splash: undefined` dans `RootStackParamList`

## Flux d'authentification complet

### 1. Au démarrage de l'application

```
App.tsx
  ↓
SplashScreen
  ↓
Vérification token JWT (checkAuthStatus)
  ↓
  ├─ Token valide → MainTabs
  └─ Pas de token → OnboardingInitialScreen
```

### 2. Inscription d'un nouvel utilisateur

```
OnboardingInitialScreen
  ↓
SignUpScreen (formulaire complet)
  ↓
AuthService.register()
  ↓
Succès → Alert + Navigation vers Login
  ↓
LoginScreen
```

### 3. Connexion d'un utilisateur existant

```
OnboardingInitialScreen ou SignUpScreen
  ↓
LoginScreen
  ↓
AuthService.login()
  ↓
Succès → Sauvegarde token + Redux setUser
  ↓
Navigation vers MainTabs
```

### 4. Déconnexion

```
ProfileScreen
  ↓
Bouton "Se déconnecter"
  ↓
Alert de confirmation
  ↓
Redux logout() + apiClient.clearUserData()
  ↓
Navigation vers OnboardingInitialScreen
```

## Placeholders explicites dans les formulaires

### LoginScreen

- Email : `"Exemple: jean.dupont@email.com"`
- Mot de passe : `"Entrez votre mot de passe (min. 6 caractères)"`

### SignUpScreen

- Nom : `"Exemple: Dupont"`
- Prénom : `"Exemple: Jean"`
- Email : `"Exemple: jean.dupont@email.com"`
- Téléphone : `"Exemple: +237698765432"`
- Ville : `"Exemple: Yaoundé"`
- Mot de passe : `"Entrez un mot de passe (min. 6 caractères)"`
- Confirmation : `"Confirmez votre mot de passe"`

## Système de logs

Tous les appels API sont automatiquement loggés avec :

- **Requête** : Méthode, URL, Headers, Body
- **Réponse** : Status, Data
- **Erreur** : Message, Stack trace

Exemple de log dans la console :

```
ℹ️ [2025-12-04T10:30:00.000Z] [INFO] 🔐 Tentative de connexion
{
  "email": "jean@example.com"
}

✅ [2025-12-04T10:30:01.500Z] [SUCCESS] 🌐 API RESPONSE: POST /api/auth/login - Status 200
{
  "token": "eyJhbGc...",
  "role": "ACHETEUR",
  "idUser": 1,
  "nom": "Dupont"
}
```

## Tests à effectuer

### 1. Test d'inscription

1. Lancer l'application
2. Cliquer sur "S'inscrire"
3. Remplir tous les champs avec des données valides
4. Soumettre le formulaire
5. Vérifier le message de succès
6. Se connecter avec les identifiants créés

### 2. Test de connexion

1. Cliquer sur "Se connecter"
2. Entrer email et mot de passe
3. Vérifier la redirection vers MainTabs
4. Vérifier que le nom apparaît dans le ProfileScreen

### 3. Test de déconnexion

1. Aller dans l'onglet Profile
2. Défiler jusqu'à "Se déconnecter"
3. Cliquer et confirmer
4. Vérifier la redirection vers OnboardingInitialScreen

### 4. Test de persistance de session

1. Se connecter
2. Fermer complètement l'application
3. Relancer l'application
4. Vérifier que l'utilisateur reste connecté (redirection automatique vers MainTabs)

## Notes importantes

### 1. Backend utilisé

- URL de production : `https://terrabia-backend-g2ym.onrender.com`
- Documentation Swagger : `https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/`

### 2. Rôle de l'application

Cette application est **uniquement pour les clients** (rôle `ACHETEUR`).
L'application pour les producteurs (rôle `VENDEUR`) est séparée.

### 3. OTP non implémenté

Les écrans OTPVerificationScreen et VerificationSuccessScreen sont préparés mais l'API backend ne supporte pas encore la vérification OTP. Ils pourront être activés ultérieurement.

### 4. Logs de développement

Le système de logging est actif uniquement en développement (`__DEV__ === true`). En production, les logs ne seront pas affichés.

### 5. Sécurité

- Les mots de passe sont hashés côté backend avec BCrypt
- Le token JWT expire après 30 jours
- Les données sensibles (token, infos utilisateur) sont stockées localement avec AsyncStorage

## Prochaines étapes recommandées

1. Intégrer les services API dans les écrans existants (HomeScreen, CartScreen, etc.)
2. Remplacer les données mockées par des appels API réels
3. Implémenter la gestion du panier avec l'API
4. Implémenter le passage de commande avec l'API
5. Implémenter le paiement avec l'API
6. Ajouter la gestion des erreurs réseau (mode hors ligne)
7. Ajouter un refresh token pour prolonger la session
8. Implémenter les notifications push

## Structure des fichiers créés

```
src/
├── config/
│   └── api.config.ts                           # Configuration de l'API
├── utils/
│   ├── logger.ts                               # Système de logging
│   └── apiClient.ts                            # Client HTTP
├── types/
│   └── Backend.ts                              # Types TypeScript du backend
├── store/
│   ├── index.ts                                # Store Redux (modifié)
│   └── authSlice.ts                            # Slice Redux d'authentification
├── services/
│   ├── AuthService.ts                          # Service d'authentification
│   ├── ProduitService.ts                       # Service de produits
│   ├── PanierService.ts                        # Service de panier
│   ├── CommandeService.ts                      # Service de commandes
│   └── PaiementService.ts                      # Service de paiement
├── screens/
│   ├── SplashScreen.tsx                        # Écran de démarrage
│   ├── Onboarding/
│   │   └── OnboardingInitialScreen.tsx         # Premier écran d'onboarding
│   ├── Registration/
│   │   ├── LoginScreen.tsx                     # Écran de connexion
│   │   ├── SignUpScreen.tsx                    # Écran d'inscription
│   │   ├── OTPVerificationScreen.tsx           # Écran de vérification OTP
│   │   └── VerificationSuccessScreen.tsx       # Écran de succès
│   └── ProfileScreen.tsx                       # Écran de profil (modifié)
└── navigation/
    └── AppNavigator.tsx                        # Navigation (modifiée)
```

## Support

Pour toute question ou problème d'intégration :

- Consulter `API_DOCUMENTATION.md` pour les détails sur le backend
- Consulter les logs dans la console pour le debugging
- Utiliser la documentation Swagger pour tester les endpoints : `https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/`
