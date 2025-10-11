import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppSelector, useAppDispatch } from '../store/types';
import { toggleItemSelection, updateQuantity } from '../store/cartSlice';
import { CartItem } from '../store/cartSlice';

type CartNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

export default function CartScreen() {
  const navigation = useNavigation<CartNavigationProp>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);

  const handleToggleSelection = (id: string) => {
    dispatch(toggleItemSelection(id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const selectedCount = selectedItems.length;
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.priceNumeric * item.quantity), 0);

  const renderCartItem = (item: CartItem) => (
    <Pressable 
      key={item.id} 
      style={[styles.cartItem, item.selected && styles.selectedItem]}
      onPress={() => handleToggleSelection(item.id)}
    >
      <View style={styles.selectionContainer}>
        <View style={[styles.checkbox, item.selected && styles.checkedBox]}>
          {item.selected && <View style={styles.checkmark} />}
        </View>
      </View>
      
      <Image source={item.image} style={styles.itemImage} />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemUnit}>Unité : {item.price}</Text>
        
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Qté :</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(item.id, item.quantity - 1);
            }}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{String(item.quantity).padStart(2, '0')}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={(e) => {
              e.stopPropagation();
              handleUpdateQuantity(item.id, item.quantity + 1);
            }}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>{item.priceNumeric * item.quantity} CFA</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Articles ({String(cartItems.length).padStart(2, '0')})</Text>
      </View>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.shopButtonText}>Commencer vos achats</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView 
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map(renderCartItem)}
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{totalPrice} CFA</Text>
            </View>
            
            <Pressable 
              style={[styles.paymentButton, selectedCount === 0 && styles.disabledButton]}
              disabled={selectedCount === 0}
              onPress={() => {
                navigation.navigate('Checkout');
              }}
            >
              <Text style={styles.paymentButtonText}>
                Payer maintenant ({selectedCount})
              </Text>
            </Pressable>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7F0',
  },
  selectionContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B35',
  },
  checkmark: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemUnit: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#1F2937',
    marginRight: 8,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 24,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  paymentButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 8,
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