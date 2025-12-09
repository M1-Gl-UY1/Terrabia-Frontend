import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ShoppingBag, Tractor } from 'lucide-react-native';

type UserTypeSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserTypeSelection'>;

const { width } = Dimensions.get('window');

/**
 * Écran de sélection du type d'utilisateur
 * Permet de choisir entre Acheteur et Producteur
 */
const UserTypeSelectionScreen = () => {
  const navigation = useNavigation<UserTypeSelectionNavigationProp>();

  const handleBuyerSelect = () => {
    navigation.navigate('Login');
  };

  const handleProducerSelect = () => {
    navigation.navigate('ProducerLogin');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.terrabiaText}>Terrabia</Text>
            <Image
              source={require('../../assets/images/logo_sans_fond.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>Qui êtes-vous ?</Text>
          <Text style={styles.subtitle}>
            Choisissez votre profil pour une expérience personnalisée
          </Text>
        </View>

        {/* Options de sélection */}
        <View style={styles.optionsContainer}>
          {/* Option Acheteur */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleBuyerSelect}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <ShoppingBag size={48} color="#F48C06" strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Je suis Acheteur</Text>
            <Text style={styles.optionDescription}>
              Découvrez des produits frais directement des producteurs locaux
            </Text>
            <View style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Continuer</Text>
            </View>
          </TouchableOpacity>

          {/* Option Producteur */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleProducerSelect}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, styles.iconContainerProducer]}>
              <Tractor size={48} color="#2E7D32" strokeWidth={1.5} />
            </View>
            <Text style={styles.optionTitle}>Je suis Producteur</Text>
            <Text style={styles.optionDescription}>
              Vendez vos produits agricoles et atteignez plus de clients
            </Text>
            <View style={[styles.optionButton, styles.optionButtonProducer]}>
              <Text style={[styles.optionButtonText, styles.optionButtonTextProducer]}>Continuer</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  terrabiaText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F48C06',
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainerProducer: {
    backgroundColor: '#E8F5E9',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  optionButton: {
    backgroundColor: '#F48C06',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  optionButtonProducer: {
    backgroundColor: '#2E7D32',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButtonTextProducer: {
    color: '#fff',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default UserTypeSelectionScreen;
