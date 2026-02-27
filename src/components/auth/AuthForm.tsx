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
    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null); // For success messages
    const [loading, setLoading] = useState(false);
    const { signUp, logIn, signInWithGoogle, resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            if (view === 'login') {
                await logIn(email, password);
            } else if (view === 'signup') {
                if (!email.endsWith('@gmail.com')) {
                    throw new Error("Please use a genuine @gmail.com address.");
                }
                if (password.length < 6) {
                    throw new Error("Password must be at least 6 characters.");
                }
                await signUp(email, password);
                alert("Account created! A verification email has been sent to your inbox.");
                setView('login');
            } else if (view === 'forgot') {
                await resetPassword(email);
                setMessage("Password reset email sent! Check your inbox.");
                setLoading(false);
                return; // Stay on this view to show message
            }
        } catch (err) {
            if (err instanceof FirebaseError) {
                 if (err.code === 'auth/email-already-in-use') setError('Email already registered.');
                 else if (err.code === 'auth/invalid-credential') setError('Invalid email or password.');
                 else setError(err.message);
            } else if (err instanceof Error) {
                 setError(err.message);
            } else {
                 setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button onClick={() => { setView('login'); setError(null); setMessage(null); }} className={`flex-1 py-4 text-sm font-semibold transition-colors ${view === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Login</button>
                <button onClick={() => { setView('signup'); setError(null); setMessage(null); }} className={`flex-1 py-4 text-sm font-semibold transition-colors ${view === 'signup' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Sign Up</button>
            </div>
            
            <div className="p-8">
                <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-white">
                    {view === 'login' ? "Welcome Back!" : view === 'signup' ? "Create Account" : "Reset Password"}
                </h2>
                <p className="text-slate-500 text-center text-sm mb-6">
                    {view === 'login' ? "Login to access your dashboard." : view === 'signup' ? "Get started on your journey." : "Enter your email to receive a reset link."}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
                    {message && <p className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">{message}</p>}
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="username@gmail.com" className="w-full px-4 py-2 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    
                    {view !== 'forgot' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 rounded border border-slate-300 dark:bg-slate-700 dark:border-slate-600"/>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 disabled:opacity-50">
                        {loading ? 'Processing...' : (view === 'login' ? 'Login' : view === 'signup' ? 'Create Account' : 'Send Reset Link')}
                    </button>
                </form>

                {view === 'login' && (
                    <button onClick={() => setView('forgot')} className="mt-4 w-full text-sm text-indigo-600 hover:underline">
                        Forgot your password?
                    </button>
                )}
                {view === 'forgot' && (
                    <button onClick={() => setView('login')} className="mt-4 w-full text-sm text-indigo-600 hover:underline">
                        Back to Login
                    </button>
                )}

                {view !== 'forgot' && (
                    <>
                        <div className="my-6 flex items-center">
                            <div className="flex-grow border-t border-slate-300"></div>
                            <span className="mx-4 text-xs text-slate-500">OR</span>
                            <div className="flex-grow border-t border-slate-300"></div>
                        </div>
                        <button onClick={() => signInWithGoogle().catch(e => setError(e.message))} className="w-full flex justify-center gap-3 bg-white border border-slate-300 py-3 rounded hover:bg-slate-50">
                            <IconGoogle />
                            <span className="text-slate-700 font-semibold">Sign in with Google</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};