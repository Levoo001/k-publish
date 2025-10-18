// src/components/Navbar.jsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GiShoppingBag } from "react-icons/gi";
import { BiMenuAltLeft } from "react-icons/bi";
import { useSelector } from "react-redux";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { FaUserCircle } from "react-icons/fa";
import { useCart } from "./CartProvider";
import { IoCloseOutline } from "react-icons/io5";

const Navbar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();
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

  const renderUserIcon = () => {
    if (!isLoaded) {
      return <FaUserCircle size={24} className="text-burgundy-400 animate-pulse" />;
    }

    if (isSignedIn) {
      return <UserButton />;
    }

    return (
      <SignInButton mode="modal">
        <FaUserCircle
          size={24}
          className="cursor-pointer text-burgundy-600 hover:text-burgundy transition-colors"
        />
      </SignInButton>
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const year = new Date().getFullYear()

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-burgundy-100">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between px-6 py-4">
          {/* Left Links */}
          <div className="flex items-center space-x-8">
            <Link href="/shop" className="text-sm font-medium text-burgundy-700 hover:text-burgundy transition-colors font-inter">
              SHOP
            </Link>
            <Link href="/about-us" className="text-sm font-medium text-burgundy-700 hover:text-burgundy transition-colors font-inter">
              ABOUT US
            </Link>
            <Link href="/SizeGuide" className="text-sm font-medium text-burgundy-700 hover:text-burgundy transition-colors font-inter">
              SIZE GUIDE
            </Link>
          </div>

          {/* Center Logo */}
          <Link href="/" className="text-2xl text-burgundy absolute left-1/2 transform -translate-x-1/2"
          style={{ fontFamily: 'Cinzel, serif' }}>
            Kavan
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {renderUserIcon()}
            <button
              onClick={openCart}
              className="relative text-burgundy-600 hover:text-burgundy transition-colors"
            >
              {isHydrated && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-burgundy text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
              <GiShoppingBag size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between px-4 py-4">
          {/* Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="text-burgundy-700 hover:text-burgundy transition-colors"
          >
            <BiMenuAltLeft size={28} />
          </button>

          {/* Center Logo */}
          <Link href="/" className="text-2xl font-bold text-burgundy" style={{ fontFamily: 'Cinzel, serif' }}>
            Kavan
          </Link>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative text-burgundy-600 hover:text-burgundy transition-colors"
          >
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-burgundy text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <GiShoppingBag size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Kilentar Style */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          />
          
          {/* Menu Panel - Kilentar Style */}
          <div className="absolute top-0 left-0 w-3/5 max-w-sm h-full bg-white shadow-xl">
            <div className="flex flex-col h-full p-6">
              {/* Header - Kilentar Style */}
                <div className="flex justify-end">
                  <span onClick={toggleMobileMenu}>

                  <IoCloseOutline size={30} className="text-burgundy-500 hover:text-burgundy transition-colors"/>
                  </span>
                </div>

              {/* Menu Items - Kilentar Style */}
              <div className="flex-1 mt-3">
                <nav className="py-2 space-y-3 text-sm text-burgundy-900">
                  <Link 
                    href="/shop" 
                    className="block w-full text-left py-3 hover:bg-burgundy-50 transition-colors border-b border-burgundy-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    SHOP
                  </Link>
                  <Link 
                    href="/about-us" 
                    className="block w-full text-left py-3 hover:bg-burgundy-50 transition-colors border-b border-burgundy-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    ABOUT US
                  </Link>
                  
                  <Link 
                    href="/contact-us" 
                    className="block w-full text-left py-3 hover:bg-burgundy-50 transition-colors border-b border-burgundy-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    CONTACT US
                  </Link>
                  <Link 
                    href="/SizeGuide" 
                    className="block w-full text-left py-3 hover:bg-burgundy-50 transition-colors border-b border-burgundy-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    SIZE GUIDE
                  </Link>
                  
                  {/* User Section in Mobile Menu - Kilentar Style */}
                  <div className="border-b border-burgundy-100">
                    <div 
                      className="flex items-center w-full text-left py-3 hover:bg-burgundy-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (!isSignedIn) {
                          // Trigger sign in modal
                          document.querySelector('[data-clerk-sign-in]')?.click();
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {renderUserIcon()}
                        <span className="text-[15px] font-normal text-burgundy-900 font-inter">
                          {isSignedIn ? "Account" : "Sign In"}
                        </span>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Footer Section - Optional, like Kilentar */}
              <div className="p-6 border-t border-burgundy-100">
                <div className="text-xs text-burgundy-500 text-center font-cormorant">
                  © {year} KAVAN. ALL RIGHTS RESERVED.
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