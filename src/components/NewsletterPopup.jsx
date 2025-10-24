// src/components/NewsletterPopup.jsx - FIXED VERSION
"use client";

import { useState, useEffect } from "react";
import { subscribeToNewsletter } from '@/services/newsletterService';

const NewsletterPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthday: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState('');

    // Show popup after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            setSubscriptionStatus('Please enter your email address');
            setTimeout(() => setSubscriptionStatus(''), 4000);
            return;
        }

        setIsSubmitting(true);
        setSubscriptionStatus('');

        try {
            // CORRECTED: Pass all form data to the newsletter service
            const result = await subscribeToNewsletter(
                formData.email,
                formData.name,
                formData.birthday
            );

            if (result.success) {
                setSubscriptionStatus('success');
                setFormData({ name: '', email: '', birthday: '' });
                setTimeout(() => {
                    setIsVisible(false);
                    setSubscriptionStatus('');
                    handleClose(true);
                }, 3000);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setSubscriptionStatus(error.message);
            setTimeout(() => setSubscriptionStatus(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (rememberClose = false) => {
        setIsVisible(false);

        if (rememberClose) {
            localStorage.setItem('newsletterPopupClosed', 'true');
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            localStorage.setItem('newsletterPopupExpiry', expirationDate.toISOString());
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-200">
                {/* Close Button */}
                <button
                    onClick={() => handleClose(true)}
                    className="absolute top-1 right-1 z-10 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded-full p-1.5 shadow-md"
                    aria-label="Close newsletter popup"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Section */}
                <div className="bg-primary text-white p-6 rounded-t-xl">
                    <div className="text-center">
                        <h2 className="text-xl font-bold font-playfair mb-2">
                            Join The Kavan Inner Circle with 10% off
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed font-poppins">
                            Get exclusive offers, behind-the-scenes access, and inspiring stories behind our unique designs
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-poppins text-sm"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-poppins text-sm"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1 font-poppins">
                                Birthday (DD/MM)
                            </label>
                            <input
                                type="text"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-poppins text-sm"
                                placeholder="DD/MM"
                                maxLength="5"
                            />
                        </div>

                        {/* Status Messages */}
                        {subscriptionStatus === 'success' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-green-700 text-sm font-poppins text-center">
                                    🎉 Welcome to Kavanthebrand! Check your email for your 10% discount code.
                                </p>
                            </div>
                        )}

                        {subscriptionStatus && subscriptionStatus !== 'success' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-700 text-sm font-poppins text-center">
                                    {subscriptionStatus}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewsletterPopup;