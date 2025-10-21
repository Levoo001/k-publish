// src/lib/auth.js

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          if (credentials.action === 'register') {
            // Registration flow
            if (!credentials.name) {
              throw new Error('Name is required for registration');
            }

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );
            
            const user = userCredential.user;

            // Create user profile in Firestore (without Clerk fields)
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
              totalSpent: 0
            };

            await setDoc(doc(db, 'users', user.uid), userProfile);

            return {
              id: user.uid,
              email: user.email,
              name: credentials.name
            };
          } else {
            // Login flow
            const userCredential = await signInWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );
            
            const user = userCredential.user;

            // Get or create user data in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            let userData = userDoc.data();
            
            if (!userData) {
              userData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || credentials.name || 'User',
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
              name: userData.name
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
          
          // User-friendly error messages
          if (error.code === 'auth/email-already-in-use') {
            throw new Error('An account already exists with this email');
          } else if (error.code === 'auth/user-not-found') {
            throw new Error('No account found with this email');
          } else if (error.code === 'auth/wrong-password') {
            throw new Error('Incorrect password');
          } else if (error.code === 'auth/weak-password') {
            throw new Error('Password should be at least 6 characters');
          } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email address');
          } else {
            throw new Error(error.message || 'Authentication failed');
          }
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
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