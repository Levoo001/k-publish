// src/services/newsletterService.js - UPDATED WITH BETTER ERROR HANDLING
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Subscribe to newsletter
export const subscribeToNewsletter = async (email) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email already exists
    const subscribersRef = collection(db, 'newsletterSubscribers');
    const q = query(subscribersRef, where('email', '==', normalizedEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error('This email is already subscribed to our newsletter!');
    }

    // Add new subscriber
    const docRef = await addDoc(subscribersRef, {
      email: normalizedEmail,
      subscribedAt: serverTimestamp(),
      status: 'active',
      source: 'website'
    });

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      id: docRef.id
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'permission-denied') {
      throw new Error('Newsletter service is currently unavailable. Please try again later.');
    }
    
    if (error.code === 'unavailable') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Preserve specific error messages
    if (error.message.includes('already subscribed') || 
        error.message.includes('valid email')) {
      throw error;
    }
    
    throw new Error('Failed to subscribe. Please try again later.');
  }
};

// Get subscriber count (optional)
export const getSubscriberCount = async () => {
  try {
    const subscribersRef = collection(db, 'newsletterSubscribers');
    const querySnapshot = await getDocs(subscribersRef);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    return 0;
  }
};