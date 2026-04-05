"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useCart } from "@/components/CartProvider";
import { addToCart } from "@/store/CartSlice";
import { urlFor } from "@/sanity/lib/image";

export default function ProductPageClient({ product }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openCart } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const availableSizes = [6, 8, 10, 12, 14, 16, 18, 20, 22];

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e, totalImages) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
      } else {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-playfair text-primary mb-4">
            Product not found
          </h1>
          <button
            onClick={() => router.push("/shop")}
            className="bg-primary text-white px-6 py-3 rounded-lg font-poppins hover:bg-primary/90 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  const getImages = () => {
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(
        (v) => v.color === selectedColor,
      );
      // Color variant images are not sliced — they have no cover thumbnail to skip
      if (variant?.images?.length) {
        return variant.images.map((img) =>
          typeof img === "string"
            ? img
            : urlFor(img)
                .width(1200)
                .height(1600)
                .quality(95)
                .format("jpg")
                .fit("fill")
                .bg("FFFFFF")
                .url(),
        );
      }
    }
    // Skip index 0 from product.image — that's the cover/thumbnail image
    if (product.image?.length) {
      return product.image
        .slice(1)
        .map((img) =>
          typeof img === "string"
            ? img
            : urlFor(img)
                .width(1200)
                .height(1600)
                .quality(95)
                .format("jpg")
                .fit("fill")
                .bg("FFFFFF")
                .url(),
        );
    }
    return [];
  };

  const images = getImages();
  const mainImage = images[currentImageIndex];
  const hasColors = product.colors && product.colors.length > 0;
  const processedImages = product.image
    ?.slice(1)
    .map((img) =>
      urlFor(img)
        .width(1200)
        .height(1600)
        .quality(95)
        .format("jpg")
        .fit("fill")
        .bg("FFFFFF")
        .url(),
    );

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }

    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: processedImages
        ? processedImages[0]
        : urlFor(product.image[1] || product.image[0])
            .width(400)
            .height(533)
            .quality(80)
            .format("jpg")
            .url(),
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      _id: product._id,
      originalImages: product.image,
    };

    dispatch(addToCart(cartProduct));
    openCart();
    setSelectedColor(null);
    setSelectedSize(null);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <div className="py-3 sm:py-4 md:py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary/80 transition-colors mb-4 font-poppins text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pb-8 sm:pb-12">
          {/* Image Gallery */}
          <div className="relative bg-primary-50 rounded-xl">
            <div
              className="relative aspect-[3/4] w-full"
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, images.length)}
            >
              {mainImage && (
                <Image
                  key={currentImageIndex}
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}

              {images.length > 1 && (
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium font-poppins">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="mt-3 sm:mt-4 px-1 sm:px-2">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                        index === currentImageIndex
                          ? "border-primary shadow-md"
                          : "border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-primary font-playfair mb-1 sm:mb-2">
                  {product.name}
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary font-poppins">
                  ₦{product.price?.toLocaleString()}
                </p>
              </div>

              {product.description && (
                <div className="space-y-2 text-slate-700 font-poppins text-xs sm:text-sm md:text-base leading-relaxed border-t border-slate-200 pt-3 sm:pt-4">
                  {product.description.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Options */}
            <div className="space-y-4 sm:space-y-6 border-t border-slate-200 pt-4 sm:pt-6">
              {/* Colors */}
              {hasColors && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3 font-poppins uppercase tracking-wide">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm ${
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-slate-300 text-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3 font-poppins uppercase tracking-wide">
                  Size
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white font-semibold"
                          : "border-slate-300 text-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95 font-poppins uppercase tracking-wider text-xs sm:text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
