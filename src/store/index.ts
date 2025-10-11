import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les warnings pour les images require() dans le cart
        ignoredActions: ['cart/addToCart'],
        ignoredPaths: ['cart.items'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;