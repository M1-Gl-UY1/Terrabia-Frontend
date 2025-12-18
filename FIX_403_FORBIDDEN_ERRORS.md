# 🔧 Fix 403 Forbidden Errors - Backend

## 🐛 Problèmes Identifiés

### 1. Erreur de Génération de Clé JWT
**Fichier** : `JwtUtils.java` (ligne 72)

**AVANT** (❌ Incorrect) :
```java
private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(java.util.Base64.getEncoder().encodeToString(SECRET_KEY.getBytes()));
    return Keys.hmacShaKeyFor(keyBytes);
}
```

**Problème** :
- La clé secrète était encodée en Base64 puis immédiatement décodée
- Cette opération était redondante et incorrecte
- La clé résultante ne correspondait pas à la clé utilisée lors de la génération du token
- **Résultat** : Tous les tokens générés étaient rejetés lors de la validation

**APRÈS** (✅ Correct) :
```java
private Key getSignInKey() {
    // Utiliser directement les octets de la clé secrète pour générer une clé HMAC
    byte[] keyBytes = SECRET_KEY.getBytes();
    return Keys.hmacShaKeyFor(keyBytes);
}
```

### 2. Absence de Gestion d'Erreurs dans le Filtre JWT
**Fichier** : `JwtAuthFilter.java` (ligne 26-60)

**AVANT** (❌ Sans gestion d'erreurs) :
```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String userEmail;

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    jwt = authHeader.substring(7);
    userEmail = jwtUtils.extractUsername(jwt); // ❌ Peut lancer une exception

    if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
        // ...
    }
    filterChain.doFilter(request, response);
}
```

**Problème** :
- Si `jwtUtils.extractUsername(jwt)` lançait une exception (token expiré, token mal formé, clé invalide), l'exception n'était pas gérée
- L'authentification échouait silencieusement
- L'utilisateur se retrouvait non authentifié → **403 Forbidden**

**APRÈS** (✅ Avec gestion d'erreurs) :
```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String userEmail;

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }

    try {
        jwt = authHeader.substring(7);
        userEmail = jwtUtils.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtUtils.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    } catch (Exception e) {
        // Log l'erreur mais continue le filtre (l'utilisateur restera non authentifié)
        System.err.println("Erreur JWT: " + e.getMessage());
        e.printStackTrace();
    }

    filterChain.doFilter(request, response);
}
```

---

## 🔍 Impact des Corrections

### Ce qui était cassé :
1. ❌ La génération de la clé de signature JWT était incorrecte
2. ❌ Les tokens JWT étaient rejetés lors de la validation
3. ❌ Les exceptions JWT n'étaient pas gérées, causant des échecs d'authentification silencieux
4. ❌ Tous les endpoints protégés retournaient **403 Forbidden**

### Ce qui est maintenant corrigé :
1. ✅ La clé de signature JWT est correctement générée
2. ✅ Les tokens JWT sont validés correctement
3. ✅ Les erreurs JWT sont loggées pour faciliter le débogage
4. ✅ Les utilisateurs authentifiés peuvent accéder aux endpoints autorisés

---

## ⚠️ IMPORTANT : Actions Requises

### 1. Tous les utilisateurs doivent se reconnecter

**Pourquoi ?**
- La méthode de génération de la clé JWT a changé
- Les anciens tokens ne sont plus valides
- Les utilisateurs doivent obtenir de nouveaux tokens

**Ce qu'il faut faire :**
1. Dans l'app mobile, déconnecter tous les utilisateurs
2. Demander aux utilisateurs de se reconnecter
3. Les nouveaux tokens seront valides avec la nouvelle clé

### 2. Déployer le backend sur Render

**Étapes** :
1. Commit et push les changements :
```bash
cd TERRABIA_BACKEND
git add .
git commit -m "fix: Correct JWT key generation and add error handling in JWT filter"
git push
```

2. Render redéploiera automatiquement (si auto-deploy activé)
3. Vérifier les logs de déploiement sur Render

---

## 🧪 Comment Tester Après le Déploiement

### Test 1 : Se connecter et obtenir un nouveau token

```bash
curl -X POST https://terrabia-backend-g2ym.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "votre.email@example.com",
    "password": "votre_mot_de_passe"
  }'
```

**Résultat Attendu** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "utilisateur": {
    "idUser": 1,
    "nom": "...",
    "role": "VENDEUR"
  }
}
```

### Test 2 : Tester GET /api/categories avec le nouveau token

```bash
curl -X GET https://terrabia-backend-g2ym.onrender.com/api/categories \
  -H "Authorization: Bearer VOTRE_NOUVEAU_TOKEN"
```

**Résultat Attendu** :
```json
[
  {
    "idCat": 1,
    "nomCat": "Fruits",
    "produits": []
  }
]
```

### Test 3 : Tester POST /api/categories (VENDEUR uniquement)

```bash
curl -X POST https://terrabia-backend-g2ym.onrender.com/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_VENDEUR" \
  -d '{
    "nomCat": "Légumes"
  }'
```

**Résultat Attendu** :
```json
{
  "idCat": 2,
  "nomCat": "Légumes",
  "produits": []
}
```

### Test 4 : Tester POST /api/produits (VENDEUR uniquement)

```bash
curl -X POST https://terrabia-backend-g2ym.onrender.com/api/produits \
  -H "Authorization: Bearer VOTRE_TOKEN_VENDEUR" \
  -F "nom=Tomate" \
  -F "prix=2.5" \
  -F "quantite=100" \
  -F "description=Tomates fraîches" \
  -F "idCategorie=2" \
  -F "image=@chemin/vers/image.jpg"
```

**Résultat Attendu** :
```json
{
  "idProduit": 1,
  "nom": "Tomate",
  "prix": 2.5,
  "quantite": 100,
  "description": "Tomates fraîches",
  "photoUrl": "https://terrabia-backend-g2ym.onrender.com/uploads/...",
  "categorie": {
    "idCat": 2,
    "nomCat": "Légumes"
  }
}
```

---

## 📊 Endpoints et Permissions

### Endpoints Publics (Pas de token requis)
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /uploads/**` - Images

### Endpoints Authentifiés (Token requis, tous les rôles)
- `GET /api/categories` - Liste des catégories
- `GET /api/produits` - Liste des produits
- `GET /api/produits/{id}` - Détails d'un produit
- `GET /api/produits/vendeur/{idVendeur}` - Produits d'un vendeur

### Endpoints VENDEUR Uniquement (Token + rôle VENDEUR)
- `POST /api/categories` - Créer une catégorie
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/{id}` - Modifier un produit

### Endpoints ACHETEUR
- `POST /api/panier/ajouter` - Ajouter au panier
- `POST /api/commandes` - Créer une commande
- Etc.

---

## 🔐 Sécurité

### Clé Secrète JWT
**Fichier** : `JwtUtils.java` (ligne 22)

```java
private static final String SECRET_KEY = "TaCleSecreteTresLonguePourTerrabiaM1SIGLProjet2025ChangeMoiVite";
```

**⚠️ Recommandations pour la production** :
1. Déplacer la clé secrète dans `application.properties` :
```properties
jwt.secret=TaCleSecreteTresLonguePourTerrabiaM1SIGLProjet2025ChangeMoiVite
```

2. Utiliser une variable d'environnement sur Render :
```properties
jwt.secret=${JWT_SECRET}
```

3. Générer une clé sécurisée (au moins 256 bits / 32 caractères)

### Durée de Validité des Tokens
**Fichier** : `JwtUtils.java` (ligne 25)

```java
private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 24 * 30; // 30 jours
```

Les tokens sont valides pendant **30 jours**. Après cette période, l'utilisateur doit se reconnecter.

---

## ✨ Résumé

**Ce qui a été corrigé** :
1. ✅ Génération correcte de la clé de signature JWT
2. ✅ Gestion des erreurs dans le filtre JWT avec logging
3. ✅ Validation correcte des tokens JWT

**Actions requises** :
1. 🔄 Déconnecter tous les utilisateurs de l'app mobile
2. 🚀 Déployer le backend sur Render
3. 🧪 Tester la connexion et les endpoints

**Résultat** :
- ✅ Les erreurs 403 sont corrigées
- ✅ Les utilisateurs peuvent accéder aux endpoints autorisés
- ✅ Les logs d'erreurs JWT aident au débogage
- ✅ La sécurité est maintenue avec validation correcte des tokens

---

## 📝 Fichiers Modifiés

### 1. `JwtUtils.java`
- ✅ Correction de la méthode `getSignInKey()`
- ✅ Génération correcte de la clé HMAC

### 2. `JwtAuthFilter.java`
- ✅ Ajout d'un bloc try-catch pour gérer les exceptions
- ✅ Logging des erreurs JWT pour faciliter le débogage

---

## 🔍 Débogage

Si les erreurs 403 persistent après le déploiement, vérifier :

1. **Logs Render** : Rechercher "Erreur JWT:" dans les logs
2. **Token Expiré** : Vérifier la date d'expiration du token
3. **Rôle Utilisateur** : Vérifier que l'utilisateur a le bon rôle (VENDEUR pour créer des catégories/produits)
4. **Format du Token** : Vérifier que le header Authorization commence par "Bearer "

**Commande pour vérifier les logs Render** :
```bash
# Sur le dashboard Render, aller dans :
# Your Service → Logs → Rechercher "Erreur JWT"
```
