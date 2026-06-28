"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const key = `${newItem.id}-${newItem.selectedSize || "nosize"}-${newItem.selectedColor || "nocolor"}`;
        set((state) => {
          const existing = state.items.find((i) => i.cartItemId === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === key ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...newItem, quantity: 1, cartItemId: key }],
          };
        });
      },

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.cartItemId !== cartItemId && i.id !== cartItemId,
          ),
        })),

      incrementItem: (cartItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId || i.id === cartItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        })),

      decrementItem: (cartItemId) =>
        set((state) => ({
          items: state.items.map((i) =>
            (i.cartItemId === cartItemId || i.id === cartItemId) &&
            i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "kavan-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
    },
  ),
);
