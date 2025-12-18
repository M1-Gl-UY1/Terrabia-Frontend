import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Package,
  Headphones,
  MessageSquare,
  PackageOpen,
  Heart,
  Clock,
  ChevronRight,
  Edit2,
  LogOut,
  Settings,
  Bell,
  HelpCircle,
  FileText,
  Shield,
  Trash2,
  Globe,
  User,
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/types';
import { logout, selectUser } from '../store/authSlice';
import { RootStackParamList } from '../navigation/AppNavigator';
import { orderService } from '../services/OrderService';
import { Commande, StatutCommande } from '../types/Backend';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  title: string;
  icon?: any;
  iconColor?: string;
  action: () => void;
  showBadge?: boolean;
  badgeCount?: number;
};

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const [refreshing, setRefreshing] = useState(false);
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    paid: 0,
    delivered: 0,
    total: 0,
  });

  const user = {
    name: currentUser ? `${currentUser.prenom || ''} ${currentUser.nom}`.trim() : 'Utilisateur',
    email: currentUser?.email || 'Non renseigné',
    phone: currentUser?.numTel || 'Non renseigné',
    city: currentUser?.ville || 'Non renseignée',
  };

  const loadOrderCounts = async () => {
    if (currentUser?.idUser) {
      try {
        const response = await orderService.getOrderHistory(currentUser.idUser);
        if (response.success && response.data) {
          const orders = response.data;
          setOrderCounts({
            pending: orders.filter(o => o.statut === StatutCommande.EN_ATTENTE).length,
            paid: orders.filter(o => o.statut === StatutCommande.PAYEE).length,
            delivered: orders.filter(o => o.statut === StatutCommande.LIVREE).length,
            total: orders.length,
          });
        }
      } catch (error) {
        console.error('Erreur chargement commandes:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOrderCounts();
    }, [currentUser?.idUser])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrderCounts();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          navigation.replace('OnboardingInitialScreen');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // API call to delete account
            Alert.alert('Info', 'Cette fonctionnalité sera bientôt disponible');
          },
        },
      ]
    );
  };

  const quickActions = [
    {
      id: '1',
      title: 'Toutes',
      icon: Package,
      count: orderCounts.total,
      action: () => navigation.navigate('OrderHistory'),
    },
    {
      id: '2',
      title: 'En attente',
      icon: Clock,
      count: orderCounts.pending,
      action: () => navigation.navigate('OrderHistory'),
    },
    {
      id: '3',
      title: 'Payées',
      icon: MessageSquare,
      count: orderCounts.paid,
      action: () => navigation.navigate('OrderHistory'),
    },
    {
      id: '4',
      title: 'Livrées',
      icon: PackageOpen,
      count: orderCounts.delivered,
      action: () => navigation.navigate('OrderHistory'),
    },
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Mes commandes',
      icon: Package,
      iconColor: '#F48C06',
      action: () => navigation.navigate('OrderHistory'),
    },
    {
      id: '2',
      title: 'Messages',
      icon: MessageSquare,
      iconColor: '#10B981',
      action: () => navigation.navigate('Conversations'),
    },
    {
      id: '3',
      title: 'Notifications',
      icon: Bell,
      iconColor: '#3B82F6',
      action: () => navigation.navigate('Notifications'),
    },
    {
      id: '4',
      title: 'Liste de souhaits',
      icon: Heart,
      iconColor: '#EF4444',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
    {
      id: '5',
      title: 'Vus récemment',
      icon: Clock,
      iconColor: '#8B5CF6',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      id: '1',
      title: 'Modifier le profil',
      icon: User,
      iconColor: '#6B7280',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
    {
      id: '2',
      title: 'Langue',
      icon: Globe,
      iconColor: '#6B7280',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
    {
      id: '3',
      title: 'Aide et support',
      icon: HelpCircle,
      iconColor: '#6B7280',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
    {
      id: '4',
      title: 'Conditions d\'utilisation',
      icon: FileText,
      iconColor: '#6B7280',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
    {
      id: '5',
      title: 'Politique de confidentialité',
      icon: Shield,
      iconColor: '#6B7280',
      action: () => Alert.alert('Info', 'Fonctionnalité bientôt disponible'),
    },
    {
      id: '6',
      title: 'À propos de Terrabia',
      icon: HelpCircle,
      iconColor: '#6B7280',
      action: () => Alert.alert('Info', 'Version 1.0.0'),
    },
  ];

  const dangerItems: MenuItem[] = [
    {
      id: '1',
      title: 'Supprimer mon compte',
      icon: Trash2,
      iconColor: '#EF4444',
      action: handleDeleteAccount,
    },
    {
      id: '2',
      title: 'Se déconnecter',
      icon: LogOut,
      iconColor: '#EF4444',
      action: handleLogout,
    },
  ];

  const renderQuickAction = (item: any) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity key={item.id} style={styles.quickActionItem} onPress={item.action}>
        <View style={styles.quickActionIconContainer}>
          <IconComponent size={22} color="#F48C06" strokeWidth={2} />
        </View>
        <Text style={styles.quickActionCount}>{item.count}</Text>
        <Text style={styles.quickActionTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const renderMenuItem = (item: MenuItem, showBorder: boolean = true) => {
    const IconComponent = item.icon;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.menuItem, !showBorder && styles.menuItemNoBorder]}
        onPress={item.action}
      >
        <View style={styles.menuItemLeft}>
          {IconComponent && (
            <View style={[styles.menuIconContainer, { backgroundColor: `${item.iconColor}15` }]}>
              <IconComponent size={18} color={item.iconColor} strokeWidth={2} />
            </View>
          )}
          <Text style={[styles.menuTitle, item.iconColor === '#EF4444' && styles.dangerText]}>
            {item.title}
          </Text>
        </View>
        <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F48C06']}
            tintColor="#F48C06"
          />
        }
      >
        {/* En-tête avec fond orange */}
        <View style={styles.orangeHeader}>
          <Text style={styles.headerTitle}>Mon Profil</Text>

          {/* Profil utilisateur */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userCity}>{user.city}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => Alert.alert('Info', 'Modification du profil bientôt disponible')}
            >
              <Edit2 size={18} color="#F48C06" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Mes Commandes */}
        <View style={styles.commandSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes Commandes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Menu principal */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => renderMenuItem(item, index < menuItems.length - 1))}
        </View>

        {/* Paramètres */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Paramètres</Text>
          {settingsItems.map((item, index) => renderMenuItem(item, index < settingsItems.length - 1))}
        </View>

        {/* Actions dangereuses */}
        <View style={[styles.menuSection, styles.dangerSection]}>
          {dangerItems.map((item, index) => renderMenuItem(item, index < dangerItems.length - 1))}
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Terrabia v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  orangeHeader: {
    backgroundColor: '#F48C06',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F48C06',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  userCity: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commandSection: {
    backgroundColor: '#FFFFFF',
    marginTop: -30,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#F48C06',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  quickActionTitle: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemNoBorder: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  dangerText: {
    color: '#EF4444',
  },
  dangerSection: {
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingBottom: 30,
  },
});
