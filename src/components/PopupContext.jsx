// src/components/PopupContext.jsx

"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [popupInitialized, setPopupInitialized] = useState(false);
  const hasShownPopup = useRef(false);

  const openAuthPopup = () => setShowAuthPopup(true);
  const closeAuthPopup = () => setShowAuthPopup(false);

  // Auto-show popup after 5 seconds on homepage for unauthenticated users
  useEffect(() => {
    if (hasShownPopup.current) return;
    
    const timer = setTimeout(() => {
      // Only show if we're on homepage and user isn't authenticated
      const isHomepage = window.location.pathname === '/';
      if (isHomepage && !hasShownPopup.current) {
        openAuthPopup();
        hasShownPopup.current = true;
      }
    }, 5000);

    setPopupInitialized(true);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PopupContext.Provider value={{
      showAuthPopup,
      setShowAuthPopup,
      openAuthPopup,
      closeAuthPopup,
      popupInitialized
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