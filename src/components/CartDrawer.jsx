"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useCartStore } from "@/store/cart";

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useCart();
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = items.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0,
  );
  const totalQty = items.reduce((sum, i) => sum + (i?.quantity || 0), 0);

  const fmt = (price) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(price);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-light font-playfair text-slate-900 tracking-wide">
              Your Cart
            </h2>
            {totalQty > 0 && (
              <span className="bg-primary text-white text-[11px] font-semibold font-poppins w-5 h-5 rounded-full flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="font-playfair text-slate-800 text-lg font-light mb-1">Nothing here yet</p>
              <p className="text-slate-400 text-sm font-poppins mb-7">Browse the shop and add something you love.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="bg-primary text-white px-7 py-3 rounded-xl text-sm font-medium font-poppins hover:bg-primary/90 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50 px-5 py-3">
              {items.map((item, index) => (
                <li key={item.cartItemId || item.id || index} className="py-4 flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 font-poppins leading-snug truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {item.selectedSize && (
                            <span className="text-[11px] bg-slate-100 text-slate-600 font-poppins px-2 py-0.5 rounded">
                              Size {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[11px] bg-slate-100 text-slate-600 font-poppins px-2 py-0.5 rounded capitalize">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId || item.id)}
                        aria-label="Remove item"
                        className="flex-shrink-0 text-slate-300 hover:text-red-400 transition-colors mt-0.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                        <button
                          onClick={() => decrementItem(item.cartItemId || item.id)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition-colors text-base font-light"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold font-poppins text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.cartItemId || item.id)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors text-base font-light"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-bold text-primary font-poppins">
                        {fmt(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-5 py-4 space-y-4">
            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-poppins">
                <span>{totalQty} item{totalQty !== 1 ? "s" : ""}</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-poppins text-slate-700">Total</span>
                <span className="text-xl font-bold font-playfair text-primary">{fmt(subtotal)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-poppins text-center -mt-1">
              Shipping calculated at checkout
            </p>

            {/* CTAs */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full block bg-primary text-white py-3.5 rounded-xl text-sm font-semibold font-poppins text-center hover:bg-primary/90 transition-colors"
            >
              Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-xs text-slate-400 font-poppins hover:text-slate-600 transition-colors py-1"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
