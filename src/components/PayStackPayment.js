// src/components/PayStackPayment.jsx
"use client";

import { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/CartSlice";
import { saveOrder } from '@/lib/firestoreService';
import { useUser } from '@clerk/nextjs';

const PayStackPayment = ({ email, amount, metadata, onSuccess }) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const handlePayment = () => {
    if (!publicKey) {
      alert("Payment system is currently unavailable. Please try again later.");
      return;
    }

    setIsProcessing(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
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
          },
          {
            display_name: "Delivery Notes",
            variable_name: "delivery_notes",
            value: metadata?.delivery_notes || "None"
          },
          {
            display_name: "Items Count",
            variable_name: "item_count",
            value: metadata?.item_count || 0
          },
          {
            display_name: "Order Items",
            variable_name: "order_items",
            value: JSON.stringify(metadata?.items || [])
          },
          {
            display_name: "Subtotal",
            variable_name: "subtotal",
            value: metadata?.subtotal || 0
          },
          {
            display_name: "Total Amount",
            variable_name: "total_amount",
            value: metadata?.total || 0
          },
          {
            display_name: "Store Name",
            variable_name: "store_name",
            value: metadata?.store_name || "Your Fashion Brand"
          },
          {
            display_name: "Store Contact",
            variable_name: "store_contact",
            value: metadata?.store_contact || "+234 123 456 7890"
          },
          {
            display_name: "Store Email",
            variable_name: "store_email",
            value: metadata?.store_email || "support@yourbrand.com"
          }
        ]
      },
      callback: async (response) => {
        try {
          // Save order to Firestore with enhanced delivery information
          const orderData = {
            // Customer Information
            clerkUserId: user?.id,
            customerEmail: email,
            customerName: metadata?.customer_name,
            customerPhone: metadata?.customer_phone,
            
            // Enhanced Delivery Information
            shippingLocation: metadata?.shipping_location,
            shippingProvider: metadata?.shipping_provider,
            shippingType: metadata?.shipping_type,
            shippingFee: metadata?.shipping_fee,
            shippingAddress: metadata?.shipping_address,
            deliveryNotes: metadata?.delivery_notes,
            
            // Order Information
            items: metadata?.items,
            itemCount: metadata?.item_count,
            subtotal: metadata?.subtotal,
            totalAmount: metadata?.total,
            
            // Payment Information
            paymentMethod: response?.channel === "bank" ? "Bank Transfer" : "Card Payment",
            paymentReference: response.reference,
            paymentChannel: response.channel,
            paymentStatus: 'completed',
            
            // Order Status
            orderStatus: 'confirmed',
            orderTimestamp: new Date().toISOString(),
            
            // Store Information
            storeContact: metadata?.store_contact,
            storeEmail: metadata?.store_email,
            storeAddress: metadata?.store_address,
            
            notes: `Payment via ${response.channel}. ${metadata?.delivery_notes ? 'Delivery notes: ' + metadata.delivery_notes : ''}`
          };

          const orderId = await saveOrder(orderData);
          console.log('Order saved with ID:', orderId);

          // Update UI state
          setPaymentSuccess(true);
          setPaymentMethod(orderData.paymentMethod);
          setDateTime(new Date().toLocaleString());
          setPaymentReference(response.reference);

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(response);
          }

          // Log the successful payment with all details
          console.log('Payment successful with details:', {
            reference: response.reference,
            metadata: metadata,
            amount: amount,
            orderId: orderId,
            orderData: orderData
          });

        } catch (error) {
          console.error('Error saving order to database:', error);
          // Still show success to user but log the error
          setPaymentSuccess(true);
          setPaymentMethod(response?.channel === "bank" ? "Bank Transfer" : "Card Payment");
          setDateTime(new Date().toLocaleString());
          setPaymentReference(response.reference);
          
          // Call onSuccess callback even if database save fails
          if (onSuccess) {
            onSuccess(response);
          }
          
          console.warn('Payment was successful but order was not saved to database. Please contact support.');
        } finally {
          setIsProcessing(false);
        }
      },
      onClose: function () {
        console.log('Payment window closed by user');
        setIsProcessing(false);
      },
    });

    handler.openIframe();
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
        onClick={handlePayment}
        disabled={isProcessing}
        className="bg-black text-white text-lg rounded-xl w-full py-3 cursor-pointer hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </div>
        ) : (
          `Proceed To Checkout - ${formatter.format(amount / 100)}`
        )}
      </button>

      {paymentSuccess && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-50 h-screen w-screen flex items-center justify-center z-50">
          <div className="relative rounded-xl bg-black py-10 px-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <span
              className="absolute top-4 right-4 py-1 px-3 border rounded-full border-gray-500 text-gray-300 text-xl cursor-pointer hover:bg-gray-800 transition-colors"
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
              <p className="text-gray-300 text-sm text-center">
                Thank you for your order. Your payment has been processed successfully and your order has been saved.
              </p>
            </div>

            <div
              id="receipt"
              className="my-7 p-4 flex flex-col gap-4 bg-gray-800 rounded-xl text-sm text-gray-400"
            >
              {/* Store Information */}
              <div className="text-center mb-2 border-b border-gray-700 pb-2">
                <h3 className="text-white text-lg font-semibold">{metadata?.store_name || "Your Fashion Brand"}</h3>
                <p className="text-xs text-gray-400">{metadata?.store_contact || "+234 123 456 7890"}</p>
                <p className="text-xs text-gray-400">{metadata?.store_email || "support@yourbrand.com"}</p>
                <p className="text-xs text-gray-400 mt-1">Reference: {paymentReference}</p>
              </div>

              {/* Customer Information */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-gray-700 pb-1">Customer Information</h4>
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
                <h4 className="text-white font-medium border-b border-gray-700 pb-1">Shipping Information</h4>
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
                {metadata?.delivery_notes && (
                  <div className="flex justify-between items-start">
                    <span className="flex-shrink-0">Delivery Notes:</span>
                    <span className="text-white text-right text-xs ml-2">{metadata?.delivery_notes}</span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-gray-700 pb-1">Order Items</h4>
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

              <hr className="border-gray-700" />

              {/* Payment Summary */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-gray-700 pb-1">Payment Summary</h4>
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">{formatter.format(metadata?.subtotal || 0)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="text-white">{formatter.format(metadata?.shipping_fee || 0)}</span>
                </p>
                <p className="flex justify-between text-base font-semibold border-t border-gray-700 pt-2">
                  <span>Total Paid:</span>
                  <span className="text-white">{formatter.format(amount / 100)}</span>
                </p>
              </div>

              <hr className="border-gray-700" />

              {/* Payment Details */}
              <div className="space-y-2">
                <h4 className="text-white font-medium border-b border-gray-700 pb-1">Payment Details</h4>
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
                className="w-full p-3 rounded-xl border border-gray-500 text-gray-300 text-center hover:bg-gray-800 transition-colors"
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