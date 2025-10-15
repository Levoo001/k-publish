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

// Save customer profile (sync with Clerk)
export const saveCustomerProfile = async (clerkUserId, userData) => {
  try {
    const customerRef = doc(db, 'customers', clerkUserId);
    
    const customerData = {
      clerkUserId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      profileImage: userData.profileImage,
      signUpDate: userData.signUpDate || serverTimestamp(),
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Additional fields you might want
      totalOrders: 0,
      totalSpent: 0,
      newsletterSubscribed: true
    };

    await setDoc(customerRef, customerData, { merge: true });
    console.log('Customer profile saved successfully');
    return customerData;
  } catch (error) {
    console.error('Error saving customer profile:', error);
    throw error;
  }
};

// Save order details with enhanced delivery information
export const saveOrder = async (orderData) => {
  try {
    const orderRef = doc(collection(db, 'orders'));
    const orderId = orderRef.id;
    
    const order = {
      // Order Identification
      orderId,
      clerkUserId: orderData.clerkUserId,
      
      // Customer Information
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      
      // Enhanced Delivery Information
      shippingLocation: orderData.shippingLocation,
      shippingProvider: orderData.shippingProvider,
      shippingType: orderData.shippingType,
      shippingFee: orderData.shippingFee,
      shippingAddress: orderData.shippingAddress,
      deliveryNotes: orderData.deliveryNotes,
      
      // Order Items
      items: orderData.items,
      itemCount: orderData.itemCount,
      
      // Payment Information
      subtotal: orderData.subtotal,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentReference: orderData.paymentReference,
      paymentChannel: orderData.paymentChannel,
      paymentStatus: orderData.paymentStatus || 'completed',
      
      // Order Status
      orderStatus: orderData.orderStatus || 'confirmed',
      
      // Store Information
      storeContact: orderData.storeContact,
      storeEmail: orderData.storeEmail,
      storeAddress: orderData.storeAddress,
      
      // Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Additional metadata
      notes: orderData.notes || '',
      
      // Delivery Tracking
      deliveryStatus: 'pending',
      estimatedDelivery: getEstimatedDeliveryDate(orderData.shippingType),
      trackingNumber: null,
      carrier: orderData.shippingProvider
    };

    await setDoc(orderRef, order);
    
    // Update customer's order count and total spent
    if (orderData.clerkUserId) {
      await updateCustomerOrderStats(orderData.clerkUserId, orderData.totalAmount);
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
      deliveryDays = 10; // 5-10 business days
      break;
    case 'domestic':
    default:
      deliveryDays = 5; // 2-5 business days
      break;
  }
  
  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + deliveryDays);
  return estimatedDate;
};

// Update customer order statistics
const updateCustomerOrderStats = async (clerkUserId, orderAmount) => {
  try {
    const customerRef = doc(db, 'customers', clerkUserId);
    const customerDoc = await getDoc(customerRef);
    
    if (customerDoc.exists()) {
      const currentData = customerDoc.data();
      await updateDoc(customerRef, {
        totalOrders: (currentData.totalOrders || 0) + 1,
        totalSpent: (currentData.totalSpent || 0) + orderAmount,
        lastOrderDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error updating customer stats:', error);
  }
};

// Get customer orders
export const getCustomerOrders = async (clerkUserId) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('clerkUserId', '==', clerkUserId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      orders.push({ 
        id: doc.id, 
        ...orderData,
        // Format dates for display
        createdAt: orderData.createdAt?.toDate() || new Date(),
        estimatedDelivery: orderData.estimatedDelivery?.toDate() || new Date()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
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
        // Format dates for display
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