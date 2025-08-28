import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';

type MenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
};

export default function ProfileScreen() {
  const user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60',
    memberSince: '2023',
    totalOrders: 15,
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Mes commandes',
      subtitle: 'Suivez vos commandes en cours',
      icon: '📦',
      action: () => console.log('Mes commandes'),
    },
    {
      id: '2',
      title: 'Adresses de livraison',
      subtitle: 'Gérez vos adresses',
      icon: '📍',
      action: () => console.log('Adresses'),
    },
    {
      id: '3',
      title: 'Méthodes de paiement',
      subtitle: 'Cartes et comptes bancaires',
      icon: '💳',
      action: () => console.log('Paiement'),
    },
    {
      id: '4',
      title: 'Préférences',
      subtitle: 'Notifications et confidentialité',
      icon: '⚙️',
      action: () => console.log('Préférences'),
    },
    {
      id: '5',
      title: 'Aide et support',
      subtitle: 'FAQ et contact',
      icon: '❓',
      action: () => console.log('Aide'),
    },
    {
      id: '6',
      title: 'À propos',
      subtitle: 'Version 1.0.0',
      icon: 'ℹ️',
      action: () => console.log('À propos'),
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <Pressable key={item.id} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </Pressable>
  );

  return (
    <TabNavigatorWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* En-tête du profil */}
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.totalOrders}</Text>
                  <Text style={styles.statLabel}>Commandes</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.memberSince}</Text>
                  <Text style={styles.statLabel}>Membre depuis</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu principal */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            <View style={styles.menuContainer}>
              {menuItems.map(renderMenuItem)}
            </View>
          </View>

          {/* Bouton de déconnexion */}
          <View style={styles.logoutSection}>
            <Pressable style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TabNavigatorWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F27A22',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  logoutSection: {
    marginTop: 32,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
