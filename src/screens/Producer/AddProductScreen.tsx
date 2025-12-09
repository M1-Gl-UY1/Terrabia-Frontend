import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppSelector } from '../../store/types';
import producerService from '../../services/ProducerService';
import { Categorie } from '../../types/Backend';
import { ArrowLeft, ChevronDown, Image as ImageIcon, Camera, X } from 'lucide-react-native';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { launchImageLibrary, launchCamera, ImagePickerResponse, Asset } from 'react-native-image-picker';

type AddProductNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;

interface FormErrors {
  nom?: string;
  prix?: string;
  quantite?: string;
  description?: string;
  idCategorie?: string;
}

const AddProductScreen = () => {
  const navigation = useNavigation<AddProductNavigationProp>();
  const user = useAppSelector(state => state.auth.user);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    quantite: '',
    description: '',
    idCategorie: 0,
  });

  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Categorie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await producerService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log('Erreur chargement catégories:', error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    setShowImagePicker(false);

    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      showError(`Erreur: ${response.errorMessage || 'Impossible de sélectionner l\'image'}`, 3000);
      return;
    }

    if (response.assets && response.assets.length > 0) {
      setSelectedImage(response.assets[0]);
    }
  };

  const pickImageFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      handleImageResponse
    );
  };

  const pickImageFromCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        saveToPhotos: true,
      },
      handleImageResponse
    );
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du produit est obligatoire';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.prix.trim()) {
      newErrors.prix = 'Le prix est obligatoire';
    } else if (isNaN(Number(formData.prix)) || Number(formData.prix) <= 0) {
      newErrors.prix = 'Veuillez entrer un prix valide';
    }

    if (!formData.quantite.trim()) {
      newErrors.quantite = 'La quantité en stock est obligatoire';
    } else if (isNaN(Number(formData.quantite)) || Number(formData.quantite) < 0) {
      newErrors.quantite = 'Veuillez entrer une quantité valide';
    }

    if (formData.idCategorie === 0) {
      newErrors.idCategorie = 'Veuillez sélectionner une catégorie';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !user?.idUser) {
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        nom: formData.nom.trim(),
        prix: Number(formData.prix),
        quantite: Number(formData.quantite),
        description: formData.description.trim() || undefined,
        idCategorie: formData.idCategorie,
        idVendeur: user.idUser,
      };

      // Préparer l'image si sélectionnée
      const imageFile = selectedImage ? {
        uri: selectedImage.uri!,
        type: selectedImage.type || 'image/jpeg',
        name: selectedImage.fileName || `product_${Date.now()}.jpg`,
      } : undefined;

      const response = await producerService.createProduct(productData, imageFile);

      if (response.success) {
        showSuccess('Produit ajouté avec succès !', 2000);
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        showError(response.error || 'Erreur lors de l\'ajout du produit', 4000);
      }
    } catch (error: any) {
      showError('Une erreur est survenue. Veuillez réessayer.', 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCategory = (category: Categorie) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, idCategorie: category.idCat }));
    setErrors(prev => ({ ...prev, idCategorie: undefined }));
    setShowCategoryPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nouveau Produit</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image upload */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Photo du produit</Text>
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                  disabled={isLoading}
                >
                  <X size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => setShowImagePicker(true)}
                  disabled={isLoading}
                >
                  <Text style={styles.changeImageText}>Changer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imageUpload}
                onPress={() => setShowImagePicker(true)}
                disabled={isLoading}
              >
                <ImageIcon size={40} color="#ccc" />
                <Text style={styles.imageUploadText}>Ajouter une photo</Text>
                <Text style={styles.imageUploadHint}>JPG ou PNG, max 5MB</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nom du produit */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom du produit*</Text>
            <TextInput
              style={[styles.input, errors.nom && styles.inputError]}
              placeholder="Ex: Tomates fraîches"
              placeholderTextColor="#999"
              value={formData.nom}
              onChangeText={text => updateField('nom', text)}
              editable={!isLoading}
            />
            {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
          </View>

          {/* Catégorie */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Catégorie*</Text>
            <TouchableOpacity
              style={[styles.pickerButton, errors.idCategorie && styles.inputError]}
              onPress={() => setShowCategoryPicker(true)}
              disabled={isLoading || isCategoriesLoading}
            >
              {isCategoriesLoading ? (
                <ActivityIndicator size="small" color="#2E7D32" />
              ) : (
                <>
                  <Text
                    style={[
                      styles.pickerButtonText,
                      !selectedCategory && styles.placeholderText,
                    ]}
                  >
                    {selectedCategory?.nomCat || 'Sélectionner une catégorie'}
                  </Text>
                  <ChevronDown size={20} color="#999" />
                </>
              )}
            </TouchableOpacity>
            {errors.idCategorie && (
              <Text style={styles.errorText}>{errors.idCategorie}</Text>
            )}
          </View>

          {/* Prix et Quantité sur la même ligne */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Prix (FCFA)*</Text>
              <TextInput
                style={[styles.input, errors.prix && styles.inputError]}
                placeholder="Ex: 1500"
                placeholderTextColor="#999"
                value={formData.prix}
                onChangeText={text => updateField('prix', text)}
                keyboardType="numeric"
                editable={!isLoading}
              />
              {errors.prix && <Text style={styles.errorText}>{errors.prix}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Stock*</Text>
              <TextInput
                style={[styles.input, errors.quantite && styles.inputError]}
                placeholder="Ex: 50"
                placeholderTextColor="#999"
                value={formData.quantite}
                onChangeText={text => updateField('quantite', text)}
                keyboardType="numeric"
                editable={!isLoading}
              />
              {errors.quantite && (
                <Text style={styles.errorText}>{errors.quantite}</Text>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez votre produit..."
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={text => updateField('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter le produit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal sélection catégorie */}
      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une catégorie</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.categoryList}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.idCat}
                  style={styles.categoryItem}
                  onPress={() => selectCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      selectedCategory?.idCat === category.idCat &&
                        styles.categoryItemSelected,
                    ]}
                  >
                    {category.nomCat}
                  </Text>
                  {selectedCategory?.idCat === category.idCat && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Modal sélection source image */}
      <Modal visible={showImagePicker} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowImagePicker(false)}
        >
          <View style={styles.imagePickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter une photo</Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={pickImageFromCamera}
            >
              <Camera size={24} color="#2E7D32" />
              <Text style={styles.imagePickerOptionText}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={pickImageFromGallery}
            >
              <ImageIcon size={24} color="#2E7D32" />
              <Text style={styles.imagePickerOptionText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageUpload: {
    height: 160,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  imageUploadHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  imagePreviewContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 5,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
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
  submitButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
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
  categoryList: {
    padding: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  categoryItemSelected: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  imagePickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 16,
  },
  imagePickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AddProductScreen;
