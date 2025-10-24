// src/components/Footer.jsx

import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { BsTiktok, BsWhatsapp } from "react-icons/bs";

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="py-4 container mx-auto max-w-7xl bg-primary text-white">
      <div className="grid md:grid-cols-3 gap-8 mb-8 px-4">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo-2.jpeg" alt="Kavanthebrand" className="h-18" />
          <div className="flex gap-6">
            <Link
              href="https://www.instagram.com/kavanthebrand_"
              target="_blank"
            >
              <FaInstagram size={24} className="hover:text-white" />
            </Link>
            <Link href="https://wa.me/2347036210107" target="_blank">
              <BsWhatsapp size={21} className="hover:text-white" />
            </Link>
            <Link href="https://www.tiktok.com/@kavanthebrand" target="_blank">
              <BsTiktok size={21} className="hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Brand Message */}
        <div className="text-[0.88rem] space-y-1">
          <h3 className="font-semibold text-base font-playfair">KavanTheBrand</h3>
          <p className="font-poppins leading-relaxed">
            Where strength meets softness in contemporary fashion.
            Handcrafted pieces that celebrate the beautiful duality of womanhood.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs font-poppins -mb-4">
          © {date} Kavanthebrand
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center text-center gap-2 text-[0.86rem]">
          <Link href="/contact-us" className="block hover:text-white font-poppins underline">
            Contact Us
          </Link>
          <Link href="/about-us" className="block hover:text-white font-poppins underline">
            About Us
          </Link>
          <Link href="/SizeGuide" className="block hover:text-white font-poppins underline">
            Size Guide
          </Link>
          <Link href="/delivery-policy" className="block hover:text-white font-poppins underline">
            Delivery Policy
          </Link>
          <Link href="/privacy-policy" className="block hover:text-white font-poppins underline">
            Privacy Policy
          </Link>
          <Link
            href="/refund-and-exchange-policy"
            className="block hover:text-white font-poppins underline"
          >
            Returns & Exchanges
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;