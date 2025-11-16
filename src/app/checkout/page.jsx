// src/app/checkout/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { COUNTRIES } from "@/lib/shippingLocations";
import { calculateShippingRates, getNigerianStates } from "@/lib/shippingCalculator";
import PayStackPayment from "@/components/PayStackPayment";
import { clearCart } from "@/store/CartSlice";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [formData, setFormData] = useState({
    country: 'Nigeria',
    state: '',
    address: '',
    phone: '',
    email: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Dropdown states
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  const totalAmount = subtotal + (selectedShipping?.cost || 0);

  const nigerianStates = getNigerianStates();
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setIsStateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate shipping when country or state changes
  useEffect(() => {
    if (formData.country && formData.state && cartItems.length > 0) {
      calculateShipping();
    } else {
      setShippingRates([]);
      setSelectedShipping(null);
    }
  }, [formData.country, formData.state, cartItems]);

  const calculateShipping = async () => {
    setIsCalculating(true);

    try {
      const rates = calculateShippingRates(formData.country, formData.state, cartItems);
      setShippingRates(rates);

      // Auto-select the first (cheapest) rate
      if (rates.length > 0) {
        setSelectedShipping(rates[0]);
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      setShippingRates([]);
      setSelectedShipping(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCountrySelect = (country) => {
    setFormData(prev => ({
      ...prev,
      country,
      state: '' // Reset state when country changes
    }));
    setIsCountryOpen(false);
    setSearchQuery('');
  };

  const handleStateSelect = (state) => {
    setFormData(prev => ({ ...prev, state }));
    setIsStateOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsCountryOpen(true);
  };

  // Prepare order metadata for PayStack
  const getOrderMetadata = () => {
    return {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_country: formData.country,
      shipping_state: formData.state,
      shipping_address: formData.address,
      shipping_provider: selectedShipping?.provider || 'Not selected',
      shipping_service: selectedShipping?.service || 'Not selected',
      shipping_fee: selectedShipping?.cost || 0,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        color: item.selectedColor || 'Not specified'
      })),
      subtotal: subtotal,
      total: totalAmount,
      item_count: cartItems.reduce((total, item) => total + item.quantity, 0),
      store_name: "Kavan The Brand",
      store_contact: "+234 703 621 0107",
      store_email: "admin@kavanthebrand.com",
      store_address: "Lagos, Nigeria"
    };
  };

  const handlePayment = () => {
    if (!isCheckoutReady || isProcessing) return;

    setIsProcessing(true);
    setShowPaystack(true);

    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const paystackButton = document.querySelector('[data-paystack-button]');
          if (paystackButton) {
            paystackButton.click();
          } else {
            console.error('PayStack button not found');
            setIsProcessing(false);
            setShowPaystack(false);
            alert('Payment system error. Please refresh the page and try again.');
          }
        } catch (error) {
          console.error('Error triggering payment:', error);
          setIsProcessing(false);
          setShowPaystack(false);
        }
      }, 500);
    });
  };

  const handlePaymentSuccess = (response, orderDetails) => {
    setOrderData(orderDetails);
    setShowSuccessModal(true);
    setIsProcessing(false);
    setShowPaystack(false);

    // Clear the cart immediately
    dispatch(clearCart());
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setOrderData(null);
    router.push('/shop');
  };

  // Check if checkout is ready
  const isFormComplete = formData.name && formData.email && formData.country && formData.state && formData.address && formData.phone;
  const isCheckoutReady = isFormComplete && selectedShipping && agreeToPolicy && cartItems.length > 0;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-playfair text-primary-900 mb-4">Your cart is empty</h1>
          <p className="text-primary-600 mb-6 font-poppins">Add some items to get started.</p>
          <Link
            href="/shop"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-poppins"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-playfair text-primary-900 mb-4">Checkout</h1>
          <div className="flex justify-center items-center space-x-8 text-sm text-primary-600 font-poppins">
            <span className="text-primary font-semibold">Cart</span>
            <span>→</span>
            <span className="text-primary font-semibold">Information</span>
            <span>→</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left Column - Customer & Delivery Information */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div>
              <h2 className="text-xl font-playfair text-primary-900 mb-6">Customer information</h2>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-poppins text-base"
                  required
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-poppins text-base"
                  required
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                  Phone number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 800 123 4567"
                  className="w-full p-3 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-poppins text-base"
                  required
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-playfair text-primary-900 mb-6">Shipping address</h2>

              {/* Country - Searchable Dropdown */}
              <div className="mb-4 relative" ref={countryDropdownRef}>
                <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                  Country *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={isCountryOpen ? searchQuery : formData.country}
                    onChange={handleSearchChange}
                    onFocus={() => setIsCountryOpen(true)}
                    placeholder="Search for a country..."
                    className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-poppins bg-white cursor-pointer"
                  />
                  <svg
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-600 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Country Dropdown */}
                {isCountryOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country}
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors font-poppins text-sm ${formData.country === country ? 'bg-primary-50 text-primary font-semibold' : 'text-primary-900'
                              }`}
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-primary-600 text-sm font-poppins">
                          No countries found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* State Dropdown for Nigeria */}
              {formData.country === 'Nigeria' && (
                <div className="mb-4 relative" ref={stateDropdownRef}>
                  <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                    State *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      onFocus={() => setIsStateOpen(true)}
                      placeholder="Select your state"
                      className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-poppins bg-white cursor-pointer"
                    />
                    <svg
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-600 transition-transform ${isStateOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* State Dropdown */}
                  {isStateOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {nigerianStates.map((state) => (
                        <button
                          key={state}
                          onClick={() => handleStateSelect(state)}
                          className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors font-poppins text-sm ${formData.state === state ? 'bg-primary-50 text-primary font-semibold' : 'text-primary-900'}`}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* State Input for International */}
              {formData.country !== 'Nigeria' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter your state or province"
                    className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-poppins"
                    required
                  />
                </div>
              )}

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-poppins">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address, apartment, suite, etc."
                  rows={3}
                  className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary resize-none font-poppins"
                  required
                />
              </div>

              {/* Shipping Options - Auto Calculated */}
              <div className="border border-primary-200 rounded-lg">
                <button
                  onClick={() => setIsShippingOpen(!isShippingOpen)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-primary-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-primary-900 font-poppins">Shipping method</h3>
                    {selectedShipping && (
                      <p className="text-sm text-primary-600 mt-1 font-poppins">
                        {selectedShipping.provider} - {selectedShipping.service} ({formatPrice(selectedShipping.cost)})
                      </p>
                    )}
                    {!selectedShipping && formData.state && (
                      <p className="text-sm text-primary-600 mt-1 font-poppins">
                        Select a shipping option
                      </p>
                    )}
                    {!formData.state && (
                      <p className="text-sm text-primary-600 mt-1 font-poppins">
                        Enter your state to see shipping options
                      </p>
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-primary-600 transition-transform ${isShippingOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isShippingOpen && (
                  <div className="p-4 border-t border-primary-200">
                    {isCalculating ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        <p className="text-sm text-primary-600 mt-2">Calculating shipping options...</p>
                      </div>
                    ) : shippingRates.length > 0 ? (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-primary-900 font-poppins">
                          Available shipping options
                        </label>
                        {shippingRates.map((rate, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedShipping(rate)}
                            className={`w-full p-3 rounded border text-left font-poppins text-sm transition-colors ${selectedShipping?.provider === rate.provider && selectedShipping?.service === rate.service
                                ? 'border-primary bg-primary-50'
                                : 'border-primary-200 hover:bg-primary-50'
                              }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-semibold text-primary-900">{rate.provider}</p>
                                <p className="text-primary-600">{rate.service}</p>
                                <p className="text-xs text-primary-500 mt-1">
                                  Est. delivery: {rate.estimatedDelivery.min} - {rate.estimatedDelivery.max}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-primary">{formatPrice(rate.cost)}</p>
                                <p className="text-xs text-primary-500">{rate.deliveryDays}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-primary-600 text-sm">
                          {formData.state ? 'No shipping options available for this location' : 'Select your state to see shipping options'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Policy Agreement */}
            <div className="border-t border-primary-100 pt-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="policy-agreement"
                  checked={agreeToPolicy}
                  onChange={(e) => setAgreeToPolicy(e.target.checked)}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <label htmlFor="policy-agreement" className="text-sm text-primary-700 font-poppins leading-relaxed">
                  I agree with the{" "}
                  <Link href="/delivery-policy" className="text-primary underline hover:no-underline">
                    delivery policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/refund-and-exchange-policy" className="text-primary underline hover:no-underline">
                    return/exchange policy
                  </Link>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-primary-50 rounded-lg p-6">
              <h2 className="text-xl font-playfair text-primary-900 mb-6">Order summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={item.id || item._id || `checkout-item-${index}`} className="flex gap-4 items-start">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 font-poppins text-primary-900 leading-tight">
                        {item.name}
                      </h3>

                      {/* Display selected color if available */}
                      {item.selectedColor && (
                        <p className="text-xs text-primary-600 mb-1 font-poppins">
                          Color: <span className="font-semibold">{item.selectedColor}</span>
                        </p>
                      )}

                      <p className="text-primary-600 text-xs font-poppins mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold text-primary text-sm font-poppins">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="space-y-3 border-t border-primary-200 pt-4">
                <div className="flex justify-between text-sm font-poppins">
                  <span className="text-primary-700">Subtotal</span>
                  <span className="text-primary-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm font-poppins">
                  <span className="text-primary-700">Shipping</span>
                  <span className="text-primary-900 font-semibold">
                    {selectedShipping ? formatPrice(selectedShipping.cost) : '—'}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-playfair pt-3 border-t border-primary-200">
                  <span className="text-primary-900">Total</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Delivery Timeline */}
              {selectedShipping && (
                <div className="bg-white p-2 rounded-lg border border-primary-200 mt-4">
                  <p className="text-primary-800 text-xs font-poppins leading-relaxed">
                    {selectedShipping.deliveryDays} | {selectedShipping.provider}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Button */}
            <div className="space-y-4">
              {isCheckoutReady ? (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed font-poppins text-sm font-medium"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    `Proceed to payment - ${formatPrice(totalAmount)}`
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-primary-200 text-primary-600 py-4 px-6 rounded-lg cursor-not-allowed font-poppins text-sm font-medium"
                >
                  {!selectedShipping ? 'Select shipping method' :
                    !formData.name ? 'Enter your name' :
                      !formData.email ? 'Enter email address' :
                        !formData.state ? 'Enter state/province' :
                          !formData.address ? 'Enter address' :
                            !formData.phone ? 'Enter phone number' :
                              !agreeToPolicy ? 'Agree to policies' :
                                'Complete required information'}
                </button>
              )}

              <Link
                href="/shop"
                className="w-full block border border-primary-200 text-primary-700 py-4 px-6 rounded-lg text-center font-medium hover:bg-primary-50 transition-colors font-poppins text-sm"
              >
                Continue shopping
              </Link>
            </div>

            {/* PayStack Payment Component */}
            {showPaystack && (
              <div className="hidden">
                <PayStackPayment
                  email={formData.email}
                  amount={totalAmount * 100}
                  metadata={getOrderMetadata()}
                  onSuccess={handlePaymentSuccess}
                  onClose={() => {
                    setIsProcessing(false);
                    setShowPaystack(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && orderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-playfair text-primary-900 mb-2">Order Confirmed!</h2>
                <p className="text-primary-600 font-poppins">Thank you for your order. We've sent a confirmation email to {formData.email}</p>
              </div>

              <div className="border-t border-primary-100 pt-4 mb-6">
                <h3 className="font-playfair text-primary-900 mb-3">Order Details</h3>
                <div className="space-y-2 text-sm font-poppins">
                  <div className="flex justify-between">
                    <span className="text-primary-600">Order ID:</span>
                    <span className="font-medium">{orderData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-600">Total Paid:</span>
                    <span className="font-medium">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-600">Payment Method:</span>
                    <span className="font-medium">{orderData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-600">Shipping Provider:</span>
                    <span className="font-medium">{selectedShipping?.provider}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCloseSuccessModal}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-poppins font-medium"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/"
                  className="w-full block border border-primary-200 text-primary-700 py-3 px-6 rounded-lg text-center hover:bg-primary-50 transition-colors font-poppins"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}