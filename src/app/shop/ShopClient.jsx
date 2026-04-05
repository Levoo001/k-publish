// src/components/ShopClient.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { subscribeToNewsletter } from "@/services/newsletterService";

export default function ShopClient({ products }) {
  const router = useRouter();

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Collection filtering
  const rebirthProductNames = [
    "the amarachi set",
    "the chisom dress",
    "the amara set",
    "the zahra dress",
    "the adanna dress",
  ];
  const bloomCollection = products.filter(
    (p) => !rebirthProductNames.includes(p.name?.toLowerCase().trim()),
  );
  const rebirthCollection = products.filter((p) =>
    rebirthProductNames.includes(p.name?.toLowerCase().trim()),
  );

  const handleProductClick = (product) => {
    router.push(`/products/${encodeURIComponent(product.name)}`);
  };

  // Newsletter subscription handler with timeout management
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      setSubscriptionStatus("Please enter your email address");
      // Auto-clear after 4 seconds
      setTimeout(() => setSubscriptionStatus(""), 4000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus("Please enter a valid email address");
      // Auto-clear after 4 seconds
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
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSubscriptionStatus(""), 5000);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscriptionStatus(error.message);
      // Auto-clear error message after 5 seconds
      setTimeout(() => setSubscriptionStatus(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Bloom Collection Section */}
      <section className="bg-gradient-to-r from-white to-primary-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="">
            <h1 className="text-3xl md:text-5xl font-playfair mb-3 text-primary text-center">
              The Bloom Collection
            </h1>
            <div className="space-y-2 text-slate-700 leading-snug font-poppins max-w-2xl mx-auto text-center text-sm md:text-base">
              <p>
                Bloom is about living in your presence fully and without
                apology.
              </p>
              <p>
                It is the quiet confidence that comes from no longer abandoning
                yourself.
              </p>
              <p className="italic text-xs md:text-sm">
                Not louder. Not harder. Just more you.
              </p>
              <p className="pt-1">
                Because when you stop disappearing… you don't need to prove
                anything.
              </p>
              <div className="bg-primary text-white p-3 italic mt-2 rounded text-xs md:text-sm">
                <p>You simply exist and that is felt.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloom Collection Products Grid */}
      <section className="container mx-auto px-2 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {bloomCollection.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-lg rounded-xl group-hover:shadow-luxury"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-t-xl transition-all duration-300">
                <Image
                  src={urlFor(product.image[1])
                    .width(600)
                    .height(800)
                    .quality(90)
                    .format("jpg")
                    .fit("fill")
                    .bg("FFFFFF")
                    .url()}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="text-center p-2 space-y-2">
                <h3 className="font-light text-base md:text-lg text-primary line-clamp-2 font-playfair">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary font-poppins">
                  ₦{product.price?.toLocaleString()}
                </p>

                <button
                  className="md:hidden w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-2 font-poppins"
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

      {/* Rebirth Collection Section */}
      <section className="bg-gradient-to-r from-primary-50 to-white py-8 mt-6 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="">
            <h1 className="text-3xl md:text-5xl font-playfair mb-3 text-primary text-center">
              The Rebirth Collection
            </h1>
            <div className="space-y-2 text-slate-700 leading-snug font-poppins max-w-2xl mx-auto text-center text-sm md:text-base">
              <p>
                Rebirth is where it begins. Not with certainty, not with
                confidence—but with awareness.
              </p>
              <p>
                The quiet realization that you began to disappear into
                expectations, responsibilities, into being everything for
                everyone else except yourself.
              </p>
              <p className="pt-1">
                Rebirth is not about having answers. It is about no longer
                ignoring the question.
              </p>
              <div className="bg-primary text-white p-3 italic rounded text-xs md:text-sm">
                <p>Who am I when I am not performing for the world?</p>
              </div>
              <p>
                This collection lives in that space—the in-between, the
                becoming. Where you start to feel again, notice yourself again,
                and begin gently to come back.
              </p>
              <p>Not all at once. Not perfectly. But intentionally.</p>
              <p>
                Because the moment you see yourself clearly, you cannot go back
                to being unseen.
              </p>
              <div className="bg-primary text-white p-3 italic rounded text-xs md:text-sm">
                <p>This is where you begin again.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rebirth Collection Products Grid */}
      <section className="container mx-auto px-2 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {rebirthCollection.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-lg rounded-xl group-hover:shadow-luxury"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-t-xl transition-all duration-300">
                <Image
                  src={urlFor(product.image[1])
                    .width(600)
                    .height(800)
                    .quality(90)
                    .format("jpg")
                    .fit("fill")
                    .bg("FFFFFF")
                    .url()}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="text-center p-2 space-y-2">
                <h3 className="font-light text-base md:text-lg text-primary line-clamp-2 font-playfair">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary font-poppins">
                  ₦{product.price?.toLocaleString()}
                </p>

                <button
                  className="md:hidden w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-2 font-poppins"
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

      {/* Enhanced Newsletter Section */}
      <section className="py-16 bg-primary text-white overflow-hidden relative">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-light mb-6 bg-white bg-clip-text text-transparent font-playfair">
            Stay Updated
          </h2>
          <p className="text-primary-200 mb-8 max-w-2xl mx-auto font-poppins text-lg">
            Be the first to know about new arrivals, exclusive offers, and
            styling tips
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
              className="flex-1 px-4 py-3 border border-primary rounded-xl focus:outline-none focus:border-white text-primary-900 placeholder-primary-300 disabled:opacity-50 font-poppins backdrop-blur-sm bg-white/95"
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

          {/* Beautiful Status Messages with Auto-timeout */}
          <div className="max-w-md mx-auto mb-4">
            {/* Success Message */}
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

            {/* Error Message */}
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

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24"></div>
      </section>
    </main>
  );
}
