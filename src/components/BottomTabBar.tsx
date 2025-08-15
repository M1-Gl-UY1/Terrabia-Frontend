import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { MainTabParamList } from '../navigation/AppNavigator';

type TabItem = {
  key: keyof MainTabParamList;
  label: string;
  icon: string;
  activeIcon: string;
};

type Props = {
  currentRoute: keyof MainTabParamList;
  onTabPress: (tabKey: keyof MainTabParamList) => void;
};

const tabs: TabItem[] = [
  {
    key: 'Home',
    label: 'Accueil',
    icon: '🏠',
    activeIcon: '🏠',
  },
  {
    key: 'Categories',
    label: 'Catégories',
    icon: '📱',
    activeIcon: '📱',
  },
  {
    key: 'Cart',
    label: 'Panier',
    icon: '🛒',
    activeIcon: '🛒',
  },
  {
    key: 'Profile',
    label: 'Profil',
    icon: '👤',
    activeIcon: '👤',
  },
];

export default function BottomTabBar({ currentRoute, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            onPress={() => onTabPress(tab.key)}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {isActive ? tab.activeIcon : tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItemActive: {
    // Active state styling
  },
  tabIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  tabIconActive: {
    color: '#F27A22',
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
