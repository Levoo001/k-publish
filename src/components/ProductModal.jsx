// src/components/ProductModal.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useCart } from "./CartProvider";
import { addToCart } from "@/store/CartSlice";
import { urlFor } from "@/sanity/lib/image";

const ProductModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const modalImageRef = useRef(null);

  const dispatch = useDispatch();
  const { openCart } = useCart();

  if (!product) return null;

  // Available sizes based on your requirements
  const availableSizes = [6, 8, 10, 12, 14, 16, 18, 20, 22];

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCartClick = () => {
    // Validate size selection
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }

    // Create cart-ready product object
    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      // Use the first image for cart thumbnail
      image: product.processedImages
        ? product.processedImages[0]
        : urlFor(product.image[0])
            .width(400)
            .height(533)
            .quality(80)
            .format("jpg")
            .url(),
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      // Optional: Keep reference to original product for details
      _id: product._id,
      originalImages: product.image,
    };

    dispatch(addToCart(cartProduct));

    openCart();

    setSelectedColor(null);
    setSelectedSize(null);

    onClose();
  };

  const getImages = () => {
    if (product.processedImages) {
      return product.processedImages;
    }
    if (product.images) {
      return product.images;
    }
    if (product.image) {
      return product.image.map((img) =>
        typeof img === "string"
          ? img
          : urlFor(img)
              .width(1200)
              .height(1600)
              .quality(95)
              .format("jpg")
              .fit("fill")
              .bg("FFFFFF")
              .url()
      );
    }
    return [];
  };

  const images = getImages();
  const mainImage = images[currentImageIndex];
  const hasColors = product.colors && product.colors.length > 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="relative h-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 bg-white rounded-full p-2 hover:bg-slate-100 transition-all duration-300 shadow-lg hover:scale-110"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="grid lg:grid-cols-2 h-full">
            {/* Image Gallery Section - Keep as is */}
            <div className="relative bg-white">
              <div className="relative aspect-[3/4] w-full h-full">
                {mainImage && (
                  <Image
                    ref={modalImageRef}
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => {
                      if (modalImageRef.current) {
                        modalImageRef.current.style.opacity = "1";
                      }
                    }}
                    style={{ transition: "opacity 0.2s ease-in-out" }}
                  />
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium font-poppins">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-2">
                  <div className="flex gap-2 justify-center overflow-x-auto">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                          index === currentImageIndex
                            ? "border-primary shadow-md"
                            : "border-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <Image
                          src={urlFor(product.image?.[index] || img)
                            .width(120)
                            .height(120)
                            .quality(80)
                            .format("jpg")
                            .fit("fill")
                            .bg("FFFFFF")
                            .url()}
                          alt={`${product.name} view ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details Section - UPDATED WITH SIZE SELECTION */}
            <div className="bg-white flex flex-col justify-between py-6 px-2">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3 text-primary font-playfair">
                    {product.name}
                  </h2>
                  <p className="text-2xl font-bold text-primary mb-4 font-poppins">
                    ₦{product.price?.toLocaleString()}
                  </p>
                </div>

                {/* Size Selection - NEW SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-primary font-playfair">
                      Select Size
                    </h3>
                    <Link
                      href="/SizeGuide"
                      className="text-primary-600 text-sm font-poppins hover:text-primary underline hover:no-underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Size Guide →
                    </Link>
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`p-1 rounded-lg border-2 transition-all duration-200 font-poppins font-medium text-sm ${
                          selectedSize === size
                            ? "border-primary bg-primary text-white"
                            : "border-gray-300 hover:border-primary hover:bg-primary-25 text-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {selectedSize && (
                    <p className="text-sm text-primary-600 mt-4 font-poppins">
                      Selected Size:{" "}
                      <span className="font-semibold">{selectedSize}</span>
                    </p>
                  )}
                </div>

                {/* Color Selection - Only show if product has colors */}
                {hasColors && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary font-playfair">
                      Available Colors
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorSelect(color)}
                          className={`flex items-center space-x-2 px-4 py-1 rounded-lg border-2 transition-all duration-200 font-poppins ${
                            selectedColor === color
                              ? "border-primary bg-primary-50 text-primary"
                              : "border-gray-300 hover:border-primary hover:bg-primary-25 text-gray-700"
                          }`}
                        >
                          <span>{color}</span>
                        </button>
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="text-sm text-primary-600 mt-2 font-poppins">
                        Selected Color:{" "}
                        <span className="font-semibold">{selectedColor}</span>
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary font-playfair">
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base font-poppins whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold shadow-lg font-poppins transition-all duration-300 ${
                    !selectedSize || (hasColors && !selectedColor)
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-slate-800"
                  }`}
                  onClick={handleAddToCartClick}
                  disabled={!selectedSize || (hasColors && !selectedColor)}
                >
                  {(() => {
                    if (!selectedSize) return "Please select a size";
                    if (hasColors && !selectedColor)
                      return "Please select a color";
                    return "Add to Cart";
                  })()}
                </button>

                <button
                  className="w-full border-2 border-slate-300 text-slate-700 py-2 px-6 hover:border-primary hover:bg-slate-50 transition-all duration-300 rounded-xl font-semibold font-poppins"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
