import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {

  const navigation = useNavigation<OnboardingNavigationProp>();
  const rootNavigation = useNavigation<RootNavigationProp>();

  // Fonction pour naviguer vers la page 2 de l'onboarding
  const handleNextPress = () => {
    navigation.navigate('Onboarding2');
  };

  // Fonction pour passer l'onboarding et aller à l'écran principal
  const handleSkipPress = () => {
    rootNavigation.navigate('Onboarding4');
  };
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/person1.jpg')}
        style={styles.imageBackground}
      >
        <TouchableOpacity style={styles.skipButton} onPress={handleSkipPress}>
          <Text style={styles.skipButtonText}>passer →</Text>
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.mainContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeText}>BIENVENU SUR</Text>
              <View style={styles.logoContainer}>
                <Text style={styles.komBText}>KOM-B!</Text>
                <Image source={require('../../assets/images/logo_sans_fond.png')} style={styles.logo} />
              </View>
            </View>
            
            <Text style={styles.descriptionText}>
              Accédez Directement Aux Récoltes De Nos Producteurs Locaux. Mangez Des Produits Frais, De Saison, Et De Qualité, Livrés Près De Chez Vous.
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.paginationContainer}>
              <View style={[styles.paginationDot, styles.activeDot]} />
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    width: width,
    height: height * 0.58,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 20,
    resizeMode: 'center',
    position : "relative",
    opacity: 3,
    
  },
  skipButton: {
    padding: 10,
    backgroundColor: 'rgba(123, 116, 116, 0.4)',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -60,
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    letterSpacing: 1,
    position : "relative",
    right : 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    
  },
  komBText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F48C06',
  },
  logo: {
    width: 70,
    height: 70,
    marginLeft: 1,
    resizeMode: 'contain',
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 14,
    color: '#555',
    marginStart: 48,
    marginEnd: 48,
    lineHeight: 18,
    marginVertical: 20,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#F48C06',
    width: 25,
  },
  nextButton: {
    backgroundColor: '#F48C06',
    paddingVertical: 12,
    paddingHorizontal: 100,
    alignItems : 'center',
    borderRadius: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;