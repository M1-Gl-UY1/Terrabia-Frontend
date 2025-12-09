import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import authService from '../../services/AuthService';
import { RegisterRequest, Role, Sexe } from '../../types/Backend';
import { ChevronDown, Tractor, ArrowLeft, Info } from 'lucide-react-native';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';

type ProducerSignUpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProducerSignUp'>;

interface FormErrors {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  numTel?: string;
  ville?: string;
  numeroCni?: string;
}

// Villes principales du Cameroun
const VILLES_CAMEROUN = [
  'Yaoundé',
  'Douala',
  'Garoua',
  'Bafoussam',
  'Bamenda',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Buéa',
  'Limbé',
  'Kribi',
  'Ebolowa',
];

const ProducerSignUpScreen = () => {
  const navigation = useNavigation<ProducerSignUpNavigationProp>();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    numTel: '',
    ville: '',
    sexe: Sexe.HOMME,
    numeroCni: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showVillePicker, setShowVillePicker] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de famille est obligatoire';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est obligatoire';
    } else if (formData.prenom.length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.numTel.trim()) {
      newErrors.numTel = 'Le numéro de téléphone est obligatoire';
    } else if (!/^\+?[0-9]{9,15}$/.test(formData.numTel.replace(/\s/g, ''))) {
      newErrors.numTel = 'Le numéro de téléphone n\'est pas valide';
    }

    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville/zone de production est obligatoire';
    }

    // Validation spécifique pour le producteur : CNI obligatoire
    if (!formData.numeroCni.trim()) {
      newErrors.numeroCni = 'Le numéro CNI est obligatoire pour les producteurs';
    } else if (formData.numeroCni.length < 6) {
      newErrors.numeroCni = 'Le numéro CNI doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registerData: RegisterRequest = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        numTel: formData.numTel.trim(),
        ville: formData.ville.trim(),
        sexe: formData.sexe,
        role: Role.VENDEUR, // Rôle producteur
        numeroCni: formData.numeroCni.trim(),
      };

      const response = await authService.register(registerData);

      if (response.success) {
        showSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.', 3000);

        setTimeout(() => {
          navigation.replace('ProducerLogin');
        }, 2000);
      } else {
        const errorMessage = response.error || 'Une erreur est survenue lors de l\'inscription';
        showError(errorMessage, 4000);
      }
    } catch (error: any) {
      showError('Une erreur est survenue. Veuillez réessayer.', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('ProducerLogin');
  };

  const handleGoBack = () => {
    navigation.navigate('UserTypeSelection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Bouton retour */}
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Tractor size={36} color="#2E7D32" strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Devenir Producteur</Text>
            <Text style={styles.subtitle}>Créez votre compte pour vendre vos produits</Text>
          </View>

          <View style={styles.form}>
            {/* Nom */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom de famille*</Text>
              <TextInput
                style={[styles.input, errors.nom && styles.inputError]}
                placeholder="Exemple: Nkoulou"
                placeholderTextColor="#999"
                value={formData.nom}
                onChangeText={text => updateField('nom', text)}
                autoCapitalize="words"
                editable={!isLoading}
              />
              {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
            </View>

            {/* Prénom */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Prénom*</Text>
              <TextInput
                style={[styles.input, errors.prenom && styles.inputError]}
                placeholder="Exemple: Pierre"
                placeholderTextColor="#999"
                value={formData.prenom}
                onChangeText={text => updateField('prenom', text)}
                autoCapitalize="words"
                editable={!isLoading}
              />
              {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse email*</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Exemple: pierre.nkoulou@email.com"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={text => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Téléphone */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro de téléphone*</Text>
              <TextInput
                style={[styles.input, errors.numTel && styles.inputError]}
                placeholder="Exemple: +237698765432"
                placeholderTextColor="#999"
                value={formData.numTel}
                onChangeText={text => updateField('numTel', text)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              {errors.numTel && <Text style={styles.errorText}>{errors.numTel}</Text>}
            </View>

            {/* Ville/Zone de production */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Zone de production*</Text>
              <TouchableOpacity
                style={[styles.pickerButton, errors.ville && styles.inputError]}
                onPress={() => setShowVillePicker(true)}
                disabled={isLoading}
              >
                <Text style={[styles.pickerButtonText, !formData.ville && styles.placeholderText]}>
                  {formData.ville || 'Sélectionnez votre zone'}
                </Text>
                <ChevronDown size={20} color="#999" />
              </TouchableOpacity>
              {errors.ville && <Text style={styles.errorText}>{errors.ville}</Text>}
            </View>

            {/* Numéro CNI - Obligatoire pour producteurs */}
            <View style={styles.inputContainer}>
              <View style={styles.labelWithInfo}>
                <Text style={styles.label}>Numéro CNI*</Text>
                <View style={styles.infoTag}>
                  <Info size={14} color="#2E7D32" />
                  <Text style={styles.infoText}>Obligatoire</Text>
                </View>
              </View>
              <TextInput
                style={[styles.input, errors.numeroCni && styles.inputError]}
                placeholder="Votre numéro de carte nationale d'identité"
                placeholderTextColor="#999"
                value={formData.numeroCni}
                onChangeText={text => updateField('numeroCni', text)}
                editable={!isLoading}
              />
              {errors.numeroCni && <Text style={styles.errorText}>{errors.numeroCni}</Text>}
              <Text style={styles.helperText}>
                Ce numéro est requis pour vérifier votre identité en tant que producteur
              </Text>
            </View>

            {/* Sexe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sexe*</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setFormData(prev => ({ ...prev, sexe: Sexe.HOMME }))}
                  disabled={isLoading}
                >
                  <View style={[styles.radioCircle, formData.sexe === Sexe.HOMME && styles.radioCircleSelected]}>
                    {formData.sexe === Sexe.HOMME && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Homme</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setFormData(prev => ({ ...prev, sexe: Sexe.FEMME }))}
                  disabled={isLoading}
                >
                  <View style={[styles.radioCircle, formData.sexe === Sexe.FEMME && styles.radioCircleSelected]}>
                    {formData.sexe === Sexe.FEMME && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>Femme</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe*</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Minimum 6 caractères"
                placeholderTextColor="#999"
                value={formData.password}
                onChangeText={text => updateField('password', text)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirmation mot de passe */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmer le mot de passe*</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirmez votre mot de passe"
                placeholderTextColor="#999"
                value={formData.confirmPassword}
                onChangeText={text => updateField('confirmPassword', text)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Bouton inscription */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupButtonText}>Créer mon compte producteur</Text>
              )}
            </TouchableOpacity>

            {/* Lien connexion */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginLinkText}>Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={handleGoToLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal sélection ville */}
      <Modal visible={showVillePicker} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowVillePicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionnez votre zone</Text>
              <TouchableOpacity onPress={() => setShowVillePicker(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.villeList}>
              {VILLES_CAMEROUN.map(ville => (
                <TouchableOpacity
                  key={ville}
                  style={styles.villeItem}
                  onPress={() => {
                    updateField('ville', ville);
                    setShowVillePicker(false);
                  }}
                >
                  <Text style={[styles.villeItemText, formData.ville === ville && styles.villeItemSelected]}>
                    {ville}
                  </Text>
                  {formData.ville === ville && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

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
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 5,
  },
  helperText: {
    color: '#888',
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#2E7D32',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E7D32',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pickerButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#999',
  },
  villeList: {
    padding: 10,
  },
  villeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  villeItemText: {
    fontSize: 16,
    color: '#333',
  },
  villeItemSelected: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});

export default ProducerSignUpScreen;
