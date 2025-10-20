// src/lib/auth.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Separate function for user registration
async function registerUser(credentials) {
  try {
    console.log('Starting registration for:', credentials.email);
    
    // Create new user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    
    const user = userCredential.user;
    console.log('Firebase user created:', user.uid);

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email,
      name: credentials.name,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      status: 'active',
      emailVerified: false,
      totalOrders: 0,
      totalSpent: 0,
      newsletterSubscribed: true
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    console.log('Firestore user profile created');

    // Send welcome email (non-blocking)
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/auth/emails/welcome-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: credentials.name
        })
      });
    } catch (emailError) {
      console.log('Welcome email failed:', emailError);
      // Don't throw error - user creation should still succeed
    }

    return {
      id: user.uid,
      email: user.email,
      name: credentials.name
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account already exists with this email');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
}

// Separate function for user login
async function loginUser(credentials) {
  try {
    console.log('Starting login for:', credentials.email);
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    
    const user = userCredential.user;
    console.log('Firebase user signed in:', user.uid);

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let userData = userDoc.data();
    
    // If user doesn't exist in Firestore, create a record
    if (!userData) {
      userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        status: 'active'
      };
      await setDoc(doc(db, 'users', user.uid), userData);
    } else {
      // Update last login
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    
    return {
      id: user.uid,
      email: user.email,
      name: userData.name || user.displayName
    };
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error('Login failed. Please try again.');
    }
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' } // 'register' or 'login'
      },
      async authorize(credentials) {
        try {
          console.log('Auth attempt - Action:', credentials.action, 'Email:', credentials.email);
          
          if (credentials.action === 'register') {
            // Registration flow
            if (!credentials.name) {
              throw new Error('Name is required for registration');
            }
            return await registerUser(credentials);
          } else {
            // Login flow (default)
            return await loginUser(credentials);
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw error; // Re-throw the error so NextAuth can handle it
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token on sign in
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.uid;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);