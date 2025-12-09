import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types/Product';
import { panierService } from '../services/PanierService';
import { mapProduitToProduct } from '../utils/dataMapper';
import logger from '../utils/logger';

export interface CartItem extends Product {
  quantity: number;
  selected: boolean;
  lignePanierId?: number; // ID de la ligne panier backend
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSyncing: false,
  error: null,
};

// Thunk pour charger le panier depuis le backend
export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (idAcheteur: number, { rejectWithValue }) => {
    try {
      const response = await panierService.getPanier(idAcheteur);
      if (response.success && response.data) {
        return response.data.articles.map(ligne => {
          const product = mapProduitToProduct(ligne.produit);
          return {
            ...product,
            quantity: ligne.quantite,
            selected: false,
            lignePanierId: ligne.id,
          };
        });
      }
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour ajouter un produit au panier backend
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (
    { idAcheteur, product, quantity }: { idAcheteur: number; product: Product; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await panierService.addToPanier(idAcheteur, {
        idProduit: parseInt(product.id),
        quantite: quantity,
      });

      if (response.success && response.data) {
        // Retourner le produit mis à jour avec le nouveau panier
        const updatedItem = response.data.articles.find(
          ligne => ligne.produit.idProduit === parseInt(product.id)
        );
        if (updatedItem) {
          return {
            ...product,
            quantity: updatedItem.quantite,
            selected: false,
            lignePanierId: updatedItem.id,
          };
        }
      }
      throw new Error(response.error || 'Erreur ajout panier');
    } catch (error: any) {
      logger.error('Erreur addToCartAsync', error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk pour supprimer du panier backend
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (
    { lignePanierId, productId }: { lignePanierId?: number; productId: string },
    { rejectWithValue }
  ) => {
    try {
      if (lignePanierId) {
        await panierService.removeLigne(lignePanierId);
      }
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          quantity,
          selected: false,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },

    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
    },

    selectAllItems: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(item => {
        item.selected = action.payload;
      });
    },

    clearCart: state => {
      state.items = [];
    },

    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Load cart
    builder
      .addCase(loadCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to cart async
    builder
      .addCase(addToCartAsync.pending, state => {
        state.isSyncing = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isSyncing = false;
        const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });

    // Remove from cart async
    builder
      .addCase(removeFromCartAsync.pending, state => {
        state.isSyncing = true;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleItemSelection,
  selectAllItems,
  clearCart,
  setCartItems,
  clearError,
} = cartSlice.actions;

// Sélecteurs
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items
    .filter(item => item.selected)
    .reduce((total, item) => total + item.priceNumeric * item.quantity, 0);
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectSelectedItems = (state: { cart: CartState }) =>
  state.cart.items.filter(item => item.selected);
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartSyncing = (state: { cart: CartState }) => state.cart.isSyncing;

export default cartSlice.reducer;
