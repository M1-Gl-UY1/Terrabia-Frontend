# Terrabia - Application Mobile React Native

Une application mobile pour commander des produits frais directement auprès des producteurs locaux.

## 🚀 Fonctionnalités

### Écran d'onboarding
- **4 slides d'introduction** présentant les avantages de l'application
- Navigation fluide avec boutons précédent/suivant
- Indicateurs de pagination
- Bouton "passer" pour aller directement à l'accueil

### Page d'accueil
- **Barre de recherche** pour trouver des produits
- **Section Hero** avec appel à l'action
- **Offres du jour** avec produits en promotion
- **Produits recommandés** avec indicateurs de qualité
- **Navigation par onglets** en bas de l'écran

### Navigation par onglets
- **Accueil** : Page principale avec produits et offres
- **Catégories** : Grille de catégories de produits
- **Panier** : Gestion du panier avec calcul des totaux
- **Profil** : Informations utilisateur et paramètres

## 🛠️ Structure du projet

```
src/
├── components/
│   ├── OnboardingSlide.tsx      # Composant pour chaque slide d'onboarding
│   ├── PaginationDots.tsx       # Indicateurs de pagination
│   └── BottomTabBar.tsx         # Barre de navigation en bas
├── navigation/
│   └── AppNavigator.tsx         # Configuration des routes
├── screens/
│   ├── Onboarding/
│   │   └── OnboardingScreen.tsx # Écran d'onboarding principal
│   ├── HomeScreen.tsx           # Page d'accueil
│   ├── CategoriesScreen.tsx     # Écran des catégories
│   ├── CartScreen.tsx           # Écran du panier
│   └── ProfileScreen.tsx        # Écran de profil
└── assets/
    └── images/                  # Images et icônes
```

## 🎨 Design System

### Couleurs principales
- **Orange principal** : `#F27A22` (boutons, accents)
- **Jaune** : `#F59E0B` (section hero)
- **Vert** : `#10B981` (indicateurs actifs)
- **Gris foncé** : `#1F2937` (texte principal)
- **Gris clair** : `#6B7280` (texte secondaire)

### Typographie
- **Titres** : 24-28px, poids 700
- **Sous-titres** : 18-20px, poids 600
- **Corps de texte** : 14-16px, poids 400-500
- **Labels** : 12-14px, poids 500

## 🚀 Installation et démarrage

1. **Cloner le projet**
   ```bash
   git clone [URL_DU_REPO]
   cd KOM_B
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer Metro**
   ```bash
   npm start
   ```

4. **Lancer sur Android**
   ```bash
   npm run android
   ```

5. **Lancer sur iOS**
   ```bash
   npm run ios
   ```

## 📱 Navigation

L'application utilise React Navigation avec :
- **Stack Navigator** pour l'onboarding → accueil
- **Tab Navigator** pour la navigation principale
- **Navigation fluide** entre les écrans

### Routes disponibles
- `Onboarding` : Écran d'introduction
- `MainTabs` : Navigation par onglets
  - `Home` : Page d'accueil
  - `Categories` : Catégories de produits
  - `Cart` : Panier d'achat
  - `Profile` : Profil utilisateur

## 🔧 Dépendances principales

- `react-native` : 0.81.0
- `@react-navigation/native` : ^6.1.17
- `@react-navigation/native-stack` : ^6.10.0
- `@react-navigation/bottom-tabs` : ^6.5.0
- `react-native-safe-area-context` : ^5.5.2
- `react-native-screens` : ^4.5.0

## 📸 Captures d'écran

L'application comprend :
1. **Écran de bienvenue** avec logo Terrabia
2. **Slide de commande** avec icône de boîte
3. **Slide d'agriculture locale** avec graphique
4. **Slide final** avec checkmark
5. **Page d'accueil** avec recherche et produits
6. **Navigation par onglets** fonctionnelle

## 🎯 Fonctionnalités à venir

- [ ] Authentification utilisateur
- [ ] Système de paiement
- [ ] Suivi des commandes en temps réel
- [ ] Notifications push
- [ ] Mode hors ligne
- [ ] Intégration avec l'API backend

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
