import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type PaymentProcessingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PaymentProcessing'>;

const PaymentProcessingScreen = () => {
  const navigation = useNavigation<PaymentProcessingNavigationProp>();
  const route = useRoute();
  const { amount, paymentMethod, phoneNumber } = route.params as {
    amount: number;
    paymentMethod: 'orange' | 'momo';
    phoneNumber: string;
  };

  const [progress, setProgress] = useState(0);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animation de pulsation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simuler la progression du paiement
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Naviguer vers l'écran de succès après 500ms
          setTimeout(() => {
            navigation.replace('PaymentSuccess', {
              amount,
              paymentMethod,
              phoneNumber,
              orderId: `ORD-${Date.now()}`,
            });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const paymentTitle = paymentMethod === 'orange' ? 'Orange Money' : 'Mobile Money';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icône animée */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={styles.icon}>
            {paymentMethod === 'orange' ? '🟠' : '💳'}
          </Text>
        </Animated.View>

        {/* Spinner */}
        <ActivityIndicator size="large" color="#FF6B35" style={styles.spinner} />

        {/* Titre */}
        <Text style={styles.title}>Traitement en cours...</Text>

        {/* Message */}
        <Text style={styles.message}>
          Veuillez vérifier votre téléphone{'\n'}
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </Text>

        <Text style={styles.instruction}>
          Entrez votre code PIN {paymentTitle} pour confirmer le paiement de{' '}
          <Text style={styles.amount}>{amount} CFA</Text>
        </Text>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          ⏱️ Cette opération peut prendre quelques secondes
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF7F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 50,
  },
  spinner: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  phoneNumber: {
    fontWeight: '600',
    color: '#1F2937',
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  amount: {
    fontWeight: '700',
    color: '#FF6B35',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  note: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default PaymentProcessingScreen;