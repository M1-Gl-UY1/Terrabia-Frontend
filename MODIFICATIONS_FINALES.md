# Modifications finales de l'intégration backend

## Changements effectués

### 1. ✅ Logs explicites ajoutés

**Problème** : Les logs ne s'affichaient pas clairement lors de l'inscription/connexion.

**Solution** : Ajout de `console.log` explicites avec emojis dans :

#### SignUpScreen (src/screens/Registration/SignUpScreen.tsx)
```javascript
console.log('📤 INSCRIPTION - Données envoyées:', {...});
console.log('📥 INSCRIPTION - Réponse reçue:', {...});
console.error('❌ INSCRIPTION - Erreur:', error);
```

#### LoginScreen (src/screens/Registration/LoginScreen.tsx)
```javascript
console.log('📤 CONNEXION - Tentative de connexion:', {...});
console.log('📥 CONNEXION - Réponse reçue:', {...});
console.log('✅ CONNEXION - Succès! Utilisateur:', {...});
console.error('❌ CONNEXION - Échec:', error);
```

**Où voir les logs** : Dans la console de votre terminal React Native (Metro Bundler)

### 2. ✅ Sélecteur de ville amélioré

**Problème** : Le champ ville était un simple TextInput.

**Solution** : Ajout d'un **Modal picker** avec les villes principales du Cameroun :
- Yaoundé
- Douala
- Garoua
- Bafoussam
- Bamenda
- Maroua
- Ngaoundéré
- Bertoua
- Buéa
- Limbé
- Kribi
- Ebolowa

**Fichier modifié** : `src/screens/Registration/SignUpScreen.tsx`

**UI** :
- Bouton de sélection avec icône ChevronDown
- Modal qui s'affiche depuis le bas
- Liste scrollable des villes
- Checkmark sur la ville sélectionnée

### 3. ✅ Écrans OTP retirés de la navigation

**Problème** : Les écrans OTP étaient dans la navigation mais le backend ne les supporte pas.

**Solution** : Suppression complète de :
- `OTPVerificationScreen`
- `VerificationSuccessScreen`
- Imports correspondants
- Types dans `RootStackParamList`

**Fichier modifié** : `src/navigation/AppNavigator.tsx`

**Navigation simplifiée** :
```
Splash → OnboardingInitialScreen
  ↓
  ├─ SignUp → (succès) → Login → MainTabs
  └─ Login → (succès) → MainTabs
```

### 4. ✅ Rôle ACHETEUR en dur

**Déjà fait** : Le rôle est forcé à `ACHETEUR` lors de l'inscription.

```typescript
role: Role.ACHETEUR,  // src/screens/Registration/SignUpScreen.tsx:139
```

### 5. ✅ Séparation Nom/Prénom

**Déjà fait** : Les champs `nom` et `prenom` sont séparés dans le formulaire d'inscription.

### 6. ✅ Champ Sexe avec sélecteur radio

**Déjà fait** : Radio buttons pour choisir entre HOMME et FEMME.

## URL de l'API

L'URL de l'API backend est stockée dans :

**Fichier** : `src/config/api.config.ts`
**Ligne** : 10
**Valeur** : `https://terrabia-backend-g2ym.onrender.com`

Pour changer l'URL (dev/prod) :
```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'https://terrabia-backend-g2ym.onrender.com' // URL pour dev
    : 'https://terrabia-backend-g2ym.onrender.com', // URL pour prod
  // ...
};
```

## Comment tester l'inscription et la connexion

### 1. Lancer l'application
```bash
cd C:\Users\Scorpion\ReactNativeProjects\KOM-B
npm start
```

### 2. Tester l'inscription
1. Ouvrir l'app sur votre émulateur/appareil
2. Cliquer sur "S'inscrire"
3. Remplir tous les champs :
   - Nom : `Dupont`
   - Prénom : `Jean`
   - Email : `jean.dupont123@example.com` (utilisez un email unique)
   - Téléphone : `+237698765432`
   - Ville : Sélectionner dans la liste (ex: Yaoundé)
   - Sexe : Homme ou Femme
   - Mot de passe : `motdepasse123`
   - Confirmation : `motdepasse123`
4. Cliquer sur "S'inscrire"

**Logs attendus dans la console** :
```
📤 INSCRIPTION - Données envoyées: {
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont123@example.com",
  numTel: "+237698765432",
  ville: "Yaoundé",
  sexe: "HOMME",
  role: "ACHETEUR",
  password: "***"
}

ℹ️ [timestamp] [INFO] 🔐 Tentative d'inscription {email: "jean.dupont123@example.com", role: "ACHETEUR"}

🌐 API REQUEST: POST https://terrabia-backend-g2ym.onrender.com/api/auth/register
{headers: {...}, body: {...}}

📥 INSCRIPTION - Réponse reçue: {
  success: true,
  data: "Acheteur inscrit avec succès !",
  status: 200
}

✅ [timestamp] [SUCCESS] ✅ Inscription réussie {email: "jean.dupont123@example.com"}
```

### 3. Tester la connexion
1. Après l'inscription, vous êtes redirigé vers Login
2. Entrer :
   - Email : `jean.dupont123@example.com`
   - Mot de passe : `motdepasse123`
3. Cliquer sur "Se connecter"

**Logs attendus dans la console** :
```
📤 CONNEXION - Tentative de connexion: {email: "jean.dupont123@example.com"}

ℹ️ [timestamp] [INFO] 🔐 Tentative de connexion {email: "jean.dupont123@example.com"}

🌐 API REQUEST: POST https://terrabia-backend-g2ym.onrender.com/api/auth/login
{headers: {...}, body: {...}}

📥 CONNEXION - Réponse reçue: {
  success: true,
  hasData: true
}

✅ CONNEXION - Succès! Utilisateur: {
  idUser: 123,
  nom: "Dupont",
  role: "ACHETEUR"
}

✅ [timestamp] [SUCCESS] ✅ Connexion réussie {userId: 123, role: "ACHETEUR", nom: "Dupont"}
```

### 4. Vérifier la persistance
1. Fermer complètement l'application
2. Relancer l'application
3. Vous devriez être automatiquement connecté (SplashScreen → MainTabs)

**Logs attendus** :
```
🚀 Vérification de l'état d'authentification
✅ Utilisateur connecté, redirection vers MainTabs
```

### 5. Tester la déconnexion
1. Aller dans l'onglet "Profile"
2. Défiler jusqu'en bas
3. Cliquer sur "Se déconnecter"
4. Confirmer
5. Vous êtes redirigé vers OnboardingInitialScreen

## Résolution de problèmes

### Les logs ne s'affichent pas
- **Vérifier** : La console Metro Bundler est bien ouverte
- **Solution** : Les logs avec `console.log` s'affichent directement dans le terminal

### Erreur "Email déjà utilisé"
- **Cause** : L'email existe déjà dans la base de données
- **Solution** : Utiliser un autre email (ex: `jean.dupont2@example.com`)

### Erreur de connexion réseau
- **Vérifier** :
  1. Votre connexion internet
  2. Le backend est accessible : https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/
  3. L'URL dans `src/config/api.config.ts` est correcte

### Erreur "Token JWT invalide"
- **Cause** : Token corrompu ou expiré
- **Solution** : Se déconnecter et se reconnecter

## Structure des données envoyées au backend

### Inscription (POST /api/auth/register)
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123",
  "numTel": "+237698765432",
  "ville": "Yaoundé",
  "sexe": "HOMME",
  "role": "ACHETEUR"
}
```

### Connexion (POST /api/auth/login)
```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

### Réponse de connexion
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ACHETEUR",
  "idUser": 123,
  "nom": "Dupont"
}
```

## Flux complet de l'authentification

```
[APP START]
     ↓
SplashScreen
     ↓
Vérification token JWT dans AsyncStorage
     ↓
     ├─ Token trouvé et valide
     │      ↓
     │  dispatch(checkAuthStatus)
     │      ↓
     │  Redux: isAuthenticated = true
     │      ↓
     │  Navigation: MainTabs
     │
     └─ Pas de token
            ↓
        OnboardingInitialScreen
            ↓
            ├─ Bouton "S'inscrire"
            │      ↓
            │  SignUpScreen (formulaire complet)
            │      ↓
            │  authService.register()
            │      ↓
            │  POST /api/auth/register
            │      ↓
            │  [Succès] → Alert → Navigation: Login
            │
            └─ Bouton "Se connecter"
                   ↓
               LoginScreen
                   ↓
               authService.login()
                   ↓
               POST /api/auth/login
                   ↓
               [Succès] → Sauvegarde token + Redux
                   ↓
               Navigation: MainTabs
```

## Fichiers modifiés (résumé)

1. **src/screens/Registration/SignUpScreen.tsx**
   - Ajout du picker pour la ville
   - Ajout de console.log explicites
   - Modal de sélection

2. **src/screens/Registration/LoginScreen.tsx**
   - Ajout de console.log explicites

3. **src/navigation/AppNavigator.tsx**
   - Suppression des écrans OTP
   - Simplification du flux

## Prochaines étapes

1. ✅ Tester l'inscription
2. ✅ Tester la connexion
3. ✅ Tester la déconnexion
4. ✅ Tester la persistance de session
5. 🔄 Intégrer les produits avec l'API
6. 🔄 Intégrer le panier avec l'API
7. 🔄 Intégrer les commandes avec l'API

## Support

- **Documentation complète** : `API_DOCUMENTATION.md`
- **Guide d'intégration** : `INTEGRATION_GUIDE.md`
- **Exemples de code** : `EXEMPLES_UTILISATION.md`
- **Swagger backend** : https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/
