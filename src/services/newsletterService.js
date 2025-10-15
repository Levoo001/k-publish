// src/services/newsletterService.js
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
    // Check if email already exists
    const subscribersRef = collection(db, 'newsletterSubscribers');
    const q = query(subscribersRef, where('email', '==', email.toLowerCase().trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error('This email is already subscribed to our newsletter!');
    }

    // Add new subscriber
    const docRef = await addDoc(subscribersRef, {
      email: email.toLowerCase().trim(),
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
    
    if (error.message.includes('already subscribed')) {
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