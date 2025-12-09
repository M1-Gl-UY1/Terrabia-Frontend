import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppSelector } from '../../store/types';
import producerService, { ProducerStats } from '../../services/ProducerService';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Star,
  Plus,
  ChevronRight,
  Bell,
} from 'lucide-react-native';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProducerDashboardScreen = () => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const user = useAppSelector(state => state.auth.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<ProducerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    averageRating: 0,
  });

  const loadStats = async () => {
    if (!user?.idUser) return;

    try {
      const response = await producerService.getStats(user.idUser);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      // Utiliser des valeurs par défaut en cas d'erreur
      console.log('Erreur chargement stats:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [user?.idUser])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadStats();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  };

  const StatCard = ({
    icon: Icon,
    iconColor,
    bgColor,
    title,
    value,
    subtitle,
  }: {
    icon: any;
    iconColor: string;
    bgColor: string;
    title: string;
    value: string | number;
    subtitle?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <View style={styles.statIconContainer}>
        <Icon size={24} color={iconColor} strokeWidth={2} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const QuickAction = ({
    icon: Icon,
    title,
    onPress,
    color = '#2E7D32',
  }: {
    icon: any;
    title: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
        <Icon size={22} color={color} strokeWidth={2} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
      <ChevronRight size={18} color="#999" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.nom || 'Producteur'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('ProducerNotifications')}
          >
            <Bell size={24} color="#333" />
            {stats.pendingOrders > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{stats.pendingOrders}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              icon={Package}
              iconColor="#2E7D32"
              bgColor="#E8F5E9"
              title="Produits"
              value={stats.totalProducts}
            />
            <StatCard
              icon={ShoppingBag}
              iconColor="#1565C0"
              bgColor="#E3F2FD"
              title="Commandes"
              value={stats.totalOrders}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon={TrendingUp}
              iconColor="#E65100"
              bgColor="#FFF3E0"
              title="Revenus"
              value={formatCurrency(stats.totalRevenue)}
            />
            <StatCard
              icon={Clock}
              iconColor="#7B1FA2"
              bgColor="#F3E5F5"
              title="En attente"
              value={stats.pendingOrders}
            />
          </View>
        </View>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingContent}>
            <Star size={28} color="#FFC107" fill="#FFC107" />
            <View style={styles.ratingInfo}>
              <Text style={styles.ratingValue}>
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
              </Text>
              <Text style={styles.ratingLabel}>Note moyenne</Text>
            </View>
          </View>
          <Text style={styles.ratingHint}>
            Basée sur les avis de vos clients
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>

          <QuickAction
            icon={Plus}
            title="Ajouter un produit"
            onPress={() => navigation.navigate('AddProduct')}
            color="#2E7D32"
          />

          <QuickAction
            icon={Package}
            title="Gérer mes produits"
            onPress={() => navigation.navigate('ProducerTabs', { screen: 'ProducerProducts' })}
            color="#1565C0"
          />

          <QuickAction
            icon={ShoppingBag}
            title="Voir les commandes"
            onPress={() => navigation.navigate('ProducerTabs', { screen: 'ProducerOrders' })}
            color="#E65100"
          />
        </View>
      </ScrollView>

      {/* FAB - Add Product */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Plus size={28} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 100,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#E53935',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  ratingCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingInfo: {
    marginLeft: 16,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
  },
  ratingHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default ProducerDashboardScreen;
