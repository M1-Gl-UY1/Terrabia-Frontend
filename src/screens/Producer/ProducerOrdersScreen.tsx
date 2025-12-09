import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppSelector } from '../../store/types';
import producerService from '../../services/ProducerService';
import { Commande, StatutCommande } from '../../types/Backend';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
} from 'lucide-react-native';

type OrdersNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProducerOrdersScreen = () => {
  const navigation = useNavigation<OrdersNavigationProp>();
  const user = useAppSelector(state => state.auth.user);

  const [orders, setOrders] = useState<Commande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const loadOrders = async () => {
    if (!user?.idUser) return;

    try {
      const response = await producerService.getMyOrders(user.idUser);
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.log('Erreur chargement commandes:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [user?.idUser])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadOrders();
  };

  const getStatusConfig = (status: StatutCommande) => {
    switch (status) {
      case StatutCommande.EN_ATTENTE:
        return {
          icon: Clock,
          color: '#FF9800',
          bgColor: '#FFF3E0',
          label: 'En attente',
        };
      case StatutCommande.PAYEE:
        return {
          icon: CheckCircle,
          color: '#2196F3',
          bgColor: '#E3F2FD',
          label: 'Payée',
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
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredOrders = orders.filter(order => {
    if (selectedFilter === 'all') return true;
    return order.statut === selectedFilter;
  });

  const FilterButton = ({ filter, label }: { filter: string; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[styles.filterButtonText, selectedFilter === filter && styles.filterButtonTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOrder = ({ item }: { item: Commande }) => {
    const statusConfig = getStatusConfig(item.statut);
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('ProducerOrderDetail', { order: item })}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>Commande #{item.idCommande}</Text>
            <Text style={styles.orderDate}>{formatDate(item.dateCommande)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <StatusIcon size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.buyerName}>
            Client: {item.acheteur?.prenom} {item.acheteur?.nom}
          </Text>
          <Text style={styles.itemCount}>
            {item.details?.length || 0} article(s)
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{formatPrice(item.montantTotal)}</Text>
          <ChevronRight size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <ShoppingBag size={64} color="#ccc" strokeWidth={1.5} />
      <Text style={styles.emptyTitle}>Aucune commande</Text>
      <Text style={styles.emptyText}>
        Vos commandes apparaîtront ici lorsque des clients achèteront vos produits
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Chargement des commandes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Commandes</Text>
        <Text style={styles.headerSubtitle}>{orders.length} commande(s)</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FilterButton filter="all" label="Toutes" />
        <FilterButton filter={StatutCommande.EN_ATTENTE} label="En attente" />
        <FilterButton filter={StatutCommande.PAYEE} label="Payées" />
        <FilterButton filter={StatutCommande.LIVREE} label="Livrées" />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.idCommande.toString()}
        renderItem={renderOrder}
        contentContainerStyle={[
          styles.listContent,
          filteredOrders.length === 0 && styles.listContentEmpty,
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
  filtersContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listContentEmpty: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12,
    marginBottom: 12,
  },
  buyerName: {
    fontSize: 14,
    color: '#333',
  },
  itemCount: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
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
});

export default ProducerOrdersScreen;
