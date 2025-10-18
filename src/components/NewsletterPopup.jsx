// src/components/NewsletterPopup.jsx

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePopup } from "./PopupContext";
import { IoIosLogIn } from "react-icons/io";

const NewsletterPopup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  
  const { popupInitialized, isPopupOpen, openPopup, closePopup } = usePopup();

  const hasSetupPopup = useRef(false);

  useEffect(() => {
    // Only run this once when popup is initialized
    if (!popupInitialized || hasSetupPopup.current) return;
    hasSetupPopup.current = true;

    // Check if user has already dismissed
    const hasDismissed = localStorage.getItem("signupDismissed");

    if (!hasDismissed) {
      // Show popup after 10 seconds
      const timer = setTimeout(() => {
        openPopup();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [popupInitialized, openPopup]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setAuthStatus('Please fill in all fields');
      setTimeout(() => setAuthStatus(''), 5000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAuthStatus('Please enter a valid email address');
      setTimeout(() => setAuthStatus(''), 5000);
      return;
    }

    if (formData.password.length < 6) {
      setAuthStatus('Password must be at least 6 characters');
      setTimeout(() => setAuthStatus(''), 5000);
      return;
    }

    setIsSubmitting(true);
    setAuthStatus("");

    try {
      // TODO: Replace with NextAuth signup logic
      console.log('Signup data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual NextAuth success handling
      setAuthStatus("success");
      
      // Store signup success
      localStorage.setItem("userSignedUp", "true");
      
      setTimeout(() => {
        closePopup();
        setFormData({ name: "", email: "", password: "" });
      }, 2000);
      
    } catch (error) {
      console.error("Signup failed:", error);
      setAuthStatus(error.message || "Something went wrong. Please try again.");
      setTimeout(() => setAuthStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closePopup();
    localStorage.setItem("signupDismissed", "true");

    // Reset dismissal after 30 days
    setTimeout(() => {
      localStorage.removeItem("signupDismissed");
    }, 30 * 24 * 60 * 60 * 1000);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!popupInitialized) {
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
              className="max-w-md w-full bg-white rounded-2xl shadow-luxury overflow-hidden"
            >
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border bg-burgundy-50 hover:bg-burgundy-100 rounded-full transition-colors duration-200 border-burgundy-200"
                  aria-label="Close signup popup"
                >
                  <svg
                    className="w-4 h-4 text-burgundy-600"
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
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy-50 to-white opacity-50" />

                <div className="relative p-6">
                  {/* Success State */}
                  {authStatus === "success" && (
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-burgundy"
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
                      <h3 className="text-xl font-light text-burgundy-900 mb-2 font-playfair">
                        Welcome to Kavan!
                      </h3>
                      <p className="text-burgundy-600 text-sm font-cormorant">
                        Your account has been created successfully!
                      </p>
                    </div>
                  )}

                  {/* Regular Form State */}
                  {!authStatus && (
                    <>
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center">
                          <IoIosLogIn size={40} color="white" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-light text-burgundy-900 mb-2 font-playfair">
                          Join The Kavan Inner Circle
                        </h3>
                        <p className="text-burgundy-600 text-sm font-cormorant mb-2">
                          Create your account and get 10% off your first order
                        </p>
                        <p className="text-burgundy-500 text-xs font-inter">
                          Plus exclusive access to new collections and styling tips
                        </p>
                      </div>
                    </>
                  )}

                  {/* Error Message */}
                  {authStatus && authStatus !== "success" && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm text-center font-inter">
                        {authStatus}
                      </p>
                    </div>
                  )}

                  {/* Form (only show if not in success state) */}
                  {!authStatus && (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="space-y-3">
                        {/* Name Field */}
                        <div>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-3 bg-burgundy-50 border border-burgundy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-burgundy-900 placeholder-burgundy-500 text-sm transition-all duration-200 font-inter"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Email Field */}
                        <div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Email Address"
                            className="w-full px-4 py-3 bg-burgundy-50 border border-burgundy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-burgundy-900 placeholder-burgundy-500 text-sm transition-all duration-200 font-inter"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        {/* Password Field */}
                        <div>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 bg-burgundy-50 border border-burgundy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-burgundy-900 placeholder-burgundy-500 text-sm transition-all duration-200 font-inter"
                            required
                            disabled={isSubmitting}
                            minLength={6}
                          />
                          <p className="text-burgundy-400 text-xs mt-1 font-inter">
                            Password must be at least 6 characters
                          </p>
                        </div>
                      </div>

                      {/* Sign Up Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-burgundy text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-burgundy-700 disabled:bg-burgundy-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-inter"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating Account...
                          </div>
                        ) : (
                          "Create Account & Get 10% Off"
                        )}
                      </button>

                      {/* Alternative Sign In */}
                      <div className="text-center pt-2">
                        <p className="text-burgundy-600 text-xs font-inter">
                          Already have an account?{" "}
                          <button
                            type="button"
                            className="text-burgundy underline hover:no-underline font-medium"
                            onClick={() => {
                              // TODO: Switch to sign-in mode or open sign-in modal
                              console.log('Switch to sign-in');
                            }}
                          >
                            Sign In
                          </button>
                        </p>
                      </div>
                    </form>
                  )}

                  {/* Privacy Notice */}
                  <div className="mt-4 text-center">
                    <p className="text-burgundy-400 text-xs font-inter">
                      By creating an account, you agree to our{" "}
                      <button className="underline hover:no-underline">
                        Terms
                      </button>{" "}
                      and{" "}
                      <button className="underline hover:no-underline">
                        Privacy Policy
                      </button>
                    </p>
                  </div>
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