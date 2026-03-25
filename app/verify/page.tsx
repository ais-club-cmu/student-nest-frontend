import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function VerifyPage() {
    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12 lg:py-24 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">

                {/* Icon & Title Section */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-primary text-3xl">mark_email_read</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight mb-3">
                        Verify your account
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
                        A 6-digit code has been sent to your email/phone. Enter it below to verify your account.
                    </p>
                </div>

                {/* OTP Input Fieldset */}
                <form className="flex flex-col w-full">
                    <div className="flex justify-center mb-8">
                        <fieldset className="flex gap-2 sm:gap-3">
                            {/* Input slots for 6 digits */}
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    className="flex h-14 w-10 sm:w-12 text-center text-xl font-bold bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-0 focus:outline-none transition-all rounded-t-lg"
                                    inputMode="numeric"
                                    maxLength={1}
                                    pattern="[0-9]*"
                                    type="text"
                                    name={`otp-${i}`}
                                />
                            ))}
                        </fieldset>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-4">
                        <Button variant="primary" size="lg" className="w-full rounded-lg" type="submit">
                            Verify Account
                        </Button>

                        {/* Resend Link */}
                        <div className="text-center mt-2">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Didn't receive the code?
                                <button type="button" className="text-primary font-bold hover:underline bg-transparent border-none p-0 ml-1">
                                    Resend code
                                </button>
                            </p>
                        </div>
                    </div>
                </form>

                {/* Additional Context/Footer */}
                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mb-4">
                        Secured by StudentNest Auth
                    </p>
                    <div className="flex justify-center gap-4 text-slate-400 dark:text-slate-600">
                        <span className="material-symbols-outlined text-lg">verified_user</span>
                        <span className="material-symbols-outlined text-lg">lock</span>
                        <span className="material-symbols-outlined text-lg">shield</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
