'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function VerifyPage() {
    const router = useRouter();
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');

    const handleResendCode = async () => {
        setIsResending(true);
        setMessage('Verification code sent. Please check your email.');
        setTimeout(() => {
            setIsResending(false);
        }, 2000);
    };

    const handleContinue = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            router.push('/complete-profile');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12 lg:py-24 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">

                {/* Icon & Title Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">mark_email_read</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight mb-3">
                        Verify your email
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
                        We've sent a verification link to your email address. Click the link in the email to verify your account and get started.
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className="flex items-center gap-3 p-4 mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">{message}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <form className="flex flex-col w-full gap-4 mt-8">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-3">
                            ✓ Check your email (including spam folder)
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-3">
                            ✓ Click the verification link
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            ✓ You'll be ready to complete your profile
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="w-full rounded-lg" 
                            type="button"
                            onClick={handleContinue}
                        >
                            I've Verified My Email
                        </Button>

                        {/* Resend Link */}
                        <div className="text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Didn't receive the email?
                                <button 
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                    className="text-primary font-bold hover:underline bg-transparent border-none p-0 ml-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResending ? 'Sending...' : 'Resend verification email'}
                                </button>
                            </p>
                        </div>
                    </div>
                </form>

                {/* Additional Help */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        Having trouble? <Link href="#" className="text-primary font-semibold hover:underline">Contact support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
