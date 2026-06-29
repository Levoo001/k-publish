import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Save order details - UPDATED WITH NEW ADDRESS FIELDS
export const saveOrder = async (orderData, retryCount = 0) => {
  try {
    const orderRef = doc(collection(db, "orders"));
    const orderId = orderRef.id;

    // Construct full shipping address with new fields
    const shippingAddress = constructShippingAddress(orderData);

    // Ensure all required fields have fallbacks
    const order = {
      orderId,
      // Customer Information
      customerEmail: orderData.customerEmail || "Not provided",
      customerName: orderData.customerName || "Not provided",
      customerPhone: orderData.customerPhone || "Not provided",

      // Shipping Information - UPDATED WITH NEW FIELDS
      shippingCountry:
        orderData.shipping_country ||
        orderData.shippingCountry ||
        "Not provided",
      shippingState:
        orderData.shipping_state || orderData.shippingState || "Not provided",
      shippingCity:
        orderData.shipping_city || orderData.shippingCity || "Not provided",
      shippingStreetAddress:
        orderData.shipping_address ||
        orderData.shippingAddress ||
        "Not provided",
      shippingApartment:
        orderData.shipping_apartment ||
        orderData.shippingApartment ||
        "Not provided",
      shippingPostalCode:
        orderData.shipping_postal_code ||
        orderData.shippingPostalCode ||
        "Not provided",
      shippingFullAddress: shippingAddress,

      shippingProvider: orderData.shippingProvider || "Standard Shipping",
      shippingType: orderData.shipping_type || orderData.shippingType || "domestic",
      shippingFee: Number(orderData.shippingFee) || 0,

      // Order Information
      items: Array.isArray(orderData.items) ? orderData.items : [],
      itemCount: Number(orderData.itemCount) || 0,
      subtotal: Number(orderData.subtotal) || 0,
      totalAmount: Number(orderData.totalAmount) || 0,

      // Payment Information
      paymentMethod: orderData.paymentMethod || "Card Payment",
      paymentReference: orderData.paymentReference || "N/A",
      paymentChannel: orderData.paymentChannel || "card",
      paymentStatus: orderData.paymentStatus || "completed",

      // Order Status
      orderStatus: orderData.orderStatus || "confirmed",
      storeContact: orderData.storeContact || "+234 703 621 0107",
      storeEmail: orderData.storeEmail || "admin@kavanthebrand.com",
      storeAddress: orderData.storeAddress || "Lagos, Nigeria",

      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      // Additional Fields
      notes: orderData.notes || "Payment completed successfully",
      deliveryStatus: "pending",
      estimatedDelivery: getEstimatedDeliveryDate(orderData.shipping_type || orderData.shippingType),
      trackingNumber: null,
      carrier: orderData.shippingProvider || "Standard Shipping",
    };

    await setDoc(orderRef, order);

    return orderId;
  } catch (error) {
    throw error;
  }
};

// Helper function to construct shipping address from available data - UPDATED
const constructShippingAddress = (orderData) => {
  const parts = [];

  // Build address in proper order
  if (orderData.shipping_street_address || orderData.shipping_address) {
    parts.push(orderData.shipping_street_address || orderData.shipping_address);
  }

  if (orderData.shipping_apartment) {
    parts.push(`Apt/Suite: ${orderData.shipping_apartment}`);
  }

  if (orderData.shipping_city) {
    parts.push(orderData.shipping_city);
  }

  if (orderData.shipping_state) {
    parts.push(orderData.shipping_state);
  }

  if (orderData.shipping_country) {
    parts.push(orderData.shipping_country);
  }

  if (orderData.shipping_postal_code) {
    parts.push(`Postal Code: ${orderData.shipping_postal_code}`);
  }

  return parts.length > 0 ? parts.join(", ") : "Address not provided";
};

// Helper function to calculate estimated delivery date
const getEstimatedDeliveryDate = (shippingType) => {
  const today = new Date();
  let deliveryDays;

  switch (shippingType) {
    case "international":
      deliveryDays = 10;
      break;
    case "domestic":
    default:
      deliveryDays = 5;
      break;
  }

  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + deliveryDays);
  return estimatedDate;
};

// Additional utility function to check Firestore connection
export const testFirestoreConnection = async () => {
  try {
    const testRef = doc(collection(db, "test"));
    await setDoc(testRef, {
      test: true,
      timestamp: serverTimestamp(),
    });
    return { success: true, message: "Firestore connection working" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
