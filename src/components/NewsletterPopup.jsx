// src/components/NewsletterPopup.jsx
// src/components/NewsletterPopup.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNewsletter } from "@/services/newsletterService";
import { useAuth, useUser } from "@clerk/nextjs";
import { usePopup } from "./PopupContext";

const NewsletterPopup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { popupInitialized, isPopupOpen, openPopup, closePopup } = usePopup();

  const hasSetupPopup = useRef(false);

  useEffect(() => {
    // Only run this once when auth is loaded and popup is initialized
    if (!popupInitialized || !isLoaded || hasSetupPopup.current) return;
    hasSetupPopup.current = true;

    // Check if user is signed in
    if (isSignedIn) {
      // User is signed in - close popup and mark as subscribed
      localStorage.setItem("newsletterSubscribed", "true");
      return;
    }

    // User is signed out - check if we should show popup
    const hasSubscribed = localStorage.getItem("newsletterSubscribed");
    const hasDismissed = localStorage.getItem("newsletterDismissed");

    if (!hasSubscribed && !hasDismissed) {
      // Show popup after 10 seconds for signed-out users
      const timer = setTimeout(() => {
        openPopup();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isSignedIn, isLoaded, popupInitialized, openPopup]);

  // Listen for sign-out events
  useEffect(() => {
    if (isLoaded && !isSignedIn && popupInitialized) {
      const hasDismissed = localStorage.getItem("newsletterDismissed");
      
      if (!hasDismissed) {
        const timer = setTimeout(() => {
          openPopup();
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isSignedIn, isLoaded, popupInitialized, openPopup]);

  // Pre-fill email if user is signed in but hasn't subscribed
  useEffect(() => {
    if (isSignedIn && user && !localStorage.getItem("newsletterSubscribed")) {
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [isSignedIn, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscriptionStatus('Please enter a valid email address');
      setTimeout(() => setSubscriptionStatus(''), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubscriptionStatus("");

    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        localStorage.setItem("newsletterSubscribed", "true");
        setSubscriptionStatus("success");
        
        setTimeout(() => {
          closePopup();
          setEmail("");
        }, 2000);
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      
      if (error.message.includes('already subscribed')) {
        localStorage.setItem("newsletterSubscribed", "true");
        setSubscriptionStatus("already_subscribed");
        
        setTimeout(() => {
          closePopup();
          setEmail("");
        }, 2000);
      } else {
        setSubscriptionStatus(error.message || "Something went wrong. Please try again.");
        setTimeout(() => setSubscriptionStatus(''), 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closePopup();
    localStorage.setItem("newsletterDismissed", "true");

    setTimeout(
      () => {
        localStorage.removeItem("newsletterDismissed");
      },
      30 * 24 * 60 * 60 * 1000
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isLoaded || !popupInitialized) {
    return null;
  }

  return (
    <AnimatePresence>
      {isPopupOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 bg-opacity-50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />

          {/* Container with padding */}
          <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Your existing popup content remains the same */}
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border bg-slate-100 hover:bg-slate-200 rounded-full transition-colors duration-200"
                  aria-label="Close newsletter popup"
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

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50" />

                <div className="relative p-6">
                  {/* Success State */}
                  {(subscriptionStatus === "success" || subscriptionStatus === "already_subscribed") && (
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-green-600"
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
                      <h3 className="text-xl font-light text-slate-900 mb-2">
                        {subscriptionStatus === "success" 
                          ? "Welcome to Our Community!" 
                          : "Already Subscribed!"}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {subscriptionStatus === "success"
                          ? "Thank you for subscribing to our newsletter!"
                          : "You're already part of our style community!"}
                      </p>
                    </div>
                  )}

                  {/* Regular Form State */}
                  {!subscriptionStatus && (
                    <>
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-light text-slate-900 mb-2">
                          Join Our Style Community
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Get exclusive access to new collections, styling tips, and
                          special offers delivered straight to your inbox.
                        </p>
                        
                        {/* Show sign-in encouragement for signed-out users */}
                        {!isSignedIn && (
                          <p className="text-blue-600 text-xs mt-2">
                            Sign up for an account to get personalized recommendations!
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Error Message */}
                  {subscriptionStatus && 
                   subscriptionStatus !== "success" && 
                   subscriptionStatus !== "already_subscribed" && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm text-center">
                        {subscriptionStatus}
                      </p>
                    </div>
                  )}

                  {/* Form (only show if not in success state) */}
                  {!subscriptionStatus && (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-slate-900 placeholder-slate-500 text-sm transition-all duration-200"
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Subscribing...
                          </div>
                        ) : (
                          "Subscribe Now"
                        )}
                      </button>
                    </form>
                  )}

                  {/* Footer Text */}
                  <p className="text-center text-slate-500 text-xs mt-4">
                    No spam, unsubscribe at any time
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;