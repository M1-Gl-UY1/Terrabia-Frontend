import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppDispatch } from '../store/types';
import { checkAuthStatus } from '../store/authSlice';
import logger from '../utils/logger';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Écran de démarrage qui vérifie l'état de connexion de l'utilisateur
 * Redirige vers OnboardingInitialScreen si non connecté, ou MainTabs si connecté
 */
const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      logger.info('🚀 Vérification de l\'état d\'authentification');

      // Vérifier si l'utilisateur est connecté
      const result = await dispatch(checkAuthStatus()).unwrap();

      if (result.token) {
        // Utilisateur connecté, rediriger vers l'application principale
        logger.success('✅ Utilisateur connecté, redirection vers MainTabs');
        setTimeout(() => {
          navigation.replace('MainTabs');
        }, 1500);
      } else {
        // Utilisateur non connecté, rediriger vers l'onboarding
        logger.info('ℹ️ Utilisateur non connecté, redirection vers Onboarding');
        setTimeout(() => {
          navigation.replace('OnboardingInitialScreen');
        }, 1500);
      }
    } catch (error) {
      // En cas d'erreur, rediriger vers l'onboarding
      logger.error('❌ Erreur lors de la vérification, redirection vers Onboarding', error);
      setTimeout(() => {
        navigation.replace('OnboardingInitialScreen');
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../assets/images/logo_sans_fond.png')} style={styles.logo} />
        <Text style={styles.title}>Terrabia</Text>
        <Text style={styles.subtitle}>Produits frais, directement du producteur</Text>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#F48C06" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#F48C06',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#999',
  },
});

export default SplashScreen;
