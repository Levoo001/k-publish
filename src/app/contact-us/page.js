// src/app/contact-us/page.js
"use client";
import { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
      
    } catch (error) {
      setIsSubmitting(false);
      console.error('Submission error:', error);
      setErrors({ 
        submit: error.message || 'Unable to send message. Please try again later.' 
      });
    }
  };

  const contactMethods = [
    {
      icon: "💬",
      title: "WhatsApp / Call",
      value: "+234 703 621 0107",
      link: "https://wa.me/2347036210107",
      description: "Quick responses"
    },
    {
      icon: "📧",
      title: "Email",
      value: "admin@kavanthebrand.com",
      link: "mailto:admin@kavanthebrand.com",
      description: "Detailed enquiries"
    },
    {
      icon: "📱",
      title: "Instagram",
      value: "@kavanthebrand_",
      link: "https://instagram.com/kavanthebrand_",
      description: "Latest updates"
    }
  ];

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container-custom max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full shadow-lg mb-4 border border-primary-100">
            <span className="text-3xl text-primary">💌</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 font-playfair">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto leading-relaxed font-cormorant">
            We're here to help you embrace your strength and softness. Reach out with any questions about our collections, sizing, or custom orders.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center text-sm text-primary-600 font-inter">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Response within 24 hours
            </div>
            <div className="flex items-center text-sm text-primary-600 font-inter">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Personalized assistance
            </div>
            <div className="flex items-center text-sm text-primary-600 font-inter">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Worldwide shipping support
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-xl text-primary">✍️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary-900 font-playfair">
                    Send Us a Message
                  </h2>
                  <p className="text-primary-600 font-cormorant">All fields marked * are required</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-primary">📧</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-900 mb-3 font-playfair">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-primary-600 mb-6 max-w-md mx-auto leading-relaxed font-cormorant">
                    Thank you for reaching out! We've received your message and will get back to you within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium font-inter"
                    >
                      Send Another Message
                    </button>
                    <a
                      href="/"
                      className="px-6 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium font-inter"
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-inter text-sm">
                      {errors.submit}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-primary-900 mb-2 font-inter"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition-all font-inter ${
                          errors.name 
                            ? "border-red-300 focus:ring-red-200" 
                            : "border-primary-200 focus:border-primary focus:ring-primary-100"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600 font-inter">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-primary-900 mb-2 font-inter"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition-all font-inter ${
                          errors.email 
                            ? "border-red-300 focus:ring-red-200" 
                            : "border-primary-200 focus:border-primary focus:ring-primary-100"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600 font-inter">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-primary-900 mb-2 font-inter"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-100 transition-all font-inter"
                        placeholder="+234 000 000 0000"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-primary-900 mb-2 font-inter"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-primary-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary-100 transition-all bg-white font-inter"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="sizing">Sizing Help</option>
                        <option value="custom">Custom Order</option>
                        <option value="wholesale">Wholesale Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-primary-900 mb-2 font-inter"
                    >
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition-all resize-vertical font-inter ${
                        errors.message 
                          ? "border-red-300 focus:ring-red-200" 
                          : "border-primary-200 focus:border-primary focus:ring-primary-100"
                      }`}
                      placeholder="Tell us about your inquiry, custom order request, or how we can help you embrace your Kavan style..."
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600 font-inter">{errors.message}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-primary-500 font-inter">
                        Minimum 10 characters
                      </span>
                      <span className={`text-sm font-inter ${
                        formData.message.length < 10 ? 'text-red-500' : 'text-primary'
                      }`}>
                        {formData.message.length}/10
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all duration-300 font-inter ${
                      isSubmitting
                        ? "bg-primary-300 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">📧</span>
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
              <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center font-playfair">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Connect With Us
              </h3>

              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="p-3 bg-primary-50 rounded-lg border border-primary-100 hover:bg-primary-100 transition-all duration-300 cursor-pointer"
                    onClick={() => method.link && window.open(method.link, '_blank')}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 bg-primary-100">
                        <span className="text-lg text-primary">{method.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1 font-playfair text-primary-900 text-sm">{method.title}</h4>
                        <p className="text-primary-700 text-sm mb-1 font-cormorant">{method.value}</p>
                        <p className="text-primary-600 text-xs font-inter">{method.description}</p>
                      </div>
                      {method.link && (
                        <span className="text-primary text-sm transform group-hover:translate-x-0.5 transition-transform">
                          ↗
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-primary rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center font-playfair text-white">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Business Hours
              </h3>
              <div className="space-y-2">
                {[
                  { days: "Monday - Friday", hours: "9:00 AM – 6:00 PM", status: "open" },
                  { days: "Saturday", hours: "10:00 AM – 4:00 PM", status: "open" },
                  { days: "Sunday", hours: "Closed", status: "closed" },
                ].map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className={`text-sm ${schedule.status === 'closed' ? 'text-primary-300' : 'text-primary-100'} font-cormorant`}>
                      {schedule.days}
                    </span>
                    <span className={`font-medium text-sm ${
                      schedule.status === 'closed' ? 'text-primary-400' : 'text-white'
                    } font-cormorant`}>
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-primary-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary-300 font-cormorant">Current Status</span>
                  <span className="flex items-center text-primary-200 font-inter">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Online • WAT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;