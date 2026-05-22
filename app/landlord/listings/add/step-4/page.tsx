'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDraftStep4Action } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { CalendarEntry, CalendarStatus } from '@/lib/types/api.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATUS_CONFIG: Record<CalendarStatus, { label: string; color: string; bg: string }> = {
    available: { label: 'Available', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700' },
    occupied: { label: 'Occupied', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700' },
    unavailable: { label: 'Unavailable', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
};

function buildDefaultCalendar(): CalendarEntry[] {
    const now = new Date();
    const entries: CalendarEntry[] = [];
    for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        entries.push({ month: d.getMonth() + 1, year: d.getFullYear(), status: 'available' });
    }
    return entries;
}

export default function AddListingStep4Page() {
    const router = useRouter();
    const [listingId, setListingId] = useState<string | null>(null);
    const [calendar, setCalendar] = useState<CalendarEntry[]>(buildDefaultCalendar);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = sessionStorage.getItem('currentDraftId');
        if (!id) { router.replace('/landlord/listings/add'); return; }
        setListingId(id);
    }, [router]);

    const cycleStatus = (idx: number) => {
        const order: CalendarStatus[] = ['available', 'occupied', 'unavailable'];
        setCalendar((prev) => {
            const next = [...prev];
            const current = next[idx].status;
            const nextStatus = order[(order.indexOf(current) + 1) % order.length];
            next[idx] = { ...next[idx], status: nextStatus };
            return next;
        });
    };

    const setAll = (status: CalendarStatus) => {
        setCalendar((prev) => prev.map((e) => ({ ...e, status })));
    };

    const handleSubmit = async () => {
        if (!listingId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setIsLoading(true);
        setError(null);
        const result = await updateDraftStep4Action(token, listingId, calendar);
        setIsLoading(false);

        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        router.push('/landlord/listings/add/step-5');
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-slate-950/50">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">home_work</span>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold">StudentNest</h2>
                </div>
                <button
                    onClick={() => { sessionStorage.removeItem('currentDraftId'); router.push('/landlord/listings'); }}
                    className="flex items-center gap-1.5 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
            </header>

            <main className="flex flex-1 justify-center py-8 px-4 md:px-0">
                <div className="flex flex-col w-full max-w-[720px]">
                    {/* Progress */}
                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-slate-900 dark:text-white text-2xl font-bold">Availability Calendar</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step 4 of 5 — Set availability for the next 12 months</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary text-sm font-bold">80%</p>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Complete</p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: '80%' }} />
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            {['Identity', 'Pricing', 'Photos', 'Calendar', 'Rules'].map((s, i) => (
                                <span key={s} className={i === 3 ? 'text-primary' : ''}>{i + 1}. {s}</span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Legend + quick-set */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 flex-wrap">
                                {(Object.entries(STATUS_CONFIG) as [CalendarStatus, typeof STATUS_CONFIG[CalendarStatus]][]).map(([k, v]) => (
                                    <span key={k} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${v.color} ${v.bg}`}>
                                        {v.label}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className="text-slate-500">Set all:</span>
                                <button type="button" onClick={() => setAll('available')} className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:brightness-105 transition-all">Available</button>
                                <button type="button" onClick={() => setAll('unavailable')} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:brightness-105 transition-all">Unavailable</button>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">Click a month to cycle through statuses.</p>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {calendar.map((entry, idx) => {
                                const cfg = STATUS_CONFIG[entry.status];
                                return (
                                    <button
                                        key={`${entry.year}-${entry.month}`}
                                        type="button"
                                        onClick={() => cycleStatus(idx)}
                                        className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${cfg.bg}`}
                                    >
                                        <span className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>
                                            {MONTHS[entry.month - 1]}
                                        </span>
                                        <span className={`text-lg font-bold ${cfg.color}`}>{entry.year}</span>
                                        <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => router.push('/landlord/listings/add/step-3')}
                            className="flex items-center gap-2 px-6 h-12 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-8 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>Next Step <span className="material-symbols-outlined">arrow_forward</span></>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
