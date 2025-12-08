# Problème de timeout lors de l'inscription

## Symptômes
- La requête d'inscription prend plus de 30 secondes
- Erreur "Aborted" ou "La requête a expiré"
- Le backend Render est lent à répondre

## Causes possibles

### 1. Backend Render en veille (mode gratuit)
Les serveurs Render gratuits se mettent en veille après 15 minutes d'inactivité. Au premier appel, le serveur peut prendre **30-60 secondes** pour se réveiller.

### 2. Connexion internet lente
Si votre connexion est lente, les requêtes peuvent prendre du temps.

### 3. Backend surchargé
Le serveur peut être occupé avec d'autres requêtes.

## Solutions appliquées

### ✅ 1. Timeout augmenté à 120 secondes
**Fichier** : `src/config/api.config.ts`
```typescript
TIMEOUT: 120000, // 2 minutes au lieu de 30 secondes
```

### ✅ 2. Message d'attente ajouté
**Fichiers** : `SignUpScreen.tsx`, `LoginScreen.tsx`

Un message s'affiche maintenant pour informer l'utilisateur d'attendre :
```
"Le serveur peut prendre quelques secondes à répondre. Veuillez patienter..."
```

### ✅ 3. Messages d'erreur améliorés
Les erreurs incluent maintenant des conseils :
```
"Si le problème persiste, vérifiez votre connexion internet."
```

## Comment tester

### Option 1 : Réveiller le backend d'abord
Avant de tester l'inscription dans l'app, accédez au Swagger pour "réveiller" le backend :

1. Ouvrir : https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/
2. Attendre 30-60 secondes que la page charge
3. Ensuite, tester l'inscription dans l'app

### Option 2 : Attendre patiemment
1. Remplir le formulaire d'inscription
2. Cliquer sur "S'inscrire"
3. **Attendre 1-2 minutes** sans fermer l'alerte
4. Le serveur devrait répondre

### Option 3 : Tester avec curl (voir si le backend répond)
```bash
curl -X POST "https://terrabia-backend-g2ym.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: */*" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "uniqueemail@example.com",
    "password": "test123",
    "numTel": "+237698765432",
    "ville": "Yaoundé",
    "sexe": "HOMME",
    "role": "ACHETEUR",
    "numeroCni": "123456789"
  }'
```

## Erreurs courantes

### "403 Forbidden"
- **Cause** : Le backend refuse la requête
- **Solution** : Vérifier que l'email n'existe pas déjà

### "Aborted" / "La requête a expiré"
- **Cause** : Le serveur prend trop de temps
- **Solution** : Attendre plus longtemps ou réveiller le serveur d'abord

### "Email déjà utilisé"
- **Cause** : L'email existe dans la base de données
- **Solution** : Utiliser un autre email

## Checklist de débogage

1. ✅ Le backend est-il accessible ?
   - Tester : https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/

2. ✅ L'email est-il unique ?
   - Utiliser un email jamais utilisé auparavant

3. ✅ La connexion internet fonctionne ?
   - Vérifier avec un navigateur

4. ✅ Les données sont-elles correctes ?
   - Vérifier les logs dans la console

5. ✅ Le timeout est-il suffisant ?
   - Maintenant à 120 secondes (2 minutes)

## Logs à surveiller

### Inscription réussie
```
📤 INSCRIPTION - Données envoyées: {...}
🌐 API REQUEST: POST /api/auth/register
📥 INSCRIPTION - Réponse reçue: {success: true}
✅ Inscription réussie
```

### Inscription échouée (timeout)
```
📤 INSCRIPTION - Données envoyées: {...}
🌐 API REQUEST: POST /api/auth/register
[... attente de 2 minutes ...]
❌ API ERROR: POST /api/auth/register {error: "Aborted"}
❌ Échec de l'inscription {error: "La requête a expiré"}
```

### Inscription échouée (email existant)
```
📤 INSCRIPTION - Données envoyées: {...}
🌐 API REQUEST: POST /api/auth/register
📥 INSCRIPTION - Réponse reçue: {success: false, error: "Email déjà utilisé !"}
❌ Échec de l'inscription
```

## Recommandations

### Pour le développement
1. **Garder le backend éveillé** : Ouvrir Swagger dans un onglet
2. **Utiliser des emails uniques** : Ajouter un timestamp (ex: `user-1733328987@example.com`)
3. **Tester d'abord sur Swagger** : S'assurer que le backend répond

### Pour la production
1. **Passer à un plan payant Render** : Évite la mise en veille
2. **Ajouter un health check** : Ping le serveur toutes les 10 minutes
3. **Implémenter un système de retry** : Réessayer automatiquement en cas d'échec

## Alternative : Backend local

Si le backend Render est trop lent, vous pouvez lancer le backend localement :

1. Cloner le repo du backend
2. Lancer avec `./mvnw spring-boot:run`
3. Changer l'URL dans `src/config/api.config.ts` :
```typescript
BASE_URL: __DEV__
  ? 'http://localhost:8080' // Local
  : 'https://terrabia-backend-g2ym.onrender.com', // Production
```

## Contact support

Si le problème persiste après ces solutions :
1. Vérifier les logs complets dans la console
2. Tester le backend directement avec Swagger
3. Vérifier que vous n'avez pas de firewall/proxy bloquant les requêtes
