'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConversationsPane from '@/components/features/ConversationsPane';

export default function LandlordConversationsPage() {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token || (role !== 'landlord' && role !== 'student')) router.push('/login');
    }, [router]);

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
                            <p className="text-xs text-slate-500 dark:text-slate-400">Landlord Portal</p>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    <Link href="/landlord" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="/landlord/listings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">list_alt</span>
                        <span className="text-sm font-medium">My Listings</span>
                    </Link>
                    <Link href="/landlord/notifications" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="text-sm font-medium">Notifications</span>
                    </Link>
                    <Link href="/landlord/conversations" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg">
                        <span className="material-symbols-outlined">forum</span>
                        <span className="text-sm font-medium">Messages</span>
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
            <main className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-0">
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center gap-3 sticky top-16 z-10 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
                </header>

                {/* Conversations fill remaining height */}
                <div className="flex-1 flex min-h-0" style={{ height: 'calc(100vh - 128px)' }}>
                    <ConversationsPane />
                </div>
            </main>
        </div>
    );
}
