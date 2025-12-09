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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppDispatch } from '../../store/types';
import { setUser } from '../../store/authSlice';
import authService from '../../services/AuthService';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { Tractor, ArrowLeft } from 'lucide-react-native';
import { Role } from '../../types/Backend';

type ProducerLoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProducerLogin'>;

const ProducerLoginScreen = () => {
  const navigation = useNavigation<ProducerLoginNavigationProp>();
  const dispatch = useAppDispatch();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'L\'adresse email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
    }

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const credentials = {
        email: email.trim(),
        password: password,
      };

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        // Vérifier que c'est bien un producteur
        if (response.data.role !== Role.VENDEUR) {
          showError('Ce compte n\'est pas un compte producteur. Veuillez utiliser l\'espace acheteur.', 4000);
          return;
        }

        dispatch(
          setUser({
            user: {
              idUser: response.data.idUser,
              nom: response.data.nom,
              prenom: '',
              email: email,
              numTel: '',
              ville: '',
              sexe: 'HOMME' as any,
              role: response.data.role,
            },
            token: response.data.token,
          }),
        );

        showSuccess(`Bienvenue ${response.data.nom} !`, 2000);

        // Rediriger vers le dashboard producteur
        setTimeout(() => {
          navigation.replace('ProducerTabs');
        }, 1500);
      } else {
        const errorMessage = response.error || 'Email ou mot de passe incorrect';
        showError(errorMessage, 4000);
      }
    } catch (error: any) {
      showError('Une erreur est survenue. Veuillez réessayer.', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    navigation.navigate('ProducerSignUp');
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

          {/* Header avec icône producteur */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Tractor size={40} color="#2E7D32" strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Espace Producteur</Text>
            <Text style={styles.subtitle}>Connectez-vous pour gérer vos produits</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Exemple: producteur@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor="#999"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupLinkContainer}>
              <Text style={styles.signupLinkText}>Vous n'avez pas de compte ?</Text>
              <TouchableOpacity onPress={handleGoToSignUp} disabled={isLoading}>
                <Text style={styles.signupLink}>Créer un compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  loginButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupLinkText: {
    color: '#666',
    fontSize: 15,
  },
  signupLink: {
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ProducerLoginScreen;
