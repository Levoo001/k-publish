// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { FaUserCircle } from "react-icons/fa";
import { useCart } from "./CartProvider";

const Navbar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
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
      return <FaUserCircle size={28} className="text-gray-400 animate-pulse" />;
    }

    if (isSignedIn) {
      return <UserButton />;
    }

    return (
      <SignInButton mode="modal">
        <FaUserCircle
          size={28}
          className="cursor-pointer text-gray-600 hover:text-black transition-colors"
        />
      </SignInButton>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white p-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold tracking-tight text-black">
        KAVAN
      </Link>

      <div className="flex items-center gap-6 ">
        {/* Cart Icon */}
        <button
          onClick={openCart}
          className="relative text-gray-600 hover:text-black transition-colors"
        >
          {isHydrated && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
          <HiOutlineShoppingCart size={28} />
        </button>

        {/* User Icon */}
        <div className="flex items-center justify-center">
          {renderUserIcon()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
