"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GiShoppingBag } from "react-icons/gi";
import { BiMenuAltLeft } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useCart } from "./CartProvider";
import { useSearch } from "./SearchContext";
import { useCartStore } from "@/store/cart";

const Navbar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart } = useCart();
  const { toggleSearch } = useSearch();
  const items = useCartStore((s) => s.items);

  const cartCount = isHydrated
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-primary-100">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between px-6 py-1">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins"
            >
              HOME
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins"
            >
              SHOP
            </Link>
            <Link
              href="/about-us"
              className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins"
            >
              ABOUT US
            </Link>
            <Link
              href="/SizeGuide"
              className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins"
            >
              SIZE GUIDE
            </Link>
          </div>

          <Link href="/" className="-ml-48">
            <Image
              src="/logo.jpeg"
              alt="Kavan The Brand"
              width={80}
              height={80}
              className="h-18 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleSearch}
              className="text-primary-600 hover:text-primary transition-colors"
              aria-label="Search products"
            >
              <FiSearch size={22} />
            </button>

            <button
              onClick={openCart}
              className="relative text-primary-600 hover:text-primary transition-colors"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium font-poppins">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <GiShoppingBag size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between px-4 py-1">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-primary-700 hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <BiMenuAltLeft size={28} />
          </button>

          <Link href="/" className="-mr-9">
            <Image
              src="/logo.jpeg"
              alt="Kavan The Brand"
              width={80}
              height={80}
              className="h-18 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="text-primary-600 hover:text-primary transition-colors"
              aria-label="Search products"
            >
              <FiSearch size={28} />
            </button>

            <button
              onClick={openCart}
              className="relative text-primary-600 hover:text-primary transition-colors"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium font-poppins">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <GiShoppingBag size={25} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 w-3/5 max-w-sm h-full bg-white shadow-xl">
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-end">
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <IoCloseOutline
                    size={30}
                    className="text-primary-500 hover:text-primary transition-colors"
                  />
                </button>
              </div>

              <div className="flex-1 mt-3">
                <nav className="py-2 space-y-3 text-sm text-primary-900">
                  {[
                    { href: "/", label: "HOME" },
                    { href: "/shop", label: "SHOP" },
                    { href: "/about-us", label: "ABOUT US" },
                    { href: "/contact-us", label: "CONTACT US" },
                    { href: "/SizeGuide", label: "SIZE GUIDE" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-poppins"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="text-xs text-primary-500 text-center font-poppins">
                Copyright © {year} Kavanthebrand. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
