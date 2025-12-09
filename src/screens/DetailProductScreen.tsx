import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Minus, Plus, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Product } from '../types/Product';
import { useAppDispatch, useAppSelector } from '../store/types';
import { addToCartAsync, addToCart, toggleItemSelection } from '../store/cartSlice';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

type DetailProductNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailProduct'>;

const { width } = Dimensions.get('window');

const DetailProductScreen = () => {
  const navigation = useNavigation<DetailProductNavigationProp>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { product } = route.params as { product: Product };

  const user = useAppSelector(state => state.auth.user);
  const isSyncing = useAppSelector(state => state.cart.isSyncing);

  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getImageSource = () => {
    if (product.imageUrl && typeof product.imageUrl === 'string') {
      return { uri: product.imageUrl };
    }
    if (product.image) {
      return product.image;
    }
    return require('../assets/images/logo_sans_fond.png');
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      if (user?.idUser) {
        // Utilisateur connecté - synchroniser avec le backend
        await dispatch(addToCartAsync({
          idAcheteur: user.idUser,
          product,
          quantity,
        })).unwrap();
      } else {
        // Utilisateur non connecté - ajouter localement
        dispatch(addToCart({ product, quantity }));
      }
      showSuccess(`${quantity} x ${product.name} ajouté(s) au panier`, 2500);
    } catch (error) {
      showError('Erreur lors de l\'ajout au panier', 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    try {
      if (user?.idUser) {
        const result = await dispatch(addToCartAsync({
          idAcheteur: user.idUser,
          product,
          quantity,
        })).unwrap();
        // Sélectionner l'article ajouté
        dispatch(toggleItemSelection(product.id));
      } else {
        dispatch(addToCart({ product, quantity }));
        dispatch(toggleItemSelection(product.id));
      }
      navigation.navigate('Checkout');
    } catch (error) {
      showError('Erreur lors de l\'ajout au panier', 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du produit</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={getImageSource()} style={styles.productImage} resizeMode="cover" />

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={22}
              color={isFavorite ? "#EF4444" : "#6B7280"}
              fill={isFavorite ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>

          {/* Image indicators */}
          <View style={styles.paginationContainer}>
            <View style={[styles.paginationDot, styles.activeDot]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          {/* Name and Price */}
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{formatPrice(product.priceNumeric)}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>{product.oldPrice}</Text>
            )}
          </View>

          {/* Stock and Orders */}
          <View style={styles.statsRow}>
            {product.stock !== undefined && (
              <View style={[styles.stockBadge, product.stock > 0 ? styles.inStockBadge : styles.outOfStockBadge]}>
                <Text style={[styles.stockText, product.stock > 0 ? styles.inStockText : styles.outOfStockText]}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </Text>
              </View>
            )}
            {product.orderCount !== undefined && product.orderCount > 0 && (
              <Text style={styles.ordersText}>{product.orderCount} commandes</Text>
            )}
          </View>

          {/* Characteristics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.characteristicsGrid}>
              {product.weight && (
                <View style={styles.characteristicItem}>
                  <Text style={styles.characteristicLabel}>Poids</Text>
                  <Text style={styles.characteristicValue}>{product.weight}</Text>
                </View>
              )}
              {product.quality && (
                <View style={styles.characteristicItem}>
                  <Text style={styles.characteristicLabel}>Qualité</Text>
                  <Text style={styles.characteristicValue}>{product.quality}</Text>
                </View>
              )}
              <View style={styles.characteristicItem}>
                <Text style={styles.characteristicLabel}>Disponibilité</Text>
                <Text style={[styles.characteristicValue, styles.availabilityText]}>
                  {product.stock && product.stock > 0 ? 'Disponible' : 'Indisponible'}
                </Text>
              </View>
            </View>
          </View>

          {/* Product Details List */}
          {product.details && product.details.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Détails du produit</Text>
              {product.details.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <Check size={16} color="#10B981" />
                  <Text style={styles.detailText}>{detail}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          )}

          {/* Seller Info */}
          {product.seller && (
            <View style={styles.sellerSection}>
              <Text style={styles.sectionTitle}>Vendeur</Text>
              <View style={styles.sellerCard}>
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{product.seller.name}</Text>
                  {product.seller.producer && (
                    <Text style={styles.sellerLocation}>{product.seller.producer}</Text>
                  )}
                </View>
                {product.seller.rating !== undefined && (
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color={star <= (product.seller?.rating || 0) ? "#F59E0B" : "#D1D5DB"}
                          fill={star <= (product.seller?.rating || 0) ? "#F59E0B" : "transparent"}
                        />
                      ))}
                    </View>
                    <Text style={styles.ratingText}>{product.seller.rating}/5</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantité</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={18} color={quantity <= 1 ? '#D1D5DB' : '#1F2937'} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus size={18} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(product.priceNumeric * quantity)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addToCartButton, isAddingToCart && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={isAddingToCart || isSyncing}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#F48C06" />
          ) : (
            <Text style={styles.addToCartText}>Ajouter au panier</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyNowButton, isAddingToCart && styles.buttonDisabled]}
          onPress={handleBuyNow}
          disabled={isAddingToCart || isSyncing}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <View style={styles.buyNowContent}>
              <ShoppingCart size={20} color="#FFFFFF" />
              <Text style={styles.buyNowText}>Commander</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onDismiss={hideToast}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: width,
    height: width * 0.8,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F48C06',
  },
  oldPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inStockBadge: {
    backgroundColor: '#D1FAE5',
  },
  outOfStockBadge: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inStockText: {
    color: '#059669',
  },
  outOfStockText: {
    color: '#DC2626',
  },
  ordersText: {
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  characteristicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  characteristicItem: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: '30%',
  },
  characteristicLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  characteristicValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  availabilityText: {
    color: '#059669',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  sellerSection: {
    marginBottom: 24,
  },
  sellerCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sellerLocation: {
    fontSize: 13,
    color: '#6B7280',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F9FAFB',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    minWidth: 40,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F48C06',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F48C06',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  addToCartText: {
    color: '#F48C06',
    fontSize: 15,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#F48C06',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  buyNowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default DetailProductScreen;
