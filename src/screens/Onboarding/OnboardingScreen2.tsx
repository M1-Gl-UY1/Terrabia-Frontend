import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding2'>;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const OnboardingScreen2 = () => {

    const navigation = useNavigation<OnboardingNavigationProp>();
    const rootNavigation = useNavigation<RootNavigationProp>();
  
    // Fonction pour naviguer vers la page 3 de l'onboarding
    const handleNextPress = () => {
      navigation.navigate('Onboarding3');
    };
  
    // Fonction pour revenir à la page 1 de l'onboarding
    const handlePreviousPress = () => {
      navigation.navigate('Onboarding');
    };
  
    // Fonction pour passer l'onboarding et aller à l'écran principal
    const handleSkipPress = () => {
      rootNavigation.navigate('MainTabs');
    };
    
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/person2.png')}
        style={styles.imageBackground}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handlePreviousPress}>
            <Text style={styles.headerButtonText}>← précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSkipPress}>
            <Text style={styles.headerButtonText}>passer →</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.contentWrapper}>
          <Image
            source={require('../../assets/images/logo3.png')}
            style={styles.icon}
          />
          
          <Text style={styles.titleText}>Soutenez</Text>
          <Text style={styles.titleText}>l'agriculture locale</Text>

          <Text style={styles.descriptionText}>
            Chaque Achat Sur Kom-B Aide À Réduire Les Pertes Après Récolte Et Garantit Une Juste Rémunération Pour Les Producteurs. Ensemble, Luttons Contre Le Gaspillage Alimentaire !
          </Text>

          <View style={styles.paginationContainer}>
            <View style={styles.paginationDot} />
            <View style={[styles.paginationDot, styles.activeDot]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
    padding: 20,
    
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 0.4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  icon: {
    width: 40,
    height: 40,
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
    fontSize: 14,
    color: '#555',
    lineHeight: 24,
    marginVertical: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
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
    marginBottom : 24,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen2;
