// src/services/newsletterService.js - UPDATED TO STORE ALL FORM DATA
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Subscribe to newsletter - UPDATED to accept form data
export const subscribeToNewsletter = async (email, name = '', birthday = '') => {
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

    // Prepare subscriber data with all form fields
    const subscriberData = {
      email: normalizedEmail,
      subscribedAt: serverTimestamp(),
      status: 'active',
      source: 'website_popup'
    };

    // Add name if provided
    if (name && name.trim()) {
      subscriberData.name = name.trim();
    }

    // Add birthday if provided and valid format
    if (birthday && birthday.trim()) {
      // Basic DD/MM format validation
      const birthdayRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
      if (birthdayRegex.test(birthday.trim())) {
        subscriberData.birthday = birthday.trim();
      } else {
        console.warn('Invalid birthday format provided:', birthday);
        // Still subscribe but without birthday
      }
    }

    // Add new subscriber with all data
    const docRef = await addDoc(subscribersRef, subscriberData);

    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      id: docRef.id,
      data: subscriberData
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