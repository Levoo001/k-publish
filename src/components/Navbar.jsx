// src/components/Navbar.jsx - UPDATED WITHOUT AUTH
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GiShoppingBag } from "react-icons/gi";
import { BiMenuAltLeft } from "react-icons/bi";
import { useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";
import { useCart } from "./CartProvider";

const Navbar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart } = useCart();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartCount = useSelector(
    (state) =>
      state.cart?.cartItems?.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0
      ) || 0
  );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const year = new Date().getFullYear()

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-primary-100">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between px-6 py-1">
          {/* Left Links */}
          <div className="flex items-center space-x-8">
            <Link href="/shop" className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins">
              SHOP
            </Link>
            <Link href="/about-us" className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins">
              ABOUT US
            </Link>
            <Link href="/SizeGuide" className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-poppins">
              SIZE GUIDE
            </Link>
          </div>

          {/* Center Logo */}
          <Link href="/">
            <img src="logo.jpeg" alt="kavanthebrand" className="h-18" />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={openCart}
              className="relative text-primary-600 hover:text-primary transition-colors"
            >
              {isHydrated && cartCount > 0 && (
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
          {/* Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="text-primary-700 hover:text-primary transition-colors"
          >
            <BiMenuAltLeft size={28} />
          </button>

          {/* Center Logo */}
          <Link href="/">
            <img src="logo.jpeg" alt="kavanthebrand" className="h-18" />
          </Link>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative text-primary-600 hover:text-primary transition-colors"
          >
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium font-poppins">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <GiShoppingBag size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 left-0 w-3/5 max-w-sm h-full bg-white shadow-xl">
            <div className="flex flex-col h-full p-6">
              {/* Header */}
              <div className="flex justify-end">
                <span onClick={toggleMobileMenu}>
                  <IoCloseOutline size={30} className="text-primary-500 hover:text-primary transition-colors" />
                </span>
              </div>

              {/* Menu Items */}
              <div className="flex-1 mt-3">
                <nav className="py-2 space-y-3 text-sm text-primary-900">
                  <Link
                    href="/shop"
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-poppins"
                    onClick={toggleMobileMenu}
                  >
                    SHOP
                  </Link>
                  <Link
                    href="/about-us"
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-poppins"
                    onClick={toggleMobileMenu}
                  >
                    ABOUT US
                  </Link>

                  <Link
                    href="/contact-us"
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-poppins"
                    onClick={toggleMobileMenu}
                  >
                    CONTACT US
                  </Link>
                  <Link
                    href="/SizeGuide"
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-poppins"
                    onClick={toggleMobileMenu}
                  >
                    SIZE GUIDE
                  </Link>
                </nav>
              </div>

              {/* Footer Section */}
              <div className="border-primary-100">
                <div className="text-xs text-primary-500 text-center font-poppins">
                  Copyright © {year} Kavanthebrand . All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;