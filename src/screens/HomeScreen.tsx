import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Search, Bell, ShoppingCart } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../store/types';
import { loadCart, selectCartItemCount } from '../store/cartSlice';
import { productService } from '../services/ProductService';
import { Product } from '../types/Product';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const dispatch = useAppDispatch();
  const hasUnreadNotifications = useAppSelector(state => state.notifications.unreadCount > 0);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const user = useAppSelector(state => state.auth.user);

  const [dailyOffers, setDailyOffers] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      // Charger le panier si l'utilisateur est connecté
      if (user?.idUser) {
        dispatch(loadCart(user.idUser));
      }
    }, [user?.idUser])
  );

  const loadProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      const [offers, recommended] = await Promise.all([
        productService.getDailyOffers(),
        productService.getRecommendedProducts(),
      ]);
      setDailyOffers(offers);
      setRecommendedProducts(recommended);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getImageSource = (product: Product) => {
    if (product.imageUrl && typeof product.imageUrl === 'string') {
      return { uri: product.imageUrl };
    }
    if (product.image) {
      return product.image;
    }
    return require('../assets/images/logo_sans_fond.png');
  };

  const ProductCard = ({ product, style }: { product: Product; style?: any }) => (
    <TouchableOpacity
      style={[styles.productCard, style]}
      onPress={() => navigation.navigate('DetailProduct', { product })}
      activeOpacity={0.8}
    >
      <Image source={getImageSource(product)} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(product.priceNumeric)}</Text>
        {product.oldPrice && <Text style={styles.oldPrice}>{product.oldPrice}</Text>}
        {product.orderCount !== undefined && product.orderCount > 0 && (
          <Text style={styles.ordersText}>{product.orderCount} Commandes</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F48C06']}
            tintColor="#F48C06"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.searchContainer} onPress={() => navigation.navigate('Search')}>
            <Search size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>Que recherchez-vous aujourd'hui ?</Text>
          </Pressable>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell size={22} color="#333" />
              {hasUnreadNotifications && <View style={styles.badge} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
            >
              <ShoppingCart size={22} color="#333" />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              De la plantation à{'\n'}votre table, en toute{'\n'}simplicité
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Categories' })}>
              <Text style={styles.heroSubtitle}>Commandez maintenant {'>>'}</Text>
            </TouchableOpacity>
            <View style={styles.paginationContainer}>
              <View style={[styles.paginationDot, styles.activeDot]} />
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
            </View>
          </View>
          <Image
            source={require('../assets/images/lot_fruits.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F48C06" />
            <Text style={styles.loadingText}>Chargement des produits...</Text>
          </View>
        ) : (
          <>
            {/* Section Offre du jour */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Offre du jour</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Categories' })}>
                  <Text style={styles.seeAllText}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {dailyOffers.map(product => (
                  <ProductCard key={product.id} product={product} style={styles.offerCard} />
                ))}
              </ScrollView>
            </View>

            {/* Section Recommandé pour vous */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommandé pour vous</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Categories' })}>
                  <Text style={styles.seeAllText}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productsGrid}>
                {recommendedProducts.map(product => (
                  <ProductCard key={product.id} product={product} style={styles.gridCard} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#F5F5F5',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#FF6B35',
    borderRadius: 6,
    width: 10,
    height: 10,
  },
  cartBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: '#F48C06',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  // Hero Section
  heroSection: {
    height: 200,
    flexDirection: 'row',
    backgroundColor: '#FFCB69',
    overflow: 'hidden',
  },
  heroTextContainer: {
    flex: 1,
    paddingTop: 28,
    paddingStart: 20,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  heroImage: {
    width: 160,
    height: 200,
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#2D3748',
    opacity: 1,
  },

  // Sections
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  seeAllText: {
    fontSize: 14,
    color: '#F48C06',
    fontWeight: '600',
  },

  // Horizontal scroll (Offre du jour)
  horizontalScroll: {
    paddingRight: 16,
  },
  offerCard: {
    width: 160,
    marginRight: 12,
  },

  // Products Grid
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: CARD_WIDTH,
  },

  // Product Card
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 6,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F48C06',
  },
  oldPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  ordersText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default HomeScreen;
