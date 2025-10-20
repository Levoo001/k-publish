// src/services/userService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp,
  doc,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Register new user with email and password
export const registerUser = async (userData) => {
  try {
    const { email, password, name } = userData;
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save user to Firestore
    const userDocRef = doc(db, 'users', user.uid);
    
    const userProfile = {
      uid: user.uid,
      email: email,
      name: name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      status: 'active',
      emailVerified: false,
      totalOrders: 0,
      totalSpent: 0,
      newsletterSubscribed: true
    };

    await setDoc(userDocRef, userProfile, { merge: true });
    
    // Track sign-up event
    await trackSignUpEvent(userProfile, 'sign_up');

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.uid,
        email: user.email,
        name: name
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(error.message || 'Failed to register user');
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Track sign-up events
export const trackSignUpEvent = async (userData, eventType = 'sign_up') => {
  try {
    const eventsRef = collection(db, 'userEvents');
    
    await addDoc(eventsRef, {
      userId: userData.uid,
      email: userData.email,
      eventType: eventType,
      timestamp: serverTimestamp(),
      userAgent: navigator?.userAgent || 'unknown',
      source: 'website'
    });

    console.log('Sign-up event tracked successfully');
  } catch (error) {
    console.error('Error tracking sign-up event:', error);
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await setDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return {
      success: true,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
};