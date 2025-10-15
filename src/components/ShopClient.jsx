// src/components/ShopClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/CartSlice";
import { useCart } from "./CartProvider";
import { urlFor } from "@/sanity/lib/image";
import ProductModal from "./ProductModal";

export default function ShopClient({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const { openCart } = useCart();

  const handleProductClick = (product) => {
    const modalProduct = {
      ...product,
      processedImages: product.image.map((img) =>
        urlFor(img).width(600).height(800).url()
      ),
    };
    setSelectedProduct(modalProduct);
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: urlFor(product.image[0]).width(300).height(400).url(),
    };

    dispatch(addToCart(cartProduct));
    setSelectedProduct(null);
    openCart();
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Shop Header */}
      <section className="bg-gradient-to-r from-slate-50 to-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="">
            <h1 className="text-2xl md:text-6xl font-playfair mb-4 text-slate-900 text-center">
              The Rebirth Collection 
            </h1>
            <p className="text-[1.05rem] font-cormornt text-slate-600 max-w-2xl mx-auto text-center">
              Softness. Strength.
              <br />
              <br />
              Elegance. A celebration of the modern woman ~ grounded in grace,
              defined by strength. Each piece is crafted to remind you that
              power can be gentle, and softness can be bold. This collection
              marks a return to self ~ to ease, intention, and timeless
              femininity.
              <br />
              <br />
              The Rebirth Collection ~ for women in their soft era.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-2 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-xl rounded-xl"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={urlFor(product.image[0]).width(600).height(800).url()}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 text-black px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    New
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                      Quick View
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center p-2 space-y-2">
                <h3 className="font-light text-base md:text-lg text-slate-900 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-slate-900">
                  ₦{product.price?.toLocaleString()}
                </p>

                <button
                  className="md:hidden w-full bg-black text-white py-2 rounded-lg text-sm font-medium mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-slate-900">
            Stay Updated
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Be the first to know about new arrivals, exclusive offers, and
            styling tips
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-black text-slate-900 placeholder-slate-500"
            />
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors duration-300 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
}
