// src/components/PageClient.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoVolumeHighSharp, IoVolumeMute } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/CartSlice";
import { useCart } from "./CartProvider";
import { urlFor } from "@/sanity/lib/image";
import useEmblaCarousel from "embla-carousel-react";
import ProductModal from "./ProductModal";
import NewsletterPopup from "./NewsletterPopup";
import Link from "next/link";
import { subscribeToNewsletter } from '../services/newsletterService';

// Brand Story Carousel Component
const BrandStoryCarousel = ({ product }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 15,
  });

  // Auto-slide effect
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="embla overflow-hidden h-full" ref={emblaRef}>
      <div className="embla__container flex h-full">
        {product.image.map((img, index) => (
          <div
            className="embla__slide flex-shrink-0 w-full h-full relative"
            key={img._key || index}
          >
            <Image
              src={urlFor(img).width(600).height(600).url()}
              alt={`${product.name} - View ${index + 1}`}
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

// Brand Story Product Card Component
const BrandStoryProductCard = ({ product }) => {
  return (
    <div className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl group">
      {product.image.length > 1 ? (
        <BrandStoryCarousel product={product} />
      ) : (
        <Image
          src={urlFor(product.image[0]).width(600).height(600).url()}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority
        />
      )}
    </div>
  );
};

export default function Home({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSlides, setCurrentSlides] = useState({});
  const dispatch = useDispatch();
  const { openCart } = useCart();

  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix video loading and overflow issues
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedData = () => {
        console.log("Video loaded successfully");
        setIsVideoLoaded(true);
        setVideoError(false);
      };
      
      const handleCanPlay = () => {
        console.log("Video can play");
        setIsVideoLoaded(true);
      };
      
      const handleError = (e) => {
        console.error("Video failed to load:", e);
        setIsVideoLoaded(false);
        setVideoError(true);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      // Try to play the video
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Autoplay prevented:", error);
          // Autoplay was prevented, but video is still loaded
        }
      };

      playVideo();

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, []);

  // Prevent horizontal overflow
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  // Auto-slide effect for homepage grid only
  useEffect(() => {
    const intervals = {};

    products.forEach((product) => {
      if (product.image.length > 1) {
        intervals[product._id] = setInterval(() => {
          setCurrentSlides((prev) => ({
            ...prev,
            [product._id]:
              ((prev[product._id] || 0) + 1) % product.image.length,
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [products]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Updated newsletter subscription handler with Firebase
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setSubscriptionStatus('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubscriptionStatus('');

    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setSubscriptionStatus('success');
        setEmail('');
        // Clear success message after 5 seconds
        setTimeout(() => setSubscriptionStatus(''), 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = (product) => {
    // Use the original product structure from Sanity
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

  const handleProductClick = (product) => {
    // Create consistent modal product structure
    const modalProduct = {
      ...product,
      processedImages: product.image.map((img) =>
        urlFor(img).width(600).height(800).url()
      ),
    };
    setSelectedProduct(modalProduct);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Enhanced Hero Section with Video - Fixed */}
      <section className="relative h-[60vh] lg:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {/* Video with correct file paths */}
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover"
            preload="auto"
            poster="/5b.jpg" // Using your actual fallback image
          >
            <source src="/Video.mp4" type="video/mp4" /> {/* Capital V */}
            Your browser does not support the video tag.
          </video>

          {/* Video Loading State */}
          {!isVideoLoaded && !videoError && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading video...</p>
              </div>
            </div>
          )}

          {/* Video Error State - Show fallback image */}
          {videoError && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
              <Image
                src="/5b.jpg"
                alt="Kavan The Brand"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-white text-center bg-black/50 p-6 rounded-lg">
                  <p className="text-lg mb-2">Video unavailable</p>
                  <p className="text-sm">Showing fallback image</p>
                </div>
              </div>
            </div>
          )}

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 left-4 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <IoVolumeMute size={20} />
            ) : (
              <IoVolumeHighSharp size={20} />
            )}
          </button>

          {/* Order Now Button - Bottom Center */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <Link
              href="/shop"
              className="bg-white/90 text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-white hover:scale-105 transform transition-all duration-300 shadow-2xl flex items-center space-x-2 group"
            >
              <span>Order Now</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-0" />
        </div>
      </section>

      {/* Enhanced Featured Collections - Fixed overflow */}
      <section className="py-10 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-2xl md:text-5xl mb-3 font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
              Curated Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-semibold">
              Discover pieces that transform your wardrobe and elevate your
              style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const currentSlide = currentSlides[product._id] || 0;
              const displayImage = product.image[currentSlide]
                ? urlFor(product.image[currentSlide])
                    .width(600)
                    .height(800)
                    .url()
                : "/5b.jpg"; // Fallback to your image

              return (
                <div
                  key={product._id}
                  className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-2xl shadow-xl">
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={currentSlide === 0}
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                        New
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="cursor-pointer w-full bg-white text-black py-3 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-colors">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="text-center p-2">
                    <h3 className="font-light text-xl mb-2 text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Brand Story Section - Fixed layout */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {products.slice(0, 2).map((product, index) => (
                  <div key={product._id} className="relative group">
                    <BrandStoryProductCard product={product} />

                    {/* Show overlay only on the first product in left column */}
                    {index === 0 && (
                      <>
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl pointer-events-none" />

                        {/* Best Seller & Shop Now Overlay */}
                        <div
                          className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="space-y-2">
                            <div className="text-left text-white text-xs font-semibold">
                              BEST SELLER
                            </div>
                            <button className="text-white font-semibold text-sm w-fit border-b border-white">
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4 mt-8">
                {products.slice(2, 4).map((product, index) => (
                  <div key={product._id} className="relative group">
                    <BrandStoryProductCard product={product} />

                    {/* Show overlay only on the first product in right column */}
                    {index === 0 && (
                      <>
                        {/* Gradient overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl pointer-events-none" />

                        {/* Best Seller & Shop Now Overlay */}
                        <div
                          className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="space-y-2">
                            <div className="text-left text-white text-xs font-semibold">
                              BEST SELLER
                            </div>
                            <button className="text-white font-semibold text-sm w-fit border-b border-white">
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  Our Philosophy
                </span>
                <h2 className="text-4xl font-light mb-6 text-gray-900">
                  Designed for Life's Moments
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      Quality Craftsmanship
                    </h3>
                    <p className="text-gray-600">
                      Every stitch tells a story of dedication and excellence
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">♻</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      Sustainable Choices
                    </h3>
                    <p className="text-gray-600">
                      Materials that respect both people and planet
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">✨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      Timeless Appeal
                    </h3>
                    <p className="text-gray-600">
                      Pieces designed to transcend seasonal trends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-light mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Join Our Style Community
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive access to new collections, styling tips, and special
            offers
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-white text-white placeholder-gray-400 disabled:opacity-50"
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>

          {/* Status Messages */}
          {subscriptionStatus === 'success' && (
            <div className="max-w-md mx-auto mb-4 p-3 bg-green-500/20 border border-green-500 rounded-xl text-green-300">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Successfully subscribed! Welcome to our style community.</span>
              </div>
            </div>
          )}

          {subscriptionStatus && subscriptionStatus !== 'success' && (
            <div className="max-w-md mx-auto mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-300">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{subscriptionStatus}</span>
              </div>
            </div>
          )}

          <p className="text-gray-500 text-xs">
            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Newsletter Popup */}
      <NewsletterPopup />
    </main>
  );
}