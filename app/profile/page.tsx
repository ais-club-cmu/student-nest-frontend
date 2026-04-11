'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfileAction } from '@/app/actions/nestActions';
import type { UserProfileResponse } from '@/lib/types/api.types';

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

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
            return;
        }

        getUserProfileAction(accessToken).then((result) => {
            if (result.error) {
                setError(result.error.message);
            } else {
                setProfile(result.data);
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
            </div>
        </div>
    );
}
