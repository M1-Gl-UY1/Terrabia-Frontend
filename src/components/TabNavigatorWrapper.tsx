import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../navigation/AppNavigator';
import BottomTabBar from './BottomTabBar';

type Props = {
  children: React.ReactNode;
};

export default function TabNavigatorWrapper({ children }: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const route = useRoute();
  const currentRoute = route.name as keyof MainTabParamList;

  const handleTabPress = (tabKey: keyof MainTabParamList) => {
    if (tabKey !== currentRoute) {
      navigation.navigate(tabKey);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <BottomTabBar 
        currentRoute={currentRoute}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 20, // Plus d'espace pour la barre de navigation
    margin : 0,
  },
});
