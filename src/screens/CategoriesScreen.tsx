import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { productService } from '../services/ProductService';
import producerService from '../services/ProducerService';
import { Product } from '../types/Product';
import { Categorie } from '../types/Backend';
import { Search, X, Filter } from 'lucide-react-native';

type CategoriesNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const PRODUCT_CARD_WIDTH = (width - 48) / 2;

export default function CategoriesScreen() {
  const navigation = useNavigation<CategoriesNavigationProp>();

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categorie | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, allProducts] = await Promise.all([
        producerService.getCategories(),
        productService.getAllProducts(),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
        if (categoriesResponse.data.length > 0) {
          setSelectedCategory(categoriesResponse.data[0]);
        }
      }

      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadProductsByCategory = async (category: Categorie) => {
    try {
      setProductsLoading(true);
      const categoryProducts = await productService.getProductsByCategoryId(category.idCat);
      setFilteredProducts(categoryProducts);
    } catch (error) {
      console.error('Erreur chargement produits par catégorie:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCategorySelect = (category: Categorie) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setIsSearchMode(false);
    loadProductsByCategory(category);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      if (selectedCategory) {
        loadProductsByCategory(selectedCategory);
      } else {
        setFilteredProducts(products);
      }
      setIsSearchMode(false);
    } else {
      setIsSearchMode(true);
      try {
        const results = await productService.searchProducts(query);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Erreur recherche:', error);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    if (selectedCategory) {
      loadProductsByCategory(selectedCategory);
    } else {
      setFilteredProducts(products);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInitialData();
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

  const ProductCard = ({ product }: { product: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('DetailProduct', { product })}
      activeOpacity={0.8}
    >
      <Image source={getImageSource(product)} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(product.priceNumeric)}</Text>
        {product.orderCount !== undefined && product.orderCount > 0 && (
          <Text style={styles.productOrders}>{product.orderCount} Commandes</Text>
        )}
        {product.seller && (
          <Text style={styles.productSeller} numberOfLines={1}>
            Par {product.seller.name}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F48C06" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Categories Sidebar */}
        <View style={styles.categoriesSidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.idCat}
                style={[
                  styles.categoryItem,
                  selectedCategory?.idCat === category.idCat && styles.categoryItemActive,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory?.idCat === category.idCat && styles.categoryTextActive,
                  ]}
                  numberOfLines={2}
                >
                  {category.nomCat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Area */}
        <View style={styles.productsArea}>
          {/* Category Title */}
          {!isSearchMode && selectedCategory && (
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{selectedCategory.nomCat}</Text>
              <Text style={styles.productCount}>{filteredProducts.length} produit(s)</Text>
            </View>
          )}

          {isSearchMode && (
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>Résultats de recherche</Text>
              <Text style={styles.productCount}>{filteredProducts.length} produit(s)</Text>
            </View>
          )}

          {productsLoading ? (
            <View style={styles.productsLoading}>
              <ActivityIndicator size="small" color="#F48C06" />
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <ProductCard product={item} />}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              contentContainerStyle={styles.productsList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#F48C06']}
                  tintColor="#F48C06"
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aucun produit trouvé</Text>
                  <Text style={styles.emptySubtext}>
                    {isSearchMode
                      ? 'Essayez avec d\'autres mots-clés'
                      : 'Cette catégorie ne contient pas encore de produits'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  categoriesSidebar: {
    width: 100,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  categoryItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryItemActive: {
    backgroundColor: '#FFF5E6',
    borderLeftWidth: 3,
    borderLeftColor: '#F48C06',
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  categoryTextActive: {
    color: '#F48C06',
    fontWeight: '600',
  },
  productsArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  categoryHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  productCount: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  productsLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: (width - 100 - 32) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 17,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F48C06',
  },
  productOrders: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  productSeller: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
});
