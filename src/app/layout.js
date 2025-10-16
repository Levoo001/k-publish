// src/app/layout.js

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer"; // Import CartDrawer
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import { ClerkProvider } from "@clerk/nextjs";
import UserSync from '@/components/UserSync';
import { CartProvider } from "@/components/CartProvider";
import { PopupProvider } from "@/components/PopupContext";

export const metadata = {
  title: "Kavan The Brand - Luxury Fashion Brand",
  description:
    "Discover exquisite luxury dresses and fashion. Handcrafted elegance with Ottoman-inspired designs.",
  keywords: [
    "Kavan The Brand",
    "luxury fashion",
    "luxury dresses",
    "Ottoman designs",
    "handcrafted clothing",
    "boutique fashion",
  ].join(", "),
  openGraph: {
    title: "Kavan The Brand - Luxury Fashion Brand",
    description: "Exquisite luxury dresses and fashion collections",
    url: "https://www.kavanthebrand.com",
    siteName: "Kavan The Brand",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.kavanthebrand.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://cdn.sanity.io" />
          <link rel="preconnect" href="https://img.clerk.com" />
        </head>
        <body className="antialiased">
          <ReduxProvider>
            <CartProvider>
              <PopupProvider>
              <UserSync /> {/* Add UserSync here */}
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
              </PopupProvider>
            </CartProvider>
          </ReduxProvider>

          <script src="https://js.paystack.co/v1/inline.js" async></script>
        </body>
      </html>
    </ClerkProvider>
  );
}
