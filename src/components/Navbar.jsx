// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GiShoppingBag } from "react-icons/gi";
import { BiMenuAltLeft } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import { useCart } from "./CartProvider";
import { usePopup } from "./PopupContext"; // Add this import
import { IoCloseOutline } from "react-icons/io5";

const Navbar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { openCart } = useCart();
  const { openPopup } = usePopup(); // Add this hook

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
    if (status === 'loading') {
      return <FaUserCircle size={24} className="text-primary-400 animate-pulse" />;
    }

    if (session) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            {session.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-primary-600 text-sm font-medium">
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
              </span>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-primary-600 hover:text-primary-700 font-inter"
          >
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={openPopup} // Change from signIn() to openPopup()
        className="flex items-center space-x-1"
      >
        <FaUserCircle
          size={24}
          className="cursor-pointer text-primary-600 hover:text-primary transition-colors"
        />
        <span className="text-sm text-primary-600 font-inter hidden sm:block">Sign In</span>
      </button>
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const year = new Date().getFullYear()

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-primary-100">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between px-6 py-4">
          {/* Left Links */}
          <div className="flex items-center space-x-8">
            <Link href="/shop" className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-inter">
              SHOP
            </Link>
            <Link href="/about-us" className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-inter">
              ABOUT US
            </Link>
            <Link href="/SizeGuide" className="text-sm font-medium text-primary-700 hover:text-primary transition-colors font-inter">
              SIZE GUIDE
            </Link>
          </div>

          {/* Center Logo */}
          <Link href="/" className="text-2xl text-primary absolute left-1/2 transform -translate-x-1/2"
          style={{ fontFamily: 'Cinzel, serif' }}>
            Kavan
          </Link>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {renderUserIcon()}
            <button
              onClick={openCart}
              className="relative text-primary-600 hover:text-primary transition-colors"
            >
              {isHydrated && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
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
            className="text-primary-700 hover:text-primary transition-colors"
          >
            <BiMenuAltLeft size={28} />
          </button>

          {/* Center Logo */}
          <Link href="/" className="text-2xl font-bold text-primary" style={{ fontFamily: 'Cinzel, serif' }}>
            Kavan
          </Link>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative text-primary-600 hover:text-primary transition-colors"
          >
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
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
                  <IoCloseOutline size={30} className="text-primary-500 hover:text-primary transition-colors"/>
                </span>
              </div>

              {/* Menu Items */}
              <div className="flex-1 mt-3">
                <nav className="py-2 space-y-3 text-sm text-primary-900">
                  <Link 
                    href="/shop" 
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    SHOP
                  </Link>
                  <Link 
                    href="/about-us" 
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    ABOUT US
                  </Link>
                  
                  <Link 
                    href="/contact-us" 
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    CONTACT US
                  </Link>
                  <Link 
                    href="/SizeGuide" 
                    className="block w-full text-left py-3 hover:bg-primary-50 transition-colors border-b border-primary-100 font-inter"
                    onClick={toggleMobileMenu}
                  >
                    SIZE GUIDE
                  </Link>
                  
                  {/* User Section in Mobile Menu */}
                  <div className="border-b border-primary-100">
                    <div 
                      className="flex items-center w-full text-left py-3 hover:bg-primary-50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (!session) {
                          openPopup(); // Change from signIn() to openPopup()
                        }
                        toggleMobileMenu();
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {renderUserIcon()}
                        <span className="text-[15px] font-normal text-primary-900 font-inter">
                          {session ? "Account" : "Sign In"}
                        </span>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Footer Section */}
              <div className="p-6 border-t border-primary-100">
                <div className="text-xs text-primary-500 text-center font-cormorant">
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