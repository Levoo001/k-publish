// src/app/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SHIPPING_LOCATIONS } from "@/lib/shippingLocations";
import PayStackPayment from "@/components/PayStackPayment";
import { usePopup } from "@/components/PopupContext";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  const [selectedLocationType, setSelectedLocationType] = useState('domestic');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const { showAuthPopup, setShowAuthPopup } = usePopup();
  const [formData, setFormData] = useState({
    country: 'Nigeria',
    state: '',
    address: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);

  const emailAddress = session?.user?.email || "";
  const userName = session?.user?.name || "";

  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  const totalAmount = subtotal + shippingFee;

  // Update shipping fee when location changes
  useEffect(() => {
    if (selectedLocation) {
      const allLocations = [
        ...SHIPPING_LOCATIONS.domestic.flatMap(group => group.options),
        ...SHIPPING_LOCATIONS.international.flatMap(group => group.options)
      ];
      const location = allLocations.find(loc => loc.id === selectedLocation);
      setShippingFee(location ? location.fee : 0);
    }
  }, [selectedLocation]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && status === 'authenticated') {
      router.push('/shop');
    }
  }, [cartItems, status, router]);

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

  // Prepare order metadata for PayStack
  const getOrderMetadata = () => {
    const allLocations = [
      ...SHIPPING_LOCATIONS.domestic.flatMap(group => group.options),
      ...SHIPPING_LOCATIONS.international.flatMap(group => group.options)
    ];
    const selectedLocationData = allLocations.find(loc => loc.id === selectedLocation);
    const providerGroup = SHIPPING_LOCATIONS.domestic.find(group =>
      group.options.some(opt => opt.id === selectedLocation)
    ) || SHIPPING_LOCATIONS.international.find(group =>
      group.options.some(opt => opt.id === selectedLocation)
    );

    return {
      customer_name: userName,
      customer_email: emailAddress,
      customer_phone: formData.phone,
      shipping_country: formData.country,
      shipping_state: formData.state,
      shipping_address: formData.address,
      shipping_location: selectedLocationData?.name || 'Not selected',
      shipping_provider: providerGroup?.provider || 'Not selected',
      shipping_type: selectedLocationType,
      shipping_fee: shippingFee,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
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

    // Double-check session status (this is the fix)
    if (status !== 'authenticated' || !session) {
      setShowAuthPopup(true);
      return;
    }

    setIsProcessing(true);
    setShowPaystack(true);

    setTimeout(() => {
      try {
        const paystackButton = document.querySelector('button[data-paystack-button]') ||
          document.querySelector('button');

        if (paystackButton) {
          paystackButton.click();
        } else {
          console.error('PayStack button not found');
          setIsProcessing(false);
          alert('Payment system error. Please try again.');
        }
      } catch (error) {
        console.error('Error triggering payment:', error);
        setIsProcessing(false);
      }
    }, 1000);
  };

  const handlePaymentSuccess = (response) => {
    console.log('Payment successful:', response);
    router.push('/order-success');
  };

  // Check if checkout is ready
  const isFormComplete = formData.country && formData.state && formData.address && formData.phone;
  const isCheckoutReady = status === 'authenticated' && isFormComplete && selectedLocation && agreeToPolicy && cartItems.length > 0;

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600 font-inter">Loading...</p>
        </div>
      </div>
    );
  }


  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-playfair text-primary-900 mb-4">Sign In Required</h1>
          <p className="text-primary-600 mb-6 font-cormorant">Please sign in to complete your purchase.</p>

          <div className="space-y-3">
            {/* Sign In Button that opens the auth modal */}
            <button
              onClick={() => setShowAuthPopup(true)}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 cursor-pointer transition-colors font-inter"
            >
              Sign In to Checkout
            </button>

            <Link
              href="/shop"
              className="w-full block border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-inter cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-playfair text-primary-900 mb-4">Your cart is empty</h1>
          <p className="text-primary-600 mb-6 font-cormorant">Add some items to get started.</p>
          <Link
            href="/shop"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-inter"
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
          <div className="flex justify-center items-center space-x-8 text-sm text-primary-600 font-inter">
            <span className="text-primary font-semibold">Cart</span>
            <span>→</span>
            <span className="text-primary font-semibold">Information</span>
            <span>→</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left Column - Delivery Information */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-playfair text-primary-900 mb-6">Contact information</h2>
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                <p className="text-primary-800 font-inter text-sm">Email: {emailAddress}</p>
                {userName && (
                  <p className="text-primary-600 font-inter text-sm mt-1">Name: {userName}</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-playfair text-primary-900 mb-6">Shipping address</h2>

              {/* Country */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-inter">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-inter text-sm bg-white"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* State/Province */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-inter">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter your state or province"
                  className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-inter text-sm"
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-inter">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address, apartment, suite, etc."
                  rows={3}
                  className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary resize-none font-inter text-sm"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-primary-900 font-inter">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+234 800 123 4567"
                  className="w-full p-4 border border-primary-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-inter text-sm"
                  required
                />
              </div>

              {/* Shipping Provider - Collapsible */}
              <div className="border border-primary-200 rounded-lg">
                <button
                  onClick={() => setIsShippingOpen(!isShippingOpen)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-primary-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-primary-900 font-inter">Shipping method</h3>
                    {selectedLocation && (
                      <p className="text-sm text-primary-600 mt-1 font-inter">
                        {SHIPPING_LOCATIONS[selectedLocationType].flatMap(group => group.options).find(opt => opt.id === selectedLocation)?.name}
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
                  <div className="p-4 border-t border-primary-200 space-y-4">
                    {/* Location Type Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-3 text-primary-900 font-inter">
                        Location Type
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => {
                            setSelectedLocationType('domestic');
                            setSelectedLocation('');
                          }}
                          className={`px-4 py-2 rounded border font-inter text-sm transition-colors ${selectedLocationType === 'domestic'
                            ? 'border-primary bg-primary text-white'
                            : 'border-primary-200 text-primary-700 hover:bg-primary-50'
                            }`}
                        >
                          Domestic
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLocationType('international');
                            setSelectedLocation('');
                          }}
                          className={`px-4 py-2 rounded border font-inter text-sm transition-colors ${selectedLocationType === 'international'
                            ? 'border-primary bg-primary text-white'
                            : 'border-primary-200 text-primary-700 hover:bg-primary-50'
                            }`}
                        >
                          International
                        </button>
                      </div>
                    </div>

                    {/* Shipping Provider Selection */}
                    {selectedLocationType && (
                      <div>
                        <label className="block text-sm font-medium mb-3 text-primary-900 font-inter">
                          Select shipping option
                        </label>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {SHIPPING_LOCATIONS[selectedLocationType].map((group) => (
                            <div key={group.provider} className="space-y-2">
                              <p className="text-sm font-medium text-primary-700 font-inter">{group.provider}</p>
                              <div className="grid gap-2">
                                {group.options.map((location) => (
                                  <button
                                    key={location.id}
                                    onClick={() => setSelectedLocation(location.id)}
                                    className={`p-3 rounded border text-left font-inter text-sm transition-colors ${selectedLocation === location.id
                                      ? 'border-primary bg-primary-50'
                                      : 'border-primary-200 hover:bg-primary-50'
                                      }`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="text-primary-900">{location.name}</span>
                                      <span className="text-primary font-semibold">{formatPrice(location.fee)}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
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
                <label htmlFor="policy-agreement" className="text-sm text-primary-700 font-inter leading-relaxed">
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
                    <div className="w-20 h-24 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 font-inter text-primary-900 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-primary-600 text-xs font-inter mb-2">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-semibold text-primary text-sm font-inter">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="space-y-3 border-t border-primary-200 pt-4">
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-primary-700">Subtotal</span>
                  <span className="text-primary-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm font-inter">
                  <span className="text-primary-700">Shipping</span>
                  <span className="text-primary-900 font-semibold">
                    {shippingFee > 0 ? formatPrice(shippingFee) : '—'}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-playfair pt-3 border-t border-primary-200">
                  <span className="text-primary-900">Total</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Delivery Timeline */}
              {selectedLocation && (
                <div className="bg-white p-4 rounded-lg border border-primary-200 mt-4">
                  <p className="text-primary-800 text-xs font-inter leading-relaxed">
                    📦 Made-to-order: 6-10 days production +{" "}
                    {selectedLocationType === 'international' ? '5-7 days' : '2-5 days'} shipping
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
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed font-inter text-sm font-medium"
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
                  className="w-full bg-primary-200 text-primary-600 py-4 px-6 rounded-lg cursor-not-allowed font-inter text-sm font-medium"
                >
                  {!selectedLocation ? 'Select shipping method' :
                    !formData.state ? 'Enter state/province' :
                      !formData.address ? 'Enter address' :
                        !formData.phone ? 'Enter phone number' :
                          !agreeToPolicy ? 'Agree to policies' :
                            'Complete required information'}
                </button>
              )}

              <Link
                href="/shop"
                className="w-full block border border-primary-200 text-primary-700 py-4 px-6 rounded-lg text-center font-medium hover:bg-primary-50 transition-colors font-inter text-sm"
              >
                Continue shopping
              </Link>
            </div>

            {/* PayStack Payment Component */}
            {showPaystack && (
              <div className="hidden">
                <PayStackPayment
                  email={emailAddress}
                  amount={totalAmount * 100}
                  metadata={getOrderMetadata()}
                  onSuccess={handlePaymentSuccess}
                  session={session}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}