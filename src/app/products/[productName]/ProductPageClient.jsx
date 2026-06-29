"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useCartStore } from "@/store/cart";
import { urlFor } from "@/sanity/lib/image";
import { trackFacebookEvent } from "@/lib/facebookPixel";

const DEFAULT_SIZES = ["6", "8", "10", "12", "14", "16", "18", "20", "22"];

export default function ProductPageClient({ product }) {
  const router = useRouter();
  const { openCart } = useCart();
  const addItem = useCartStore((s) => s.addItem);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [validationModal, setValidationModal] = useState(null); // "size" | "color" | null
  const [shareCopied, setShareCopied] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const availableSizes = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
  const hasColors = product.colors?.length > 0;

  useEffect(() => {
    if (!product) return;
    trackFacebookEvent("ViewContent", {
      content_name: product.name,
      content_type: "product",
      content_ids: [product._id],
      currency: "NGN",
      value: Number(product.price) || 0,
    });
  }, [product]);

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-playfair text-primary mb-4">Product not found</h1>
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
      const variant = product.colorVariants.find((v) => v.color === selectedColor);
      if (variant?.images?.length) {
        return variant.images.map((img) =>
          typeof img === "string"
            ? img
            : urlFor(img).width(1200).height(1600).quality(95).format("jpg").fit("fill").bg("FFFFFF").url(),
        );
      }
    }
    return (product.image?.slice(1) || []).map((img) =>
      typeof img === "string"
        ? img
        : urlFor(img).width(1200).height(1600).quality(95).format("jpg").fit("fill").bg("FFFFFF").url(),
    );
  };

  const images = getImages();
  const mainImage = images[currentImageIndex];

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) setCurrentImageIndex((p) => (p + 1) % images.length);
      else setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleShare = async () => {
    const url = `https://www.kavanthebrand.com/products/${product.slug?.current || encodeURIComponent(product.name)}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Kavan The Brand — ₦${product.price?.toLocaleString()}`,
      url,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      });
    }
  };

  const handleAddToCart = () => {
    if (hasColors && !selectedColor) {
      setValidationModal("color");
      return;
    }
    if (!selectedSize) {
      setValidationModal("size");
      return;
    }

    const cartImageUrl =
      images[0] ||
      urlFor(product.image?.[1] || product.image?.[0]).width(400).height(533).quality(80).format("jpg").url();

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: cartImageUrl,
      selectedColor,
      selectedSize,
      slug: product.slug?.current,
    });

    trackFacebookEvent("AddToCart", {
      content_name: product.name,
      content_type: "product",
      content_ids: [product._id],
      currency: "NGN",
      value: Number(product.price) || 0,
    });

    openCart();
    setSelectedColor(null);
    setSelectedSize(null);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Validation modal */}
      {validationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setValidationModal(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-light font-playfair text-slate-900 mb-2">
              {validationModal === "color" ? "Select a colour" : "Select a size"}
            </h3>
            <p className="text-slate-500 text-sm font-poppins mb-5">
              {validationModal === "color"
                ? "Please choose a colour option before adding this item to your cart."
                : "Please choose a size before adding this item to your cart."}
            </p>
            {validationModal === "size" && (
              <Link
                href="/SizeGuide"
                className="block text-xs text-primary underline underline-offset-2 font-poppins mb-5"
                onClick={() => setValidationModal(null)}
              >
                Not sure of your size? View size guide →
              </Link>
            )}
            <button
              onClick={() => setValidationModal(null)}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-poppins hover:bg-primary/90 transition-colors"
            >
              OK, got it
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="py-3 sm:py-4 md:py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary/80 transition-colors mb-4 font-poppins text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
              onTouchEnd={handleTouchEnd}
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
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-poppins">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 sm:mt-4 px-1 sm:px-2">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        index === currentImageIndex
                          ? "border-primary shadow-md"
                          : "border-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" sizes="64px" />
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
                <div className="flex items-start justify-between gap-3 mb-1 sm:mb-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-primary font-playfair leading-tight">
                    {product.name}
                  </h1>
                  <button
                    onClick={handleShare}
                    title="Share this product"
                    className="flex-shrink-0 mt-1 p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/40 transition-colors relative"
                  >
                    {shareCopied ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    )}
                    {shareCopied && (
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-poppins text-green-600 bg-white border border-green-200 px-2 py-0.5 rounded-full shadow-sm">
                        Link copied!
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary font-poppins">
                    ₦{product.price?.toLocaleString()}
                  </p>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <p className="text-base text-slate-400 line-through font-poppins">
                      ₦{product.comparePrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {product.description && (
                <div className="space-y-2 text-slate-700 font-poppins text-xs sm:text-sm md:text-base leading-relaxed border-t border-slate-200 pt-3 sm:pt-4">
                  {product.description.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6 border-t border-slate-200 pt-4 sm:pt-6">
              {/* Color selection */}
              {hasColors && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3 font-poppins uppercase tracking-wide">
                    Colour{" "}
                    {!selectedColor && (
                      <span className="text-slate-400 normal-case font-normal tracking-normal">— select one</span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          setCurrentImageIndex(0);
                        }}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm capitalize ${
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

              {/* Size selection */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3 font-poppins uppercase tracking-wide">
                  Size{" "}
                  {!selectedSize && (
                    <span className="text-slate-400 normal-case font-normal tracking-normal">— select one</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[2.75rem] py-1.5 sm:py-2 px-4 sm:px-5 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white font-semibold"
                          : "border-slate-300 text-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <Link
                  href="/SizeGuide"
                  className="inline-block mt-2 text-xs text-primary/70 hover:text-primary underline underline-offset-2 font-poppins transition-colors"
                >
                  Not sure of your size? View size guide
                </Link>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors font-poppins uppercase tracking-wider text-xs sm:text-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
