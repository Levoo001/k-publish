// src/lib/firestoreService.js
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

// Save user profile (sync with NextAuth)
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const profileData = {
      uid: userId,
      email: userData.email,
      name: userData.name,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      profileImage: userData.profileImage,
      signUpDate: userData.signUpDate || serverTimestamp(),
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      totalOrders: 0,
      totalSpent: 0,
      newsletterSubscribed: true
    };

    await setDoc(userRef, profileData, { merge: true });
    console.log('User profile saved successfully');
    return profileData;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Save order details
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

// Get user orders
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

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      return { 
        id: orderDoc.id, 
        ...orderData,
        createdAt: orderData.createdAt?.toDate() || new Date(),
        estimatedDelivery: orderData.estimatedDelivery?.toDate() || new Date()
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      orderStatus: newStatus,
      updatedAt: serverTimestamp()
    });
    
    console.log('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Update delivery status and tracking
export const updateDeliveryStatus = async (orderId, deliveryData) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      deliveryStatus: deliveryData.deliveryStatus,
      trackingNumber: deliveryData.trackingNumber,
      carrier: deliveryData.carrier,
      actualDeliveryDate: deliveryData.actualDeliveryDate || null,
      updatedAt: serverTimestamp()
    });
    
    console.log('Delivery status updated successfully');
  } catch (error) {
    console.error('Error updating delivery status:', error);
    throw error;
  }
};

// Get all orders (for admin)
export const getAllOrders = async () => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
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
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

// Get orders by status
export const getOrdersByStatus = async (status) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('orderStatus', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({ 
        id: doc.id, 
        ...orderData,
        createdAt: orderData.createdAt?.toDate() || new Date()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }
};

// Search orders by customer email or name
export const searchOrders = async (searchTerm) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      const searchableText = `
        ${orderData.customerEmail || ''} 
        ${orderData.customerName || ''} 
        ${orderData.customerPhone || ''}
        ${orderData.orderId || ''}
      `.toLowerCase();
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        orders.push({ 
          id: doc.id, 
          ...orderData,
          createdAt: orderData.createdAt?.toDate() || new Date()
        });
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error searching orders:', error);
    throw error;
  }
};

// Get order statistics
export const getOrderStatistics = async () => {
  try {
    const ordersQuery = query(collection(db, 'orders'));
    const querySnapshot = await getDocs(ordersQuery);
    
    let totalRevenue = 0;
    let totalOrders = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      totalRevenue += orderData.totalAmount || 0;
      totalOrders++;
      
      if (orderData.orderStatus === 'pending') {
        pendingOrders++;
      } else if (orderData.orderStatus === 'completed') {
        completedOrders++;
      }
    });
    
    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};