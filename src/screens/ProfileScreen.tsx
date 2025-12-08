import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/types';
import { logout, selectUser } from '../store/authSlice';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  title: string;
  icon?: any;
  action: () => void;
};

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const user = {
    name: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Utilisateur',
    phone: currentUser?.numTel || 'Non renseigné',
    avatar: require('../assets/profil_gisele.png'),
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

  const quickActions = [
    {
      id: '1',
      title: 'Commandes',
      icon: Package,
      action: () => console.log('Commandes'),
    },
    {
      id: '2',
      title: 'Service Client',
      icon: Headphones,
      action: () => console.log('Service Client'),
    },
    {
      id: '3',
      title: 'En Attente De Commentaire',
      icon: MessageSquare,
      action: () => console.log('Commentaire'),
    },
    {
      id: '4',
      title: 'Retour Et Remboursement',
      icon: PackageOpen,
      action: () => console.log('Retour'),
    },
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Liste de souhaits',
      icon: Heart,
      action: () => console.log('Liste de souhaits'),
    },
    {
      id: '2',
      title: 'Consulter récemments',
      icon: Clock,
      action: () => console.log('Récemments'),
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      id: '1',
      title: 'Langues',
      action: () => console.log('Langues'),
    },
    {
      id: '2',
      title: 'Reinitialiser Mot De Passe',
      action: () => console.log('Mot de passe'),
    },
    {
      id: '3',
      title: 'Guide Utilisateur',
      action: () => console.log('Guide'),
    },
    {
      id: '4',
      title: 'Politique De Retour',
      action: () => console.log('Politique'),
    },
    {
      id: '5',
      title: 'A Propos De Terrabia',
      action: () => console.log('A Propos'),
    },
    {
      id: '6',
      title: 'Devenir Vendeur',
      action: () => console.log('Vendeur'),
    },
    {
      id: '7',
      title: 'Suprimer Mon Compte',
      action: () => console.log('Supprimer'),
    },
    {
      id: '8',
      title: 'Se déconnecter',
      icon: LogOut,
      action: handleLogout,
    },
  ];

  const renderQuickAction = (item: any) => {
    const IconComponent = item.icon;
    return (
      <Pressable key={item.id} style={styles.quickActionItem} onPress={item.action}>
        <View style={styles.quickActionIconContainer}>
          <IconComponent size={24} color="#F27A22" strokeWidth={2} />
        </View>
        <Text style={styles.quickActionTitle}>{item.title}</Text>
      </Pressable>
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = item.icon;
    return (
      <Pressable key={item.id} style={styles.menuItem} onPress={item.action}>
        <View style={styles.menuItemLeft}>
          {IconComponent && (
            <View style={styles.menuIconContainer}>
              <IconComponent size={20} color="#374151" strokeWidth={2} />
            </View>
          )}
          <Text style={styles.menuTitle}>{item.title}</Text>
        </View>
        <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête avec fond orange */}
        <View style={styles.orangeHeader}>
          {/* Profil utilisateur */}
          <View style={styles.profileCard}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
            <Pressable onPress={() => console.log('Edit profile')}>
              <Edit2 size={20} color="#6B7280" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Section Ma Commande */}
        <View style={styles.commandSection}>
          <Text style={styles.commandTitle}>Ma Commande</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Menu avec cœur et liste */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Section Paramètres */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.settingsContainer}>
            {settingsItems.map(renderMenuItem)}
          </View>
        </View>
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
    backgroundColor: '#F27A22',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  commandSection: {
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  commandTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '400',
  },
  settingsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingsContainer: {
    paddingHorizontal: 16,
  },
});