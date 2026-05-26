'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VerifyPage() {
    const [isResending, setIsResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResend = async () => {
        setIsResending(true);
        // TODO: wire up resend endpoint when available
        await new Promise((r) => setTimeout(r, 1000));
        setIsResending(false);
        setResent(true);
    };

    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12 lg:py-24 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-slate-900/50 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">

                {/* Icon & Title */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-primary text-3xl">mark_email_unread</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight mb-3">
                        Check your inbox
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                        We sent a confirmation link to your email. Click it and you'll be brought back here to sign in automatically.
                    </p>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-3 mb-8">
                    {[
                        { icon: 'mail', label: 'Open the email from StudentNest' },
                        { icon: 'link', label: 'Click the confirmation link' },
                        { icon: 'login', label: 'You\'ll be redirected to sign in' },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-[18px]">{step.icon}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{step.label}</p>
                        </div>
                    ))}
                </div>

                {/* Spam notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl mb-6">
                    <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5 text-[18px]">info</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Can't find it? Check your <strong>spam or junk</strong> folder. The link expires in <strong>1 hour</strong>.
                    </p>
                </div>

                {/* Resent confirmation */}
                {resent && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">check_circle</span>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">Verification email resent.</p>
                    </div>
                )}

                {/* Resend */}
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Didn't receive it?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || resent}
                        className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? 'Sending…' : resent ? 'Email sent' : 'Resend verification email'}
                    </button>
                </p>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Wrong email?{' '}
                        <Link href="/register" className="text-primary font-semibold hover:underline">Register again</Link>
                        {' '}·{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
