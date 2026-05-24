'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getNotificationsAction, markNotificationReadAction } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { NotificationResponse } from '@/lib/types/api.types';

export default function StudentPortalNotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [markingId, setMarkingId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const load = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token || role !== 'student') { router.push('/login'); return; }
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
        <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950/50">

            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-16 bottom-0 left-0 z-30 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary rounded-lg p-2 text-white">
                            <span className="material-symbols-outlined block">home_work</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none text-slate-900 dark:text-white">StudentNest</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Listing Portal</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    <Link href="/student-portal" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="/student-portal/listings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">list_alt</span>
                        <span className="text-sm font-medium">My Listings</span>
                    </Link>
                    <Link href="/student-portal/notifications" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="text-sm font-medium">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                    </Link>
                    <Link href="/student-portal/conversations" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">forum</span>
                        <span className="text-sm font-medium">Messages</span>
                    </Link>
                    <Link href="/listings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">search</span>
                        <span className="text-sm font-medium">Browse Listings</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <button onClick={() => { localStorage.clear(); router.push('/'); }} className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
                <div className="p-4">
                    <Link href="/add-listing">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add New Listing
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 md:ml-64 flex flex-col min-w-0">
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center justify-between sticky top-16 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
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

                <div className="p-4 md:p-8 max-w-3xl w-full mx-auto">

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

                    {!loading && notifications.length === 0 && !error && (
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
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.is_read ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary/10'}`}>
                                        <span className={`material-symbols-outlined text-xl ${n.is_read ? 'text-slate-400' : 'text-primary'}`}>
                                            {n.entity_type === 'listing' ? 'apartment' :
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
                </div>
            </main>
        </div>
    );
}
