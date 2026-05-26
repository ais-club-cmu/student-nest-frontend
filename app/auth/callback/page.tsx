'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CallbackState = 'loading' | 'confirmed' | 'error';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [state, setState] = useState<CallbackState>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const hash = window.location.hash.slice(1); // strip leading #
        if (!hash) {
            router.replace('/login');
            return;
        }

        const params = new URLSearchParams(hash);
        const type = params.get('type');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
            setErrorMsg(
                errorDescription
                    ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
                    : 'The confirmation link is invalid or has expired.'
            );
            setState('error');
            return;
        }

        if (type === 'signup' || type === 'email_change') {
            setState('confirmed');
            // Give user a moment to read the success message, then go to login
            const t = setTimeout(() => {
                router.replace('/login?verified=true');
            }, 2500);
            return () => clearTimeout(t);
        }

        if (type === 'recovery') {
            // Password reset token — hand off to the reset-confirm page
            const accessToken = params.get('access_token') ?? '';
            router.replace(`/password-reset/confirm?token=${accessToken}`);
            return;
        }

        // Unknown type — just go to login
        router.replace('/login');
    }, [router]);

    if (state === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="material-symbols-outlined text-primary text-5xl animate-spin" style={{ animationDuration: '1s' }}>
                        progress_activity
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Confirming your email…</p>
                </div>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="flex flex-col items-center gap-6 text-center max-w-sm">
                    <div className="size-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl">error</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Link expired</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{errorMsg}</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                        >
                            Back to Register
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm text-slate-500 hover:text-primary transition-colors"
                        >
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // confirmed
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
            <div className="flex flex-col items-center gap-6 text-center max-w-sm">
                <div className="size-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">check_circle</span>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Email confirmed!</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Your account is active. Redirecting you to sign in…
                    </p>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[grow_2.5s_linear_forwards]" />
                </div>
                <Link
                    href="/login?verified=true"
                    className="text-sm text-primary hover:underline font-semibold"
                >
                    Go to sign in now
                </Link>
            </div>
        </div>
    );
}
