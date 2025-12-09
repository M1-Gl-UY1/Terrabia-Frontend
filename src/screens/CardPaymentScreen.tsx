import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ArrowLeft, CreditCard, Lock, Calendar, User } from 'lucide-react-native';
import { orderService } from '../services/OrderService';
import { ModePaiement } from '../types/Backend';

type CardPaymentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CardPayment'>;

const CardPaymentScreen = () => {
  const navigation = useNavigation<CardPaymentNavigationProp>();
  const route = useRoute();
  const { amount, orderId } = route.params as { amount: number; orderId: number };

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateCard = () => {
    const newErrors: {[key: string]: string} = {};

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber || cleanCardNumber.length < 16) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }

    if (!expiryDate || expiryDate.length < 5) {
      newErrors.expiryDate = 'Date invalide';
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (parseInt(month) > 12 || parseInt(month) < 1) {
        newErrors.expiryDate = 'Mois invalide';
      } else if (parseInt(year) < currentYear ||
                 (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Carte expirée';
      }
    }

    if (!cvv || cvv.length < 3) {
      newErrors.cvv = 'CVV invalide';
    }

    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Nom du titulaire requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateCard()) {
      return;
    }

    setIsLoading(true);
    try {
      const paymentData = {
        commandeId: orderId,
        modePaiement: ModePaiement.CARTE_BANCAIRE,
        devise: 'XAF',
      };

      const response = await orderService.payOrder(paymentData);

      if (response.success) {
        navigation.replace('PaymentSuccess', {
          amount,
          paymentMethod: 'card',
          orderId,
        });
      } else {
        Alert.alert(
          'Erreur de paiement',
          response.error || 'Le paiement a échoué. Veuillez réessayer.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors du paiement. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getCardType = () => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5')) return 'Mastercard';
    if (cleanNumber.startsWith('37') || cleanNumber.startsWith('34')) return 'American Express';
    return '';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paiement par Carte</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Preview */}
          <View style={styles.cardPreview}>
            <View style={styles.cardGradient}>
              <View style={styles.cardChip} />
              <Text style={styles.cardNumberPreview}>
                {cardNumber || '**** **** **** ****'}
              </Text>
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardLabel}>TITULAIRE</Text>
                  <Text style={styles.cardValue}>
                    {cardHolder.toUpperCase() || 'NOM DU TITULAIRE'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRE</Text>
                  <Text style={styles.cardValue}>{expiryDate || 'MM/AA'}</Text>
                </View>
              </View>
              {getCardType() && (
                <Text style={styles.cardType}>{getCardType()}</Text>
              )}
            </View>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Montant à payer</Text>
            <Text style={styles.amountValue}>{formatPrice(amount)}</Text>
          </View>

          {/* Card Form */}
          <View style={styles.formContainer}>
            {/* Card Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de carte</Text>
              <View style={[styles.inputWrapper, errors.cardNumber && styles.inputError]}>
                <CreditCard size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#9CA3AF"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
              {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            </View>

            {/* Card Holder */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom du titulaire</Text>
              <View style={[styles.inputWrapper, errors.cardHolder && styles.inputError]}>
                <User size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="JEAN DUPONT"
                  placeholderTextColor="#9CA3AF"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  autoCapitalize="characters"
                />
              </View>
              {errors.cardHolder && <Text style={styles.errorText}>{errors.cardHolder}</Text>}
            </View>

            {/* Expiry and CVV */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Date d'expiration</Text>
                <View style={[styles.inputWrapper, errors.expiryDate && styles.inputError]}>
                  <Calendar size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    placeholderTextColor="#9CA3AF"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={[styles.inputWrapper, errors.cvv && styles.inputError]}>
                  <Lock size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#9CA3AF"
                    value={cvv}
                    onChangeText={(text) => setCvv(text.replace(/\D/g, '').substring(0, 4))}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
                {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
              </View>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Lock size={16} color="#6B7280" />
            <Text style={styles.securityText}>
              Vos informations sont sécurisées par un cryptage SSL 256 bits
            </Text>
          </View>
        </ScrollView>

        {/* Pay Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payButton, isLoading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Lock size={20} color="#FFFFFF" />
                <Text style={styles.payButtonText}>
                  Payer {formatPrice(amount)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  cardPreview: {
    marginBottom: 20,
  },
  cardGradient: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
    position: 'relative',
  },
  cardChip: {
    width: 40,
    height: 30,
    backgroundColor: '#D4AF37',
    borderRadius: 4,
    marginBottom: 30,
  },
  cardNumberPreview: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardType: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  amountContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F48C06',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  securityText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    backgroundColor: '#F48C06',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CardPaymentScreen;
