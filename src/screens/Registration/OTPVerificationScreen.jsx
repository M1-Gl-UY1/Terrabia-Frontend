import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  Alert,
  KeyboardAvoidingView, // <-- 1. IMPORTER
  Platform, // <-- 2. IMPORTER
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

// ... (le reste de vos constantes et de votre logique reste identique)
const OTP_LENGTH = 4;

export default function OTPVerificationScreen({ navigation, route }) {
  // ... (toute votre logique useState, useEffect, handlers... est correcte)
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Timer pour le renvoi du code
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChangeText = (text, index) => {
    // N'accepter que les chiffres
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Passer au champ suivant si un chiffre est saisi
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
   // Revenir au champ précédent si backspace est pressé sur un champ vide
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== OTP_LENGTH) {
      Alert.alert('Erreur', `Veuillez entrer le code à ${OTP_LENGTH} chiffres`);
      return;
    }

    setIsVerifying(true);
    Keyboard.dismiss();

    // Simulation de la vérification (remplacer par votre API)
    setTimeout(() => {
      setIsVerifying(false);
      // Afficher l'écran de succès
      navigation.navigate('VerificationSuccess');
    }, 1500);
  };

  const handleResendCode = () => {
    if (!canResend) return;

    // Logique de renvoi du code
    setTimer(60);
    setCanResend(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    
    Alert.alert('Code renvoyé', 'Un nouveau code a été envoyé à votre téléphone');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#F27A22" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* --- 3. AJOUTER LE KEYBOARDAVOIDINGVIEW --- */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          
          {/* --- 4. CRÉER LE GROUPE DU HAUT --- */}
          <View>
            {/* Title */}
            <Text style={styles.title}>Saisissez le votre{'\n'}code de confirmation</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Un code à {OTP_LENGTH} chiffres a été envoyé au{'\n'}
              <Text style={styles.phoneNumber}>{route?.params?.phoneNumber || '+237 XXX XXX XXX'}</Text>
            </Text>

            {/* OTP Input Boxes */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChangeText(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={styles.timerText}>
                  Renvoyer le code dans <Text style={styles.timerHighlight}>{formatTime(timer)}</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendCode} activeOpacity={0.7}>
                  <Text style={styles.resendButton}>Renvoyer le code</Text>
                </TouchableOpacity>
              )}
            </View>
          </View> 
          {/* --- FIN DU GROUPE DU HAUT --- */}


          {/* --- 5. CRÉER LE GROUPE DU BAS --- */}
          <View>
            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
              onPress={handleVerify}
              activeOpacity={0.8}
              disabled={isVerifying}
            >
              <Text style={styles.verifyButtonText}>
                {isVerifying ? 'Vérification...' : 'Vérifier'}
              </Text>
            </TouchableOpacity>

            {/* Help Text */}
            <Text style={styles.helpText}>
              Vous n'avez pas reçu le code ?{'\n'}
              Vérifiez votre numéro ou contactez le support
            </Text>
          </View>
          {/* --- FIN DU GROUPE DU BAS --- */}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // --- 6. AJOUTER LE STYLE POUR KEYBOARDAVOIDINGVIEW ---
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    // Ce style va maintenant pousser le "groupe haut" en haut
    // et le "groupe bas" en bas.
    justifyContent: 'space-between', 
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 22,
  },
  phoneNumber: {
    color: '#F27A22',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  otpInput: {
    width: 64,
    height: 64,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#F27A22',
    backgroundColor: '#FFF7ED',
  },
  resendContainer: {
    alignItems: 'center',
    // J'ai enlevé la marge en bas ici, car elle n'est plus nécessaire
    // pour espacer les groupes.
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timerHighlight: {
    color: '#F27A22',
    fontWeight: '600',
  },
  resendButton: {
    fontSize: 14,
    color: '#F27A22',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: '#F27A22',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#F27A22',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 48, 
  },
});