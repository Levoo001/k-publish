// src/app/layout.js
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import SearchDrawer from "@/components/SearchDrawer";
import { SearchProvider } from "@/components/SearchContext";
import { productQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Playfair_Display, Poppins } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

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

export default async function RootLayout({ children }) {
  // Fetch products for search functionality
  const products = await client.fetch(productQuery);

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body className="antialiased">
        <SearchProvider products={products}>
          <ClientLayout>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <SearchDrawer />
          </ClientLayout>
        </SearchProvider>

        <script src="https://js.paystack.co/v1/inline.js" async></script>
      </body>
    </html>
  );
}