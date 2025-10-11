import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import TabNavigatorWrapper from '../components/TabNavigatorWrapper';
import { Trash2, ArrowLeft } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../store/types';
import { clearAllNotifications, markAsRead } from '../store/notificationSlice';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchNavigationProp>();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);

  // Fonction pour gérer la suppression des notifications
  const handleClearAllNotifications = () => {
    dispatch(clearAllNotifications());
  };

  return (
      <SafeAreaView style={styles.container}>
        {/* En-tête de l'écran */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft color="#000000" size={24} />
          </TouchableOpacity>
          
          {/* Conteneur du titre et de l'icône de la corbeille */}
          <View style={styles.titleContainer}>
            <Text style={styles.TitreNotif}>Notifications (0{notifications.length})</Text>
            {/* Bouton pour vider toutes les notifications */}
            <TouchableOpacity onPress={handleClearAllNotifications}>
              <Trash2 size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenu de la liste des notifications (défilable) */}
        <ScrollView style={styles.content}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <View key={notification.id} style={styles.notificationCard}>
                <Text style={styles.notificationTitle}>{notification.titre}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationDate}>{notification.date}</Text>
              </View>
            ))
          ) : (
            // Message si aucune notification n'est présente
            <ImageBackground source = {require("../assets/images/notifClear.jpg")} resizeMode="contain" style={styles.backgroundIm} >
                <View style={styles.noNotificationsContainer}>
                </View>
            </ImageBackground>
          )}
        </ScrollView>
      </SafeAreaView>
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
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    position: 'relative',
    top: 2
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  TitreNotif: {
    fontSize: 23,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  trashIcon: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  noNotificationsContainer: {
    alignItems: 'center',
    marginTop: 150,
    width :400,
    height : 450,
    justifyContent : 'center'
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#6B7280',
  },

  backgroundIm :{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  }
});
