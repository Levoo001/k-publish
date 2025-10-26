// src/lib/firestoreService.js - FIXED VERSION
import { 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Save order details - ENHANCED WITH BETTER ERROR HANDLING
export const saveOrder = async (orderData) => {
  try {
    console.log('🔧 Saving order to Firestore...', orderData);
    
    const orderRef = doc(collection(db, 'orders'));
    const orderId = orderRef.id;
    
    // Construct proper shipping address from available data
    const shippingAddress = orderData.shippingAddress || 
      constructShippingAddress(orderData);
    
    // Ensure all required fields have fallbacks
    const order = {
      orderId,
      // Customer Information
      customerEmail: orderData.customerEmail || 'Not provided',
      customerName: orderData.customerName || 'Not provided',
      customerPhone: orderData.customerPhone || 'Not provided',
      
      // Shipping Information
      shippingLocation: orderData.shippingLocation || 'Not selected',
      shippingProvider: orderData.shippingProvider || 'Standard Shipping',
      shippingType: orderData.shippingType || 'domestic',
      shippingFee: Number(orderData.shippingFee) || 0,
      shippingAddress: shippingAddress,
      
      // Order Information
      items: Array.isArray(orderData.items) ? orderData.items : [],
      itemCount: Number(orderData.itemCount) || 0,
      subtotal: Number(orderData.subtotal) || 0,
      totalAmount: Number(orderData.totalAmount) || 0,
      
      // Payment Information
      paymentMethod: orderData.paymentMethod || 'Card Payment',
      paymentReference: orderData.paymentReference || 'N/A',
      paymentChannel: orderData.paymentChannel || 'card',
      paymentStatus: orderData.paymentStatus || 'completed',
      
      // Order Status
      orderStatus: orderData.orderStatus || 'confirmed',
      storeContact: orderData.storeContact || '+234 703 621 0107',
      storeEmail: orderData.storeEmail || 'admin@kavanthebrand.com',
      storeAddress: orderData.storeAddress || 'Lagos, Nigeria',
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Additional Fields
      notes: orderData.notes || 'Payment completed successfully',
      deliveryStatus: 'pending',
      estimatedDelivery: getEstimatedDeliveryDate(orderData.shippingType),
      trackingNumber: null,
      carrier: orderData.shippingProvider || 'Standard Shipping'
    };

    console.log('📦 Final order object:', order);
    
    await setDoc(orderRef, order);
    console.log('✅ Order saved successfully with ID:', orderId);
    
    return orderId;
  } catch (error) {
    console.error('❌ Error saving order to Firestore:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error(`Failed to save order: ${error.message}`);
  }
};

// Helper function to construct shipping address from available data
const constructShippingAddress = (orderData) => {
  const parts = [];
  
  if (orderData.shipping_address) parts.push(orderData.shipping_address);
  if (orderData.shipping_state) parts.push(orderData.shipping_state);
  if (orderData.shipping_country) parts.push(orderData.shipping_country);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not provided';
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

// Additional utility function to check Firestore connection
export const testFirestoreConnection = async () => {
  try {
    const testRef = doc(collection(db, 'test'));
    await setDoc(testRef, {
      test: true,
      timestamp: serverTimestamp()
    });
    return { success: true, message: 'Firestore connection working' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};