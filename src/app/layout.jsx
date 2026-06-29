import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import SearchDrawer from "@/components/SearchDrawer";
import { SearchProvider } from "@/components/SearchContext";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Playfair_Display, Poppins } from "next/font/google";
import Script from "next/script";
import { FACEBOOK_PIXEL_ID } from "@/lib/facebookPixel";
import { client } from "@/sanity/lib/client";
import { productQuery } from "@/sanity/lib/queries";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL("https://www.kavanthebrand.com"),
  title: {
    default: "Kavan The Brand — Luxury Fashion",
    template: "%s | Kavan The Brand",
  },
  description:
    "Handcrafted luxury dresses and fashion pieces for the woman whose presence lingers. Discover new collections from Kavan The Brand.",
  keywords: [
    "Kavan The Brand",
    "luxury fashion Nigeria",
    "luxury dresses",
    "handcrafted clothing",
    "boutique fashion Lagos",
    "womenswear Nigeria",
  ].join(", "),
  openGraph: {
    title: "Kavan The Brand — Luxury Fashion",
    description:
      "Handcrafted luxury dresses and fashion pieces. For the woman whose presence lingers.",
    url: "https://www.kavanthebrand.com",
    siteName: "Kavan The Brand",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 600,
        alt: "Kavan The Brand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavan The Brand — Luxury Fashion",
    description:
      "Handcrafted luxury dresses and fashion pieces. For the woman whose presence lingers.",
    images: ["/logo.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.kavanthebrand.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }) {
  const products = await client.fetch(productQuery, {}, { next: { revalidate: 60 } });

  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FACEBOOK_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className="antialiased bg-gray-200">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <div className="mx-auto w-full max-w-[1440px] bg-white min-h-screen relative overflow-x-hidden shadow-2xl flex flex-col">
          <SearchProvider products={products}>
            <ClientLayout>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
              <SearchDrawer />
            </ClientLayout>
          </SearchProvider>
        </div>

        <script src="https://js.paystack.co/v1/inline.js" async></script>
      </body>
    </html>
  );
}
