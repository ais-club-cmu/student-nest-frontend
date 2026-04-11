'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandlordConfirmEmailPage() {
    return (
        <div className="flex flex-1 justify-center py-10 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col items-center max-w-[560px] flex-1 text-center gap-8">

                {/* Icon */}
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mt-6">
                    <span className="material-symbols-outlined text-5xl text-primary">mark_email_unread</span>
                </div>

                {/* Copy */}
                <div className="flex flex-col gap-3">
                    <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
                        Check your inbox
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                        We sent a confirmation link to your email address. Click the link to verify your account — you'll then be taken to upload your identity document.
                    </p>
                </div>

                {/* Steps */}
                <div className="w-full flex flex-col gap-3 text-left">
                    {[
                        { icon: 'mail', label: 'Open the email from StudentNest' },
                        { icon: 'link', label: 'Click the confirmation link' },
                        { icon: 'verified_user', label: 'Upload your ID to complete verification' },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-[18px]">{step.icon}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{step.label}</p>
                        </div>
                    ))}
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl w-full text-left">
                    <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5">info</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Didn't receive an email? Check your spam folder. The link expires in <strong>1 hour</strong>.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full">
                    <Link href="/login">
                        <Button variant="primary" size="lg" className="w-full">
                            Go to Sign In
                        </Button>
                    </Link>
                    <Link href="/" className="text-sm text-slate-500 hover:text-primary transition-colors">
                        Return to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
