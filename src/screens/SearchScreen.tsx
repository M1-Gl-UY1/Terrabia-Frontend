import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ArrowLeft, Search, X, Trash2 } from 'lucide-react-native';
import { productService } from '../services/ProductService';
import { Product } from '../types/Product';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Tags de grosses soldes (peuvent être chargés depuis le service plus tard)
  const grossesSoldes = ['Cageot Tomates', 'Pastèques', 'Prunes'];
  
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Avocats',
    'Ignames blanc',
    'Mangues',
  ]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') return;
    
    try {
      setLoading(true);
      setShowResults(true);
      const results = await productService.searchProducts(query);
      setSearchResults(results);
      
      // Ajouter aux recherches récentes si pas déjà présent
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagPress = (tag: string) => {
    setSearchQuery(tag);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec barre de recherche */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Que recherchez-vous aujourd'hui ?"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Si on affiche les résultats */}
        {showResults ? (
          <View style={styles.resultsSection}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <>
                    <Text style={styles.resultsCount}>
                      {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                    </Text>
                    {searchResults.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.productCard}
                        onPress={() => {
                          navigation.navigate('DetailProduct', { product });
                        }}
                      >
                        <Image source={product.image} style={styles.productImage} />
                        <View style={styles.productInfo}>
                          <Text style={styles.productName}>{product.name}</Text>
                          <Text style={styles.productCategory}>{product.category}</Text>
                          <View style={styles.priceRow}>
                            <Text style={styles.productPrice}>{product.price}</Text>
                            {product.oldPrice && (
                              <Text style={styles.oldPrice}>{product.oldPrice}</Text>
                            )}
                          </View>
                          {product.orderCount && (
                            <Text style={styles.orderCount}>{product.orderCount} commandes</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                ) : (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>
                      Aucun résultat pour "{searchQuery}"
                    </Text>
                    <Text style={styles.noResultsSubtext}>
                      Essayez avec d'autres mots-clés
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <>
            {/* Section Grosses soldes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Grosses soldes</Text>
              <View style={styles.tagsContainer}>
                {grossesSoldes.map((tag, index) => (
                  <Pressable
                    key={index}
                    style={styles.tag}
                    onPress={() => handleTagPress(tag)}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Section Recherches récentes */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recherches récentes</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Trash2 size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>
                  {recentSearches.map((tag, index) => (
                    <Pressable
                      key={index}
                      style={styles.tag}
                      onPress={() => handleTagPress(tag)}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: '#1F2937',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  resultsSection: {
    flex: 1,
  },
  loader: {
    marginTop: 40,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  oldPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  orderCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default SearchScreen;