import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppSelector, useAppDispatch } from '../store/types';
import {
  toggleItemSelection,
  updateQuantity,
  selectAllItems,
  loadCart,
  removeFromCartAsync,
  selectCartItems,
  selectCartLoading,
  selectCartSyncing,
} from '../store/cartSlice';
import { CartItem } from '../store/cartSlice';
import { Trash2, ShoppingBag, CheckSquare, Square, Minus, Plus } from 'lucide-react-native';

type CartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

export default function CartScreen() {
  const navigation = useNavigation<CartNavigationProp>();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const isLoading = useAppSelector(selectCartLoading);
  const isSyncing = useAppSelector(selectCartSyncing);
  const user = useAppSelector(state => state.auth.user);

  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (user?.idUser) {
        dispatch(loadCart(user.idUser));
      }
    }, [user?.idUser, dispatch])
  );

  const onRefresh = async () => {
    if (user?.idUser) {
      setRefreshing(true);
      await dispatch(loadCart(user.idUser));
      setRefreshing(false);
    }
  };

  const handleToggleSelection = (id: string) => {
    dispatch(toggleItemSelection(id));
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    dispatch(selectAllItems(!allSelected));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    Alert.alert(
      'Supprimer l\'article',
      `Voulez-vous supprimer "${item.name}" du panier ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(item.id);
            await dispatch(removeFromCartAsync({
              lignePanierId: item.lignePanierId,
              productId: item.id,
            }));
            setDeletingId(null);
          },
        },
      ]
    );
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const selectedCount = selectedItems.length;
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.priceNumeric * item.quantity), 0);
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getImageSource = (item: CartItem) => {
    if (item.imageUrl && typeof item.imageUrl === 'string') {
      return { uri: item.imageUrl };
    }
    if (item.image) {
      return item.image;
    }
    return require('../assets/images/logo_sans_fond.png');
  };

  const renderCartItem = (item: CartItem) => (
    <Pressable
      key={item.id}
      style={[styles.cartItem, item.selected && styles.selectedItem]}
      onPress={() => handleToggleSelection(item.id)}
    >
      <TouchableOpacity
        style={styles.selectionContainer}
        onPress={() => handleToggleSelection(item.id)}
      >
        {item.selected ? (
          <CheckSquare size={24} color="#F48C06" />
        ) : (
          <Square size={24} color="#D1D5DB" />
        )}
      </TouchableOpacity>

      <Image source={getImageSource(item)} style={styles.itemImage} />

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemUnit}>{formatPrice(item.priceNumeric)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={16} color={item.quantity <= 1 ? '#D1D5DB' : '#1F2937'} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemRight}>
        <Text style={styles.itemTotalText}>{formatPrice(item.priceNumeric * item.quantity)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveItem(item)}
          disabled={deletingId === item.id}
        >
          {deletingId === item.id ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Trash2 size={20} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  if (isLoading && cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48C06" />
          <Text style={styles.loadingText}>Chargement du panier...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Panier</Text>
        <Text style={styles.itemCount}>{cartItems.length} article(s)</Text>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyText}>Découvrez nos produits frais et ajoutez-les à votre panier</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Categories' })}
          >
            <Text style={styles.shopButtonText}>Commencer mes achats</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Select All */}
          <TouchableOpacity style={styles.selectAllContainer} onPress={handleSelectAll}>
            {allSelected ? (
              <CheckSquare size={24} color="#F48C06" />
            ) : (
              <Square size={24} color="#D1D5DB" />
            )}
            <Text style={styles.selectAllText}>Tout sélectionner</Text>
          </TouchableOpacity>

          {isSyncing && (
            <View style={styles.syncingBanner}>
              <ActivityIndicator size="small" color="#F48C06" />
              <Text style={styles.syncingText}>Synchronisation...</Text>
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#F48C06']}
                tintColor="#F48C06"
              />
            }
          >
            {cartItems.map(renderCartItem)}
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles sélectionnés</Text>
              <Text style={styles.summaryValue}>{selectedCount}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.paymentButton, selectedCount === 0 && styles.disabledButton]}
              disabled={selectedCount === 0}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.paymentButtonText}>
                Passer la commande ({selectedCount})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

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
    fontSize: 14,
    color: '#666',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  itemCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: '#F48C06',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  selectAllText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  syncingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFF7ED',
    gap: 8,
  },
  syncingText: {
    fontSize: 13,
    color: '#F48C06',
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedItem: {
    borderColor: '#F48C06',
    backgroundColor: '#FFFBF5',
  },
  selectionContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  itemUnit: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F48C06',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 36,
    textAlign: 'center',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemTotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 8,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F48C06',
  },
  paymentButton: {
    backgroundColor: '#F48C06',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
