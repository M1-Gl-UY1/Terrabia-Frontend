import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  Truck,
  Store,
  Package,
  CreditCard,
} from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../store/types';
import { clearCart, selectSelectedItems } from '../store/cartSlice';
import { orderService } from '../services/OrderService';
import PaymentBottomSheet from '../components/PaymentBottomSheet';
import { usePayment } from '../context/PaymentContext';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { CartItem } from '../store/cartSlice';

type CheckoutNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

type DeliveryMode = 'domicile' | 'relais';

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutNavigationProp>();
  const dispatch = useAppDispatch();
  const { selectedMethod } = usePayment();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const user = useAppSelector(state => state.auth.user);
  const selectedItems = useAppSelector(selectSelectedItems);

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMode>('domicile');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Frais de livraison
  const deliveryFee = selectedDelivery === 'domicile' ? 500 : 0;
  const subtotal = selectedItems.reduce((sum, item) => sum + item.priceNumeric * item.quantity, 0);
  const total = subtotal + deliveryFee;

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

  const handleCreateOrder = async () => {
    if (!user?.idUser) {
      showError('Vous devez être connecté pour passer une commande', 3000);
      return;
    }

    if (selectedItems.length === 0) {
      showError('Veuillez sélectionner des articles dans votre panier', 3000);
      return;
    }

    setIsCreatingOrder(true);
    try {
      const response = await orderService.createOrder(user.idUser);

      if (response.success && response.data) {
        setOrderId(response.data.idCommande);
        showSuccess('Commande créée avec succès!', 2000);
        // Ouvrir le bottom sheet de paiement
        setTimeout(() => {
          setShowPaymentSheet(true);
        }, 500);
      } else {
        showError(response.error || 'Erreur lors de la création de la commande', 3000);
      }
    } catch (error) {
      showError('Une erreur est survenue', 3000);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentConfirm = () => {
    setShowPaymentSheet(false);

    if (!orderId) {
      showError('Erreur: ID de commande manquant', 3000);
      return;
    }

    // Naviguer vers l'écran de paiement selon la méthode choisie
    if (selectedMethod === 'orange' || selectedMethod === 'momo') {
      navigation.navigate('MobileMoneyPayment', {
        amount: total,
        paymentMethod: selectedMethod,
        orderId: orderId,
      });
    } else if (selectedMethod === 'card') {
      navigation.navigate('CardPayment', {
        amount: total,
        orderId: orderId,
      });
    }
  };

  const renderOrderItem = (item: CartItem) => (
    <View key={item.id} style={styles.orderItem}>
      <Image source={getImageSource(item)} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemDetails}>Prix unitaire: {formatPrice(item.priceNumeric)}</Text>
        <Text style={styles.itemQuantity}>Quantité: {item.quantity}</Text>
      </View>
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>{formatPrice(item.priceNumeric * item.quantity)}</Text>
      </View>
    </View>
  );

  // Group items by seller
  const itemsBySeller = selectedItems.reduce((acc, item) => {
    const sellerName = item.seller?.name || 'Vendeur';
    if (!acc[sellerName]) {
      acc[sellerName] = [];
    }
    acc[sellerName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  if (selectedItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Commande</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Package size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Aucun article sélectionné</Text>
          <Text style={styles.emptyText}>
            Retournez au panier et sélectionnez les articles que vous souhaitez commander
          </Text>
          <TouchableOpacity
            style={styles.backToCartButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
          >
            <Text style={styles.backToCartText}>Retour au panier</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commande</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Adresse d'envoi */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#F48C06" />
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          </View>
          <TouchableOpacity style={styles.addressCard}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{user?.nom || 'Nom'} {user?.prenom || ''}</Text>
              <Text style={styles.addressDetails}>{user?.ville || 'Ville non renseignée'}</Text>
            </View>
            <View style={styles.addressRight}>
              <Text style={styles.phoneNumber}>{user?.numTel || 'Téléphone'}</Text>
              <ChevronRight size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Mode de livraison */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck size={20} color="#F48C06" />
            <Text style={styles.sectionTitle}>Mode de livraison</Text>
          </View>

          <TouchableOpacity
            style={[styles.deliveryOption, selectedDelivery === 'domicile' && styles.selectedOption]}
            onPress={() => setSelectedDelivery('domicile')}
          >
            <View style={styles.deliveryLeft}>
              <Truck size={20} color={selectedDelivery === 'domicile' ? '#F48C06' : '#6B7280'} />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryText}>Livraison à domicile</Text>
                <Text style={styles.deliverySubtext}>Livré sous 24-48h</Text>
              </View>
            </View>
            <View style={styles.deliveryRight}>
              <Text style={styles.deliveryPrice}>500 FCFA</Text>
              <View style={[styles.radio, selectedDelivery === 'domicile' && styles.radioSelected]}>
                {selectedDelivery === 'domicile' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deliveryOption, selectedDelivery === 'relais' && styles.selectedOption]}
            onPress={() => setSelectedDelivery('relais')}
          >
            <View style={styles.deliveryLeft}>
              <Store size={20} color={selectedDelivery === 'relais' ? '#F48C06' : '#6B7280'} />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryText}>Point de relais</Text>
                <Text style={styles.deliverySubtext}>Récupérez votre commande</Text>
              </View>
            </View>
            <View style={styles.deliveryRight}>
              <Text style={[styles.deliveryPrice, styles.freeDelivery]}>Gratuit</Text>
              <View style={[styles.radio, selectedDelivery === 'relais' && styles.radioSelected]}>
                {selectedDelivery === 'relais' && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Articles commandés par vendeur */}
        {Object.entries(itemsBySeller).map(([sellerName, items]) => (
          <View key={sellerName} style={styles.section}>
            <View style={styles.sellerHeader}>
              <Store size={18} color="#6B7280" />
              <Text style={styles.sellerName}>Vendeur: {sellerName}</Text>
            </View>
            {items.map(renderOrderItem)}
          </View>
        ))}

        {/* Résumé des prix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>
          <View style={styles.pricesSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sous-total ({selectedItems.length} article(s))</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Frais de livraison</Text>
              <Text style={[styles.priceValue, deliveryFee === 0 && styles.freeText]}>
                {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalPriceRow]}>
              <Text style={styles.totalPriceLabel}>Total</Text>
              <Text style={styles.totalPriceValue}>{formatPrice(total)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer avec total et bouton commande */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotalLabel}>Total à payer</Text>
          <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.orderButton, isCreatingOrder && styles.orderButtonDisabled]}
          onPress={handleCreateOrder}
          disabled={isCreatingOrder}
        >
          {isCreatingOrder ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.orderButtonText}>Passer la commande</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet de paiement */}
      <PaymentBottomSheet
        visible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        onConfirm={handlePaymentConfirm}
      />

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onDismiss={hideToast}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
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
  backToCartButton: {
    backgroundColor: '#F48C06',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 13,
    color: '#6B7280',
  },
  addressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneNumber: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#FFFBF5',
    borderColor: '#F48C06',
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  deliverySubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  deliveryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deliveryPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F48C06',
  },
  freeDelivery: {
    color: '#10B981',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#F48C06',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F48C06',
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sellerName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
    backgroundColor: '#F5F5F5',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  pricesSummary: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  freeText: {
    color: '#10B981',
  },
  totalPriceRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 4,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F48C06',
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
  footerTotalLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  footerTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  orderButton: {
    backgroundColor: '#F48C06',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 16,
    gap: 8,
  },
  orderButtonDisabled: {
    opacity: 0.7,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
