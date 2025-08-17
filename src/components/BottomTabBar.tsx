import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react-native';
import type { MainTabParamList } from '../navigation/AppNavigator';

// Définition des types pour les props
type TabItem = {
  key: keyof MainTabParamList;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number; }>;
  activeIcon: React.ComponentType<{ size: number; color: string; strokeWidth?: number; }>;
};

type Props = {
  currentRoute: keyof MainTabParamList;
  onTabPress: (tabKey: keyof MainTabParamList) => void;
};

// Tableau de configuration des onglets avec des composants d'icônes Lucide
const tabs: TabItem[] = [
  {
    key: 'Home',
    label: 'Accueil',
    icon: Home,
    activeIcon: Home,
  },
  {
    key: 'Categories',
    label: 'Catégories',
    icon: LayoutGrid,
    activeIcon: LayoutGrid,
  },
  {
    key: 'Cart',
    label: 'Panier',
    icon: ShoppingCart,
    activeIcon: ShoppingCart,
  },
  {
    key: 'Profile',
    label: 'Profil',
    icon: User,
    activeIcon: User,
  },
];

export default function BottomTabBar({ currentRoute, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Onglets de navigation */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.key;
          const IconComponent = isActive ? tab.activeIcon : tab.icon;
          const color = isActive ? '#F27A22' : '#9CA3AF';

          return (
            <Pressable
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => onTabPress(tab.key)}
            >
              <IconComponent size={24} color={color} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    paddingTop: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {
    // Styles pour l'état actif, si nécessaire
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#F27A22',
    fontWeight: '600',
  },
});
