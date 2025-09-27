import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical, Star, Heart, Share2, ShoppingCart } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type DetailProductNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailProduct'>;

const DetailProductScreen = () => {
  const navigation = useNavigation<DetailProductNavigationProp>();
  const route = useRoute();
  const { product } = route.params as { product: { name: string; price: string; image: any; description?: string } };
  const [isFavorite, setIsFavorite] = useState(false);

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
            source={require('../assets/images/tomate.png')} 
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
          <Text style={styles.productName}>Cageot De Tomates</Text>
          <Text style={styles.productPrice}>3000 FCFA</Text>
          
          {/* Caractéristiques du produit */}
          <View style={styles.characteristicsSection}>
            <Text style={styles.sectionTitle}>Caractéristiques Du Produits</Text>
            
            <View style={styles.characteristicRow}>
              <Text style={styles.characteristicLabel}>Poids Approximatif :</Text>
              <Text style={styles.characteristicValue}>3 Kg</Text>
            </View>
            
            <View style={styles.characteristicRow}>
              <Text style={styles.characteristicLabel}>Disponibilité :</Text>
              <Text style={[styles.characteristicValue, styles.inStock]}>In Stock</Text>
            </View>
            
            <View style={styles.characteristicRow}>
              <Text style={styles.characteristicLabel}>Qualité :</Text>
              <Text style={styles.characteristicValue}>Agriculture Raisonnée Sans Pesticides De Synthèse</Text>
            </View>
          </View>

          {/* Détails du produit */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Détails Du Produit</Text>
            <Text style={styles.detailsText}>
              • Variété : Cœur De Bœuf Ancienne{'\n'}
              • Couleur De Goûts : Riche Et Dense D'exception Goûtez-À Goûte Pour Préserver L'Eau{'\n'}
              • Naturellement à Une Production Odbo
            </Text>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              Nous Avons Le Goût Authentique De Leïla Avec Nos Tomates. Cœur D'Artiste ! Cultivées En Plein Champ Sous Le Soleil Délicieux, Nos Tomates Sont Parfaites Pour Transformer Vos Plats En Délices. Elle Nous Offre Intense Pour Parfumer Une Saveur Incomparable.{'\n'}
              
              Voici Ce Que Nous Vous Recommandons En Général : La Bonne Nouvelle, C'est Qu'avec Ces Variétés, Les Saveurs Sont Subtiles Et Savoureuses, Des Spécialités Dans Nos Jardins.{'\n'}
              
              Les Goûts Naturels Et Variés Sont Un Super Atout Pour Simplement À Croquer Avec Une Pincée De Thé Des Tomates En Améliorer Ce Cageot, Vous Vous Offrez La Générosité Du Vitamines Et D'antioxydants Avec Agriculture Respectueuse Du (0) Du Km.
            </Text>
          </View>

          {/* Informations vendeur */}
          <View style={styles.sellerSection}>
            <Text style={styles.sellerTitle}>Vendu Par :</Text>
            <Text style={styles.sellerName}>Ka Ferme De Sow</Text>
            
            <Text style={styles.productionTitle}>Production :</Text>
            <Text style={styles.productionLocation}>Jean Et Sylvie Martin</Text>
            
            {/* Étoiles de notation */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Note Du Vendeur :</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    color="#FFD700"
                    fill="#FFD700"
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => Alert.alert('Ajouté au panier !')}>
            <Text style={styles.addToCartText}>Ajouter au panier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={() => Alert.alert('Commander')}>
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
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
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
    marginBottom: 32,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffffff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailProductScreen;