import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Commande, StatutCommande, LigneCommande } from '../../types/Backend';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
  User,
  CreditCard,
} from 'lucide-react-native';

type OrderDetailNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProducerOrderDetailScreen = () => {
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const route = useRoute();
  const { order } = route.params as { order: Commande };

  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusConfig = (status: StatutCommande) => {
    switch (status) {
      case StatutCommande.EN_ATTENTE:
        return {
          icon: Clock,
          color: '#FF9800',
          bgColor: '#FFF3E0',
          label: 'En attente de paiement',
        };
      case StatutCommande.PAYEE:
        return {
          icon: CreditCard,
          color: '#2196F3',
          bgColor: '#E3F2FD',
          label: 'Payée - En préparation',
        };
      case StatutCommande.LIVREE:
        return {
          icon: Truck,
          color: '#4CAF50',
          bgColor: '#E8F5E9',
          label: 'Livrée',
        };
      case StatutCommande.ANNULEE:
        return {
          icon: XCircle,
          color: '#F44336',
          bgColor: '#FFEBEE',
          label: 'Annulée',
        };
      default:
        return {
          icon: Clock,
          color: '#9E9E9E',
          bgColor: '#F5F5F5',
          label: 'Inconnu',
        };
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

  const handleMarkAsDelivered = () => {
    Alert.alert(
      'Confirmer la livraison',
      'Êtes-vous sûr de vouloir marquer cette commande comme livrée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setIsUpdating(true);
            // API call to update order status
            setTimeout(() => {
              setIsUpdating(false);
              Alert.alert('Succès', 'La commande a été marquée comme livrée');
              navigation.goBack();
            }, 1000);
          },
        },
      ]
    );
  };

  const handleContactClient = () => {
    Alert.alert('Contacter le client', `Appeler ${order.acheteur?.numTel || 'le client'} ?`);
  };

  const statusConfig = getStatusConfig(order.statut);
  const StatusIcon = statusConfig.icon;

  const renderOrderItem = (item: LigneCommande, index: number) => {
    const imageUrl = item.produit?.photoUrl;
    const imageSource = imageUrl
      ? { uri: imageUrl }
      : require('../../assets/images/logo_sans_fond.png');

    return (
      <View key={index} style={styles.orderItem}>
        <Image source={imageSource} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.produit?.nom || 'Produit'}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.prixUnitaire)}</Text>
          <Text style={styles.itemQuantity}>Quantité: {item.quantite}</Text>
        </View>
        <Text style={styles.itemTotal}>
          {formatPrice(item.prixUnitaire * item.quantite)}
        </Text>
      </View>
    );
  };

  const subtotal = order.details?.reduce(
    (sum, item) => sum + item.prixUnitaire * item.quantite,
    0
  ) || 0;
  const deliveryFee = order.montantTotal - subtotal;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commande #{order.idCommande}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: statusConfig.bgColor }]}>
          <StatusIcon size={28} color={statusConfig.color} />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
            <Text style={styles.statusDate}>{formatDate(order.dateCommande)}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Informations client</Text>
          </View>
          <View style={styles.clientCard}>
            <Text style={styles.clientName}>
              {order.acheteur?.prenom} {order.acheteur?.nom}
            </Text>
            {order.acheteur?.email && (
              <Text style={styles.clientDetail}>{order.acheteur.email}</Text>
            )}
            <View style={styles.phoneRow}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.phoneText}>
                {order.acheteur?.numTel || 'Non renseigné'}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>
              {order.acheteur?.ville || 'Ville non spécifiée'}
            </Text>
            {order.agenceLivraison && (
              <View style={styles.agencyInfo}>
                <Text style={styles.agencyLabel}>Point de retrait:</Text>
                <Text style={styles.agencyName}>{order.agenceLivraison.nom}</Text>
                <Text style={styles.agencyAddress}>{order.agenceLivraison.adresse}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>
              Articles ({order.details?.length || 0})
            </Text>
          </View>
          <View style={styles.itemsContainer}>
            {order.details?.map((item, index) => renderOrderItem(item, index))}
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
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactClient}>
            <Phone size={20} color="#2E7D32" />
            <Text style={styles.contactButtonText}>Contacter le client</Text>
          </TouchableOpacity>

          {order.statut === StatutCommande.PAYEE && (
            <TouchableOpacity
              style={[styles.deliveryButton, isUpdating && styles.buttonDisabled]}
              onPress={handleMarkAsDelivered}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <CheckCircle size={20} color="#FFFFFF" />
                  <Text style={styles.deliveryButtonText}>Marquer comme livrée</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
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
  clientCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  clientDetail: {
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
  addressCard: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 15,
    color: '#1F2937',
  },
  agencyInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  agencyLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  agencyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  agencyAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
    color: '#2E7D32',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  contactButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  deliveryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProducerOrderDetailScreen;
