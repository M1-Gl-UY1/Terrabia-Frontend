import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { usePayment } from '../context/PaymentContext';
import { PaymentMethod, PaymentOption } from '../types/Payment';

const { height } = Dimensions.get('window');

interface PaymentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Options de paiement disponibles
const paymentOptions: PaymentOption[] = [
  {
    id: 'orange',
    name: 'Orange Money',
    icon: require('../assets/images/orange.jpg'), // À créer
  },
  {
    id: 'momo',
    name: 'Mobile Money',
    icon: require('../assets/images/mtn.jpg'), // À créer
  },
  {
    id: 'card',
    name: 'Carte Bancaire',
    icon: require('../assets/images/visa.jpg'), // À créer
  },
];

const PaymentBottomSheet: React.FC<PaymentBottomSheetProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { selectedMethod, setSelectedMethod } = usePayment();
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onConfirm();
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Titre */}
          <Text style={styles.title}>Mode de paiement</Text>

          {/* Options de paiement */}
          <View style={styles.optionsContainer}>
            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.paymentOption,
                  selectedMethod === option.id && styles.selectedPaymentOption,
                ]}
                onPress={() => handleSelectMethod(option.id)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={option.icon}
                      style={styles.paymentIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.optionName}>{option.name}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    selectedMethod === option.id && styles.radioSelected,
                  ]}
                >
                  {selectedMethod === option.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bouton de validation */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedMethod && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedMethod}
          >
            <Text style={styles.confirmButtonText}>Valider</Text>
          </TouchableOpacity>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    minHeight: 400,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentOption: {
    backgroundColor: '#FFF7F0',
    borderColor: '#FF6B35',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconText: {
    fontSize: 24,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#FF6B35',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },
  confirmButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentBottomSheet;