// src/components/Footer.jsx
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";

const Footer = () => {
  const date = new Date().getFullYear();

  return (
    <footer className="py-8 container mx-auto max-w-7xl bg-slate-200">
      <div className="grid md:grid-cols-3 gap-8 mb-8 px-4">
        {/* Contact Info */}
        <div className="text-[0.88rem] space-y-3">
          <h3 className="text-sm font-semibold font-playfair">Contact Us</h3>
          <div className="space-y-2 font-cormorant">
            <p>
              <span className="font-playfair">Call:</span>{" "}
              <a href="tel:+2347036210107" className="hover:text-white font-cormorant">
                +234 703 621 0107
              </a>
            </p>
            <p>
              <span className="font-playfair">Email:</span>{" "}
              <a
                href="mailto:admin@kavanthebrand.com"
                className="hover:text-white font-cormorant"
              >
                admin@kavanthebrand.com
              </a>
            </p>
          </div>

          <div className="flex gap-4 mt-4">
            <Link
              href="https://www.instagram.com/kavanthebrand_"
              target="_blank"
            >
              <FaInstagram size={24} className="hover:text-white" />
            </Link>
            <Link href="https://wa.me/2347036210107" target="_blank">
              <BsWhatsapp size={21} className="hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-[0.88rem] space-y-3">
          <h3 className="font-semibold text-sm text-center font-playfair">Quick Links</h3>

          <div className="flex justify-between">
            <div className="space-y-2">
              <Link href="/contact-us" className="block hover:text-white font-cormorant">
                Contact Us
              </Link>
              <Link href="/about-us" className="block hover:text-white font-cormorant">
                About Us
              </Link>
              <Link href="/SizeGuide" className="block hover:text-white font-cormorant">
                Size Guide
              </Link>
            </div>

            <div className="space-y-2">
              <Link href="/delivery-policy" className="block hover:text-white font-cormorant">
                Delivery Policy
              </Link>
              <Link href="/privacy-policy" className="block hover:text-white font-cormorant">
                Privacy Policy
              </Link>
              <Link
                href="/refund-and-exchange-policy"
                className="block hover:text-white font-cormorant"
              >
                Returns & Exchanges
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Message */}
        <div className="text-[0.88rem] space-y-3">
          <h3 className="font-semibold text-sm font-playfair">Kavan The Brand</h3>
          <p className="font-cormorant leading-relaxed">
            Where strength meets softness in contemporary fashion. 
            Handcrafted pieces that celebrate the beautiful duality of womanhood.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <p className="border-t border-slate-700 pt-4 text-center text-xs font-cormorant">
        Copyright © Kavan The Brand {date}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;