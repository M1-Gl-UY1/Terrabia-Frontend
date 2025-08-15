import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
};

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Tomates fraîches',
      price: 2500,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&auto=format&fit=crop&q=60',
      unit: 'kg',
    },
    {
      id: '2',
      name: 'Macabots',
      price: 2700,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82b55cd2?w=400&auto=format&fit=crop&q=60',
      unit: 'kg',
    },
    {
      id: '3',
      name: 'Pommes de terre',
      price: 1500,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82b55cd2?w=400&auto=format&fit=crop&q=60',
      unit: 'kg',
    },
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 500;
  const finalTotal = totalPrice + deliveryFee;

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} FCFA / {item.unit}</Text>
        <View style={styles.quantityContainer}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>{item.price * item.quantity} FCFA</Text>
      </View>
    </View>
  );

  return (
    <TabNavigatorWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Panier</Text>
          <Text style={styles.subtitle}>{cartItems.length} article(s)</Text>
        </View>
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartIcon}>🛒</Text>
            <Text style={styles.emptyCartTitle}>Votre panier est vide</Text>
            <Text style={styles.emptyCartSubtitle}>
              Ajoutez des produits pour commencer vos achats
            </Text>
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
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total</Text>
                <Text style={styles.summaryValue}>{totalPrice} FCFA</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Livraison</Text>
                <Text style={styles.summaryValue}>{deliveryFee} FCFA</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{finalTotal} FCFA</Text>
              </View>
              
              <Pressable style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Commander maintenant</Text>
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </TabNavigatorWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCartIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
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
  checkoutButton: {
    backgroundColor: '#F27A22',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
