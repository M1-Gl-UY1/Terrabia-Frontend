import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { CheckCircle, Home, FileText } from 'lucide-react-native';
import { useAppDispatch } from '../store/types';
import { clearCart } from '../store/cartSlice';

type PaymentSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PaymentSuccess'>;

const PaymentSuccessScreen = () => {
  const navigation = useNavigation<PaymentSuccessNavigationProp>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { amount, paymentMethod, phoneNumber, orderId } = route.params as {
    amount: number;
    paymentMethod: 'orange' | 'momo' | 'card';
    phoneNumber?: string;
    orderId: number;
  };

  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    // Vider le panier après paiement réussi
    dispatch(clearCart());

    // Animation d'entrée
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            state: {
              routes: [
                { name: 'Home' },
                { name: 'Categories' },
                { name: 'Cart' },
                { name: 'Profile' },
              ],
              index: 0,
            },
          },
        ],
      })
    );
  };

  const handleViewOrder = () => {
    // Naviguer vers l'écran de détails de commande
    navigation.navigate('OrderDetails', { orderId });
  };

  const paymentMethodName = 
    paymentMethod === 'orange' ? 'Orange Money' :
    paymentMethod === 'momo' ? 'Mobile Money' :
    'Carte Bancaire';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Icône de succès animée */}
          <Animated.View
            style={[
              styles.successIconContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <CheckCircle size={80} color="#22C55E" strokeWidth={2} />
          </Animated.View>

          {/* Titre */}
          <Text style={styles.title}>Paiement réussi !</Text>

          {/* Message */}
          <Text style={styles.message}>
            Votre commande a été confirmée avec succès
          </Text>

          {/* Détails de la transaction */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Numéro de commande</Text>
              <Text style={styles.detailValue}>{orderId}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Montant payé</Text>
              <Text style={styles.detailValueBold}>{amount} CFA</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mode de paiement</Text>
              <Text style={styles.detailValue}>{paymentMethodName}</Text>
            </View>
            
            {phoneNumber && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Numéro</Text>
                  <Text style={styles.detailValue}>{phoneNumber}</Text>
                </View>
              </>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date().toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {/* Message de confirmation */}
          <View style={styles.confirmationMessage}>
            <Text style={styles.confirmationText}>
              ✉️ Un reçu a été envoyé sur votre téléphone
            </Text>
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleViewOrder}
          >
            <FileText size={20} color="#FF6B35" />
            <Text style={styles.secondaryButtonText}>Voir la commande</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleGoHome}
          >
            <Home size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 24,
    justifyContent: 'center',
  },
  successIconContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  confirmationMessage: {
    backgroundColor: '#FFF7F0',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  confirmationText: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentSuccessScreen;