import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding3'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const OnboardingScreen3 = () => {
    const navigation = useNavigation<OnboardingNavigationProp>();
    const rootNavigation = useNavigation<RootNavigationProp>();
  
    // Fonction pour naviguer vers la page 4 de l'onboarding
    const handleNextPress = () => {
      navigation.navigate('Onboarding4');
    };
  
    // Fonction pour revenir à la page 2 de l'onboarding
    const handlePreviousPress = () => {
      navigation.navigate('Onboarding2');
    };
  
    // Fonction pour passer l'onboarding et aller à l'écran principal
    const handleSkipPress = () => {
      rootNavigation.navigate('MainTabs');
    };
    
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" translucent={false}  />
      <ImageBackground
        source={require('../../assets/images/perso3.jpg')}
        style={styles.imageBackground}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={handlePreviousPress}>
            <Text style={styles.headerButtonText}>← précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSkipPress}>
            <Text style={styles.headerButtonText}>passer →</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.mainContent}>
            <Image
              source={require('../../assets/images/logo2.png')}
              style={styles.icon}
            />
            <Text style={styles.titleText}>Commandez en toute simplicité</Text>
            <Text style={styles.descriptionText}>
              Recherchez, réservez ou achetez immédiatement vos produits. Suivez l'avancement de votre commande en temps réel, de la ferme jusqu'à votre porte.
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.paginationContainer}>
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
              <View style={[styles.paginationDot, styles.activeDot]} />
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
    height: height * 0.55,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButtonText: {
    padding: 10,
    color: 'white',
    backgroundColor: 'rgba(60, 57, 57, 0.4)',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 16,
    paddingHorizontal: 16,
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
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    tintColor: '#F48C06',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 35,
  },
  descriptionText: {
    textAlign: 'justify',
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
    marginStart: 48,
    marginEnd: 48,
    marginVertical: 24,
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
    borderRadius: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen3;