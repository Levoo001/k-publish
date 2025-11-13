// src/components/PayStackPayment.jsx - CORRECTED VERSION

"use client";

import { useState, useEffect, useCallback } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/CartSlice";
import { saveOrder } from '@/lib/firestoreService';

const PayStackPayment = ({ email, amount, metadata, onSuccess, onClose }) => {
  const dispatch = useDispatch();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  // Check if PayStack script is loaded
  useEffect(() => {
    const checkPaystack = () => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
      } else {
        console.log('PayStack script not yet loaded');
      }
    };

    // Check immediately
    checkPaystack();

    // Also check after a delay
    const timer = setTimeout(checkPaystack, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Define the callback function with useCallback to preserve reference
  const paymentCallback = useCallback(async (response) => {
    try {
      console.log('🔧 PayStack response:', response);

      // BETTER PAYMENT METHOD DETECTION
      let paymentMethod = 'Card Payment';
      if (response.channel === 'bank') {
        paymentMethod = 'Bank Transfer';
      } else if (response.channel === 'ussd') {
        paymentMethod = 'USSD';
      } else if (response.channel === 'mobile_money') {
        paymentMethod = 'Mobile Money';
      } else if (response.channel === 'qr') {
        paymentMethod = 'QR Code';
      }

      const orderData = {
        // Customer Information
        customerEmail: email,
        customerName: metadata?.customer_name,
        customerPhone: metadata?.customer_phone,

        // Shipping Information - PASS ALL ADDRESS COMPONENTS
        shippingLocation: metadata?.shipping_location,
        shippingProvider: metadata?.shipping_provider,
        shippingType: metadata?.shipping_type,
        shippingFee: metadata?.shipping_fee,

        // Individual address components for proper construction
        shipping_address: metadata?.shipping_address,
        shipping_state: metadata?.shipping_state,
        shipping_country: metadata?.shipping_country,

        // Order Information
        items: metadata?.items,
        itemCount: metadata?.item_count,
        subtotal: metadata?.subtotal,
        totalAmount: metadata?.total,

        // Payment Information - USE THE DETECTED METHOD
        paymentMethod: paymentMethod,
        paymentReference: response.reference,
        paymentChannel: response.channel,
        paymentStatus: 'completed',

        // Order Status
        orderStatus: 'confirmed',

        // Store Information
        storeContact: metadata?.store_contact,
        storeEmail: metadata?.store_email,
        storeAddress: metadata?.store_address,

        notes: `Payment via ${response.channel}. Guest checkout.`
      };

      console.log('📦 Order data for saving:', orderData);

      // Save order to Firebase
      const orderId = await saveOrder(orderData);
      console.log('✅ Order saved with ID:', orderId);

      // Send order confirmation email
      try {
        const emailResponse = await fetch('/api/emails/order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...orderData,
            orderId
          })
        });

        if (!emailResponse.ok) {
          throw new Error('Email sending failed');
        }
        console.log('✅ Order confirmation email sent');
      } catch (emailError) {
        console.log('❌ Order confirmation email failed:', emailError);
      }

      // CLEAR CART HERE TOO FOR REDUNDANCY
      dispatch(clearCart());

      // Update UI state
      setPaymentSuccess(true);
      setPaymentMethod(paymentMethod); // Use the detected method
      setDateTime(new Date().toLocaleString());
      setPaymentReference(response.reference);

      // Call onSuccess callback with order data
      if (onSuccess) {
        onSuccess(response, {
          ...orderData,
          orderId
        });
      }
    } catch (error) {
      console.error('❌ Error in payment callback:', error);
      // Still show success to user but log the error
      setPaymentSuccess(true);
      setPaymentMethod(response?.channel === "bank" ? "Bank Transfer" : "Card Payment");
      setDateTime(new Date().toLocaleString());
      setPaymentReference(response.reference);

      if (onSuccess) {
        onSuccess(response, {
          orderId: 'unknown',
          paymentMethod: response?.channel === "bank" ? "Bank Transfer" : "Card Payment"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [email, metadata, onSuccess, dispatch]);

  // Define the onClose function with useCallback - CORRECTED VERSION
  const paymentOnClose = useCallback(() => {
    setIsProcessing(false);
    // Call the onClose prop if provided
    if (onClose) {
      onClose();
    }
  }, [onClose]); // Add onClose to dependencies

  const handlePayment = () => {
    if (!publicKey) {
      alert("Payment system is currently unavailable. Please try again later.");
      return;
    }

    if (!paystackLoaded) {
      alert("Payment system is still loading. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a simple callback function that doesn't lose context
      const callbackFunction = function (response) {
        paymentCallback(response);
      };

      // Create a simple onClose function
      const onCloseFunction = function () {
        paymentOnClose();
      };

      // Verify the functions are valid
      if (typeof callbackFunction !== 'function') {
        throw new Error('Callback is not a valid function');
      }

      if (typeof onCloseFunction !== 'function') {
        throw new Error('OnClose is not a valid function');
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amount,
        currency: "NGN",
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: metadata?.customer_name || "N/A"
            },
            {
              display_name: "Customer Phone",
              variable_name: "customer_phone",
              value: metadata?.customer_phone || "N/A"
            },
            {
              display_name: "Customer Email",
              variable_name: "customer_email",
              value: email || "N/A"
            },
            {
              display_name: "Shipping Location",
              variable_name: "shipping_location",
              value: metadata?.shipping_location || "N/A"
            },
            {
              display_name: "Shipping Provider",
              variable_name: "shipping_provider",
              value: metadata?.shipping_provider || "N/A"
            },
            {
              display_name: "Shipping Type",
              variable_name: "shipping_type",
              value: metadata?.shipping_type || "N/A"
            },
            {
              display_name: "Shipping Fee",
              variable_name: "shipping_fee",
              value: metadata?.shipping_fee || 0
            },
            {
              display_name: "Shipping Address",
              variable_name: "shipping_address",
              value: metadata?.shipping_address || "N/A"
            }
          ]
        },
        callback: callbackFunction,
        onClose: onCloseFunction
      });

      handler.openIframe();

    } catch (error) {
      console.error('Error setting up PayStack:', error);
      alert('Error initializing payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const generatePDF = () => {
    const receiptElement = document.getElementById("receipt");
    if (!receiptElement) {
      console.error('Receipt element not found');
      return;
    }

    html2canvas(receiptElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 180;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`receipt-${paymentReference}.pdf`);
    }).catch(error => {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF receipt. Please try again.');
    });

    dispatch(clearCart());
    setPaymentSuccess(false);
  };

  const handleCloseSuccessModal = () => {
    dispatch(clearCart());
    setPaymentSuccess(false);
  };

  return (
    <>
      <button
        data-paystack-button
        onClick={handlePayment}
        disabled={isProcessing || !paystackLoaded}
        className="bg-black text-white text-lg rounded-xl w-full py-3 cursor-pointer hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </div>
        ) : !paystackLoaded ? (
          'Loading Payment...'
        ) : (
          `Proceed To Checkout - ${formatter.format(amount / 100)}`
        )}
      </button>

      {paymentSuccess && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-50 h-screen w-screen flex items-center justify-center z-50">
          <div className="relative rounded-xl bg-black py-10 px-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 py-1 px-3 border rounded-full border-slate-500 text-slate-300 text-xl cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={handleCloseSuccessModal}
            >
              ×
            </span>

            <div className="flex flex-col items-center my-4 gap-3">
              <div className="w-fit rounded-full p-3 bg-green-200 bg-opacity-20">
                <IoMdCheckmarkCircleOutline className="text-green-400 text-4xl" />
              </div>
              <p className="text-green-400 text-xl font-medium">
                Order Confirmed!
              </p>
              <p className="text-slate-300 text-sm text-center">
                Thank you for your order. Your payment has been processed successfully and your order has been saved.
              </p>
            </div>

            <div
              id="receipt"
              className="my-7 p-4 flex flex-col gap-4 bg-slate-800 rounded-xl text-sm text-slate-400"
            >
              {/* Store Information */}
              <div className="text-center mb-2 border-b border-slate-700 pb-2">
                <h3 className="text-white text-lg font-semibold">{metadata?.store_name || "Kavan The Brand"}</h3>
                <p className="text-xs text-slate-400">{metadata?.store_contact || "+234 703 621 0107"}</p>
                <p className="text-xs text-slate-400">{metadata?.store_email || "admin@kavanthebrand.com"}</p>
                <p className="text-xs text-slate-400 mt-1">Reference: {paymentReference}</p>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-slate-700 pb-1">Customer Information</h4>
                <p className="flex justify-between">
                  <span>Name:</span>
                  <span className="text-white">{metadata?.customer_name || "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span>Email:</span>
                  <span className="text-white">{email}</span>
                </p>
                <p className="flex justify-between">
                  <span>Phone:</span>
                  <span className="text-white">{metadata?.customer_phone || "N/A"}</span>
                </p>
              </div>

              {/* Shipping Information */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-slate-700 pb-1">Shipping Information</h4>
                <p className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-white text-right">{metadata?.shipping_location || "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span>Provider:</span>
                  <span className="text-white">{metadata?.shipping_provider || "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span>Type:</span>
                  <span className="text-white capitalize">{metadata?.shipping_type || "N/A"}</span>
                </p>
                <p className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="text-white">{formatter.format(metadata?.shipping_fee || 0)}</span>
                </p>
                <div className="flex justify-between items-start">
                  <span className="flex-shrink-0">Address:</span>
                  <span className="text-white text-right text-xs ml-2">{metadata?.shipping_address || "N/A"}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-slate-700 pb-1">Order Items</h4>
                {metadata?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="flex-1">
                      {item.name} (Qty: {item.quantity})
                    </span>
                    <span className="text-white ml-2">
                      {formatter.format(item.total)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-slate-700" />

              {/* Payment Summary */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-slate-700 pb-1">Payment Summary</h4>
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">{formatter.format(metadata?.subtotal || 0)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="text-white">{formatter.format(metadata?.shipping_fee || 0)}</span>
                </p>
                <p className="flex justify-between text-base font-semibold border-t border-slate-700 pt-2">
                  <span>Total Paid:</span>
                  <span className="text-white">{formatter.format(amount / 100)}</span>
                </p>
              </div>

              <hr className="border-slate-700" />

              {/* Payment Details */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-slate-700 pb-1">Payment Details</h4>
                <p className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className="py-1 px-2 text-xs bg-green-200/20 text-green-500 rounded-full">
                    Success
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Payment Time:</span>
                  <span className="text-white">{dateTime}</span>
                </p>
                <p className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="text-white">{paymentMethod}</span>
                </p>
                <p className="flex justify-between">
                  <span>Reference:</span>
                  <span className="text-white text-xs">{paymentReference}</span>
                </p>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-2 mt-4 p-3 bg-blue-900/20 rounded-lg">
                <h4 className="text-white font-medium text-sm">📦 Expected Delivery</h4>
                <p className="text-xs text-blue-300">
                  {metadata?.shipping_type === 'international'
                    ? 'International: 5-10 business days'
                    : 'Domestic: 2-5 business days'
                  }
                </p>
                <p className="text-xs text-blue-300">
                  You will receive tracking information via SMS/Email
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6 font-semibold text-sm">
              <button
                onClick={generatePDF}
                className="w-full p-3 rounded-xl border border-yellow-500 text-yellow-500 text-center cursor-pointer hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Download PDF Receipt
              </button>

              <Link
                href="/"
                onClick={handleCloseSuccessModal}
                className="w-full p-3 rounded-xl bg-yellow-500 text-black text-center hover:bg-yellow-600 transition-colors"
              >
                Back To Homepage
              </Link>

              <Link
                href="/shop"
                onClick={handleCloseSuccessModal}
                className="w-full p-3 rounded-xl border border-slate-500 text-slate-300 text-center hover:bg-slate-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayStackPayment;