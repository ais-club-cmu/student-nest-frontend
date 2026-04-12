'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandlordPendingPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex flex-1 justify-center py-8 md:py-12 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[640px] flex-1">
                {/* Progress Indicator */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[100%] rounded-full"></div>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center gap-4 mb-10">
                    <div className="size-20 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-5xl">schedule</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                        Application Under Review
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
                        Thank you for registering with StudentNest. Your KYC documents are being reviewed by our compliance team.
                    </p>
                </div>

                {/* Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-amber-600">
                            <span className="material-symbols-outlined">timer</span>
                            <span className="font-bold text-sm">24-48 Hour Review</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Our team manually verifies every document. Expect your final result within 2 business days.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-green-600">
                            <span className="material-symbols-outlined">verified</span>
                            <span className="font-bold text-sm">Verified Badge</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Once approved, you'll receive the 'Verified Landlord' badge, boosting tenant trust.
                        </p>
                    </div>
                </div>

                {/* What Happens Next */}
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
                    <h3 className="text-blue-900 dark:text-blue-100 font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">info</span>
                        What Happens Next
                    </h3>
                    <ul className="space-y-3 text-blue-800 dark:text-blue-200 text-sm">
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
                            <span>We verify your national ID and residential address</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
                            <span>We check your background for any compliance issues</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
                            <span>You'll receive an email notification when approved or if we need more info</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    {/* <Button
                        variant="primary"
                        size="lg"
                        className="w-full rounded-lg"
                        onClick={() => router.push('/landlord')}
                    >
                        Return to Dashboard
                    </Button> */}
                    <Link href="/">
                        <Button variant="secondary" size="lg" className="w-full rounded-lg">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Support */}
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Have questions? <Link href="#" className="text-primary font-semibold hover:underline">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
