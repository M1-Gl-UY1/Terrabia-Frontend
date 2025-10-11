import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { productService } from '../services/ProductService';
import { Product } from '../types/Product';
import { categories, recommendedSubcategories } from '../data/mockProducts';

type CategoriesNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CategoriesScreen() {
  const navigation = useNavigation<CategoriesNavigationProp>();
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProductsByCategory(selectedCategory);
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProductsByCategory = (category: string) => {
    const filtered = products.filter(p => p.category === category);
    setFilteredProducts(filtered);
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      filterProductsByCategory(selectedCategory);
    } else {
      try {
        const results = await productService.searchProducts(query);
        setFilteredProducts(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Affiche la vue recherche si showProducts est true */}
      {showProducts ? (
        <>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Que recherchez-vous aujourd'hui ?"
              autoFocus
              value={searchQuery}
              onChangeText={handleSearch}
              onBlur={() => {
                if (searchQuery.trim() === '') {
                  setShowProducts(false);
                }
              }}
            />
            <Pressable style={styles.filterBtn}>
              <Text style={{fontSize:18}}>Filtre</Text>
            </Pressable>
          </View>
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" color="#F48C06" style={{marginTop: 20}} />
            ) : (
              <View style={styles.productsList}>
                {filteredProducts.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.productCardV2}
                    onPress={() => navigation.navigate('DetailProduct', { product: p })}
                  >
                    <Image source={p.image} style={styles.productImgV2} />
                    <View style={styles.productInfoV2}>
                      <View style={{flex:1}}>
                        <Text style={styles.productNameV2}>{p.name}</Text>
                        <Text style={styles.productPriceV2}>{p.price}</Text>
                        <Text style={styles.productOrdersV2}>{p.orderCount} Commandes</Text>
                      </View>
                      {p.badge && p.badgeColor && (
                        <View style={styles.productBadgesV2}>
                          <View style={[styles.badgeV2, {backgroundColor: p.badgeColor}]}> 
                            <Text style={{color:'#fff', fontWeight:'bold'}}>{p.badge}</Text>
                          </View>
                          {p.qualityIndicators && (
                            <View style={styles.indicatorsV2}>
                              {p.qualityIndicators.map((color, idx) => (
                                <View key={idx} style={[styles.indicatorDotV2, {backgroundColor: color}]} />
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
                {filteredProducts.length === 0 && (
                  <Text style={styles.noResultsText}>Aucun produit trouvé</Text>
                )}
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Que recherchez-vous aujourd'hui ?"
              onFocus={() => setShowProducts(true)}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.sideMenu}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.sideMenuItem,
                    selectedCategory === cat.name && styles.selectedMenuItem
                  ]}
                  onPress={() => handleCategoryPress(cat.name)}
                >
                  <Text style={[
                    styles.sideMenuText,
                    selectedCategory === cat.name && styles.selectedMenuText
                  ]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.recommendedContainer}>
              <Text style={styles.recommendedTitle}>Recommandé</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#F48C06" />
              ) : (
                <View style={styles.recommendedGrid}>
                  {recommendedSubcategories.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.recommendedCard}
                      onPress={() => {
                        setShowProducts(true);
                        handleSearch(item.name);
                      }}
                    >
                      <Image source={item.image} style={styles.recommendedImg} />
                      <Text style={styles.recommendedName}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: -24,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 36,
    fontSize: 14,
    marginRight: 8,
  },
  filterBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenu: {
    width: 120,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
  },
  sideMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  selectedMenuItem: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B35',
  },
  sideMenuText: {
    fontSize: 13,
    color: '#222',
  },
  selectedMenuText: {
    fontWeight: '600',
    color: '#FF6B35',
  },
  recommendedContainer: {
    flex: 1,
    padding: 8,
  },
  recommendedTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
  },
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recommendedCard: {
    width: 70,
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendedImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 2,
  },
  recommendedName: {
    fontSize: 11,
    textAlign: 'center',
  },
  productsList: {
    padding: 8,
  },
  productCardV2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  productImgV2: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  productInfoV2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  productNameV2: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  productPriceV2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F27A22',
  },
  productOrdersV2: {
    fontSize: 12,
    color: '#888',
  },
  productBadgesV2: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 48,
  },
  badgeV2: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  indicatorsV2: {
    flexDirection: 'row',
    gap: 3,
  },
  indicatorDotV2: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 2,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },
});