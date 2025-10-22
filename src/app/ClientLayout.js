// src/app/ClientLayout.js
"use client";

import ReduxProvider from "./ReduxProvider";
import { CartProvider } from "@/components/CartProvider";
import { PopupProvider } from "@/components/PopupContext";

export default function ClientLayout({ children }) {
  return (
    <ReduxProvider>
      <CartProvider>
        <PopupProvider>
          {children}
        </PopupProvider>
      </CartProvider>
    </ReduxProvider>
  );
}