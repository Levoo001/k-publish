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

// Save user to Firebase when they sign up
export const saveUserToFirebase = async (userData) => {
  try {
    const usersRef = collection(db, 'users');
    
    // Check if user already exists
    const q = query(usersRef, where('clerkId', '==', userData.clerkId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('User already exists in Firebase');
      return {
        success: true,
        message: 'User already exists',
        exists: true
      };
    }

    // Add new user
    const docRef = await addDoc(usersRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    });

    return {
      success: true,
      message: 'User saved to Firebase successfully',
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving user to Firebase:', error);
    throw new Error('Failed to save user data. Please try again.');
  }
};

// Alternative: Use setDoc with user ID as document ID
export const saveUserWithId = async (userData) => {
  try {
    const userDocRef = doc(db, 'users', userData.clerkId);
    
    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active'
    }, { merge: true }); // merge: true prevents overwriting existing data

    return {
      success: true,
      message: 'User data saved successfully'
    };
  } catch (error) {
    console.error('Error saving user with ID:', error);
    throw new Error('Failed to save user data.');
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (clerkId) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('clerkId', '==', clerkId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
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
      clerkId: userData.clerkId,
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

// Save user with additional metadata
export const saveUserWithMetadata = async (userData) => {
  try {
    const userDocRef = doc(db, 'users', userData.clerkId);
    
    const userMetadata = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      loginCount: 1, // You can increment this on each login
      status: 'active',
      emailVerified: userData.emailVerified || false,
      signUpMethod: 'clerk'
    };

    await setDoc(userDocRef, userMetadata, { merge: true });
    
    // Also track the sign-up event
    await trackSignUpEvent(userData, 'sign_up');

    return {
      success: true,
      message: 'User data and event saved successfully'
    };
  } catch (error) {
    console.error('Error saving user with metadata:', error);
    throw new Error('Failed to save user data.');
  }
};