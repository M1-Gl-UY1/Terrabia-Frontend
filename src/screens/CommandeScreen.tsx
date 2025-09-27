import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical, ChevronRight, ShoppingCart } from 'lucide-react-native';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  unit: string;
};

export default function CheckoutScreen() {
  const [selectedDelivery, setSelectedDelivery] = useState('domicile');

  const orderItems: OrderItem[] = [
    {
      id: '1',
      name: 'Tomates (Cageot)',
      price: 3000,
      quantity: 3,
      image: require('../assets/images/tomate.png'),
      unit: 'CFA',
    },
    {
      id: '2',
      name: 'Noix (seaux)',
      price: 1000,
      quantity: 3,
      image: require('../assets/images/noix.png'),
      unit: 'CFA',
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>Unité : {item.price} {item.unit}</Text>
        <Text style={styles.itemQuantity}>Qté : {item.quantity}</Text>
      </View>
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>Total : {item.price * item.quantity} {item.unit}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </Pressable>
        <Pressable style={styles.menuButton}>
          <MoreVertical size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Adresse d'envoi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse d'envoie</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>Paul Mbarga</Text>
              <Text style={styles.addressDetails}>Yaoundé, Nsimalen</Text>
            </View>
            <Text style={styles.phoneNumber}>655 567 113</Text>
          </View>
        </View>

        {/* Mode de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de livraison</Text>
          
          <Pressable 
            style={[styles.deliveryOption, selectedDelivery === 'domicile' && styles.selectedOption]}
            onPress={() => setSelectedDelivery('domicile')}
          >
            <Text style={styles.deliveryText}>Livraison à domicile</Text>
            <View style={styles.chevronContainer}>
              <ChevronRight size={16} color="#FF6B35" />
            </View>
          </Pressable>

          <Pressable 
            style={[styles.deliveryOption, selectedDelivery === 'relais' && styles.selectedOption]}
            onPress={() => setSelectedDelivery('relais')}
          >
            <Text style={styles.deliveryText}>Livraison depuis un point de relais</Text>
          </Pressable>
        </View>

        {/* Vendeur */}
        <View style={styles.section}>
          <Pressable style={styles.vendorRow}>
            <Text style={styles.vendorText}>Vendeur : Paulin kamga</Text>
            <ChevronRight size={20} color="#6B7280" />
          </Pressable>
        </View>

        {/* Articles commandés */}
        <View style={styles.section}>
          {orderItems.map(renderOrderItem)}
        </View>
      </ScrollView>

      {/* Footer avec total et bouton commande */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total : {total} CFA</Text>
        </View>
        <Pressable style={styles.orderButton}>
          <ShoppingCart size={20} color="#FFFFFF" style={styles.cartIcon} />
          <Text style={styles.orderButtonText}>Commandez</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedOption: {
    backgroundColor: '#FFF7F0',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  deliveryText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  vendorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  vendorText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 16,
  },
  cartIcon: {
    marginRight: 8,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});