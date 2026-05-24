'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublicListingsAction } from '@/app/actions/listingsActions';
import type { PropertyType, PublicListing } from '@/lib/types/api.types';

const API_BASE = process.env.NEXT_PUBLIC_NEST_API_BASE_URL ?? '';
function mediaUrl(url: string) { return url.startsWith('http') ? url : `${API_BASE}${url}`; }

function fmtRwf(n: number | null | undefined) {
    return n != null ? `RWF ${n.toLocaleString()}` : '—';
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    single_room: 'Single Room',
    shared_room: 'Shared Room',
    self_contained_studio: 'Studio',
    full_apartment: 'Full Apartment',
};

const UTILITY_ICONS: Record<string, string> = {
    electricity: 'bolt',
    water: 'water_drop',
    gas: 'local_fire_department',
    security: 'security',
    garbage: 'delete',
};

const FILTER_OPTIONS = [
    { key: 'all', label: 'All' },
    { key: 'single_room', label: 'Single Room' },
    { key: 'shared_room', label: 'Shared Room' },
    { key: 'self_contained_studio', label: 'Studio' },
    { key: 'full_apartment', label: 'Apartment' },
] as const;

type FilterKey = typeof FILTER_OPTIONS[number]['key'];

function nextAvailableMonth(listing: PublicListing): string | null {
    if (!listing.calendar?.length) return null;
    const now = new Date();
    const upcoming = listing.calendar
        .filter((e) => e.status === 'available')
        .filter((e) => e.year > now.getFullYear() || (e.year === now.getFullYear() && e.month >= now.getMonth() + 1))
        .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    if (!upcoming.length) return null;
    const { year, month } = upcoming[0];
    return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ListingsPage() {
    const [listings, setListings] = useState<PublicListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterKey>('all');
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => { setRole(localStorage.getItem('userRole')); }, []);

    const load = useCallback(async () => {
        setLoading(true);
        const result = await getPublicListingsAction();
        setLoading(false);
        if (result.error) {
            if (result.error.status === 404) { setListings([]); return; }
            setError(result.error.message);
            return;
        }
        setListings((result.data ?? []).filter((l) => l.status === 'active'));
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = listings.filter((l) => {
        const q = search.toLowerCase();
        const matchesSearch = !q ||
            l.full_address?.toLowerCase().includes(q) ||
            l.neighborhood_name?.toLowerCase().includes(q);
        const matchesFilter = filter === 'all' || l.property_type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-950/50">
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header bar */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Browse Listings</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Find your perfect student accommodation</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all text-slate-900 dark:text-white"
                                placeholder="Search by address or neighbourhood…"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {role === 'student' && (
                            <Link
                                href="/add-listing"
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span className="hidden sm:inline">Add Listing</span>
                            </Link>
                        )}
                    </div>
                </div>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto whitespace-nowrap">
                            {FILTER_OPTIONS.map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => setFilter(opt.key)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                        filter === opt.key
                                            ? 'bg-primary text-white'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {!loading && (
                            <div className="ml-auto">
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-24">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        </div>
                    )}

                    {/* Empty — no listings exist yet */}
                    {!loading && !error && listings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">apartment</span>
                            <div>
                                <p className="font-bold text-slate-600 dark:text-slate-400 text-lg">No listings yet</p>
                                <p className="text-sm text-slate-400 mt-1">Check back soon — new listings are added regularly.</p>
                            </div>
                        </div>
                    )}

                    {/* Empty — search/filter produced no matches */}
                    {!loading && !error && listings.length > 0 && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">search_off</span>
                            <div>
                                <p className="font-bold text-slate-600 dark:text-slate-400 text-lg">No matches</p>
                                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
                            </div>
                        </div>
                    )}

                    {/* Listings */}
                    {!loading && filtered.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            {filtered.map((listing) => {
                                const cover = listing.cover_url ? mediaUrl(listing.cover_url) : null;
                                const typeLabel = listing.property_type ? PROPERTY_TYPE_LABELS[listing.property_type] : null;
                                const availableFrom = nextAvailableMonth(listing);

                                return (
                                    <div
                                        key={listing.id}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Image */}
                                        <div className="relative w-full lg:w-72 h-52 lg:h-auto shrink-0 bg-slate-100 dark:bg-slate-800">
                                            {cover ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={cover}
                                                    alt={listing.full_address ?? 'Listing photo'}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl">apartment</span>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <span className="size-1.5 bg-emerald-500 rounded-full" />
                                                    Available
                                                </span>
                                            </div>
                                            {typeLabel && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full text-xs font-bold">
                                                        {typeLabel}
                                                    </span>
                                                </div>
                                            )}
                                            {listing.verified_badge && (
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="bg-primary text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">verified</span>
                                                        Verified
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white truncate">
                                                        {listing.full_address ?? 'Address not provided'}
                                                    </h3>
                                                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1">
                                                        <span className="material-symbols-outlined text-lg">location_on</span>
                                                        {listing.neighborhood_name ?? 'Kigali'}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-xl font-bold text-primary">{fmtRwf(listing.monthly_rent_rwf)}</p>
                                                    <p className="text-xs text-slate-500">per month</p>
                                                </div>
                                            </div>

                                            {/* Amenity chips */}
                                            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800 my-4">
                                                {listing.utilities && listing.utilities.length > 0
                                                    ? listing.utilities.map((u) => (
                                                        <div key={u} className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm capitalize">
                                                            <span className="material-symbols-outlined text-lg">
                                                                {UTILITY_ICONS[u] ?? 'check_circle'}
                                                            </span>
                                                            {u}
                                                        </div>
                                                    ))
                                                    : (
                                                        <span className="text-sm text-slate-400">No utilities listed</span>
                                                    )
                                                }
                                                {availableFrom && (
                                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                                                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                                                        From {availableFrom}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-auto">
                                                <Link
                                                    href={`/listings/${listing.id}`}
                                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                                                >
                                                    View Details
                                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
