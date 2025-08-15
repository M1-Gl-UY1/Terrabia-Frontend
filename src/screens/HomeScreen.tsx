import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';
import { Search, Bell } from 'lucide-react-native';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  

  return (
    <TabNavigatorWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Hero Section / Banner */}
          <View style={styles.heroSection}>
            
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>De la plantation à votre table, en toute simplicité</Text>
              <Text style={styles.heroSubtitle}>Commandez maintenant {'>'}</Text>
            </View>
          </View>

          {/* Section "Offre du jour" */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offre du jour</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {/* Carte de produit (exemple) */}
              <View style={styles.productCard}>
                <Image source={require('../assets/images/manioc.png')} style={styles.productImage} />
                <Text style={styles.productName}>tige de tomates</Text>
                <Text style={styles.productPrice}>3000 FCFA</Text>
              </View>
              <View style={styles.productCard}>
                <Image source={require('../assets/images/manioc.png')} style={styles.productImage} />
                <Text style={styles.productName}>tige de tomates</Text>
                <Text style={styles.productPrice}>2500 FCFA</Text>
              </View>
              <View style={styles.productCard}>
                <Image source={require('../assets/images/manioc.png')} style={styles.productImage} />
                <Text style={styles.productName}>tige de tomates</Text>
                <Text style={styles.productPrice}>2500 FCFA</Text>
              </View>
            </ScrollView>
          </View>

          {/* Section "Recommandé pour vous" */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommandé pour vous</Text>
            <View style={styles.recommendedGrid}>
              <View style={styles.recommendedCard}>
                <Image source={require('../assets/images/noix.png')} style={styles.recommendedImage} />
                <Text style={styles.recommendedName}>Macabots</Text>
                <Text style={styles.recommendedPrice}>2700 FCFA <Text style={styles.oldPrice}>3000 FCFA</Text></Text>
                <Text style={styles.ordersText}>23 Commandes</Text>
              </View>
              <View style={styles.recommendedCard}>
                <Image source={require('../assets/images/pomme.png')} style={styles.recommendedImage} />
                <Text style={styles.recommendedName}>Pommes</Text>
                <Text style={styles.recommendedPrice}>2700 FCFA</Text>
                <Text style={styles.ordersText}>23 Commandes</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </TabNavigatorWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop : 31,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 21,
    backgroundColor: '#EBEBEB',
    borderRadius: 100,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 0,
    height: 50,
  },

  searchIcon: {
    width: 20,
    height: 20,
    margin: 0,
    padding : 0,

  },
  searchPlaceholder: {
    flex: 1, 
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationButton: {
    padding: 5,
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: '#999',
  },
  heroSection: {
    marginHorizontal: 0,
    borderRadius: 0,
    overflow: 'hidden',
    height: 180,
    marginBottom: 20,
    position: 'relative',
    backgroundColor : '#FFCB69'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroTextContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '60%',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  horizontalScroll: {
    // Styles pour la vue ScrollView horizontale
  },
  productCard: {
    width: 150,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    alignItems: 'center',
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F48C06',
    marginTop: 5,
  },
  recommendedGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendedCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  recommendedImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  recommendedName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  recommendedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  oldPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ordersText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});

export default HomeScreen;