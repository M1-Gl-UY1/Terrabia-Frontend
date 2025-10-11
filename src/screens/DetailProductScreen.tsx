import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical, Star, Heart, Share2, ShoppingCart } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Product } from '../types/Product';
import { useAppDispatch } from '../store/types';
import { addToCart } from '../store/cartSlice';

type DetailProductNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailProduct'>;

const DetailProductScreen = () => {
  const navigation = useNavigation<DetailProductNavigationProp>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { product } = route.params as { product: Product };
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    Alert.alert(
      'Produit ajouté',
      `${quantity} x ${product.name} ajouté(s) au panier`,
      [
        { text: 'Continuer mes achats', style: 'cancel' },
        { 
          text: 'Voir le panier', 
          onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' })
        }
      ]
    );
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigation.navigate('Checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec navigation centré */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Détails du produit</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Share2 size={22} color="#000" />
          <MoreVertical style={styles.MoreVert} size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image du produit avec overlay d'actions */}
        <View style={styles.imageContainer}>
          <Image 
            source={product.image} 
            style={styles.productImage} 
          />
          
          {/* Boutons flottants sur l'image */}
          <View style={styles.imageOverlay}>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart 
                size={20} 
                color={isFavorite ? "#FF6B35" : "#000"} 
                fill={isFavorite ? "#FF6B35" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          {/* Indicateurs de pagination */}
          <View style={styles.paginationContainer}>
            <View style={[styles.paginationDot, styles.activeDot]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </View>

        {/* Détails du produit */}
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{product.price}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>{product.oldPrice}</Text>
            )}
          </View>
          
          {/* Stock et commandes */}
          {product.stock && (
            <Text style={styles.stockText}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </Text>
          )}
          {product.orderCount && (
            <Text style={styles.ordersText}>{product.orderCount} commandes</Text>
          )}
          
          {/* Caractéristiques du produit */}
          <View style={styles.characteristicsSection}>
            <Text style={styles.sectionTitle}>Caractéristiques Du Produit</Text>
            
            {product.weight && (
              <View style={styles.characteristicRow}>
                <Text style={styles.characteristicLabel}>Poids Approximatif :</Text>
                <Text style={styles.characteristicValue}>{product.weight}</Text>
              </View>
            )}
            
            <View style={styles.characteristicRow}>
              <Text style={styles.characteristicLabel}>Disponibilité :</Text>
              <Text style={[styles.characteristicValue, styles.inStock]}>
                {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            
            {product.quality && (
              <View style={styles.characteristicRow}>
                <Text style={styles.characteristicLabel}>Qualité :</Text>
                <Text style={styles.characteristicValue}>{product.quality}</Text>
              </View>
            )}
          </View>

          {/* Détails du produit */}
          {product.details && product.details.length > 0 && (
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Détails Du Produit</Text>
              <Text style={styles.detailsText}>
                {product.details.map((detail, index) => `• ${detail}`).join('\n')}
              </Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description}
            </Text>
          </View>

          {/* Informations vendeur */}
          {product.seller && (
            <View style={styles.sellerSection}>
              <Text style={styles.sellerTitle}>Vendu Par :</Text>
              <Text style={styles.sellerName}>{product.seller.name}</Text>
              
              <Text style={styles.productionTitle}>Production :</Text>
              <Text style={styles.productionLocation}>{product.seller.producer}</Text>
              
              {/* Étoiles de notation */}
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Note Du Vendeur :</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      color={star <= (product.seller?.rating || 0) ? "#FFD700" : "#D1D5DB"}
                      fill={star <= (product.seller?.rating || 0) ? "#FFD700" : "transparent"}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Sélection de quantité */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantité :</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Boutons d'action */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Ajouter au panier</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buyNowButton} 
          onPress={handleBuyNow}
        >
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <ShoppingCart size={22} color="#FFFF" />
            <Text style={styles.buyNowText}>Commander</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerButton: {
    padding: 8,
    flexDirection: 'row',
  },
  MoreVert:{
    marginStart: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
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
    backgroundColor: '#FFFFFF',
  },
  detailsContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  oldPrice: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  stockText: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  ordersText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  characteristicsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  characteristicRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  characteristicLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: 'bold',
    marginEnd: 8,
  },
  characteristicValue: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  inStock: {
    color: '#059669',
    fontWeight: '500',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'justify',
  },
  sellerSection: {
    marginBottom: 24,
  },
  sellerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 12,
  },
  productionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  productionLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 30,
    textAlign: 'center',
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
    borderColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailProductScreen;