import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
          <TouchableOpacity style={styles.headerButton} onPress={handlePreviousPress}>
            <Text style={styles.headerButtonText}>← précédent</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.contentWrapper}>
          <Image
            source={require('../../assets/images/logo4.png')}
            style={styles.icon}
          />
          
          <Text style={styles.titleText}>Prêt à goûter la différence ?</Text>

          <Text style={styles.descriptionText}>
          découvrez les trésors de nos régions et commencer votre première commande.  
          </Text>

          <View style={styles.paginationContainer}>
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
            <View style={[styles.paginationDot, styles.activeDot]} />
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinishPress}>
            <Text style={styles.finishButtonText}>Commencer l'aventure</Text>
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
    height: height * 0.52,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerButton: {
    padding: 10,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 0.6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
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
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width : 190,
    textAlign : 'center',
  },
});

export default OnboardingScreen4;
