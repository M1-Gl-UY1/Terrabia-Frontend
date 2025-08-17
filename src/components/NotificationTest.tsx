import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppDispatch } from '../store/types';
import { addNotification } from '../store/notificationSlice';

const NotificationTest = () => {
  const dispatch = useAppDispatch();

  const addTestNotification = () => {
    const newNotification = {
      id: Date.now().toString(),
      titre: 'Test Notification',
      message: 'Ceci est une notification de test pour vérifier le badge !',
      date: 'Maintenant',
      read: false
    };
    dispatch(addNotification(newNotification));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={addTestNotification}>
        <Text style={styles.buttonText}>Ajouter une notification de test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default NotificationTest;
