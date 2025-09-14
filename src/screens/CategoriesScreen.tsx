import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';

const categories = [
  'Produits agricoles',
  "Produits d'élevage",
  'Produits halieutiques',
  'Condiments et épices',
  'Produits transformés',
];

const recommended = [
  { name: 'légumes racines', image: require('../assets/images/patate.png') },
  { name: 'fruits', image: require('../assets/images/pomme.png') },
  { name: 'viandes', image: require('../assets/images/noix.png') },
  { name: 'céréales', image: require('../assets/images/manioc.png') },
  { name: 'oignons', image: require('../assets/images/patate.png') },
  { name: 'carottes', image: require('../assets/images/patate.png') },
];

const products = [
  {
    name: 'Pommes',
    price: '2700 FCFA',
    image: require('../assets/images/pomme.png'),
    orders: 25,
    badge: 'A',
    badgeColor: '#22C55E',
    indicators: ['#22C55E', '#F59E0B', '#F97316'],
  },
  {
    name: 'Manioc',
    price: '3000 FCFA',
    image: require('../assets/images/manioc.png'),
    orders: 18,
    badge: 'B',
    badgeColor: '#F59E0B',
    indicators: ['#F59E0B', '#F97316'],
  },
  // Ajoute d'autres produits ici...
];

export default function CategoriesScreen() {
  const [showProducts, setShowProducts] = useState(false);

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
                onBlur={() => setShowProducts(false)}
              />
              <Pressable style={styles.filterBtn}>
                <Text style={{fontSize:18}}>Filtre</Text>
              </Pressable>
            </View>
            <ScrollView>
              <View style={styles.productsList}>
                {products.map((p, i) => (
                  <View key={i} style={styles.productCardV2}>
                    <Image source={p.image} style={styles.productImgV2} />
                    <View style={styles.productInfoV2}>
                      <View style={{flex:1}}>
                        <Text style={styles.productNameV2}>{p.name}</Text>
                        <Text style={styles.productPriceV2}>{p.price}</Text>
                        <Text style={styles.productOrdersV2}>{p.orders} Commandes</Text>
                      </View>
                      <View style={styles.productBadgesV2}>
                        <View style={[styles.badgeV2, {backgroundColor: p.badgeColor}]}> 
                          <Text style={{color:'#fff', fontWeight:'bold'}}>{p.badge}</Text>
                        </View>
                        <View style={styles.indicatorsV2}>
                          {p.indicators.map((color, idx) => (
                            <View key={idx} style={[styles.indicatorDotV2, {backgroundColor: color}]} />
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
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
                {categories.map((cat, i) => (
                  <Pressable key={i} style={styles.sideMenuItem}>
                    <Text style={styles.sideMenuText}>{cat}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.recommendedContainer}>
                <Text style={styles.recommendedTitle}>Recommander</Text>
                <View style={styles.recommendedGrid}>
                  {recommended.map((item, i) => (
                    <View key={i} style={styles.recommendedCard}>
                      <Image source={item.image} style={styles.recommendedImg} />
                      <Text style={styles.recommendedName}>{item.name}</Text>
                    </View>
                  ))}
                </View>
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
  sideMenuText: {
    fontSize: 13,
    color: '#222',
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
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productName: {
    fontWeight: '600',
    fontSize: 15,
  },
  productPrice: {
    color: '#F27A22',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#F27A22',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  // --- V2 styles for product card with attributes ---
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
});
