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

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  action: () => void;
};

export default function ProfileScreen() {
  const user = {
    name: 'Gisele Tiafo',
    phone: '620 356 221',
    avatar: require('../assets/profil_gisele.png'),
  };

  const quickActions = [
    {
      id: '1',
      title: 'Commandes',
      icon: '🎯',
      action: () => console.log('Commandes'),
    },
    {
      id: '2',
      title: 'Service Client',
      icon: '🎧',
      action: () => console.log('Service Client'),
    },
    {
      id: '3',
      title: 'En Attente De Commentaire',
      icon: '💬',
      action: () => console.log('Commentaire'),
    },
    {
      id: '4',
      title: 'Retour Et Remboursement',
      icon: '📦',
      action: () => console.log('Retour'),
    },
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'Liste de souhaits',
      icon: '🤍',
      action: () => console.log('Liste de souhaits'),
    },
    {
      id: '2',
      title: 'Consulter récemments',
      icon: '📋',
      action: () => console.log('Récemments'),
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      id: '1',
      title: 'Langues',
      icon: '',
      action: () => console.log('Langues'),
    },
    {
      id: '2',
      title: 'Reinitialiser Mot De Passe',
      icon: '',
      action: () => console.log('Mot de passe'),
    },
    {
      id: '3',
      title: 'Guide Utilisateur',
      icon: '',
      action: () => console.log('Guide'),
    },
    {
      id: '4',
      title: 'Politique De Retour',
      icon: '',
      action: () => console.log('Politique'),
    },
    {
      id: '5',
      title: 'A Propos De KOM-B',
      icon: '',
      action: () => console.log('A Propos'),
    },
    {
      id: '6',
      title: 'Devenir Vendeur',
      icon: '',
      action: () => console.log('Vendeur'),
    },
    {
      id: '7',
      title: 'Suprimer Mon Compte',
      icon: '',
      action: () => console.log('Supprimer'),
    },
  ];

  const renderQuickAction = (item: any) => (
    <Pressable key={item.id} style={styles.quickActionItem} onPress={item.action}>
      <Text style={styles.quickActionIcon}>{item.icon}</Text>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
    </Pressable>
  );

  const renderMenuItem = (item: MenuItem) => (
    <Pressable key={item.id} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemLeft}>
        {item.icon && <Text style={styles.menuIcon}>{item.icon}</Text>}
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* En-tête avec fond orange */}
          <View style={styles.orangeHeader}>
            {/* Profil utilisateur */}
            <View style={styles.profileCard}>
              <Image source={ user.avatar } style={styles.avatar} />
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userPhone}>{user.phone}</Text>
              </View>
              <Text style={styles.editIcon}>✏️</Text>
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
    backgroundColor: '#FF7722',
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
  editIcon: {
    fontSize: 20,
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
  quickActionIcon: {
    fontSize: 24,
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
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