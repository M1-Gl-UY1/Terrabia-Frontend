import React, { useState } from 'react';
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
import { ArrowLeft, MoreVertical, ChevronRight, ShoppingCart } from 'lucide-react-native';
import { useAppSelector } from '../store/types';
import PaymentBottomSheet from '../components/PaymentBottomSheet';
import { usePayment } from '../context/PaymentContext';

type CheckoutNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any;
  unit: string;
};

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutNavigationProp>();
  const [selectedDelivery, setSelectedDelivery] = useState('domicile');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const { selectedMethod } = usePayment();
  
  // Récupérer les items sélectionnés du panier
  const cartItems = useAppSelector(state => state.cart.items.filter(item => item.selected));

  // Convertir les items du panier au format OrderItem
  const orderItems: OrderItem[] = cartItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.priceNumeric,
    quantity: item.quantity,
    image: item.image,
    unit: 'CFA',
  }));

  // Utiliser les vrais items du panier ou items mockés si le panier est vide
  const finalOrderItems = orderItems.length > 0 ? orderItems : [
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

  const subtotal = finalOrderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = selectedDelivery === 'domicile' ? 500 : 0;
  const total = subtotal + deliveryFee;

  const handleOrderPress = () => {
    setShowPaymentSheet(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentSheet(false);
    // Naviguer vers l'écran de paiement selon la méthode choisie
    if (selectedMethod === 'orange' || selectedMethod === 'momo') {
      navigation.navigate('MobileMoneyPayment', { 
        amount: total,
        paymentMethod: selectedMethod 
      });
    } else if (selectedMethod === 'card') {
      navigation.navigate('CardPayment', { amount: total });
    }
  };

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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commande</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Adresse d'envoi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse d'envoi</Text>
          <TouchableOpacity style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>Paul Mbarga</Text>
              <Text style={styles.addressDetails}>Yaoundé, Nsimalen</Text>
            </View>
            <View style={styles.addressRight}>
              <Text style={styles.phoneNumber}>655 567 113</Text>
              <ChevronRight size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Mode de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de livraison</Text>
          
          <Pressable 
            style={[styles.deliveryOption, selectedDelivery === 'domicile' && styles.selectedOption]}
            onPress={() => setSelectedDelivery('domicile')}
          >
            <Text style={styles.deliveryText}>Livraison à domicile</Text>
            <View style={styles.deliveryRight}>
              <Text style={styles.deliveryPrice}>500 CFA</Text>
              <View style={[styles.radio, selectedDelivery === 'domicile' && styles.radioSelected]}>
                {selectedDelivery === 'domicile' && <View style={styles.radioDot} />}
              </View>
            </View>
          </Pressable>

          <Pressable 
            style={[styles.deliveryOption, selectedDelivery === 'relais' && styles.selectedOption]}
            onPress={() => setSelectedDelivery('relais')}
          >
            <Text style={styles.deliveryText}>Livraison depuis un point de relais</Text>
            <View style={styles.deliveryRight}>
              <Text style={styles.deliveryPrice}>Gratuit</Text>
              <View style={[styles.radio, selectedDelivery === 'relais' && styles.radioSelected]}>
                {selectedDelivery === 'relais' && <View style={styles.radioDot} />}
              </View>
            </View>
          </Pressable>
        </View>

        {/* Vendeur */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.vendorRow}>
            <Text style={styles.vendorText}>Vendeur : Paulin Kamga</Text>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Articles commandés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Articles commandés ({finalOrderItems.length})</Text>
          {finalOrderItems.map(renderOrderItem)}
          
          {/* Résumé des prix */}
          <View style={styles.pricesSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sous-total</Text>
              <Text style={styles.priceValue}>{subtotal} CFA</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Frais de livraison</Text>
              <Text style={styles.priceValue}>{deliveryFee} CFA</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer avec total et bouton commande */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{total} CFA</Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={handleOrderPress}>
          <ShoppingCart size={20} color="#FFFFFF" style={styles.cartIcon} />
          <Text style={styles.orderButtonText}>Commander</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet de paiement */}
      <PaymentBottomSheet
        visible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        onConfirm={handlePaymentConfirm}
      />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
  addressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#FFF7F0',
    borderColor: '#FF6B35',
  },
  deliveryText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    fontWeight: '500',
  },
  deliveryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#FF6B35',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B35',
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
  pricesSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
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
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
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