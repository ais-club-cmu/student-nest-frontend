'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNotificationsAction, markNotificationReadAction } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { NotificationResponse } from '@/lib/types/api.types';

function timeAgo(isoDate: string) {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [markingId, setMarkingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }
        setLoading(true);
        const result = await getNotificationsAction(token);
        setLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        setNotifications(result.data ?? []);
    }, [router]);

    useEffect(() => { load(); }, [load]);

    const markRead = async (id: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setMarkingId(id);
        await markNotificationReadAction(token, id);
        setMarkingId(null);
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    };

    const markAllRead = async () => {
        const unread = notifications.filter((n) => !n.is_read);
        for (const n of unread) await markRead(n.id);
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950/50 font-display">
            {/* Top bar */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-sm font-semibold text-primary hover:underline">
                            Mark all read
                        </button>
                    )}
                    <button onClick={load} disabled={loading} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
                        <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">

                {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6">
                        <span className="material-symbols-outlined text-red-500">error</span>
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                    </div>
                )}

                {!loading && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">notifications_off</span>
                        <div>
                            <p className="font-bold text-slate-600 dark:text-slate-400 text-lg">All caught up!</p>
                            <p className="text-sm text-slate-400 mt-1">No notifications yet. Check back later.</p>
                        </div>
                    </div>
                )}

                {!loading && notifications.length > 0 && (
                    <div className="space-y-2">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                                    n.is_read
                                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                        : 'bg-primary/5 border-primary/20 dark:bg-primary/10'
                                }`}
                            >
                                {/* Icon */}
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                    n.is_read ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary/10'
                                }`}>
                                    <span className={`material-symbols-outlined text-xl ${n.is_read ? 'text-slate-400' : 'text-primary'}`}>
                                        {n.entity_type === 'listing' ? 'apartment' :
                                         n.entity_type === 'kyc' ? 'verified_user' :
                                         n.entity_type === 'payment' ? 'payments' :
                                         'notifications'}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-sm ${n.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                        {n.title}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{n.body}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    {!n.is_read && (
                                        <>
                                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            <button
                                                onClick={() => markRead(n.id)}
                                                disabled={markingId === n.id}
                                                className="text-xs text-slate-400 hover:text-primary transition-colors disabled:opacity-50 font-medium"
                                            >
                                                {markingId === n.id ? '…' : 'Mark read'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
