// src/lib/firestoreService.js - UPDATED WITHOUT USER AUTH
import { 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Save order details (SIMPLIFIED - NO USER AUTH)
export const saveOrder = async (orderData) => {
  try {
    const orderRef = doc(collection(db, 'orders'));
    const orderId = orderRef.id;
    
    const order = {
      orderId,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      shippingLocation: orderData.shippingLocation,
      shippingProvider: orderData.shippingProvider,
      shippingType: orderData.shippingType,
      shippingFee: orderData.shippingFee,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      itemCount: orderData.itemCount,
      subtotal: orderData.subtotal,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentReference: orderData.paymentReference,
      paymentChannel: orderData.paymentChannel,
      paymentStatus: orderData.paymentStatus || 'completed',
      orderStatus: orderData.orderStatus || 'confirmed',
      storeContact: orderData.storeContact,
      storeEmail: orderData.storeEmail,
      storeAddress: orderData.storeAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: orderData.notes || '',
      deliveryStatus: 'pending',
      estimatedDelivery: getEstimatedDeliveryDate(orderData.shippingType),
      trackingNumber: null,
      carrier: orderData.shippingProvider
    };

    await setDoc(orderRef, order);
    
    console.log('Order saved successfully with ID:', orderId);
    return orderId;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Helper function to calculate estimated delivery date
const getEstimatedDeliveryDate = (shippingType) => {
  const today = new Date();
  let deliveryDays;
  
  switch (shippingType) {
    case 'international':
      deliveryDays = 10;
      break;
    case 'domestic':
    default:
      deliveryDays = 5;
      break;
  }
  
  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + deliveryDays);
  return estimatedDate;
};
