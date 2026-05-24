'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    getListingDashboardAction,
    markFilledAction,
    archiveListingAction,
    deleteDraftListingAction,
} from '@/app/actions/listingsActions';
import { getUserProfileAction } from '@/app/actions/nestActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { ListingDashboardCard, ListingDashboardResponse, ListingStatus } from '@/lib/types/api.types';

type FilterTab = 'all' | ListingStatus;

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
    active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    pending_review: { label: 'Under Review', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    filled: { label: 'Filled', dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    archived: { label: 'Archived', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    draft: { label: 'Draft', dot: 'bg-slate-300', badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
};

function fmtRwf(n: number | null | undefined) { return n != null ? `RWF ${n.toLocaleString()}` : '—'; }

const API_BASE = process.env.NEXT_PUBLIC_NEST_API_BASE_URL ?? '';
function mediaUrl(url: string) { return url.startsWith('http') ? url : `${API_BASE}${url}`; }

function ListingCard({ card, onAction }: { card: ListingDashboardCard; onAction: () => void }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const cfg = STATUS_CONFIG[card.status] ?? STATUS_CONFIG.draft;

    const handleMark = async (action: 'filled' | 'archive' | 'delete') => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        setBusy(true);
        if (action === 'filled') await markFilledAction(token, card.id);
        else if (action === 'archive') await archiveListingAction(token, card.id);
        else await deleteDraftListingAction(token, card.id);
        setBusy(false);
        onAction();
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-shadow">
            {/* Cover image */}
            <div className="relative w-full lg:w-56 h-44 lg:h-auto shrink-0 bg-slate-100 dark:bg-slate-800">
                {card.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(card.cover_url)} alt="Listing" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">apartment</span>
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.badge}`}>
                        <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                            {card.full_address}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-base">location_on</span>
                            {card.neighborhood_name ?? 'Unknown neighbourhood'}{card.property_type ? <> · <span className="capitalize">{card.property_type.replace(/_/g, ' ')}</span></> : null}
                        </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                        <p className="font-bold text-primary text-lg">{fmtRwf(card.monthly_rent_rwf)}</p>
                        <p className="text-xs text-slate-400">/ month</p>
                    </div>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {card.status === 'draft' && (
                        <>
                            <button onClick={() => router.push('/landlord/listings/add')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                Continue Draft
                            </button>
                            <button onClick={() => handleMark('delete')} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50">
                                Delete
                            </button>
                        </>
                    )}
                    {card.status === 'pending_review' && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-amber-500 text-base">schedule</span>
                            Under review — usually 24–48 hours
                        </p>
                    )}
                    {card.status === 'active' && (
                        <>
                            <button onClick={() => handleMark('filled')} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50">
                                Mark Filled
                            </button>
                            <button onClick={() => handleMark('archive')} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50">
                                Archive
                            </button>
                        </>
                    )}
                    {card.status === 'filled' && (
                        <button onClick={() => handleMark('archive')} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50">
                            Archive
                        </button>
                    )}
                    {busy && (
                        <span className="material-symbols-outlined animate-spin text-primary text-base ml-auto">progress_activity</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LandlordListingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [dashboard, setDashboard] = useState<ListingDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<FilterTab>('all');
    const [successBanner, setSuccessBanner] = useState(searchParams.get('submitted') === '1');
    const [kycPendingReview, setKycPendingReview] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const load = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token || (role !== 'landlord' && role !== 'student')) { router.push('/login'); return; }

        const profileResult = await getUserProfileAction(token);
        if (profileResult.error) {
            if (handleAuthError(profileResult.error, router)) return;
        }
        if (profileResult.data) {
            const { kyc_status } = profileResult.data;
            if (role === 'landlord' && kyc_status === 'rejected') {
                router.replace('/landlord-registration/id-verification');
                return;
            }
            setKycPendingReview(role === 'landlord' && kyc_status === 'pending');
        }

        setLoading(true);
        const result = await getListingDashboardAction(token);
        setLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        setDashboard(result.data);
    }, [router]);

    useEffect(() => { load(); }, [load]);

    const allCards = dashboard
        ? [
            ...dashboard.active,
            ...dashboard.pending_review,
            ...dashboard.filled,
            ...dashboard.archived,
            ...dashboard.drafts,
          ]
        : [];

    const filtered = tab === 'all' ? allCards : allCards.filter((c) => c.status === tab);
    const s = dashboard?.summary;

    const TABS: { value: FilterTab; label: string; count?: number }[] = [
        { value: 'all', label: 'All', count: allCards.length },
        { value: 'active', label: 'Active', count: s?.active },
        { value: 'pending_review', label: 'Under Review', count: s?.pending_review },
        { value: 'filled', label: 'Filled', count: s?.filled },
        { value: 'archived', label: 'Archived', count: s?.archived },
        { value: 'draft', label: 'Drafts', count: s?.drafts },
    ];

    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950/50">

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out
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
                    <Link href="/landlord" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="/landlord/listings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-lg">
                        <span className="material-symbols-outlined">list_alt</span>
                        <span className="text-sm font-medium">My Listings</span>
                    </Link>
                    <Link href="/landlord/notifications" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="text-sm font-medium">Notifications</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <button onClick={() => { localStorage.clear(); router.push('/'); }} className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
                <div className="p-4">
                    <Link href="/landlord/listings/add">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add New Listing
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 md:ml-64 flex flex-col min-w-0">
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Listings</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={load} disabled={loading} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50">
                            <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
                        </button>
                        <Link href="/landlord/listings/add">
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                                <span className="hidden sm:inline">Add Listing</span>
                            </button>
                        </Link>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto w-full">

                    {kycPendingReview && (
                        <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                            <span className="material-symbols-outlined text-amber-500 shrink-0">pending</span>
                            <div>
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">KYC verification in progress</p>
                                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Your identity documents are under review. You can prepare your listings now — they&apos;ll be submitted once your account is verified.</p>
                            </div>
                        </div>
                    )}

                    {successBanner && (
                        <div className="flex items-center justify-between mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Listing submitted successfully! It&apos;s now under review.</p>
                            </div>
                            <button onClick={() => setSuccessBanner(false)} className="text-emerald-500 hover:text-emerald-700">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                    )}

                    {/* Summary cards */}
                    {s && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                            {[
                                { label: 'Active', value: s.active, color: 'text-emerald-600' },
                                { label: 'Under Review', value: s.pending_review, color: 'text-amber-600' },
                                { label: 'Filled', value: s.filled, color: 'text-blue-600' },
                                { label: 'Archived', value: s.archived, color: 'text-slate-500' },
                                { label: 'Drafts', value: s.drafts, color: 'text-slate-400' },
                            ].map((item) => (
                                <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
                                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto whitespace-nowrap mb-6 gap-1">
                        {TABS.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setTab(t.value)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                    tab === t.value
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {t.label}
                                {t.count !== undefined && t.count > 0 && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.value ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                        {t.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">apartment</span>
                            <p className="font-semibold text-slate-600 dark:text-slate-400">No listings here yet</p>
                            {tab === 'all' && (
                                <Link href="/landlord/listings/add">
                                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:bg-primary/90 transition-colors">
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Add Your First Listing
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}

                    {!loading && filtered.length > 0 && (
                        <div className="space-y-5">
                            {filtered.map((card) => (
                                <ListingCard key={card.id} card={card} onAction={load} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
