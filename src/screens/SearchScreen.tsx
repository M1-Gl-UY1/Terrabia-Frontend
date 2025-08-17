import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';
import { Search, Trash2, ArrowLeft } from 'lucide-react-native';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();
  const [searchText, setSearchText] = useState('');

  const grossesSoldes = [
    'cageot Tomates',
    'Pasteques',
    'Prunes',
  ];

  const [recherchesRecentes, setRecherchesRecentes] = useState([
    'Avocats',
    'Ignames blanc',
    'Mangues',
  ]);

  const handleSearch = (term: string) => {
    setSearchText(term);
    // Ici vous pouvez implémenter la logique de recherche
    setRecherchesRecentes(prevSearches => [term, ...prevSearches] );
    console.log('Recherche pour:', term);
  };

  const clearRecentSearches = () => {
    setRecherchesRecentes([]);
    console.log('Recherches récentes effacées');
  };

  return (
    <TabNavigatorWrapper>
      <SafeAreaView style={styles.container}>
        {/* Barre de navigation avec bouton retour */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}><ArrowLeft /></Text>
          </TouchableOpacity>
          
          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}><Search size={18} /></Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Que recherchez-vous aujourd'hui ?"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() =>{handleSearch(searchText)}}
              autoFocus
            />
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Section Grosses soldes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grosses soldes</Text>
            <View style={styles.tagsContainer}>
              {grossesSoldes.map((tag, index) => (
                <Pressable
                  key={index}
                  style={styles.tag}
                  onPress={() => handleSearch(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section Recherches récentes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recherche recentes</Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text style={styles.trashIcon}><Trash2 /></Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
            {recherchesRecentes.map((tag, index) => (
              <Pressable
                key={index}
                style={styles.tag}
                onPress={() => handleSearch(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TabNavigatorWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position : 'relative',
    right : 20,
    top: 20
  },
  backButton: {
    padding: 8,
    marginRight: 2,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    position : 'relative',
    top : 2
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginTop : 5,
  },
  searchIcon: {
    
    marginRight: 1,
    color: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  trashIcon: {
    fontSize: 20,
    color: '#9CA3AF',
  },
});
