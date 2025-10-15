// src/components/ProductModal.jsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const modalImageRef = useRef(null);

  if (!product) return null;

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle both processedImages and original image arrays
  const getImages = () => {
    if (product.processedImages) {
      return product.processedImages;
    }
    if (product.images) {
      return product.images;
    }
    if (product.image) {
      return product.image.map((img) =>
        typeof img === "string" ? img : urlFor(img).width(600).height(800).url()
      );
    }
    return [];
  };

  const images = getImages();
  const mainImage = images[currentImageIndex];

  const handleAddToCartClick = () => {
    onAddToCart(product);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="relative h-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-20 bg-white rounded-full p-2 hover:bg-gray-100 transition-all duration-300 shadow-lg hover:scale-110"
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
            {/* Image Gallery Section */}
            <div className="relative bg-gray-50">
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
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
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
                            ? "border-black shadow-md"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                      >
                        <Image
                          src={img}
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

            {/* Product Details Section */}
            <div className="flex flex-col justify-between p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3 text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    ₦{product.price?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <button
                  className="w-full bg-black text-white py-3 px-6 hover:bg-gray-800 transition-all duration-300 rounded-xl font-semibold text-lg shadow-lg"
                  onClick={handleAddToCartClick}
                >
                  Add to Cart
                </button>

                <button
                  className="w-full border-2 border-gray-300 text-gray-700 py-2 px-6 hover:border-black hover:bg-gray-50 transition-all duration-300 rounded-xl font-semibold text-lg"
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
