// src/components/PageClient.jsx

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { IoVolumeHighSharp, IoVolumeMute } from "react-icons/io5";
import { urlFor } from "@/sanity/lib/image";
import useEmblaCarousel from "embla-carousel-react";
import ProductModal from "./ProductModal";
import Link from "next/link";
import { subscribeToNewsletter } from "../services/newsletterService";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import NewsletterPopup from "./NewsletterPopup";
import QuoteCarousel from "./QuoteCarousel";
import WhatsAppChatPopup from "./WhatsAppChatPopup";

// Featured Collections Carousel Component
const FeaturedCollectionsCarousel = ({ products, onProductClick }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    (index) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  // Show all products
  const displayProducts = products;
  const totalSlides = Math.ceil(displayProducts.length / 2);

  return (
    <section className="bg-white">
      <div className="container mx-auto p-2 max-w-7xl">
        {/* Mobile: Carousel (hidden on lg+) */}
        <div className="lg:hidden">
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="embla__slide flex-shrink-0 w-full min-w-0"
                  style={{ flex: "0 0 100%" }}
                >
                  <div className="grid grid-cols-2 gap-4 md:gap-8 px-2">
                    {displayProducts
                      .slice(slideIndex * 2, slideIndex * 2 + 2)
                      .map((product) => {
                        const displayImage = product.image[0]
                          ? urlFor(product.image[0])
                              .width(600)
                              .height(800)
                              .quality(90)
                              .format("jpg")
                              .fit("fill")
                              .bg("FFFFFF")
                              .url()
                          : "/fallback.jpg";

                        return (
                          <div
                            key={product._id}
                            className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
                            onClick={() => onProductClick(product)}
                          >
                            <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white rounded-lg">
                              <Image
                                src={displayImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                sizes="50vw"
                                priority={slideIndex === 0}
                              />
                            </div>
                            <div className="text-center">
                              <h3 className="font-light text-sm mb-1 text-primary-900 line-clamp-1 font-playfair">
                                {product.name}
                              </h3>
                              <p className="text-sm font-medium text-primary font-poppins">
                                ₦{product.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet Dot Indicators */}
          <div className="flex items-center justify-center space-x-1 mt-5">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => onDotButtonClick(index)}
                className="flex items-center justify-center w-5 h-5"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    selectedIndex === index
                      ? "w-5 h-5 border-2 border-gray-900 rounded-full"
                      : ""
                  }`}
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? "w-1 h-1 bg-slate-900"
                        : "w-1.5 h-1.5 bg-slate-400 hover:bg-slate-600"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Static Grid (lg+) */}
        <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-6 px-2 py-4">
          {displayProducts.map((product) => {
            const displayImage = product.image[0]
              ? urlFor(product.image[0])
                  .width(600)
                  .height(800)
                  .quality(90)
                  .format("jpg")
                  .fit("fill")
                  .bg("FFFFFF")
                  .url()
              : "/fallback.jpg";

            return (
              <div
                key={product._id}
                className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white rounded-lg">
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1280px) 25vw, 20vw"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-light text-sm mb-1 text-primary-900 line-clamp-1 font-playfair">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-primary font-poppins">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Bottom Cards Carousel Component - Shows random first images from all products
const BottomCardsCarousel = ({ products, startIndex = 0 }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  // Get all first images from products
  const allFirstImages = products.map((product) => ({
    image: product.image[1],
    productName: product.name,
  }));

  // Start from different positions based on startIndex
  const reorderedImages = [
    ...allFirstImages.slice(startIndex),
    ...allFirstImages.slice(0, startIndex),
  ];

  return (
    <div className="embla overflow-hidden h-full" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {reorderedImages.map((item, index) => (
          <div
            className="embla__slide flex-shrink-0 w-full h-full relative"
            key={index}
          >
            <Image
              src={urlFor(item.image)
                .width(800)
                .height(800)
                .quality(90) // Change from 85 to 90
                .format("jpg")
                .fit("fill") // ADD THIS
                .bg("FFFFFF") // ADD THIS
                .url()}
              alt={`${item.productName} - Featured`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Static Product Card Component (for Bestsellers and Co-ords)
const StaticProductCard = ({ product }) => {
  return (
    <div className="aspect-[3/3.9] relative rounded-2xl overflow-hidden shadow-luxury group">
      <Image
        src={urlFor(product.image[1] || product.image[0])
          .width(800)
          .height(1040)
          .quality(90)
          .format("jpg")
          .fit("fill")
          .bg("FFFFFF")
          .url()}
        alt={product.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        priority
      />
    </div>
  );
};

export default function Home({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get specific products for each section
  const bestsellerProduct = products.find(
    (product) => product.name === "The Amarachi Set",
  );
  const coordProduct = products.find(
    (product) => product.name === "The Amara Set",
  );
  const dressessProduct = products.find((product) =>
    product.name?.toLowerCase().includes("dress"),
  );
  const blouseProduct = products.find((product) =>
    product.name?.toLowerCase().includes("blouse"),
  );

  // Video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoError(false);
    };

    const handleError = (e) => {
      console.error("Video failed to load:", e);
      setVideoError(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Try to play the video
    const playVideo = async () => {
      try {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            if (
              error.name !== "AbortError" &&
              error.name !== "NotAllowedError"
            ) {
              console.error("Autoplay prevented:", error);
            }
          });
        }
      } catch (error) {
        if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
          console.error("Autoplay prevented:", error);
        }
      }
    };

    playVideo();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Newsletter subscription handler
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      setSubscriptionStatus("Please enter your email address");
      setTimeout(() => setSubscriptionStatus(""), 4000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus("Please enter a valid email address");
      setTimeout(() => setSubscriptionStatus(""), 4000);
      return;
    }

    setIsSubmitting(true);
    setSubscriptionStatus("");

    try {
      const result = await subscribeToNewsletter(email);

      if (result.success) {
        setSubscriptionStatus("success");
        setEmail("");
        setTimeout(() => setSubscriptionStatus(""), 5000);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setEmail("");
      setSubscriptionStatus(error.message);
      setTimeout(() => setSubscriptionStatus(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductClick = (product) => {
    const modalProduct = {
      ...product,
      // Strip the first image — modal shows from image[1] onward
      processedImages: product.image
        .slice(1)
        .map((img) =>
          urlFor(img)
            .width(1200)
            .height(1600)
            .quality(95)
            .format("jpg")
            .fit("fill")
            .bg("FFFFFF")
            .url(),
        ),
    };
    setSelectedProduct(modalProduct);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <main className="min-h-screen">
      <section className="relative w-full aspect-[4/5] md:aspect-video lg:h-[70vh] lg:aspect-auto flex items-center justify-center overflow-hidden bg-primary-900 border-white/10">
        <div className="relative w-full h-full flex items-center justify-center lg:overflow-hidden lg:shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover lg:object-contain bg-black"
            preload="auto"
            poster="/fallback.jpg"
          >
            <source src="/vid.mp4" type="video/mp4" />
          </video>

          {videoError && (
            <Image
              src="/fallback.jpg"
              alt="Kavan The Brand"
              fill
              className="object-cover lg:object-contain bg-black"
              priority
            />
          )}

          <div className="absolute left-4 bottom-4 inset-0 flex items-end justify-start text-white z-20 lg:pl-12 lg:pb-12 pointer-events-none">
            <div className="pointer-events-auto">
              <h1 className="text-lg md:text-xl lg:text-2xl uppercase font-playfair drop-shadow-md">
                THE BLOOM
              </h1>

              <Link
                href="/shop"
                className="py-2 flex items-center gap-2 text-white hover:text-primary-200 transition-colors drop-shadow-md"
              >
                <span className="border-b border-white hover:border-primary-200 transition-colors font-poppins">
                  Order Now
                </span>
                <HiOutlineArrowLongRight size={30} />
              </Link>
            </div>
          </div>

          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 lg:bottom-12 lg:right-12 z-30 bg-black/20 text-white p-3 rounded-full hover:bg-primary/70 transition-all duration-300 backdrop-blur-sm"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <IoVolumeMute size={20} />
            ) : (
              <IoVolumeHighSharp size={20} />
            )}
          </button>
        </div>
      </section>

      <FeaturedCollectionsCarousel
        products={products}
        onProductClick={handleProductClick}
      />

      {/* SECONDARY VIDEO SECTION */}
      <section className="relative w-full aspect-[4/5] lg:h-[70vh] lg:aspect-auto overflow-hidden bg-black my-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover lg:object-contain bg-black"
          preload="auto"
          poster="/fallback2.jpg"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        >
          <source
            src="https://ck7vajewsn9hvwtw.public.blob.vercel-storage.com/vid2.mp4"
            type="video/mp4"
          />
        </video>
        <Image
          src="/fallback2.jpg"
          alt="Kavan The Brand"
          fill
          className="object-cover -z-10"
        />
      </section>

      {/* FEATURED COLLECTIONS - Static Second Images */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* 2 items per row on mobile, 3 on md, 4 on lg, 5 on xl */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {products.map((product) => {
              const displayImage =
                product.image[1] || product.image[0]
                  ? urlFor(product.image[1] || product.image[0])
                      .width(800)
                      .height(1000)
                      .quality(90)
                      .format("jpg")
                      .fit("fill")
                      .bg("FFFFFF")
                      .url()
                  : "/fallback.jpg";

              return (
                <div
                  key={product._id}
                  className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-xl">
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 rounded-xl"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      priority
                    />
                  </div>
                  <div className="text-center p-2">
                    <h3 className="font-light text-base mb-1 text-primary-900 line-clamp-1 font-playfair">
                      {product.name}
                    </h3>
                    <p className="text-base font-medium text-primary font-poppins">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Left Column - Bestsellers (Single Card) */}
            <div className="space-y-4">
              {bestsellerProduct && (
                <div className="relative group">
                  <StaticProductCard product={bestsellerProduct} />
                  <Link
                    href="/collections/bestsellers"
                    className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                  >
                    <div className="space-y-1">
                      <div className="text-left text-white text-sm font-semibold font-poppins">
                        BESTSELLERS
                      </div>
                      <button className="text-white font-semibold text-xs w-fit border-b border-white hover:border-primary-200 transition-colors font-poppins">
                        Shop Now
                      </button>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column - Co-ords (Single Card) - Positioned Lower */}
            <div className="space-y-4 mt-8 lg:mt-0">
              {coordProduct && (
                <div className="relative group">
                  <StaticProductCard product={coordProduct} />
                  <Link
                    href="/collections/co-ords"
                    className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                  >
                    <div className="space-y-1">
                      <div className="text-left text-white text-sm font-semibold font-poppins">
                        CO-ORDS
                      </div>
                      <button className="text-white font-semibold text-xs w-fit border-b border-white hover:border-primary-200 transition-colors font-poppins">
                        Shop Now
                      </button>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Left Column - Dressess (Single Card) - Positioned Lower */}
            <div className="space-y-4">
              {dressessProduct && (
                <div className="relative group">
                  <StaticProductCard product={dressessProduct} />
                  <Link
                    href="/collections/dressess"
                    className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                  >
                    <div className="space-y-1">
                      <div className="text-left text-white text-sm font-semibold font-poppins">
                        Dressess
                      </div>
                      <button className="text-white font-semibold text-xs w-fit border-b border-white hover:border-primary-200 transition-colors font-poppins">
                        Shop Now
                      </button>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Blouse Column */}
            <div className="space-y-4 mt-8 lg:mt-0">
              {blouseProduct && (
                <div className="relative group">
                  <StaticProductCard product={blouseProduct} />
                  <Link
                    href="/collections/blouse"
                    className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                  >
                    <div className="space-y-1">
                      <div className="text-left text-white text-sm font-semibold font-poppins">
                        Blouse
                      </div>
                      <button className="text-white font-semibold text-xs w-fit border-b border-white hover:border-primary-200 transition-colors font-poppins">
                        Shop Now
                      </button>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Two Cards with Carousel - No Links */}
          <div className="grid grid-cols-2 gap-4 mt-8 lg:max-w-2xl xl:max-w-3xl lg:mx-auto">
            {/* First Bottom Card with Carousel - Starts from index 0 */}
            <div className="relative group">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-luxury group">
                <BottomCardsCarousel products={products} startIndex={0} />
              </div>
            </div>

            {/* Second Bottom Card with Carousel - Starts from middle index */}
            <div className="relative group mt-8">
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-luxury group">
                <BottomCardsCarousel
                  products={products}
                  startIndex={Math.floor(products.length / 2)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white overflow-hidden relative">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-light mb-6 bg-white bg-clip-text text-transparent font-playfair">
            Join Our Style Community
          </h2>
          <p className="text-lg text-primary-200 mb-8 max-w-2xl mx-auto font-poppins">
            Get exclusive access to new collections, styling tips, and special
            offers
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-primary-700 rounded-xl focus:outline-none focus:border-white text-primary placeholder-primary-300 disabled:opacity-50 font-poppins backdrop-blur-sm bg-white/95"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-primary px-6 py-3 rounded-xl hover:bg-primary-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-poppins transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>

          <div className="max-w-md mx-auto mb-4">
            {subscriptionStatus === "success" && (
              <div className="animate-fadeInUp bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-l-4 border-green-400 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-green-100 font-semibold text-sm font-poppins mb-1">
                      Welcome to Kavan! 🎉
                    </h4>
                    <p className="text-green-200 text-xs font-poppins leading-relaxed">
                      You're now part of our style community. Check your email
                      for exclusive offers!
                    </p>
                  </div>
                  <button
                    onClick={() => setSubscriptionStatus("")}
                    className="flex-shrink-0 text-green-300 hover:text-green-100 transition-colors"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {subscriptionStatus && subscriptionStatus !== "success" && (
              <div className="animate-fadeInUp bg-gradient-to-r from-red-500/20 to-pink-500/20 border-l-4 border-red-400 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-red-100 font-semibold text-sm font-poppins mb-1">
                      Subscription Failed
                    </h4>
                    <p className="text-red-200 text-xs font-poppins leading-relaxed">
                      {subscriptionStatus}
                    </p>
                  </div>
                  <button
                    onClick={() => setSubscriptionStatus("")}
                    className="flex-shrink-0 text-red-300 hover:text-red-100 transition-colors"
                  >
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
                        d="M6 18L18-6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-primary-300 text-xs font-poppins">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any
            time.
          </p>
        </div>

        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24"></div>
      </section>

      <QuoteCarousel />

      <ProductModal
        key={selectedProduct?._id}
        product={selectedProduct}
        onClose={handleCloseModal}
      />

      <NewsletterPopup />

      <WhatsAppChatPopup />
    </main>
  );
}
