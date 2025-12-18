// src/components/auth/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    UserCredential,
    sendEmailVerification,
    sendPasswordResetEmail // Import this
} from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>; // Add type definition
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // 1. Global Safety Check: If user exists but violates rules, don't set them in state
      if (currentUser) {
        const isGmail = currentUser.email?.endsWith('@gmail.com');
        const isVerified = currentUser.emailVerified;

        // Force logout if domain is invalid (Catch-all for session persistence)
        if (!isGmail) {
             await signOut(auth);
             setUser(null);
             setLoading(false);
             return;
        }

        // Anti-Flicker: If unverified, we treat them as logged out in the UI
        // We do NOT force signOut() here immediately, because the signUp function 
        // needs the session active briefly to send the verification email.
        if (!isVerified) {
             setUser(null); 
             setLoading(false);
             return;
        }

        setUser(currentUser);
        
        // Redirect logic: Only redirect if fully verified
        if (pathname === '/login') {
          router.push('/');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, pathname]);

  const signUp = async (email: string, password: string) => {
    if (!email.endsWith('@gmail.com')) {
        throw new Error("Only @gmail.com addresses are allowed.");
    }
    
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(credential.user);
    
    // Sign out immediately so they can't access the app until they verify
    await signOut(auth); 
    
    return credential;
  };

  const logIn = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!credential.user.emailVerified) {
        await signOut(auth);
        throw new Error("Email not verified. Please check your inbox.");
    }

    return credential;
  };

  const logOut = () => {
    return signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    if (result.user.email && !result.user.email.endsWith('@gmail.com')) {
        await signOut(auth);
        throw new Error("Only genuine @gmail.com accounts are allowed.");
    }
    
    return result;
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = { user, loading, signUp, logIn, logOut, signInWithGoogle, resetPassword };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};