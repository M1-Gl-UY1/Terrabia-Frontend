import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ArrowLeft, Phone, Shield, CheckCircle } from 'lucide-react-native';
import { orderService } from '../services/OrderService';
import { ModePaiement } from '../types/Backend';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';

type MobileMoneyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MobileMoneyPayment'>;

const MobileMoneyPaymentScreen = () => {
  const navigation = useNavigation<MobileMoneyNavigationProp>();
  const route = useRoute();
  const { amount, paymentMethod, orderId } = route.params as {
    amount: number;
    paymentMethod: 'orange' | 'momo';
    orderId: number;
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const isOrange = paymentMethod === 'orange';
  const paymentTitle = isOrange ? 'Orange Money' : 'MTN Mobile Money';
  const paymentColor = isOrange ? '#FF6600' : '#FFCC00';
  const paymentBgColor = isOrange ? '#FFF5EE' : '#FFFBEB';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handlePayment = async () => {
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    if (cleanNumber.length < 9) {
      showError('Veuillez entrer un numéro de téléphone valide', 3000);
      return;
    }

    setIsProcessing(true);

    try {
      const paymentData = {
        commandeId: orderId,
        modePaiement: isOrange ? ModePaiement.ORANGE_MONEY : ModePaiement.MTN_MOMO,
        devise: 'XAF',
        numeroTelephone: `237${cleanNumber}`,
      };

      const response = await orderService.payOrder(paymentData);

      if (response.success && response.data) {
        // Navigate to processing screen
        navigation.navigate('PaymentProcessing', {
          amount,
          paymentMethod,
          phoneNumber: `+237 ${phoneNumber}`,
          orderId,
        });
      } else {
        showError(response.error || 'Erreur lors du paiement', 3000);
      }
    } catch (error) {
      showError('Une erreur est survenue lors du paiement', 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 9);

    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 5) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 3)} ${limited.slice(3, 5)} ${limited.slice(5)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 5)} ${limited.slice(5, 7)} ${limited.slice(7)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
  const isValid = cleanPhoneNumber.length === 9;

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
          <Text style={styles.headerTitle}>{paymentTitle}</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Payment Method Card */}
          <View style={[styles.paymentCard, { backgroundColor: paymentBgColor }]}>
            <View style={[styles.paymentIconContainer, { backgroundColor: paymentColor }]}>
              <Text style={styles.paymentEmoji}>{isOrange ? '🟠' : '🟡'}</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>{paymentTitle}</Text>
              <Text style={styles.paymentDescription}>Paiement mobile sécurisé</Text>
            </View>
          </View>

          {/* Amount Display */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Montant à payer</Text>
            <Text style={[styles.amountValue, { color: paymentColor }]}>{formatPrice(amount)}</Text>
            <Text style={styles.orderIdText}>Commande #{orderId}</Text>
          </View>

          {/* Phone Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Numéro de téléphone</Text>
            <View style={[styles.phoneInputContainer, isValid && styles.phoneInputValid]}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.countryFlag}>🇨🇲</Text>
                <Text style={styles.countryCode}>+237</Text>
              </View>
              <View style={styles.divider} />
              <TextInput
                style={styles.phoneInput}
                placeholder="6XX XX XX XX"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={12}
              />
              {isValid && (
                <CheckCircle size={20} color="#10B981" />
              )}
            </View>
            <Text style={styles.inputHint}>
              Entrez le numéro associé à votre compte {paymentTitle}
            </Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Comment ça marche ?</Text>
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: paymentColor }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>Confirmez votre numéro de téléphone</Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: paymentColor }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>Vous recevrez une notification de paiement</Text>
            </View>
            <View style={styles.instructionStep}>
              <View style={[styles.stepNumber, { backgroundColor: paymentColor }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>Entrez votre code PIN pour valider</Text>
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Shield size={16} color="#6B7280" />
            <Text style={styles.securityText}>
              Transaction sécurisée et cryptée
            </Text>
          </View>
        </ScrollView>

        {/* Footer with Pay Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.payButton,
              { backgroundColor: paymentColor },
              !isValid && styles.payButtonDisabled,
            ]}
            onPress={handlePayment}
            disabled={!isValid || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Phone size={20} color={isOrange ? '#FFFFFF' : '#1F2937'} />
                <Text style={[styles.payButtonText, !isOrange && { color: '#1F2937' }]}>
                  Payer {formatPrice(amount)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onDismiss={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerSpace: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  paymentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentEmoji: {
    fontSize: 28,
  },
  paymentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  orderIdText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
    height: 56,
  },
  phoneInputValid: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryFlag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
    letterSpacing: 1,
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  instructionsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 13,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default MobileMoneyPaymentScreen;
