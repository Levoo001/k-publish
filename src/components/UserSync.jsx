"use client";

import { useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { saveUserWithMetadata, trackSignUpEvent } from '@/services/userService';

const UserSync = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { session } = useClerk();

  useEffect(() => {
    const syncUserToFirebase = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          const userData = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            profileImageUrl: user.imageUrl,
            emailVerified: user.primaryEmailAddress?.verification?.status === 'verified',
            signUpSource: 'clerk',
            lastLoginAt: new Date().toISOString()
          };

          await saveUserWithMetadata(userData);
          console.log('User synced to Firebase successfully');
        } catch (error) {
          console.error('Failed to sync user to Firebase:', error);
        }
      }
    };

    syncUserToFirebase();
  }, [isLoaded, isSignedIn, user]);

  return null;
};

export default UserSync;