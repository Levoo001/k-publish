// src/components/PopupContext.jsx
"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [popupInitialized, setPopupInitialized] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasInitialized = useRef(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    // This ensures the popup only initializes once across the entire app
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setPopupInitialized(true);
  }, []);

  return (
    <PopupContext.Provider value={{
      popupInitialized,
      isPopupOpen,
      openPopup,
      closePopup
    }}>
      {children}
    </PopupContext.Provider>
  );
}

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};