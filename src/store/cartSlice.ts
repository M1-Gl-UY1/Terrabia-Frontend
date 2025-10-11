import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/Product';

export interface CartItem extends Product {
  quantity: number;
  selected: boolean;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

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
    
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleItemSelection,
  selectAllItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;