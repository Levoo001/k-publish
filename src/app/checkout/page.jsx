"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { COUNTRIES } from "@/lib/shippingConfig";
import { calculateShippingRates, getNigerianStates } from "@/lib/shippingCalculator";
import PayStackPayment from "@/components/PayStackPayment";
import { useCartStore } from "@/store/cart";
import { trackFacebookEvent } from "@/lib/facebookPixel";

const inputClass =
  "w-full px-4 py-3 text-sm font-poppins border border-slate-200 rounded-xl outline-none focus:border-primary/60 placeholder:text-slate-300 transition-colors bg-white";

const labelClass =
  "block text-[11px] uppercase tracking-widest text-slate-400 font-poppins mb-1.5";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);

  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState({
    country: "Nigeria",
    state: "",
    city: "",
    address: "",
    apartment: "",
    postalCode: "",
    phone: "",
    email: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const hasTrackedCheckoutRef = useRef(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0,
  );
  const totalAmount = subtotal + (selectedShipping?.cost || 0);
  const totalQty = cartItems.reduce((t, i) => t + (i?.quantity || 0), 0);

  const nigerianStates = getNigerianStates();
  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const fmt = (price) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(price);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target))
        setIsCountryOpen(false);
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target))
        setIsStateOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (formData.country && formData.state && cartItems.length > 0) {
      calculateShipping();
    } else {
      setShippingRates([]);
      setSelectedShipping(null);
    }
  }, [formData.country, formData.state, cartItems]);

  useEffect(() => {
    if (hasTrackedCheckoutRef.current || cartItems.length === 0) return;
    hasTrackedCheckoutRef.current = true;
    trackFacebookEvent("InitiateCheckout", {
      currency: "NGN",
      value: Number(subtotal) || 0,
      num_items: totalQty,
      content_ids: cartItems.map((item) => item.id || item._id || item.name),
    });
  }, [cartItems, subtotal]);

  const calculateShipping = async () => {
    setIsCalculating(true);
    try {
      const rates = calculateShippingRates(formData.country, formData.state, cartItems);
      setShippingRates(rates);
      if (rates.length > 0) setSelectedShipping(rates[0]);
    } catch {
      setShippingRates([]);
      setSelectedShipping(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country, state: "" }));
    setIsCountryOpen(false);
    setSearchQuery("");
  };

  const handleStateSelect = (state) => {
    setFormData((prev) => ({ ...prev, state }));
    setIsStateOpen(false);
    setSearchQuery("");
  };

  const getOrderMetadata = () => {
    const isInternational = formData.country !== "Nigeria";
    return {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_country: formData.country,
      shipping_state: formData.state,
      shipping_city: formData.city,
      shipping_address: formData.address,
      shipping_apartment: formData.apartment || "Not provided",
      shipping_postal_code: formData.postalCode || "Not provided",
      shipping_type: isInternational ? "international" : "domestic",
      shipping_provider: selectedShipping?.provider || "Not selected",
      shipping_service: selectedShipping?.service || "Not selected",
      shipping_fee: selectedShipping?.cost || 0,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        color: item.selectedColor || "Not specified",
        size: item.selectedSize || "Not specified",
      })),
      subtotal,
      total: totalAmount,
      item_count: totalQty,
      store_name: "Kavan The Brand",
      store_contact: "+234 703 621 0107",
      store_email: "admin@kavanthebrand.com",
      store_address: "Lagos, Nigeria",
    };
  };

  const handlePayment = () => {
    if (!isCheckoutReady || isProcessing) return;
    setIsProcessing(true);
    setShowPaystack(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const btn = document.querySelector("[data-paystack-button]");
          if (btn) {
            btn.click();
          } else {
            setIsProcessing(false);
            setShowPaystack(false);
            alert("Payment system error. Please refresh and try again.");
          }
        } catch {
          setIsProcessing(false);
          setShowPaystack(false);
        }
      }, 500);
    });
  };

  const handlePaymentSuccess = (response, orderDetails) => {
    trackFacebookEvent("Purchase", {
      currency: "NGN",
      value: Number(totalAmount) || 0,
      content_type: "product",
      content_ids: cartItems.map((item) => item.id || item._id || item.name),
      num_items: totalQty,
      order_id: orderDetails?.orderId || response?.reference,
    });
    setIsProcessing(false);
    setShowPaystack(false);
  };

  const isFormComplete =
    formData.name &&
    formData.email &&
    formData.country &&
    formData.state &&
    formData.city &&
    formData.address &&
    formData.phone;

  const isCheckoutReady =
    isFormComplete && selectedShipping && agreeToPolicy && cartItems.length > 0;

  const blockingReason = !cartItems.length
    ? "Your cart is empty"
    : !formData.name
      ? "Enter your full name"
      : !formData.email
        ? "Enter your email"
        : !formData.phone
          ? "Enter your phone number"
          : !formData.state
            ? "Enter your state"
            : !formData.city
              ? "Enter your city"
              : !formData.address
                ? "Enter your street address"
                : !selectedShipping
                  ? "Select a shipping method"
                  : !agreeToPolicy
                    ? "Agree to our policies to continue"
                    : null;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-playfair text-2xl text-slate-800 font-light mb-2">Your cart is empty</p>
          <p className="text-slate-400 text-sm font-poppins mb-6">Add something you love first.</p>
          <Link href="/shop" className="bg-primary text-white px-7 py-3 rounded-xl text-sm font-poppins font-medium hover:bg-primary/90 transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-slate-100 px-4 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-playfair text-primary text-lg tracking-widest font-light">
          KAVAN
        </Link>
        <div className="flex items-center gap-2 text-xs font-poppins text-slate-400">
          <span className="text-primary font-medium">Cart</span>
          <span>›</span>
          <span className="text-primary font-medium">Information</span>
          <span>›</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">

          {/* ── Left: Form ── */}
          <div className="space-y-8">

            {/* Contact */}
            <section>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">
                Contact
              </p>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Full name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="you@email.com"
                      className={inputClass}
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className={inputClass}
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Shipping address */}
            <section>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">
                Shipping address
              </p>
              <div className="space-y-3">

                {/* Country */}
                <div ref={countryDropdownRef} className="relative">
                  <label className={labelClass}>Country *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={isCountryOpen ? searchQuery : formData.country}
                      onChange={(e) => { setSearchQuery(e.target.value); setIsCountryOpen(true); }}
                      onFocus={() => setIsCountryOpen(true)}
                      placeholder="Search country…"
                      className={inputClass}
                    />
                    <svg className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${isCountryOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {isCountryOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                      {filteredCountries.length > 0 ? filteredCountries.map((c) => (
                        <button key={c} onClick={() => handleCountrySelect(c)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-poppins transition-colors hover:bg-slate-50 ${formData.country === c ? "text-primary font-semibold" : "text-slate-700"}`}>
                          {c}
                        </button>
                      )) : (
                        <p className="px-4 py-3 text-sm text-slate-400 font-poppins">No countries found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* State */}
                {formData.country === "Nigeria" ? (
                  <div ref={stateDropdownRef} className="relative">
                    <label className={labelClass}>State *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={isStateOpen ? searchQuery : formData.state}
                        onChange={(e) => { setSearchQuery(e.target.value); setIsStateOpen(true); }}
                        onFocus={() => setIsStateOpen(true)}
                        placeholder="Search state…"
                        className={inputClass}
                      />
                      <svg className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${isStateOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {isStateOpen && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                        {nigerianStates.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())).map((s) => (
                          <button key={s} onClick={() => handleStateSelect(s)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-poppins transition-colors hover:bg-slate-50 ${formData.state === s ? "text-primary font-semibold" : "text-slate-700"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>State / Province *</label>
                    <input type="text" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} placeholder="State or province" className={inputClass} />
                  </div>
                )}

                {/* City + Street on same row on larger screens */}
                <div>
                  <label className={labelClass}>City *</label>
                  <input type="text" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="City" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Street address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street name and building number"
                    className={inputClass}
                    style={{ fontSize: "16px" }}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Apartment / Suite <span className="normal-case tracking-normal text-slate-300">(optional)</span></label>
                    <input type="text" value={formData.apartment} onChange={(e) => handleInputChange("apartment", e.target.value)} placeholder="Apt, suite, floor…" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Postal code <span className="normal-case tracking-normal text-slate-300">(optional)</span></label>
                    <input type="text" value={formData.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} placeholder="Postal code" className={inputClass} />
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Shipping method */}
            <section>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">
                Shipping method
              </p>

              {!formData.state ? (
                <p className="text-sm text-slate-400 font-poppins">Enter your state above to see shipping options.</p>
              ) : isCalculating ? (
                <div className="flex items-center gap-3 text-sm text-slate-400 font-poppins py-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Calculating rates…
                </div>
              ) : shippingRates.length > 0 ? (
                <div className="space-y-2">
                  {shippingRates.map((rate, i) => {
                    const active =
                      selectedShipping?.provider === rate.provider &&
                      selectedShipping?.service === rate.service;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedShipping(rate)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                          active
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${active ? "border-primary bg-primary" : "border-slate-300"}`}>
                            {active && <div className="w-full h-full rounded-full scale-[0.4] bg-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold font-poppins text-slate-800">{rate.provider}</p>
                            <p className="text-xs text-slate-400 font-poppins">{rate.service} · {rate.estimatedDelivery.min}–{rate.estimatedDelivery.max}</p>
                          </div>
                        </div>
                        <p className={`text-sm font-bold font-poppins ${active ? "text-primary" : "text-slate-700"}`}>
                          {fmt(rate.cost)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400 font-poppins">No shipping options available for this location.</p>
              )}
            </section>

            <hr className="border-slate-100" />

            {/* Policy */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreeToPolicy}
                  onChange={(e) => setAgreeToPolicy(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${agreeToPolicy ? "bg-primary border-primary" : "border-slate-300"}`}>
                  {agreeToPolicy && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-600 font-poppins leading-relaxed">
                I agree to the{" "}
                <Link href="/delivery-policy" className="text-primary underline underline-offset-2" onClick={(e) => e.stopPropagation()}>
                  delivery policy
                </Link>{" "}
                and{" "}
                <Link href="/refund-and-exchange-policy" className="text-primary underline underline-offset-2" onClick={(e) => e.stopPropagation()}>
                  return & exchange policy
                </Link>
              </span>
            </label>

          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="border border-slate-100 rounded-2xl overflow-hidden">

              {/* Items */}
              <div className="px-5 py-4 space-y-4">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold">
                  Order summary · {totalQty} item{totalQty !== 1 ? "s" : ""}
                </p>
                <ul className="divide-y divide-slate-50">
                  {cartItems.map((item, i) => (
                    <li key={item.cartItemId || item.id || i} className="py-3 flex gap-3">
                      <div className="relative flex-shrink-0" style={{ width: 56, height: 72 }}>
                        <div className="w-full h-full rounded-lg overflow-hidden bg-slate-50">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                          )}
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] font-bold font-poppins rounded-full flex items-center justify-center shadow">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 font-poppins leading-snug truncate">{item.name}</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {item.selectedSize && (
                            <span className="text-[11px] bg-slate-100 text-slate-500 font-poppins px-1.5 py-0.5 rounded">
                              Size {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[11px] bg-slate-100 text-slate-500 font-poppins px-1.5 py-0.5 rounded capitalize">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-800 font-poppins flex-shrink-0">{fmt(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm font-poppins text-slate-500">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-poppins text-slate-500">
                  <span>Shipping</span>
                  <span>{selectedShipping ? fmt(selectedShipping.cost) : "—"}</span>
                </div>
                {selectedShipping && (
                  <p className="text-[11px] text-slate-400 font-poppins">{selectedShipping.provider} · {selectedShipping.estimatedDelivery.min}–{selectedShipping.estimatedDelivery.max}</p>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-sm font-poppins text-slate-700">Total</span>
                  <span className="text-xl font-bold font-playfair text-primary">{fmt(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-2">
              {isCheckoutReady ? (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white py-4 rounded-xl text-sm font-semibold font-poppins hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Pay ${fmt(totalAmount)}`
                  )}
                </button>
              ) : (
                <div className="w-full bg-slate-100 text-slate-400 py-4 rounded-xl text-sm font-poppins text-center">
                  {blockingReason}
                </div>
              )}

              <Link
                href="/shop"
                className="w-full block text-center text-xs text-slate-400 font-poppins hover:text-slate-600 transition-colors py-2"
              >
                ← Continue shopping
              </Link>
            </div>

            {/* Hidden Paystack */}
            {showPaystack && (
              <div className="hidden">
                <PayStackPayment
                  email={formData.email}
                  amount={totalAmount * 100}
                  metadata={getOrderMetadata()}
                  onSuccess={handlePaymentSuccess}
                  onClose={() => { setIsProcessing(false); setShowPaystack(false); }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
