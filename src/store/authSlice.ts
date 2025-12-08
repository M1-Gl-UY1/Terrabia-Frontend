/**
 * Redux Slice pour la gestion de l'authentification
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Role, Utilisateur } from '../types/Backend';
import apiClient from '../utils/apiClient';

// État de l'authentification
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: Utilisateur | null;
  token: string | null;
  error: string | null;
}

// État initial
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  error: null,
};

// Thunk pour vérifier si l'utilisateur est connecté (au démarrage de l'app)
export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async () => {
  const token = await apiClient.getToken();
  const userInfo = await apiClient.getUserInfo();

  if (token && userInfo.userId) {
    return {
      token,
      user: {
        idUser: parseInt(userInfo.userId),
        nom: userInfo.name || '',
        role: userInfo.role as Role,
      },
    };
  }

  throw new Error('No authentication data found');
});

// Slice d'authentification
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action pour définir l'utilisateur connecté
    setUser: (
      state,
      action: PayloadAction<{
        user: Utilisateur;
        token: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },

    // Action pour la déconnexion
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      // Supprimer les données stockées
      apiClient.clearUserData();
    },

    // Action pour définir une erreur
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Action pour effacer l'erreur
    clearError: state => {
      state.error = null;
    },

    // Action pour définir le statut de chargement
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers: builder => {
    // Gérer le thunk checkAuthStatus
    builder
      .addCase(checkAuthStatus.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user as Utilisateur;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isLoading = false;
      });
  },
});

// Exporter les actions
export const { setUser, logout, setError, clearError, setLoading } = authSlice.actions;

// Exporter les sélecteurs
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Exporter le reducer
export default authSlice.reducer;
