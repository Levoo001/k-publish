"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useCart } from "@/components/CartProvider";
import { useCartStore } from "@/store/cart";
import { urlFor } from "@/sanity/lib/image";
import { trackFacebookEvent } from "@/lib/facebookPixel";
import { getCardImage, getPosterCount } from "@/lib/productImage";

const DEFAULT_SIZES = ["8", "10", "12", "14", "16", "18", "20", "22", "24"];

export default function ProductPageClient({ product }) {
  const router = useRouter();
  const { openCart } = useCart();
  const addItem = useCartStore((s) => s.addItem);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [addOnSelected, setAddOnSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [validationModal, setValidationModal] = useState(null); // "size" | "color" | null
  const [shareCopied, setShareCopied] = useState(false);
  const [showPricingInfo, setShowPricingInfo] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const thumbnailRefs = useRef([]);
  const thumbStripRef = useRef(null);

  const availableSizes = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
  const hasColors = product.colors?.length > 0;
  const isMultiColor = product.allowMultipleColors === true;
  const hasAddOn = product.hasAddOn === true && !!product.addOnName;
  const selectedColorStockNote = product.colorVariants?.find(
    (v) => v.color === selectedColor,
  )?.stockNote;
  const unitPrice =
    (isMultiColor
      ? (Number(product.price) || 0) +
        Math.max(0, selectedColors.length - 1) *
          (Number(product.extraColorPrice) || 0)
      : Number(product.price) || 0) +
    (hasAddOn && addOnSelected ? Number(product.addOnPrice) || 0 : 0);

  const colorSelectionLabel = isMultiColor
    ? selectedColors.join(", ")
    : selectedColor;
  const addOnSelectionLabel =
    hasAddOn && addOnSelected ? product.addOnName : null;
  const composedSelectedColor =
    [colorSelectionLabel, addOnSelectionLabel].filter(Boolean).join(" + ") ||
    null;

  const toggleColor = (color) => {
    setSelectedColor(color);
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

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
      if (variant?.images?.length) {
        return variant.images
          .filter((img) => typeof img === "string" || img?.asset)
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
    }
    // Joy-collection products get a background-removed "poster" shot per
    // color variant duplicated on the homepage (image[0], image[1], ...) —
    // skip that many leading images so those posters don't also show up in
    // this page's gallery. Every other product keeps the original behavior
    // of just skipping the one cover image.
    return (product.image || [])
      .filter((img) => typeof img === "string" || img?.asset)
      .slice(getPosterCount(product))
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
  };

  const images = getImages();
  const mainImage = images[currentImageIndex];

  useEffect(() => {
    const strip = thumbStripRef.current;
    const thumb = thumbnailRefs.current[currentImageIndex];
    if (!strip || !thumb) return;

    // Centre the active thumbnail in the strip, same approach as the
    // bookings-tab pills: measure explicit offsets and scrollTo() rather
    // than scrollIntoView(), which doesn't reliably target this container.
    const target =
      thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2;
    strip.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
  }, [currentImageIndex]);

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
    const url = window.location.href;
    const shareData = {
      title: product.name,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      });
    }
  };

  const handleAddToCart = () => {
    if (isMultiColor && selectedColors.length === 0) {
      setValidationModal("color");
      return;
    }
    if (!isMultiColor && hasColors && !selectedColor) {
      setValidationModal("color");
      return;
    }
    if (!selectedSize) {
      setValidationModal("size");
      return;
    }

    const cartImageUrl =
      images[0] ||
      urlFor(getCardImage(product))
        .width(400)
        .height(533)
        .quality(80)
        .format("jpg")
        .url();

    addItem({
      id: product._id,
      name: product.name,
      price: unitPrice,
      image: cartImageUrl,
      selectedColor: composedSelectedColor,
      ...(isMultiColor ? { selectedColors } : {}),
      selectedSize,
      slug: product.slug?.current,
    });

    trackFacebookEvent("AddToCart", {
      content_name: product.name,
      content_type: "product",
      content_ids: [product._id],
      currency: "NGN",
      value: unitPrice,
    });

    openCart();
    setSelectedColor(null);
    setSelectedColors([]);
    setAddOnSelected(false);
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
              {validationModal === "color"
                ? "Select a colour"
                : "Select a size"}
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

      {/* Multi-color pricing info modal */}
      {showPricingInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2"
          onClick={() => setShowPricingInfo(false)}
        >
          <div
            className="bg-white rounded-xl p-4 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-light font-playfair text-slate-900 mb-2">
              How the pricing works
            </h3>
            <p className="text-slate-500 text-sm font-poppins mb-3">
              You're not limited to one colour — pick as many top colours as you
              like, and they'll all be paired with the same skirt in your order.
            </p>
            <p className="text-slate-500 text-sm font-poppins mb-3">
              This look includes the skirt + 1 top for{" "}
              <span className="font-semibold text-slate-700">
                ₦{(Number(product.price) || 0).toLocaleString()}
              </span>
              .{" "}
              {product.extraColorPrice ? (
                <>
                  Each additional top you choose costs{" "}
                  <span className="font-semibold text-slate-700">
                    ₦{Number(product.extraColorPrice).toLocaleString()}
                  </span>
                  .
                </>
              ) : null}
            </p>
            {product.extraColorPrice ? (
              <div className="mb-5 text-xs font-poppins text-slate-600">
                <p className="font-semibold text-slate-700 mb-1">Example</p>
                <p>
                  Pick {Math.min(3, product.colors?.length || 3)} tops → ₦
                  {(Number(product.price) || 0).toLocaleString()} + (2 tops × ₦
                  {Number(product.extraColorPrice).toLocaleString()}) ={" "}
                  <span className="font-semibold text-slate-900">
                    ₦
                    {(
                      (Number(product.price) || 0) +
                      2 * Number(product.extraColorPrice)
                    ).toLocaleString()}
                  </span>
                </p>
              </div>
            ) : (
              <div className="mb-5" />
            )}
            <button
              onClick={() => setShowPricingInfo(false)}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-poppins hover:bg-primary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="py-4 md:py-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary/80 transition-colors font-poppins text-sm"
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

          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-500 hover:text-primary hover:border-primary/40 transition-colors font-poppins text-sm"
            >
              {shareCopied ? (
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              )}
              {shareCopied ? "Copied!" : "Share"}
            </button>
            {shareCopied && (
              <span className="absolute -bottom-8 right-0 whitespace-nowrap text-[10px] font-poppins text-green-600 bg-white border border-green-200 px-2 py-0.5 rounded-full shadow-sm">
                Link copied!
              </span>
            )}
          </div>
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
                <div
                  ref={thumbStripRef}
                  className="flex gap-1 sm:gap-2 overflow-x-auto pb-2"
                >
                  {images.map((img, index) => (
                    <button
                      key={index}
                      ref={(el) => (thumbnailRefs.current[index] = el)}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
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
              <div className="flex justify-between">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-playfair leading-tight mb-1 sm:mb-2">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary font-poppins">
                    ₦{unitPrice.toLocaleString()}
                  </p>
                  {!isMultiColor &&
                    !addOnSelected &&
                    product.comparePrice &&
                    product.comparePrice > product.price && (
                      <p className="text-base text-slate-400 line-through font-poppins">
                        ₦{product.comparePrice.toLocaleString()}
                      </p>
                    )}
                </div>
              </div>
              {isMultiColor && (
                <p className="text-xs sm:text-sm text-slate-500 font-poppins -mt-2">
                  ₦{unitPrice.toLocaleString()} Includes the skirt + 1 top.
                  {product.extraColorPrice
                    ? ` Each extra top costs ₦${Number(
                        product.extraColorPrice,
                      ).toLocaleString()}.`
                    : ""}
                </p>
              )}
              {hasAddOn && (
                <div className="space-y-2 -mt-2">
                  <p className="text-xs sm:text-sm text-slate-500 font-poppins">
                    {addOnSelected ? (
                      <>
                        Includes {product.addOnName} (+₦
                        {(Number(product.addOnPrice) || 0).toLocaleString()})
                      </>
                    ) : (
                      <>
                        Price shown above is without the {product.addOnName}.
                        <br />
                        It's sold separately — check the box below to add it.
                      </>
                    )}
                  </p>
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addOnSelected}
                      onChange={(e) => setAddOnSelected(e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 accent-primary-500 focus:ring-primary-500/40"
                    />
                    <span className="text-xs sm:text-sm font-poppins text-slate-700">
                      Add {product.addOnName}{" "}
                      <span className="text-slate-400">
                        (+₦{(Number(product.addOnPrice) || 0).toLocaleString()})
                      </span>
                    </span>
                  </label>
                </div>
              )}

              {selectedColorStockNote && (
                <p className="flex items-center gap-1.5 text-xs sm:text-sm font-poppins text-amber-600">
                  <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" />
                  {selectedColorStockNote}
                </p>
              )}

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
              {hasColors && isMultiColor && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3 font-poppins uppercase tracking-wide flex items-center gap-1.5">
                    <span>
                      Top Colours{" "}
                      {selectedColors.length === 0 ? (
                        <span className="text-slate-400 normal-case font-normal tracking-normal">
                          — you can pick multiple colors of Top
                        </span>
                      ) : (
                        <span className="text-slate-400 normal-case font-normal tracking-normal">
                          — {selectedColors.length} selected
                        </span>
                      )}
                    </span>
                    <span className="relative inline-flex">
                      <button
                        type="button"
                        onClick={() => setShowPricingInfo(true)}
                        aria-label="How does pricing for multiple tops work?"
                        className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0 rounded-full border border-slate-300 text-slate-500 normal-case font-normal text-[10px] leading-none flex items-center justify-center hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        ?
                      </button>
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-normal normal-case tracking-normal text-white shadow-md">
                        How does pricing work?
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                      </span>
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          toggleColor(color);
                          setCurrentImageIndex(0);
                        }}
                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm capitalize ${
                          selectedColors.includes(color)
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

              {hasColors && !isMultiColor && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3 font-poppins uppercase tracking-wide">
                    Colour{" "}
                    {!selectedColor ? (
                      <span className="text-slate-400 normal-case font-normal tracking-normal">
                        — select one
                      </span>
                    ) : (
                      selectedColorStockNote && (
                        <span className="text-amber-600 normal-case font-normal tracking-normal">
                          — {selectedColorStockNote}
                        </span>
                      )
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
                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm capitalize ${
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
                    <span className="text-slate-400 normal-case font-normal tracking-normal">
                      — select one
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[2.75rem] py-1 sm:py-2 px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 font-poppins text-xs sm:text-sm ${
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

              {hasAddOn && (
                <div>
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addOnSelected}
                      onChange={(e) => setAddOnSelected(e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 accent-primary-500 focus:ring-primary-500/40"
                    />
                    <span className="text-xs sm:text-sm font-poppins text-slate-700">
                      Add {product.addOnName}{" "}
                      <span className="text-slate-400">
                        (+₦{(Number(product.addOnPrice) || 0).toLocaleString()})
                      </span>
                    </span>
                  </label>
                </div>
              )}
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
