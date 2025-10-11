import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ArrowLeft } from 'lucide-react-native';

type MobileMoneyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MobileMoneyPayment'>;

const MobileMoneyPaymentScreen = () => {
  const navigation = useNavigation<MobileMoneyNavigationProp>();
  const route = useRoute();
  const { amount, paymentMethod } = route.params as { amount: number; paymentMethod: 'orange' | 'momo' };
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentTitle = paymentMethod === 'orange' ? 'Orange Money' : 'Mobile Money';
  const paymentColor = paymentMethod === 'orange' ? '#FF6600' : '#FFCB05';

  const handlePayment = async () => {
    if (phoneNumber.length < 9) {
      Alert.alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setIsProcessing(true);

    // Simuler un appel API
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('PaymentProcessing', {
        amount,
        paymentMethod,
        phoneNumber,
      });
    }, 1500);
  };

  const formatPhoneNumber = (text: string) => {
    // Supprimer tous les caractères non-numériques
    const cleaned = text.replace(/\D/g, '');
    
    // Limiter à 9 chiffres
    const limited = cleaned.slice(0, 9);
    
    // Formater le numéro
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 5) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 5)} ${limited.slice(5)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paiement {paymentTitle}</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Icône de paiement */}
          <View style={[styles.paymentIcon, { backgroundColor: paymentColor }]}>
            <Text style={styles.paymentIconText}>
              {paymentMethod === 'orange' ? '🟠' : '💳'}
            </Text>
          </View>

          {/* Montant */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Montant à payer</Text>
            <Text style={styles.amountValue}>{amount} CFA</Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>
              1. Entrez votre numéro de téléphone {paymentTitle}{'\n'}
              2. Vous recevrez une notification sur votre téléphone{'\n'}
              3. Validez le paiement en entrant votre code PIN{'\n'}
              4. Attendez la confirmation
            </Text>
          </View>

          {/* Champ numéro de téléphone */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Numéro de téléphone</Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+237</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="6XX XX XX XX"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={11} // 9 chiffres + 2 espaces
              />
            </View>
            <Text style={styles.inputHint}>
              Format: 6XX XX XX XX
            </Text>
          </View>

          {/* Bouton de paiement */}
          <TouchableOpacity
            style={[
              styles.payButton,
              (!phoneNumber || phoneNumber.replace(/\s/g, '').length < 9) && styles.payButtonDisabled
            ]}
            onPress={handlePayment}
            disabled={!phoneNumber || phoneNumber.replace(/\s/g, '').length < 9 || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.payButtonText}>
                Payer {amount} CFA
              </Text>
            )}
          </TouchableOpacity>

          {/* Note de sécurité */}
          <View style={styles.securityNote}>
            <Text style={styles.securityNoteText}>
              🔒 Paiement sécurisé. Vos informations sont protégées.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 8,
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
    padding: 24,
  },
  paymentIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  paymentIconText: {
    fontSize: 40,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  instructionsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  payButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    alignItems: 'center',
  },
  securityNoteText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default MobileMoneyPaymentScreen;