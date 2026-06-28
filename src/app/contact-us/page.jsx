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
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ submit: error.message || "Unable to send message. Please try again later." });
    }
  };

  const contactMethods = [
    { title: "WhatsApp / Call", value: "+234 703 621 0107", link: "https://wa.me/2347036210107", description: "Quick responses" },
    { title: "Email", value: "admin@kavanthebrand.com", link: "mailto:admin@kavanthebrand.com", description: "Detailed enquiries" },
    { title: "Instagram", value: "@kavan.thebrand", link: "https://instagram.com/kavan.thebrand", description: "Latest updates" },
  ];

  const inputClass = (field) =>
    `w-full p-2.5 border rounded-lg focus:outline-none focus:ring-1 transition-all font-poppins text-sm ${
      errors[field]
        ? "border-red-300 focus:ring-red-200"
        : "border-slate-200 focus:border-primary focus:ring-primary/20"
    }`;

  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-2 font-playfair">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-poppins">
            Questions about collections, sizing, or orders? We're here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            {["Response within 24 hours", "Personalized assistance", "Worldwide shipping support"].map((item) => (
              <span key={item} className="flex items-center text-xs text-slate-500 font-poppins">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">

          {/* Contact Form */}
          <div className="lg:col-span-2 border border-slate-100 rounded-xl p-4 md:p-6">
            <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">Send Us a Message</h2>
            <p className="text-slate-400 font-poppins text-xs mb-5">Fields marked * are required</p>

            {isSubmitted ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-3">📧</p>
                <h3 className="text-lg font-light text-slate-900 mb-2 font-playfair">Message Sent!</h3>
                <p className="text-slate-500 mb-6 text-sm font-poppins max-w-sm mx-auto">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-poppins hover:bg-primary/90 transition-colors"
                  >
                    Send Another
                  </button>
                  <a
                    href="/"
                    className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-poppins hover:border-primary hover:text-primary transition-colors"
                  >
                    Continue Shopping
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-poppins text-sm">
                    {errors.submit}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1.5 font-poppins">Full Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className={inputClass("name")} placeholder="Your full name" />
                    {errors.name && <p className="mt-1 text-xs text-red-600 font-poppins">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5 font-poppins">Email Address *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClass("email")} placeholder="your@email.com" />
                    {errors.email && <p className="mt-1 text-xs text-red-600 font-poppins">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-slate-700 mb-1.5 font-poppins">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass("phone")} placeholder="+234 000 000 0000" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium text-slate-700 mb-1.5 font-poppins">Subject</label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className={inputClass("subject")}>
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
                  <label htmlFor="message" className="block text-xs font-medium text-slate-700 mb-1.5 font-poppins">Your Message *</label>
                  <textarea
                    id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={5}
                    className={inputClass("message")}
                    placeholder="Tell us how we can help..."
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600 font-poppins">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-6 rounded-lg font-medium text-sm transition-all font-poppins bg-primary text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Contact Methods */}
            <div className="border border-slate-100 rounded-xl p-4">
              <h3 className="text-base font-light text-slate-900 mb-3 font-playfair">Connect With Us</h3>
              <div className="space-y-2">
                {contactMethods.map((method) => (
                  <a
                    key={method.title}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-primary transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-slate-800 font-playfair text-sm">{method.title}</p>
                      <p className="text-slate-600 text-xs font-poppins">{method.value}</p>
                      <p className="text-slate-400 text-xs font-poppins">{method.description}</p>
                    </div>
                    <span className="text-slate-300 group-hover:text-primary transition-colors text-sm">↗</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="border border-slate-100 rounded-xl p-4">
              <h3 className="text-base font-light text-slate-900 mb-3 font-playfair">Business Hours</h3>
              <div className="space-y-2">
                {[
                  { days: "Mon – Fri", hours: "9:00 AM – 6:00 PM", open: true },
                  { days: "Saturday", hours: "10:00 AM – 4:00 PM", open: true },
                  { days: "Sunday", hours: "Closed", open: false },
                ].map((s) => (
                  <div key={s.days} className="flex justify-between text-sm font-poppins">
                    <span className={s.open ? "text-slate-600" : "text-slate-400"}>{s.days}</span>
                    <span className={s.open ? "text-slate-800 font-medium" : "text-slate-400"}>{s.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500 font-poppins">Online · WAT</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
