import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  titre: string;
  message: string;
  date: string;
  read?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [
    {
      id: '1',
      titre: 'COMMANDE 89D29 ( Livraison Terminer )',
      message: 'Bonne nouvelle ! Votre colis a bien été livré à l\'adresse indiquée. Si vous ne l\'avez pas encore récupéré, nous vous invitons à vérifier auprès de votre entourage ou du point de livraison. N\'hésitez pas à nous contacter si vous rencontrez un problème avec la réception du colis ou si le contenu ne correspond pas à ce que vous avez commandé.\n\nMerci d\'avoir passé commande sur Kom-b et à très bientôt !',
      date: 'il y a 1j',
      read: false
    },
    {
      id: '2',
      titre: 'COMMANDE 89D29 ( Livraison Terminer )',
      message: 'Bonne nouvelle ! Votre colis a bien été livré à l\'adresse indiquée. Si vous ne l\'avez pas encore récupéré, nous vous invitons à vérifier auprès de votre entourage ou du point de livraison. N\'hésitez pas à nous contacter si vous rencontrez un problème avec la réception du colis ou si le contenu ne correspond pas à ce que vous avez commandé.\n\nMerci d\'avoir passé commande sur Kom-b et à très bientôt !',
      date: 'il y a 1j',
      read: false
    },
    {
      id: '3',
      titre: 'COMMANDE 89D29 ( Livraison Terminer )',
      message: 'Bonne nouvelle ! Votre colis a bien été livré à l\'adresse indiquée. Si vous ne l\'avez pas encore récupéré, nous vous invitons à vérifier auprès de votre entourage ou du point de livraison. N\'hésitez pas à nous contacter si vous rencontrez un problème avec la réception du colis ou si le contenu ne correspond pas à ce que vous avez commandé.\n\nMerci d\'avoir passé commande sur Kom-b et à très bientôt !',
      date: 'il y a 1j',
      read: false
    },
    {
      id: '4',
      titre: 'COMMANDE 89D29 ( Livraison Terminer )',
      message: 'Bonne nouvelle ! Votre colis a bien été livré à l\'adresse indiquée. Si vous ne l\'avez pas encore récupéré, nous vous invitons à vérifier auprès de votre entourage ou du point de livraison. N\'hésitez pas à nous contacter si vous rencontrez un problème avec la réception du colis ou si le contenu ne correspond pas à ce que vous avez commandé.\n\nMerci d\'avoir passé commande sur Kom-b et à très bientôt !',
      date: 'il y a 1j',
      read: false
    },
  ],
  unreadCount: 4
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      state.unreadCount += 1;
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    }
  }
});

export const { 
  addNotification, 
  clearAllNotifications, 
  markAsRead, 
  markAllAsRead 
} = notificationSlice.actions;

export default notificationSlice.reducer;
