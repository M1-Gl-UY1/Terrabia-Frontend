import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppSelector } from '../../store/types';
import producerService from '../../services/ProducerService';
import { Produit } from '../../types/Backend';
import { Plus, Edit3, Trash2, Package, Search } from 'lucide-react-native';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

type ProductsNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProducerProductsScreen = () => {
  const navigation = useNavigation<ProductsNavigationProp>();
  const user = useAppSelector(state => state.auth.user);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [products, setProducts] = useState<Produit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = async () => {
    if (!user?.idUser) return;

    try {
      const response = await producerService.getMyProducts(user.idUser);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log('Erreur chargement produits:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [user?.idUser])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadProducts();
  };

  const handleDeleteProduct = (product: Produit) => {
    Alert.alert(
      'Supprimer le produit',
      `Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(product.idProduit);
            try {
              const response = await producerService.deleteProduct(product.idProduit);
              if (response.success) {
                setProducts(prev => prev.filter(p => p.idProduit !== product.idProduit));
                showSuccess('Produit supprimé avec succès', 2000);
              } else {
                showError(response.error || 'Erreur lors de la suppression', 3000);
              }
            } catch (error) {
              showError('Erreur lors de la suppression', 3000);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const renderProduct = ({ item }: { item: Produit }) => (
    <View style={styles.productCard}>
      <Image
        source={
          item.photoUrl
            ? { uri: item.photoUrl }
            : require('../../assets/images/logo_sans_fond.png')
        }
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.nom}
        </Text>
        <Text style={styles.productCategory}>{item.categorie?.nomCat || 'Sans catégorie'}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.prix)}</Text>
        <View style={styles.stockContainer}>
          <Text style={[styles.stockText, item.quantite <= 5 && styles.stockLow]}>
            Stock: {item.quantite}
          </Text>
        </View>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditProduct', { product: item })}
        >
          <Edit3 size={20} color="#1565C0" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item)}
          disabled={deletingId === item.idProduit}
        >
          {deletingId === item.idProduit ? (
            <ActivityIndicator size="small" color="#E53935" />
          ) : (
            <Trash2 size={20} color="#E53935" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Package size={64} color="#ccc" strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>Aucun produit</Text>
      <Text style={styles.emptyText}>
        Commencez à vendre en ajoutant votre premier produit
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Plus size={20} color="#fff" />
        <Text style={styles.addButtonText}>Ajouter un produit</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Produits</Text>
        <Text style={styles.headerSubtitle}>{products.length} produit(s)</Text>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        keyExtractor={item => item.idProduit.toString()}
        renderItem={renderProduct}
        contentContainerStyle={[
          styles.listContent,
          products.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      {products.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Plus size={28} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onDismiss={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productCategory: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 4,
  },
  stockContainer: {
    marginTop: 4,
  },
  stockText: {
    fontSize: 13,
    color: '#666',
  },
  stockLow: {
    color: '#E53935',
    fontWeight: '500',
  },
  productActions: {
    justifyContent: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default ProducerProductsScreen;
