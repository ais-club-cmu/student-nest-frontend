'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserProfileAction, setSecurityQuestionAction } from '@/app/actions/nestActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { UserProfileResponse } from '@/lib/types/api.types';

const PRESET_QUESTIONS = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your primary school?",
    "What was your childhood nickname?",
    "What city were you born in?",
    "What is the name of the street you grew up on?",
    "Other (type your own question)",
];

function DetailRow({ label, value }: { label: string; value: string | boolean | null | undefined }) {
    const display =
        value === null || value === undefined ? '—'
        : typeof value === 'boolean' ? (value ? 'Yes' : 'No')
        : value;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <span className="text-sm text-slate-500 dark:text-slate-400 sm:w-44 shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{display}</span>
        </div>
    );
}

function SecurityQuestionCard({
    hasQuestion,
    accessToken,
    onSet,
}: {
    hasQuestion: boolean;
    accessToken: string;
    onSet: () => void;
}) {
    const [isEditing, setIsEditing] = useState(!hasQuestion);
    const [selectedQuestion, setSelectedQuestion] = useState(PRESET_QUESTIONS[0]);
    const [customQuestion, setCustomQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const isCustom = selectedQuestion === PRESET_QUESTIONS[PRESET_QUESTIONS.length - 1];
    const questionText = isCustom ? customQuestion : selectedQuestion;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!questionText.trim() || !answer.trim()) return;

        setIsLoading(true);
        setError(null);

        const result = await setSecurityQuestionAction(accessToken, {
            question: questionText.trim(),
            answer: answer.trim(),
        });

        setIsLoading(false);

        if (result.error) {
            setError(result.error.message ?? 'Could not save security question. Please try again.');
        } else {
            setSuccess(true);
            setIsEditing(false);
            onSet();
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">shield_person</span>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Security Question</h2>
                </div>
                {hasQuestion && !isEditing && (
                    <button
                        type="button"
                        onClick={() => { setIsEditing(true); setSuccess(false); setError(null); }}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        Change
                    </button>
                )}
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
                {/* Banner for users without a question */}
                {!hasQuestion && !success && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5 text-[18px]">warning</span>
                        <div>
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Security question not set</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                Add a security question so you can reset your password even without access to your email.
                            </p>
                        </div>
                    </div>
                )}

                {/* Success state */}
                {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[18px]">check_circle</span>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">Security question saved successfully.</p>
                    </div>
                )}

                {/* Already set & not editing */}
                {hasQuestion && !isEditing && (
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            A security question is set on your account.
                        </p>
                    </div>
                )}

                {/* Form */}
                {isEditing && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[18px]">error</span>
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Question selector */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Security question
                            </label>
                            <select
                                value={selectedQuestion}
                                onChange={(e) => setSelectedQuestion(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            >
                                {PRESET_QUESTIONS.map((q) => (
                                    <option key={q} value={q}>{q}</option>
                                ))}
                            </select>
                        </div>

                        {/* Custom question input */}
                        {isCustom && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Your question
                                </label>
                                <input
                                    type="text"
                                    value={customQuestion}
                                    onChange={(e) => setCustomQuestion(e.target.value)}
                                    placeholder="Type your security question…"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>
                        )}

                        {/* Answer */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                Your answer
                            </label>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Enter your answer"
                                autoComplete="off"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                required
                            />
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                Remember exactly how you type this — capitalisation matters when verifying.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={isLoading || !answer.trim() || (isCustom && !customQuestion.trim())}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                        Saving…
                                    </>
                                ) : (
                                    'Save Security Question'
                                )}
                            </button>
                            {hasQuestion && (
                                <button
                                    type="button"
                                    onClick={() => { setIsEditing(false); setError(null); }}
                                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState('');
    const [hasSecurityQuestion, setHasSecurityQuestion] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        setAccessToken(token);

        getUserProfileAction(token).then((result) => {
            if (result.error) {
                if (handleAuthError(result.error, router)) return;
                setError(result.error.message);
            } else {
                setProfile(result.data);
                setHasSecurityQuestion(result.data?.has_security_question ?? false);
            }
            setIsLoading(false);
        });
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md w-full">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const initials = profile.full_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="flex justify-center py-10 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[600px] w-full gap-6">
                {/* Avatar + name */}
                <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary text-white text-3xl font-bold select-none">
                        {initials}
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                            {profile.full_name}
                        </h1>
                        <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize">
                            {profile.role}
                        </span>
                    </div>
                </div>

                {/* Listing portal CTA — students only */}
                {profile.role === 'student' && (
                    <Link href="/student-portal">
                        <div className="flex items-center gap-4 p-5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer">
                            <div className="bg-primary rounded-xl p-2.5 shrink-0">
                                <span className="material-symbols-outlined text-white text-2xl">home_work</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">Listing Portal</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Upload and manage your rental listings</p>
                            </div>
                            <span className="material-symbols-outlined text-primary shrink-0">arrow_forward</span>
                        </div>
                    </Link>
                )}

                {/* Account details */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-6 py-2">
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pt-4 pb-2">
                        Account Details
                    </h2>
                    <DetailRow label="Phone" value={profile.phone} />
                    <DetailRow label="Account status" value={profile.status} />
                    <DetailRow label="KYC status" value={profile.kyc_status} />
                    <DetailRow label="Email verified" value={profile.email_verified} />
                    <DetailRow label="Phone verified" value={profile.phone_verified} />
                    <DetailRow label="2FA enabled" value={profile.mfa_enabled} />
                    <DetailRow
                        label="Last login"
                        value={
                            profile.last_login_at
                                ? new Date(profile.last_login_at).toLocaleString()
                                : null
                        }
                    />
                    <DetailRow label="Member since" value={joinedDate} />
                </div>

                {/* Security question */}
                {accessToken && (
                    <SecurityQuestionCard
                        hasQuestion={hasSecurityQuestion}
                        accessToken={accessToken}
                        onSet={() => setHasSecurityQuestion(true)}
                    />
                )}
            </div>
        </div>
    );
}
