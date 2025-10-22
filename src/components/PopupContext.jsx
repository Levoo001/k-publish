// src/components/PopupContext.jsx - UPDATED WITHOUT AUTH

"use client";

import { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export function PopupProvider({ children }) {
  // We can keep this for future popups if needed, but remove auth-specific logic
  const [popupInitialized, setPopupInitialized] = useState(false);

  // Remove all auth popup states and functions
  const value = {
    popupInitialized
  };

  return (
    <PopupContext.Provider value={value}>
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