import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding4'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const OnboardingScreen4 = () => {
    const navigation = useNavigation<OnboardingNavigationProp>();
    const rootNavigation = useNavigation<RootNavigationProp>();
  
    // Fonction pour revenir à la page 3 de l'onboarding
    const handlePreviousPress = () => {
      navigation.navigate('Onboarding3');
    };
  
    // Fonction pour terminer l'onboarding et aller à l'écran principal
    const handleFinishPress = () => {
      rootNavigation.navigate('MainTabs');
    };
    
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/perso4.png')}
        style={styles.imageBackground}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={handlePreviousPress}>
            <Text style={styles.headerButtonText}>← précédent</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.mainContent}>
            <Image
              source={require('../../assets/images/logo4.png')}
              style={styles.icon}
            />
            <Text style={styles.titleText}>Prêt à goûter la différence ?</Text>
            <Text style={styles.descriptionText}>
              Découvrez les trésors de nos régions et commencez votre première commande.
            </Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.paginationContainer}>
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
              <View style={styles.paginationDot} />
              <View style={[styles.paginationDot, styles.activeDot]} />
            </View>
            <TouchableOpacity style={styles.finishButton} onPress={handleFinishPress}>
              <Text style={styles.finishButtonText}>Commencer l'aventure</Text>
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
    justifyContent: 'flex-start',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'rgba(60, 57, 57, 0.4)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
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
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    tintColor: '#F48C06',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 35,
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
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
  finishButton: {
    backgroundColor: '#F48C06',
    paddingVertical: 16,
    width: '100%',  
    alignItems: 'center',
    borderRadius: 30,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen4;