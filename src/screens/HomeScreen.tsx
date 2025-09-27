import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';
import Inspector from '../components/Inspector';
import { Search, Bell, Info, Bug } from 'lucide-react-native';
import { useAppSelector } from '../store/types';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const hasUnreadNotifications = useAppSelector(state => state.notifications.unreadCount > 0);

  // Données des produits (simulées) avec oldPrice
  const products = [
    { name: 'Tige de manioc', price: '3000 FCFA', oldPrice: '3500 FCFA', image: require('../assets/images/manioc.png'), description: 'Manioc frais cultivé localement.' },
    { name: 'Cageot de tomates', price: '2500 FCFA', oldPrice: '3000 FCFA', image: require('../assets/images/tomate.png'), description: 'Tomates rouges et juteuses.' },
    { name: 'Tige de manioc', price: '2500 FCFA', oldPrice: '3200 FCFA', image: require('../assets/images/manioc.png'), description: 'Manioc frais cultivé localement.' },
    { name: 'Noix', price: '2700 FCFA', oldPrice: '3000 FCFA', image: require('../assets/images/noix.png'), description: 'Noix de qualité supérieure.' },
    { name: 'Pommes', price: '2700 FCFA', oldPrice: '3200 FCFA', image: require('../assets/images/pomme.png'), description: 'Pommes croquantes et savoureuses.' },
    { name: 'Patates', price: '1500 FCFA', oldPrice: '2000 FCFA', image: require('../assets/images/patate.png'), description: 'Patates douces et tendres.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Barre de recherche */}
          <Pressable
            style={styles.searchContainer}
            onPress={() => navigation.navigate('Search')}
          >
            <Search size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>
              Que recherchez-vous aujourd'hui ?
            </Text>
          </Pressable>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <View style={{ position: 'relative' }}>
              <Bell size={24} color="#9CA3AF" />
              {hasUnreadNotifications && <View style={styles.badge} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero Section avec l'image de fruits */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>De la plantation à{'\n'}votre table, en toute{'\n'}simplicité</Text>
            <Text style={styles.heroSubtitle}>Commandez maintenant {'>>'}</Text>

            {/* Indicateurs de pagination */}
            <View style={styles.paginationContainer}>
              <View style={[styles.paginationDot, styles.activeDot]} />
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
            </View>
          </View>
          <Image source={require('../assets/images/lot_fruits.png')} />
        </View>

        {/* Section "Offre du jour" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offre du jour</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {products.slice(0, 3).map((product, index) => (
              <TouchableOpacity
                key={index}
                style={styles.productCard}
                onPress={() => navigation.navigate('DetailProduct', { product })}
              >
                <Image source={product.image} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.oldPrice}>{product.oldPrice}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section "Recommandé pour vous" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommandé pour vous</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Array.from({ length: Math.ceil(products.length / 2) }, (_, i) => (
              <View key={i} style={styles.recommendedRow}>
                {products.slice(i * 2, i * 2 + 2).map((product, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recommendedCard}
                    onPress={() => navigation.navigate('DetailProduct', { product })}
                  >
                    <Image source={product.image} style={styles.recommendedImage} />
                    <View style={styles.recommendedInfo}>
                      <Text style={styles.recommendedName}>{product.name}</Text>
                      <Text style={styles.recommendedPrice}>{product.price}</Text>
                      <Text style={styles.oldPrice}>{product.oldPrice}</Text>
                      <Text style={styles.ordersText}>23 Commandes</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: -24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 10,
  },
  notificationButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    width: 12,
    height: 12,
  },

  // Hero Section
  heroSection: {
    height: 220,
    position: 'relative',
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#FFCB69',
  },
  heroTextContainer: {
    flex: 1,
    paddingTop: 32,
    paddingStart: 24,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 26,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  heroImageContainer: {
    position: 'absolute',
    right: -20,
    top: 0,
    bottom: 0,
    width: 220,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
    marginTop: 24,
  },
  paginationDot: {
    width: 10,
    height: 10,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  activeDot: {
    backgroundColor: '#2D3748',
    opacity: 1,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },

  // Offre du jour - Horizontal scroll
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  productCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  productImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F48C06',
  },

  // Recommandé pour vous - Grid
  recommendedGrid: {
    gap: 12,
  },
  recommendedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  recommendedCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 2,
  },
  oldPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '400',
  },
  ordersText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default HomeScreen;