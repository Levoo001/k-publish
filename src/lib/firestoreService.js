// src/lib/firestoreService.js - CLEANED VERSION
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Save user profile (REMOVED Clerk fields)
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const profileData = {
      uid: userId,
      email: userData.email,
      name: userData.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      status: 'active',
      emailVerified: false,
      totalOrders: 0,
      totalSpent: 0
    };

    await setDoc(userRef, profileData, { merge: true });
    console.log('User profile saved successfully');
    return profileData;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Save order details (KEEP THIS - it's working)
export const saveOrder = async (orderData) => {
  try {
    const orderRef = doc(collection(db, 'orders'));
    const orderId = orderRef.id;
    
    const order = {
      orderId,
      userId: orderData.userId,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      shippingLocation: orderData.shippingLocation,
      shippingProvider: orderData.shippingProvider,
      shippingType: orderData.shippingType,
      shippingFee: orderData.shippingFee,
      shippingAddress: orderData.shippingAddress,
      deliveryNotes: orderData.deliveryNotes,
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
    
    // Update user's order count and total spent
    if (orderData.userId) {
      await updateUserOrderStats(orderData.userId, orderData.totalAmount);
    }
    
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

// Update user order statistics
const updateUserOrderStats = async (userId, orderAmount) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data();
      await updateDoc(userRef, {
        totalOrders: (currentData.totalOrders || 0) + 1,
        totalSpent: (currentData.totalSpent || 0) + orderAmount,
        lastOrderDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

// Get user orders (KEEP THIS)
export const getUserOrders = async (userId) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({ 
        id: doc.id, 
        ...orderData,
        createdAt: orderData.createdAt?.toDate() || new Date(),
        estimatedDelivery: orderData.estimatedDelivery?.toDate() || new Date()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};