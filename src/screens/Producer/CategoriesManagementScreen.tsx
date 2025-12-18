import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ChevronLeft,
  Plus,
  FolderOpen,
  Package,
  X,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import CategoryService from '../../services/CategoryService';
import { Categorie } from '../../types/Backend';
import { logger } from '../../utils/logger';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast';

type CategoriesManagementScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function CategoriesManagementScreen() {
  const navigation = useNavigation<CategoriesManagementScreenNavigationProp>();
  const { toast, showToast, hideToast, showSuccess, showError } = useToast();

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadCategories = async () => {
    try {
      setError(null);
      const response = await CategoryService.getAllCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      logger.error('[CategoriesManagementScreen] Erreur:', { err });
      setError('Impossible de charger les catégories');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
  };

  const handleOpenCreateModal = () => {
    setNewCategoryName('');
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewCategoryName('');
  };

  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      showError('Veuillez entrer un nom de catégorie');
      return;
    }

    if (trimmedName.length < 2) {
      showError('Le nom doit contenir au moins 2 caractères');
      return;
    }

    setIsCreating(true);

    try {
      // Vérifier si la catégorie existe déjà
      const exists = await CategoryService.categoryExists(trimmedName);

      if (exists) {
        showError('Cette catégorie existe déjà');
        setIsCreating(false);
        return;
      }

      // Créer la catégorie
      const response = await CategoryService.createCategory({
        nomCat: trimmedName,
      });

      if (response.success && response.data) {
        showSuccess('Catégorie créée avec succès');
        handleCloseModal();
        loadCategories();
      } else {
        showError(response.error || 'Impossible de créer la catégorie');
      }
    } catch (err) {
      logger.error('[CategoriesManagementScreen] Erreur création:', { err });
      showError('Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: Categorie }) => {
    return (
      <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
        <View style={styles.categoryIcon}>
          <FolderOpen size={24} color="#2E7D32" strokeWidth={2} />
        </View>

        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>{item.nomCat}</Text>
          <Text style={styles.categoryDescription}>
            Catégorie de produits
          </Text>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryId}>#{item.idCat}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ChevronLeft size={24} color="#2D3748" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catégories</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Chargement des catégories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ChevronLeft size={24} color="#2D3748" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Catégories</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.errorContainer}>
          <FolderOpen size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadCategories}>
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onDismiss={hideToast}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ChevronLeft size={24} color="#2D3748" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catégories</Text>
        <TouchableOpacity
          onPress={handleOpenCreateModal}
          style={styles.addButton}>
          <Plus size={24} color="#2E7D32" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FolderOpen size={64} color="#9CA3AF" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>Aucune catégorie</Text>
          <Text style={styles.emptyText}>
            Créez votre première catégorie pour commencer
          </Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={handleOpenCreateModal}>
            <Plus size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.createFirstButtonText}>Créer une catégorie</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.idCat.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2E7D32']}
              tintColor="#2E7D32"
            />
          }
        />
      )}

      {/* Modal de création */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle catégorie</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
                disabled={isCreating}>
                <X size={24} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Nom de la catégorie</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Fruits, Légumes, Céréales..."
                placeholderTextColor="#9CA3AF"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
                editable={!isCreating}
                maxLength={50}
              />
              <Text style={styles.inputHint}>
                {newCategoryName.length}/50 caractères
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCloseModal}
                disabled={isCreating}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.createButton,
                  isCreating && styles.createButtonDisabled,
                ]}
                onPress={handleCreateCategory}
                disabled={isCreating}>
                {isCreating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.createButtonText}>Créer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  errorText: {
    marginTop: 8,
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  createFirstButton: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#2E7D32',
    borderRadius: 12,
  },
  createFirstButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  categoryId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'right',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: '#2E7D32',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
