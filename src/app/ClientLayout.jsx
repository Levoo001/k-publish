"use client";

import { CartProvider } from "@/components/CartProvider";
import { PopupProvider } from "@/components/PopupContext";

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <PopupProvider>{children}</PopupProvider>
    </CartProvider>
  );
}
