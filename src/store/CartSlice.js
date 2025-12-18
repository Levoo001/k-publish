// src/store/CartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Ensure cartItems exists and is an array
      if (!state.cartItems) {
        state.cartItems = [];
      }

      const newItem = action.payload;

      // Generate a unique key based on ID + Size + Color
      const itemKey = `${newItem.id}-${newItem.selectedSize || "nosize"}-${newItem.selectedColor || "nocolor"}`;

      // Check if the exact same item (with same size and color) already exists
      const existingItem = state.cartItems.find((item) => {
        const existingKey = `${item.id}-${item.selectedSize || "nosize"}-${item.selectedColor || "nocolor"}`;
        return existingKey === itemKey;
      });

      if (existingItem) {
        // If same ID, size, and color exists, increment quantity
        existingItem.quantity += 1;
      } else {
        // Otherwise add as new item with a unique key
        state.cartItems.push({
          ...newItem,
          quantity: 1,
          cartItemId: itemKey, // Add unique identifier for this specific combination
        });
      }
    },

    incrementQuantity: (state, action) => {
      if (!state.cartItems) {
        state.cartItems = [];
        return;
      }

      // Action payload can be either cartItemId or just item id
      const itemToUpdate = state.cartItems.find(
        (item) =>
          item.id === action.payload || item.cartItemId === action.payload
      );
      if (itemToUpdate) {
        itemToUpdate.quantity += 1;
      }
    },

    decrementQuantity: (state, action) => {
      if (!state.cartItems) {
        state.cartItems = [];
        return;
      }

      const itemToUpdate = state.cartItems.find(
        (item) =>
          item.id === action.payload || item.cartItemId === action.payload
      );
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        itemToUpdate.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      if (!state.cartItems) {
        state.cartItems = [];
        return;
      }

      // Remove by cartItemId for specific size/color combinations
      state.cartItems = state.cartItems.filter(
        (item) =>
          item.cartItemId !== action.payload && item.id !== action.payload
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
