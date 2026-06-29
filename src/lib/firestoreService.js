import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const saveOrder = async (orderData) => {
  const orderRef = doc(collection(db, "orders"));
  const orderId = orderRef.id;

  const order = {
    orderId,

    customerEmail: orderData.customerEmail || "Not provided",
    customerName: orderData.customerName || "Not provided",
    customerPhone: orderData.customerPhone || "Not provided",

    shippingStreetAddress: orderData.shipping_address || orderData.shippingAddress || "Not provided",
    shippingApartment: orderData.shipping_apartment || orderData.shippingApartment || null,
    shippingCity: orderData.shipping_city || orderData.shippingCity || "Not provided",
    shippingState: orderData.shipping_state || orderData.shippingState || "Not provided",
    shippingCountry: orderData.shipping_country || orderData.shippingCountry || "Not provided",
    shippingPostalCode: orderData.shipping_postal_code || orderData.shippingPostalCode || null,

    shippingProvider: orderData.shippingProvider || "Standard Shipping",
    shippingFee: Number(orderData.shippingFee) || 0,

    items: Array.isArray(orderData.items) ? orderData.items : [],
    subtotal: Number(orderData.subtotal) || 0,
    totalAmount: Number(orderData.totalAmount) || 0,

    paymentMethod: orderData.paymentMethod || "Card Payment",
    paymentReference: orderData.paymentReference || "N/A",

    orderStatus: orderData.orderStatus || "confirmed",
    deliveryStatus: "pending",
    trackingNumber: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(orderRef, order);
  return orderId;
};
