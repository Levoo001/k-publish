// src/components/CartDrawer.jsx - Add sign in button
"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/store/CartSlice";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useCart } from "./CartProvider";
import { usePopup } from "./PopupContext";

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useCart();
  const { data: session, status } = useSession();
  const { openAuthPopup } = usePopup();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  if (!isCartOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleOverlayClick}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-primary font-playfair">
              Your Cart ({cartItems.length})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <HiOutlineShoppingCart size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2 font-playfair">Your cart is empty</h3>
                <p className="text-slate-600 mb-6 font-cormorant">Add some items to get started</p>
                <button
                  onClick={closeCart}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-inter"
                >
                  <Link href="/shop">
                  Continue Shopping
                  </Link>
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Cart Items */}
                {cartItems.map((item, index) => (
                  <div
                    key={item.id || item._id || `cart-item-${index}`}
                    className="flex gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100"
                  >
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1 font-inter">
                        {item.name}
                      </h3>
                      <p className="font-semibold text-sm mb-2 text-primary font-inter">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-primary-200 rounded">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-primary-50 disabled:opacity-30 text-primary"
                            disabled={item.quantity <= 1}
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm border-x border-primary-200 text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-primary-50 text-primary"
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-primary-400 hover:text-red-500 p-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section - Fixed at bottom */}
          {cartItems.length > 0 && (
            <div className="border-t border-primary-100 bg-white p-4">
              {/* Order Summary */}
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span className="text-primary-900 font-playfair">Total</span>
                <span className="text-primary font-playfair">{formatPrice(subtotal)}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {session ? (
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full block bg-primary text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-primary-700 transition-colors font-inter"
                  >
                    Check Out
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      openAuthPopup();
                      closeCart();
                    }}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-primary-700 transition-colors font-inter"
                  >
                    Sign In to Checkout
                  </button>
                )}

                <button
                  onClick={closeCart}
                  className="w-full border border-primary-200 text-primary-700 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 transition-colors font-inter"
                >
                  <Link href="/shop">
                    Continue Shopping
                  </Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;