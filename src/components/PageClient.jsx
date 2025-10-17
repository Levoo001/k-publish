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
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { BsWhatsapp } from "react-icons/bs";

// Brand Story Carousel Component
const BrandStoryCarousel = ({ product }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 15,
  });

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
    <div className="aspect-square relative rounded-2xl overflow-hidden shadow-luxury group">
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
  const [videoError, setVideoError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simplified video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsVideoReady(true);
      setVideoError(false);
    };

    const handleLoadedData = () => {
      setIsVideoReady(true);
    };

    const handleError = (e) => {
      console.error("Video failed to load:", e);
      setVideoError(true);
      setIsVideoReady(false);
    };

    const handlePlaying = () => {
      setIsVideoReady(true);
    };

    // Add event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('playing', handlePlaying);

    // Try to play the video
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log("Autoplay prevented:", error);
        // Video is still loaded, just not playing due to autoplay restrictions
      }
    };

    playVideo();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('playing', handlePlaying);
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
    <main className="min-h-screen">
       <section className="relative h-[60vh] lg:h-[90vh] flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 w-full h-full">
    {/* Video - Always try to show it first */}
    <video
      ref={videoRef}
      autoPlay
      muted={isMuted}
      loop
      playsInline
      className="w-full h-full object-cover"
      preload="auto"
      poster="/fallback.jpg"
    >
      <source src="/vid.mp4" type="video/mp4" />
    </video>

    {/* Fallback Image - Only show if video fails */}
    {videoError && (
      <Image
        src="/fallback.jpg"
        alt="Kavan The Brand"
        fill
        className="object-cover"
        priority
      />
    )}

    {/* Text moved to bottom left corner - maintaining exact styling */}
    <div className="absolute left-2 bottom-2 inset-0 flex items-end justify-start text-white z-20 pb-8 pl-6 lg:pl-12">
      <div className="">
        {/* Main Title - Matches Kilentar exactly */}
        <h1 className="text-lg md:text-xl lg:text-2xl uppercase font-playfair">
          THE REBIRTH
        </h1>
        
        {/* Shop Now Button - Kilentar style */}
        <Link
          href="/shop"
          className="py-2 flex items-center gap-2 text-white hover:text-burgundy-200 transition-colors"
        >
          <span className="border-b border-white hover:border-burgundy-200 transition-colors font-inter">
            Order Now 
          </span>
          <HiOutlineArrowLongRight size={30} />
        </Link>
      </div>
    </div>

    {/* Mute Button */}
    <button
      onClick={toggleMute}
      className="absolute bottom-4 right-4 z-30 bg-burgundy/50 text-white p-3 rounded-full hover:bg-burgundy/70 transition-all duration-300 backdrop-blur-sm"
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

      {/* Updated Featured Collections - 2 items on mobile */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl mb-4 font-light tracking-wide text-burgundy-900 font-playfair">
              Curated Collection
            </h2>
            <p className="text-burgundy-600 max-w-2xl mx-auto text-lg font-cormorant">
              Discover pieces that transform your wardrobe and elevate your style
            </p>
          </div>

          {/* 2 items per row on mobile, 3 on larger screens */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {products.map((product) => {
              const currentSlide = currentSlides[product._id] || 0;
              const displayImage = product.image[currentSlide]
                ? urlFor(product.image[currentSlide])
                    .width(600)
                    .height(800)
                    .url()
                : "/fallback.jpg";

              return (
                <div
                  key={product._id}
                  className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-4">
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      priority={currentSlide === 0}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-burgundy/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm font-inter">
                        New
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="cursor-pointer w-full bg-burgundy text-white py-2 text-sm font-medium rounded shadow-lg hover:bg-burgundy-700 transition-colors font-inter">
                        Quick View
                      </button>
                    </div>
                  </div>
                  <div className="text-center p-2">
                    <h3 className="font-light text-base mb-1 text-burgundy-900 line-clamp-1 font-playfair">
                      {product.name}
                    </h3>
                    <p className="text-base font-medium text-burgundy font-inter">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 bg-gradient-to-br from-burgundy-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {products.slice(0, 2).map((product, index) => (
                  <div key={product._id} className="relative group">
                    <BrandStoryProductCard product={product} />

                    {/* Best Seller & Shop Now Overlay */}
                    {index === 0 && (
                        <div
                          className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="space-y-2">
                            <div className="text-left text-white text-xs font-semibold font-inter">
                              BESTSELLER
                            </div>
                            <button className="text-white font-semibold text-sm w-fit border-b border-white hover:border-burgundy-200 transition-colors font-inter">
                              Shop Now
                            </button>
                          </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4 mt-8">
                {products.slice(2, 4).map((product, index) => (
                  <div key={product._id} className="relative group">
                    <BrandStoryProductCard product={product} />

                    {/* Best Seller & Shop Now Overlay */}
                    {index === 0 && (

                        <div
                          className="absolute inset-0 flex flex-col justify-end p-4 cursor-pointer rounded-2xl z-10"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="space-y-2">
                            <div className="text-left text-white text-xs font-semibold font-inter">
                              BESTSELLER
                            </div>
                            <button className="text-white font-semibold text-sm w-fit border-b border-white hover:border-burgundy-200 transition-colors font-inter">
                              Shop Now
                            </button>
                          </div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block bg-burgundy text-white px-4 py-2 rounded-full text-sm font-medium mb-4 font-inter">
                  Our Philosophy
                </span>
                <h2 className="text-4xl font-light mb-6 text-burgundy-900 font-playfair">
                  Designed for Life's Moments
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-elegant transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-burgundy to-burgundy-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-burgundy-900 font-playfair">
                      Quality Craftsmanship
                    </h3>
                    <p className="text-burgundy-600 font-cormorant">
                      Every stitch tells a story of dedication and excellence
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-elegant transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-burgundy to-burgundy-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">♻</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-burgundy-900 font-playfair">
                      Sustainable Choices
                    </h3>
                    <p className="text-burgundy-600 font-cormorant">
                      Materials that respect both people and planet
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white hover:shadow-elegant transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-burgundy to-burgundy-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">✨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-burgundy-900 font-playfair">
                      Timeless Appeal
                    </h3>
                    <p className="text-burgundy-600 font-cormorant">
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
      <section className="py-16 bg-burgundy text-white overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-light mb-6 bg-gradient-to-r from-white to-burgundy-200 bg-clip-text text-transparent font-playfair">
            Join Our Style Community
          </h2>
          <p className="text-lg text-burgundy-200 mb-8 max-w-2xl mx-auto font-cormorant">
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
              className="flex-1 px-4 py-3 bg-burgundy-800 border border-burgundy-700 rounded-xl focus:outline-none focus:border-white text-white placeholder-burgundy-300 disabled:opacity-50 font-inter"
              required
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-burgundy px-6 py-3 rounded-xl hover:bg-burgundy-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-inter"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-burgundy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <span className="text-sm font-inter">Successfully subscribed! Welcome to our style community.</span>
              </div>
            </div>
          )}

          {subscriptionStatus && subscriptionStatus !== 'success' && (
            <div className="max-w-md mx-auto mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-300">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-inter">{subscriptionStatus}</span>
              </div>
            </div>
          )}

          <p className="text-burgundy-300 text-xs font-cormorant">
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

{/* Floating WhatsApp icon */}
      <Link href="https://wa.me/2347036210107" target="_blank" className="fixed bottom-14 right-2 p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors">
                    <BsWhatsapp size={25} color="white" />
                  </Link>

      {/* Newsletter Popup */}
      <NewsletterPopup />
    </main>
  );
}