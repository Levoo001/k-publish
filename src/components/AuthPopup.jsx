// src/components/AuthPopup.jsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePopup } from "./PopupContext";
import { IoIosLogIn } from "react-icons/io";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthPopup = () => {
  const [isSignInMode, setIsSignInMode] = useState(true); // Default to sign in
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState("");

  const { isPopupOpen, closePopup } = usePopup(); // Remove openPopup from here
  const { data: session, update } = useSession();
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setAuthStatus("");

    try {
      // Prepare credentials with action
      const credentials = {
        email: formData.email,
        password: formData.password,
        action: isSignInMode ? 'login' : 'register'
      };

      // Add name for registration
      if (!isSignInMode) {
        credentials.name = formData.name;
      }

      const result = await signIn('credentials', {
        ...credentials,
        redirect: false
      });

      if (result?.error) {
        setAuthStatus(result.error);
        setTimeout(() => setAuthStatus(''), 5000);
      } else if (result?.ok) {
        setAuthStatus("success");

        if (!isSignInMode) {
          // Store signup success
          localStorage.setItem("userSignedUp", "true");
        }

        // Update session to get latest user data
        await update();

        setTimeout(() => {
          closePopup();
          setFormData({ name: "", email: "", password: "" });

          // Refresh the page to update all session-dependent components
          router.refresh();
        }, 2000);
      } else {
        setAuthStatus('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthStatus('Something went wrong. Please try again.');
      setTimeout(() => setAuthStatus(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closePopup();
    setFormData({ name: "", email: "", password: "" });
    setAuthStatus("");
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleAuthMode = () => {
    setIsSignInMode(!isSignInMode);
    setFormData({ name: "", email: "", password: "" });
    setAuthStatus("");
  };

  // Don't show if user is already authenticated
  if (session) {
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
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center border bg-primary-50 hover:bg-primary-100 rounded-full transition-colors duration-200 border-primary-200"
                  aria-label="Close signup popup"
                >
                  <svg
                    className="w-4 h-4 text-primary-600"
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-50" />

                <div className="relative p-6">
                  {/* Success State */}
                  {authStatus === "success" && (
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-primary"
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
                      <h3 className="text-xl font-light text-primary-900 mb-2 font-playfair">
                        {isSignInMode ? "Welcome Back!" : "Welcome to Kavan!"}
                      </h3>
                      <p className="text-primary-600 text-sm font-cormorant">
                        {isSignInMode
                          ? "You've successfully signed in!"
                          : "Your account has been created successfully!"}
                      </p>
                    </div>
                  )}

                  {/* Regular Form State */}
                  {authStatus !== "success" && (
                    <>
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                          <IoIosLogIn size={40} color="white" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-light text-primary-900 mb-2 font-playfair">
                          {isSignInMode ? "Welcome Back" : "Join The Kavan Inner Circle"}
                        </h3>
                        <p className="text-primary-600 text-sm font-cormorant mb-2">
                          {isSignInMode
                            ? "Sign in to your account"
                            : "and get 10% off your first order"}
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
                  {authStatus !== "success" && (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="space-y-3">
                        {/* Name Field - Only show for Sign Up */}
                        {!isSignInMode && (
                          <div>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Full Name"
                              className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-900 placeholder-primary-500 transition-all duration-200 font-inter"
                              required={!isSignInMode}
                              disabled={isSubmitting}
                            />
                          </div>
                        )}

                        {/* Email Field */}
                        <div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Email Address"
                            className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-900 placeholder-primary-500 transition-all duration-200 font-inter"
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
                            className="w-full px-4 py-3 bg-primary-50 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary-900 placeholder-primary-500 transition-all duration-200 font-inter"
                            required
                            disabled={isSubmitting}
                            minLength={6}
                          />
                          {!isSignInMode && (
                            <p className="text-primary-400 text-xs mt-1 font-inter">
                              Password must be at least 6 characters
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-inter"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            {isSignInMode ? "Signing In..." : "Creating Account..."}
                          </div>
                        ) : (
                          isSignInMode ? "Sign In" : "Create Account"
                        )}
                      </button>

                      {/* Toggle Auth Mode */}
                      <div className="text-center pt-2">
                        <p className="text-primary-600 text-xs font-inter">
                          {isSignInMode ? "Don't have an account? " : "Already have an account? "}
                          <button
                            type="button"
                            className="text-primary underline hover:no-underline font-medium"
                            onClick={toggleAuthMode}
                          >
                            {isSignInMode ? "Sign Up" : "Sign In"}
                          </button>
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthPopup;