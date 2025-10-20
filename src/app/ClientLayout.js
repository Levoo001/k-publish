// src/app/ClientLayout.js
"use client";

import { SessionProvider } from "next-auth/react";
import ReduxProvider from "./ReduxProvider";
import { CartProvider } from "@/components/CartProvider";
import { PopupProvider } from "@/components/PopupContext";
import AuthPopup from '@/components/AuthPopup';

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <CartProvider>
          <PopupProvider>
            {children}
            <AuthPopup />
          </PopupProvider>
        </CartProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}