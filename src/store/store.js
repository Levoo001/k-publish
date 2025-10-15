// src/store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import cartReducer from "./CartSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/lib/constants";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem(_key) {
    return Promise.resolve(null);
  },
  setItem(_key, _value) {
    return Promise.resolve();
  },
  removeItem(_key) {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
  // Add this to ensure proper state structure
  migrate: (state) => {
    if (!state || !state.cart) {
      return Promise.resolve({ cart: { cartItems: [] } });
    }
    if (!state.cart.cartItems) {
      state.cart.cartItems = [];
    }
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // Add preloaded state to ensure structure
  preloadedState: {
    cart: { cartItems: [] },
  },
});

export const persistor = persistStore(store);
export default store;
