import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react-native';
import { useAppSelector } from '../store/types';
import { orderService } from '../services/OrderService';
import { Commande, StatutCommande } from '../types/Backend';

type OrderHistoryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderHistory'>;

type FilterType = 'all' | 'pending' | 'paid' | 'delivered' | 'cancelled';

const OrderHistoryScreen = () => {
  const navigation = useNavigation<OrderHistoryNavigationProp>();
  const user = useAppSelector(state => state.auth.user);

  const [orders, setOrders] = useState<Commande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const loadOrders = async () => {
    if (!user?.idUser) return;

    try {
      const response = await orderService.getOrderHistory(user.idUser);
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user?.idUser])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusInfo = (statut: StatutCommande) => {
    switch (statut) {
      case StatutCommande.EN_ATTENTE:
        return { label: 'En attente', color: '#F59E0B', bgColor: '#FEF3C7', icon: Clock };
      case StatutCommande.PAYEE:
        return { label: 'Payée', color: '#3B82F6', bgColor: '#DBEAFE', icon: CreditCard };
      case StatutCommande.LIVREE:
        return { label: 'Livrée', color: '#10B981', bgColor: '#D1FAE5', icon: CheckCircle };
      case StatutCommande.ANNULEE:
        return { label: 'Annulée', color: '#EF4444', bgColor: '#FEE2E2', icon: XCircle };
      default:
        return { label: statut, color: '#6B7280', bgColor: '#F3F4F6', icon: Package };
    }
  };

  const filterOrders = (orders: Commande[], filter: FilterType) => {
    switch (filter) {
      case 'pending':
        return orders.filter(o => o.statut === StatutCommande.EN_ATTENTE);
      case 'paid':
        return orders.filter(o => o.statut === StatutCommande.PAYEE);
      case 'delivered':
        return orders.filter(o => o.statut === StatutCommande.LIVREE);
      case 'cancelled':
        return orders.filter(o => o.statut === StatutCommande.ANNULEE);
      default:
        return orders;
    }
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'pending', label: 'En attente' },
    { key: 'paid', label: 'Payées' },
    { key: 'delivered', label: 'Livrées' },
    { key: 'cancelled', label: 'Annulées' },
  ];

  const filteredOrders = filterOrders(orders, activeFilter);

  const renderOrderItem = ({ item }: { item: Commande }) => {
    const statusInfo = getStatusInfo(item.statut);
    const StatusIcon = statusInfo.icon;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.idCommande })}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Package size={18} color="#6B7280" />
            <Text style={styles.orderId}>#{item.idCommande}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <StatusIcon size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <Text style={styles.orderDate}>{formatDate(item.dateCommande)}</Text>
          <Text style={styles.orderItems}>
            {item.details.length} article(s)
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{formatPrice(item.montantTotal)}</Text>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <ShoppingBag size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>Aucune commande</Text>
      <Text style={styles.emptyText}>
        {activeFilter === 'all'
          ? "Vous n'avez pas encore passé de commande"
          : `Aucune commande ${filters.find(f => f.key === activeFilter)?.label.toLowerCase()}`}
      </Text>
      {activeFilter === 'all' && (
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Categories' })}
        >
          <Text style={styles.shopButtonText}>Commencer mes achats</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Commandes</Text>
          <View style={styles.headerPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48C06" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Commandes</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item.key && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.idCommande.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={[
          styles.listContent,
          filteredOrders.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F48C06']}
            tintColor="#F48C06"
          />
        }
      />
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#F48C06',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  emptyListContent: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderBody: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F48C06',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
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
});

export default OrderHistoryScreen;
