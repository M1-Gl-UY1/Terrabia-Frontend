# Exemples d'utilisation du backend Terrabia

Ce document contient des exemples concrets pour utiliser les services API dans votre application.

## 1. Authentification

### Inscription d'un nouvel acheteur

```typescript
import authService from './src/services/AuthService';
import { Role, Sexe } from './src/types/Backend';

const handleRegister = async () => {
  const registerData = {
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    password: 'motdepasse123',
    numTel: '+237698765432',
    ville: 'Yaoundé',
    sexe: Sexe.HOMME,
    role: Role.ACHETEUR,
  };

  const response = await authService.register(registerData);

  if (response.success) {
    console.log('Inscription réussie !');
    // Rediriger vers la page de connexion
  } else {
    console.error('Erreur:', response.error);
  }
};
```

### Connexion

```typescript
import authService from './src/services/AuthService';
import { useAppDispatch } from './src/store/types';
import { setUser } from './src/store/authSlice';

const Login = () => {
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    const response = await authService.login({
      email: 'jean.dupont@example.com',
      password: 'motdepasse123',
    });

    if (response.success && response.data) {
      // Mettre à jour Redux
      dispatch(
        setUser({
          user: {
            idUser: response.data.idUser,
            nom: response.data.nom,
            prenom: '',
            email: 'jean.dupont@example.com',
            numTel: '',
            ville: '',
            sexe: 'HOMME',
            role: response.data.role,
          },
          token: response.data.token,
        }),
      );

      // Naviguer vers l'application principale
      navigation.replace('MainTabs');
    } else {
      Alert.alert('Erreur', response.error || 'Identifiants incorrects');
    }
  };

  return (
    // Votre UI
  );
};
```

### Déconnexion

```typescript
import { useAppDispatch } from './src/store/types';
import { logout } from './src/store/authSlice';

const handleLogout = () => {
  dispatch(logout());
  navigation.replace('OnboardingInitialScreen');
};
```

## 2. Produits

### Récupérer tous les produits

```typescript
import produitService from './src/services/ProduitService';
import { useState, useEffect } from 'react';
import { Produit } from './src/types/Backend';

const HomeScreen = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = async () => {
    setLoading(true);

    const response = await produitService.getAllProduits();

    if (response.success && response.data) {
      setProduits(response.data);
    } else {
      Alert.alert('Erreur', 'Impossible de charger les produits');
    }

    setLoading(false);
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={produits}
          keyExtractor={item => item.idProduit.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.nom}</Text>
              <Text>{item.prix} FCFA</Text>
              <Text>Stock: {item.quantite}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};
```

### Récupérer les produits par catégorie

```typescript
import produitService from './src/services/ProduitService';

const loadProduitsParCategorie = async (idCategorie: number) => {
  const response = await produitService.getProduitsByCategorie(idCategorie);

  if (response.success && response.data) {
    console.log(`${response.data.length} produits trouvés`);
    return response.data;
  }

  return [];
};

// Utilisation
const produitsFruits = await loadProduitsParCategorie(1); // ID 1 = Fruits et Légumes
```

## 3. Panier

### Récupérer le panier de l'utilisateur

```typescript
import panierService from './src/services/PanierService';
import { useAppSelector } from './src/store/types';
import { selectUser } from './src/store/authSlice';

const CartScreen = () => {
  const user = useAppSelector(selectUser);
  const [panier, setPanier] = useState(null);

  useEffect(() => {
    if (user) {
      loadPanier();
    }
  }, [user]);

  const loadPanier = async () => {
    if (!user) return;

    const response = await panierService.getPanier(user.idUser);

    if (response.success && response.data) {
      setPanier(response.data);
    }
  };

  const total = panier ? panierService.calculateTotal(panier) : 0;

  return (
    <View>
      <Text>Total: {total} FCFA</Text>
      {/* Afficher les articles du panier */}
    </View>
  );
};
```

### Ajouter un produit au panier

```typescript
import panierService from './src/services/PanierService';
import { useAppSelector } from './src/store/types';
import { selectUser } from './src/store/authSlice';

const ProductDetailScreen = ({ product }) => {
  const user = useAppSelector(selectUser);

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Veuillez vous connecter pour ajouter au panier');
      return;
    }

    const response = await panierService.addToPanier(user.idUser, {
      idProduit: product.idProduit,
      quantite: 1,
    });

    if (response.success) {
      Alert.alert('Succès', 'Produit ajouté au panier !');
    } else {
      Alert.alert('Erreur', response.error || 'Impossible d\'ajouter au panier');
    }
  };

  return (
    <View>
      <Button title="Ajouter au panier" onPress={handleAddToCart} />
    </View>
  );
};
```

### Supprimer une ligne du panier

```typescript
import panierService from './src/services/PanierService';

const handleRemoveFromCart = async (idLignePanier: number) => {
  const response = await panierService.removeLigne(idLignePanier);

  if (response.success) {
    Alert.alert('Succès', 'Produit retiré du panier');
    // Recharger le panier
    loadPanier();
  } else {
    Alert.alert('Erreur', response.error || 'Impossible de retirer le produit');
  }
};
```

## 4. Commandes

### Passer une commande

```typescript
import commandeService from './src/services/CommandeService';
import { useAppSelector } from './src/store/types';
import { selectUser } from './src/store/authSlice';

const CheckoutScreen = () => {
  const user = useAppSelector(selectUser);

  const handlePlaceOrder = async () => {
    if (!user) return;

    const response = await commandeService.passerCommande(user.idUser);

    if (response.success && response.data) {
      Alert.alert(
        'Commande passée !',
        `Votre commande #${response.data.idCommande} d'un montant de ${response.data.montantTotal} FCFA a été enregistrée.`,
        [
          {
            text: 'Payer maintenant',
            onPress: () => navigateToPayment(response.data),
          },
        ],
      );
    } else {
      Alert.alert('Erreur', response.error || 'Impossible de passer la commande');
    }
  };

  return (
    <View>
      <Button title="Passer la commande" onPress={handlePlaceOrder} />
    </View>
  );
};
```

### Consulter l'historique des commandes

```typescript
import commandeService from './src/services/CommandeService';
import { useAppSelector } from './src/store/types';
import { selectUser } from './src/store/authSlice';

const OrderHistoryScreen = () => {
  const user = useAppSelector(selectUser);
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    const response = await commandeService.getHistorique(user.idUser);

    if (response.success && response.data) {
      setCommandes(response.data);
    }
  };

  return (
    <FlatList
      data={commandes}
      keyExtractor={item => item.idCommande.toString()}
      renderItem={({ item }) => (
        <View>
          <Text>Commande #{item.idCommande}</Text>
          <Text>Date: {new Date(item.dateCommande).toLocaleDateString()}</Text>
          <Text>Montant: {item.montantTotal} FCFA</Text>
          <Text>Statut: {item.statut}</Text>
        </View>
      )}
    />
  );
};
```

## 5. Paiement

### Initier un paiement

```typescript
import paiementService from './src/services/PaiementService';
import { ModePaiement } from './src/types/Backend';

const PaymentScreen = ({ commande }) => {
  const [selectedMethod, setSelectedMethod] = useState(ModePaiement.ORANGE_MONEY);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePayment = async () => {
    const response = await paiementService.payer({
      commandeId: commande.idCommande,
      modePaiement: selectedMethod,
      devise: 'XAF',
      numeroTelephone: selectedMethod !== ModePaiement.CARTE_BANCAIRE ? phoneNumber : undefined,
    });

    if (response.success && response.data) {
      if (response.data.statut === 'VALIDE') {
        Alert.alert('Paiement réussi !', `Référence: ${response.data.referenceTransaction}`);
        navigation.navigate('PaymentSuccess', {
          amount: response.data.montant,
          paymentMethod: selectedMethod,
          phoneNumber: phoneNumber,
          orderId: commande.idCommande.toString(),
        });
      } else {
        Alert.alert('Paiement échoué', 'Le paiement n\'a pas pu être effectué. Veuillez réessayer.');
      }
    } else {
      Alert.alert('Erreur', response.error || 'Une erreur est survenue lors du paiement');
    }
  };

  return (
    <View>
      <Text>Choisissez votre mode de paiement</Text>

      <TouchableOpacity onPress={() => setSelectedMethod(ModePaiement.ORANGE_MONEY)}>
        <Text>Orange Money</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSelectedMethod(ModePaiement.MTN_MOMO)}>
        <Text>MTN Mobile Money</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSelectedMethod(ModePaiement.CARTE_BANCAIRE)}>
        <Text>Carte bancaire</Text>
      </TouchableOpacity>

      {selectedMethod !== ModePaiement.CARTE_BANCAIRE && (
        <TextInput
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      )}

      <Button title="Payer" onPress={handlePayment} />
    </View>
  );
};
```

## 6. Gestion des erreurs

### Exemple de gestion complète des erreurs

```typescript
import produitService from './src/services/ProduitService';
import logger from './src/utils/logger';

const loadProduits = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await produitService.getAllProduits();

    if (response.success && response.data) {
      setProduits(response.data);
      logger.success(`${response.data.length} produits chargés`);
    } else {
      // Erreur API (400, 500, etc.)
      const errorMessage = response.error || 'Une erreur est survenue';
      setError(errorMessage);
      logger.error('Erreur lors du chargement des produits', response);

      Alert.alert('Erreur', errorMessage);
    }
  } catch (error) {
    // Erreur réseau ou autre
    logger.error('Exception lors du chargement des produits', error);
    setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');

    Alert.alert('Erreur réseau', 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
  } finally {
    setLoading(false);
  }
};
```

## 7. Hooks personnalisés utiles

### Hook pour récupérer l'utilisateur connecté

```typescript
// src/hooks/useCurrentUser.ts
import { useAppSelector } from '../store/types';
import { selectUser, selectIsAuthenticated } from '../store/authSlice';

export const useCurrentUser = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return {
    user,
    isAuthenticated,
    userId: user?.idUser,
    userName: user ? `${user.prenom} ${user.nom}` : null,
    userRole: user?.role,
  };
};

// Utilisation
const { user, isAuthenticated, userId } = useCurrentUser();
```

### Hook pour gérer le panier

```typescript
// src/hooks/usePanier.ts
import { useState, useEffect, useCallback } from 'react';
import panierService from '../services/PanierService';
import { useCurrentUser } from './useCurrentUser';
import { Panier } from '../types/Backend';

export const usePanier = () => {
  const { userId } = useCurrentUser();
  const [panier, setPanier] = useState<Panier | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPanier = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    const response = await panierService.getPanier(userId);

    if (response.success && response.data) {
      setPanier(response.data);
    }

    setLoading(false);
  }, [userId]);

  const addToPanier = useCallback(
    async (idProduit: number, quantite: number) => {
      if (!userId) return false;

      const response = await panierService.addToPanier(userId, { idProduit, quantite });

      if (response.success) {
        await loadPanier(); // Recharger le panier
        return true;
      }

      return false;
    },
    [userId, loadPanier],
  );

  const removeLine = useCallback(
    async (idLignePanier: number) => {
      const response = await panierService.removeLigne(idLignePanier);

      if (response.success) {
        await loadPanier(); // Recharger le panier
        return true;
      }

      return false;
    },
    [loadPanier],
  );

  const total = panier ? panierService.calculateTotal(panier) : 0;
  const itemCount = panier?.articles.length || 0;

  useEffect(() => {
    loadPanier();
  }, [loadPanier]);

  return {
    panier,
    loading,
    total,
    itemCount,
    addToPanier,
    removeLine,
    refresh: loadPanier,
  };
};

// Utilisation
const { panier, loading, total, itemCount, addToPanier, removeLine, refresh } = usePanier();
```

## 8. Debugging avec les logs

Pour activer/désactiver les logs :

```typescript
import logger from './src/utils/logger';

// Activer les logs (même en production)
logger.setEnabled(true);

// Désactiver les logs
logger.setEnabled(false);

// Voir tous les logs
const allLogs = logger.getAllLogs();
console.log(allLogs);

// Exporter les logs au format JSON
const logsJSON = logger.exportLogs();

// Effacer tous les logs
logger.clearLogs();
```

## 9. Résumé des bonnes pratiques

1. **Toujours vérifier `response.success`** avant d'accéder à `response.data`
2. **Gérer les cas d'erreur** avec des messages clairs pour l'utilisateur
3. **Afficher un loader** pendant les requêtes API
4. **Recharger les données** après une modification (ajout, suppression, etc.)
5. **Vérifier l'authentification** avant d'appeler les endpoints protégés
6. **Utiliser les types TypeScript** pour éviter les erreurs
7. **Logger les opérations importantes** pour faciliter le debugging
8. **Gérer les erreurs réseau** (pas de connexion internet)
9. **Ne jamais exposer le token** dans les logs en production
10. **Utiliser des hooks personnalisés** pour réutiliser la logique métier

## Support

Pour toute question :

- Consulter `API_DOCUMENTATION.md` pour les détails de l'API
- Consulter `INTEGRATION_GUIDE.md` pour l'architecture
- Vérifier les logs dans la console
- Tester les endpoints avec Swagger : `https://terrabia-backend-g2ym.onrender.com/swagger-ui/index.html#/`
