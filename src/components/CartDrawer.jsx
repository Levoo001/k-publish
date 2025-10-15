// src/components/CartDrawer.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser, SignInButton } from "@clerk/nextjs";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/store/CartSlice";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useCart } from "./CartProvider";
import { useState, useEffect } from "react";

// Updated shipping locations based on 2025 delivery fee document
const SHIPPING_LOCATIONS = [
  // Domestic - GIG Logistics
  { id: 'gig-north', name: 'Nigeria - GIG North', fee: 4600, type: 'domestic', provider: 'GIG' },
  { id: 'gig-south-main', name: 'Nigeria - GIG South Main Cities', fee: 5500, type: 'domestic', provider: 'GIG' },
  { id: 'gig-south-onforwarding', name: 'Nigeria - GIG South Onforwarding Cities', fee: 6500, type: 'domestic', provider: 'GIG' },
  { id: 'gig-special-cities', name: 'Nigeria - GIG Special Cities (Calabar, Uyo, Akure, etc.)', fee: 6500, type: 'domestic', provider: 'GIG' },
  
  // Domestic - DHL
  { id: 'dhl-north-central', name: 'Nigeria - DHL North & North Central', fee: 5500, type: 'domestic', provider: 'DHL' },
  { id: 'dhl-north-remote', name: 'Nigeria - DHL Remote North Locations', fee: 7500, type: 'domestic', provider: 'DHL' },
  { id: 'dhl-south-west', name: 'Nigeria - DHL South/West & South East (Zone B)', fee: 5500, type: 'domestic', provider: 'DHL' },
  { id: 'dhl-south-remote', name: 'Nigeria - DHL Remote South West Locations', fee: 7500, type: 'domestic', provider: 'DHL' },
  { id: 'dhl-south-south', name: 'Nigeria - DHL South/South, South/West & South East', fee: 11700, type: 'domestic', provider: 'DHL' },
  { id: 'dhl-south-south-remote', name: 'Nigeria - DHL Remote South/South & South East', fee: 14000, type: 'domestic', provider: 'DHL' },
  
  // International - Based on zones from document
  { id: 'int-zone1', name: 'International - Zone 1 (UK, Ireland, etc.)', fee: 65000, type: 'international', provider: 'DHL' },
  { id: 'int-zone2', name: 'International - Zone 2 (West Africa)', fee: 72000, type: 'international', provider: 'DHL' },
  { id: 'int-zone3', name: 'International - Zone 3 (USA, Canada, Mexico)', fee: 79000, type: 'international', provider: 'DHL' },
  { id: 'int-zone4', name: 'International - Zone 4 (Europe)', fee: 87000, type: 'international', provider: 'DHL' },
  { id: 'int-zone5', name: 'International - Zone 5 (Africa)', fee: 93000, type: 'international', provider: 'DHL' },
  { id: 'int-zone6', name: 'International - Zone 6 (Middle East)', fee: 96000, type: 'international', provider: 'DHL' },
  { id: 'int-zone7', name: 'International - Zone 7 (Asia & Australia)', fee: 104000, type: 'international', provider: 'DHL' },
  { id: 'int-zone8', name: 'International - Zone 8 (Americas & Oceania)', fee: 108000, type: 'international', provider: 'DHL' },
];

// Helper arrays for grouping
const GIG_LOCATIONS = SHIPPING_LOCATIONS.filter(loc => loc.provider === 'GIG');
const DHL_DOMESTIC_LOCATIONS = SHIPPING_LOCATIONS.filter(loc => loc.provider === 'DHL' && loc.type === 'domestic');
const INTERNATIONAL_LOCATIONS = SHIPPING_LOCATIONS.filter(loc => loc.type === 'international');

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useCart();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  
  const [selectedLocation, setSelectedLocation] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const emailAddress = user?.primaryEmailAddress?.emailAddress || "";
  const userFirstName = user?.firstName || "";
  const userLastName = user?.lastName || "";

  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  const totalAmount = subtotal + shippingFee;

  // Update shipping fee when location changes
  useEffect(() => {
    if (selectedLocation) {
      const location = SHIPPING_LOCATIONS.find(loc => loc.id === selectedLocation);
      setShippingFee(location ? location.fee : 0);
    }
  }, [selectedLocation]);

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  // Handle overlay click to close drawer
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  // Prepare order metadata for PayStack
  const getOrderMetadata = () => {
    const selectedLocationData = SHIPPING_LOCATIONS.find(loc => loc.id === selectedLocation);
    
    return {
      customer_name: `${userFirstName} ${userLastName}`.trim(),
      customer_email: emailAddress,
      customer_phone: phoneNumber,
      shipping_location: selectedLocationData?.name || 'Not selected',
      shipping_provider: selectedLocationData?.provider || 'Not selected',
      shipping_fee: shippingFee,
      shipping_address: address,
      delivery_notes: additionalNotes,
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
    };
  };

  // Direct PayStack payment integration
  const handlePayStackPayment = async () => {
    if (!isCheckoutReady || isProcessing) return;

    setIsProcessing(true);

    try {
      // Load PayStack inline script
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        // Initialize PayStack payment
        const paystack = window.PaystackPop.setup({
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // Make sure this is in your .env.local
          email: emailAddress,
          amount: totalAmount * 100, // Convert to kobo
          currency: 'NGN',
          metadata: getOrderMetadata(),
          callback: function(response) {
            // Payment successful
            setIsProcessing(false);
            console.log('Payment successful:', response);
            
            // Show success message
            alert('Payment successful! Thank you for your order.');
            
            // Clear cart and close drawer
            cartItems.forEach(item => dispatch(removeFromCart(item.id)));
            closeCart();
            
            // Redirect to success page or home
            window.location.href = '/order-success';
          },
          onClose: function() {
            // Payment modal closed
            setIsProcessing(false);
            console.log('Payment window closed.');
          }
        });
        
        paystack.openIframe();
      };

      script.onerror = () => {
        setIsProcessing(false);
        console.error('Failed to load PayStack script');
        alert('Payment service is temporarily unavailable. Please try again.');
      };

      document.body.appendChild(script);
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
      alert('An error occurred while processing payment. Please try again.');
    }
  };

  // Check if checkout is ready
  const isDeliveryInfoComplete = address.trim() && phoneNumber.trim() && selectedLocation;
  const isCheckoutReady = isSignedIn && isDeliveryInfoComplete && cartItems.length > 0;

  if (!isCartOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleOverlayClick}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Your Cart ({cartItems.length})</h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <HiOutlineShoppingCart size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <button
                  onClick={closeCart}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Cart Items */}
                {cartItems.map((item, index) => (
                  <div
                    key={item.id || item._id || `cart-item-${index}`}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="font-semibold text-sm mb-2">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm border-x">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Section - Fixed at bottom */}
          {cartItems.length > 0 && (
            <div className="border-t bg-white">
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {/* Shipping Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Delivery Location *
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="">Select your location</option>
                    
                    <optgroup label="GIG Logistics - Nigeria">
                      {GIG_LOCATIONS.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name} - {formatPrice(location.fee)}
                        </option>
                      ))}
                    </optgroup>
                    
                    <optgroup label="DHL - Nigeria">
                      {DHL_DOMESTIC_LOCATIONS.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name} - {formatPrice(location.fee)}
                        </option>
                      ))}
                    </optgroup>
                    
                    <optgroup label="International - DHL">
                      {INTERNATIONAL_LOCATIONS.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name} - {formatPrice(location.fee)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Delivery Form - Only show when location selected */}
                {selectedLocation && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+234 800 123 4567"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full address with city and state"
                        rows={3}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="e.g., Leave with security, call before delivery..."
                        rows={2}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingFee > 0 ? formatPrice(shippingFee) : '—'}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                {/* Quick Info */}
                {selectedLocation && (
                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                    <p className="font-medium text-blue-900 mb-1">📦 Delivery Info</p>
                    <p className="text-blue-700 text-xs">
                      Made-to-order: 6-10 days production + {SHIPPING_LOCATIONS.find(loc => loc.id === selectedLocation)?.type === 'international' ? '5-7 days' : '2-5 days'} shipping
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  {!isLoaded ? (
                    <div className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg text-center">
                      Loading...
                    </div>
                  ) : isSignedIn ? (
                    <>
                      {isCheckoutReady ? (
                        <button
                          onClick={handlePayStackPayment}
                          disabled={isProcessing}
                          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Processing...
                            </div>
                          ) : (
                            `Proceed to Pay ${formatPrice(totalAmount)}`
                          )}
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                          {!selectedLocation ? 'Select Delivery Location' : 'Complete Delivery Information'}
                        </button>
                      )}
                    </>
                  ) : (
                    <SignInButton mode="modal">
                      <button className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                        Sign In to Checkout
                      </button>
                    </SignInButton>
                  )}

                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="w-full block border border-gray-300 text-gray-700 py-3 px-6 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;