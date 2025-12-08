import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingInitialNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingInitialScreen'>;

const { width, height } = Dimensions.get('window');

/**
 * Premier écran d'onboarding
 * Permet de choisir entre s'inscrire ou se connecter
 */
const OnboardingInitialScreen = () => {
  const navigation = useNavigation<OnboardingInitialNavigationProp>();

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/person1.jpg')}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Découvrir →</Text>
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.mainContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeText}>BIENVENUE SUR</Text>
              <View style={styles.logoContainer}>
                <Text style={styles.terrabiaText}>Terrabia!</Text>
                <Image source={require('../../assets/images/logo_sans_fond.png')} style={styles.logo} />
              </View>
            </View>

            <Text style={styles.descriptionText}>
              Connectez-vous directement aux producteurs locaux. Mangez frais, de saison, et de qualité, livré près
              de chez vous.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                <Text style={styles.signupButtonText}>S'inscrire</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
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
    height: height * 0.5,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  skipButton: {
    padding: 10,
    backgroundColor: 'rgba(123, 116, 116, 0.4)',
    borderRadius: 5,
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
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333',
    letterSpacing: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  terrabiaText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F48C06',
  },
  logo: {
    width: 70,
    height: 70,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#555',
    marginHorizontal: 30,
    lineHeight: 22,
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  signupButton: {
    backgroundColor: '#F48C06',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F48C06',
  },
  loginButtonText: {
    color: '#F48C06',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingInitialScreen;
