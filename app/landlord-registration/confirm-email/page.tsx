'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { resendConfirmationAction } from '@/app/actions/nestActions';

const COOLDOWN_SECONDS = 60;

function ConfirmEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';

    const [cooldown, setCooldown] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    // Tick the cooldown timer down every second
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const handleResend = useCallback(async () => {
        if (!email || isSending || cooldown > 0) return;

        setIsSending(true);
        setStatus('idle');
        setErrorMsg('');

        const result = await resendConfirmationAction(email);

        setIsSending(false);

        if (result.error) {
            setStatus('error');
            setErrorMsg(result.error.message ?? 'Something went wrong. Please try again.');
        } else {
            setStatus('sent');
            setCooldown(COOLDOWN_SECONDS);
        }
    }, [email, isSending, cooldown]);

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
                        We sent a confirmation link to{' '}
                        {email ? (
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>
                        ) : (
                            'your email address'
                        )}
                        . Click the link to verify your account — you&apos;ll then be taken to upload your identity document.
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

                {/* Expiry notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl w-full text-left">
                    <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5">info</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        Can&apos;t find it? Check your <strong>spam or junk</strong> folder. The link expires in <strong>1 hour</strong>.
                    </p>
                </div>

                {/* Resend section */}
                <div className="w-full flex flex-col gap-3 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-left">Didn&apos;t receive the email?</p>

                    {/* Status feedback */}
                    {status === 'sent' && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">check_circle</span>
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                Confirmation email resent successfully.
                            </p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[18px]">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{errorMsg}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            disabled={isSending || cooldown > 0}
                            onClick={handleResend}
                            className="flex items-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                    Sending…
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[16px]">send</span>
                                    Resend confirmation email
                                </>
                            )}
                        </Button>

                        {cooldown > 0 && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                                Resend available in {cooldown}s
                            </span>
                        )}
                    </div>

                    {!email && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-left">
                            If you registered with a different email, please{' '}
                            <Link href="/landlord-registration" className="text-primary hover:underline font-medium">
                                register again
                            </Link>
                            .
                        </p>
                    )}
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

export default function LandlordConfirmEmailPage() {
    return (
        <Suspense>
            <ConfirmEmailContent />
        </Suspense>
    );
}
