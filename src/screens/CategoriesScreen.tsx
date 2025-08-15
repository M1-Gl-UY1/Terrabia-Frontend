import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
};

export default function CategoriesScreen() {
  const categories: Category[] = [
    {
      id: '1',
      name: 'Légumes',
      icon: '🥬',
      color: '#10B981',
      productCount: 45,
    },
    {
      id: '2',
      name: 'Fruits',
      icon: '🍎',
      color: '#F59E0B',
      productCount: 32,
    },
    {
      id: '3',
      name: 'Tubercules',
      icon: '🥔',
      color: '#8B5CF6',
      productCount: 28,
    },
    {
      id: '4',
      name: 'Céréales',
      icon: '🌾',
      color: '#F27A22',
      productCount: 15,
    },
    {
      id: '5',
      name: 'Épices',
      icon: '🌶️',
      color: '#EF4444',
      productCount: 22,
    },
    {
      id: '6',
      name: 'Légumineuses',
      icon: '🫘',
      color: '#06B6D4',
      productCount: 18,
    },
    {
      id: '7',
      name: 'Huiles',
      icon: '🫒',
      color: '#84CC16',
      productCount: 12,
    },
    {
      id: '8',
      name: 'Autres',
      icon: '📦',
      color: '#6B7280',
      productCount: 35,
    },
  ];

  const renderCategory = (category: Category) => (
    <Pressable key={category.id} style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Text style={styles.categoryIconText}>{category.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
      <Text style={styles.productCount}>{category.productCount} produits</Text>
    </Pressable>
  );

  return (
    <TabNavigatorWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Catégories</Text>
          <Text style={styles.subtitle}>Découvrez nos produits par catégorie</Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {categories.map(renderCategory)}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TabNavigatorWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  content: {
    padding: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  productCount: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
