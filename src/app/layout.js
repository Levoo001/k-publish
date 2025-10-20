// src/app/layout.js
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";
import ClientLayout from "./ClientLayout";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body className="antialiased">
        <ClientLayout>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </ClientLayout>

        <script src="https://js.paystack.co/v1/inline.js" async></script>
      </body>
    </html>
  );
}