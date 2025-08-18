// src/components/auth/AuthForm.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { FirebaseError } from 'firebase/app';

const IconGoogle = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.978,36.218,44,30.608,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export const AuthForm = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signUp, logIn, signInWithGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLoginView) {
                await logIn(email, password);
            } else {
                if (password.length < 6) {
                    setError("Password must be at least 6 characters.");
                    setLoading(false);
                    return;
                }
                await signUp(email, password);
                alert("Sign up successful! Please log in.");
                setIsLoginView(true); // Switch to login view after signup
            }
        } catch (err) {
            const firebaseError = err as FirebaseError;
            if (firebaseError.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please log in.');
            } else if (firebaseError.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else {
                setError('An error occurred. Please try again.');
            }
            console.error("Auth Error:", firebaseError.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            setError("Failed to sign in with Google.");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button onClick={() => { setIsLoginView(true); setError(null); }} className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${isLoginView ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Login</button>
                <button onClick={() => { setIsLoginView(false); setError(null); }} className={`flex-1 py-4 text-sm font-semibold text-center transition-colors ${!isLoginView ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Sign Up</button>
            </div>
            <div className="p-8">
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-white">{isLoginView ? "Welcome Back!" : "Create Your Account"}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-6">{isLoginView ? "Login to access your dashboard." : "Get started on your journey."}</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-2 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-2 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors">
                        {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    <span className="mx-4 text-xs text-slate-500">OR</span>
                    <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                </div>

                <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    <IconGoogle />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};
