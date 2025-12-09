import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  MapPin,
  Truck,
  Store,
  Phone,
} from 'lucide-react-native';
import { useAppSelector } from '../store/types';
import { orderService } from '../services/OrderService';
import { Commande, StatutCommande, LigneCommande } from '../types/Backend';

type OrderDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>;

const OrderDetailScreen = () => {
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute();
  const { orderId } = route.params as { orderId: number };
  const user = useAppSelector(state => state.auth.user);

  const [order, setOrder] = useState<Commande | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    if (!user?.idUser) return;

    try {
      const response = await orderService.getOrderHistory(user.idUser);
      if (response.success && response.data) {
        const foundOrder = response.data.find(o => o.idCommande === orderId);
        if (foundOrder) {
          setOrder(foundOrder);
        }
      }
    } catch (error) {
      console.error('Erreur chargement détail commande:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusInfo = (statut: StatutCommande) => {
    switch (statut) {
      case StatutCommande.EN_ATTENTE:
        return { label: 'En attente de paiement', color: '#F59E0B', bgColor: '#FEF3C7', icon: Clock };
      case StatutCommande.PAYEE:
        return { label: 'Payée - En préparation', color: '#3B82F6', bgColor: '#DBEAFE', icon: CreditCard };
      case StatutCommande.LIVREE:
        return { label: 'Livrée', color: '#10B981', bgColor: '#D1FAE5', icon: CheckCircle };
      case StatutCommande.ANNULEE:
        return { label: 'Annulée', color: '#EF4444', bgColor: '#FEE2E2', icon: XCircle };
      default:
        return { label: statut, color: '#6B7280', bgColor: '#F3F4F6', icon: Package };
    }
  };

  const renderOrderItem = (item: LigneCommande, index: number) => {
    const imageUrl = item.produit.photoUrl;
    const imageSource = imageUrl
      ? { uri: imageUrl }
      : require('../assets/images/logo_sans_fond.png');

    return (
      <View key={index} style={styles.orderItem}>
        <Image source={imageSource} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>{item.produit.nom}</Text>
          <Text style={styles.itemPrice}>{formatPrice(item.prixUnitaire)}</Text>
          <Text style={styles.itemQuantity}>Qté: {item.quantite}</Text>
        </View>
        <Text style={styles.itemTotal}>
          {formatPrice(item.prixUnitaire * item.quantite)}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail Commande</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48C06" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détail Commande</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Commande non trouvée</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(order.statut);
  const StatusIcon = statusInfo.icon;
  const subtotal = order.details.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0);
  const deliveryFee = order.montantTotal - subtotal;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commande #{orderId}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusInfo.bgColor }]}>
          <StatusIcon size={24} color={statusInfo.color} />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
            <Text style={styles.statusDate}>{formatDate(order.dateCommande)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#F48C06" />
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>
              {order.acheteur.prenom} {order.acheteur.nom}
            </Text>
            <Text style={styles.addressDetail}>{order.acheteur.ville || 'Ville non spécifiée'}</Text>
            <View style={styles.phoneRow}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.phoneText}>{order.acheteur.numTel || 'Non renseigné'}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Point */}
        {order.agenceLivraison && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Store size={20} color="#F48C06" />
              <Text style={styles.sectionTitle}>Point de retrait</Text>
            </View>
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>{order.agenceLivraison.nom}</Text>
              <Text style={styles.addressDetail}>{order.agenceLivraison.adresse}</Text>
            </View>
          </View>
        )}

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#F48C06" />
            <Text style={styles.sectionTitle}>
              Articles commandés ({order.details.length})
            </Text>
          </View>
          <View style={styles.itemsContainer}>
            {order.details.map((item, index) => renderOrderItem(item, index))}
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sous-total</Text>
              <Text style={styles.priceValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Frais de livraison</Text>
              <Text style={[styles.priceValue, deliveryFee === 0 && styles.freeText]}>
                {deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(order.montantTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {order.statut === StatutCommande.EN_ATTENTE && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => {
                // Navigate to payment
              }}
            >
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.payButtonText}>Payer maintenant</Text>
            </TouchableOpacity>
          </View>
        )}

        {order.statut === StatutCommande.LIVREE && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.reorderButton}>
              <Text style={styles.reorderButtonText}>Commander à nouveau</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerPlaceholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemsContainer: {
    gap: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  priceContainer: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F48C06',
  },
  actionsContainer: {
    marginTop: 8,
  },
  payButton: {
    backgroundColor: '#F48C06',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reorderButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F48C06',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#F48C06',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailScreen;
