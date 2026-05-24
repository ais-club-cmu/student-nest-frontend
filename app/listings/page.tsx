'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPublicListingsAction } from '@/app/actions/listingsActions';
import type { PropertyType, PublicListing, UtilityType } from '@/lib/types/api.types';

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

const UTILITY_OPTIONS: { key: UtilityType; label: string; icon: string }[] = [
    { key: 'electricity', label: 'Electricity', icon: 'bolt' },
    { key: 'water', label: 'Water', icon: 'water_drop' },
    { key: 'gas', label: 'Gas', icon: 'local_fire_department' },
    { key: 'security', label: 'Security', icon: 'security' },
    { key: 'garbage', label: 'Garbage', icon: 'delete' },
];

const PROPERTY_TYPE_OPTIONS: { key: PropertyType | 'all'; label: string }[] = [
    { key: 'all', label: 'All Types' },
    { key: 'single_room', label: 'Single Room' },
    { key: 'shared_room', label: 'Shared Room' },
    { key: 'self_contained_studio', label: 'Studio' },
    { key: 'full_apartment', label: 'Apartment' },
];

type SortKey = 'default' | 'price_asc' | 'price_desc';

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
    const router = useRouter();
    const [listings, setListings] = useState<PublicListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    // filters
    const [search, setSearch] = useState('');
    const [propertyType, setPropertyType] = useState<PropertyType | 'all'>('all');
    const [minRent, setMinRent] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [utilities, setUtilities] = useState<UtilityType[]>([]);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [sortBy, setSortBy] = useState<SortKey>('default');
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const r = localStorage.getItem('userRole');
        if (!token || r !== 'student') {
            router.replace('/login');
            return;
        }
        setRole(r);
    }, [router]);

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

    const toggleUtility = (u: UtilityType) =>
        setUtilities((prev) => prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]);

    const clearFilters = () => {
        setPropertyType('all');
        setMinRent('');
        setMaxRent('');
        setUtilities([]);
        setVerifiedOnly(false);
        setSortBy('default');
        setSearch('');
    };

    const activeFilterCount = [
        propertyType !== 'all',
        !!minRent,
        !!maxRent,
        utilities.length > 0,
        verifiedOnly,
        sortBy !== 'default',
    ].filter(Boolean).length;

    const filtered = listings
        .filter((l) => {
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                l.full_address?.toLowerCase().includes(q) ||
                l.neighborhood_name?.toLowerCase().includes(q);
            const matchesType = propertyType === 'all' || l.property_type === propertyType;
            const min = minRent ? parseInt(minRent, 10) : null;
            const max = maxRent ? parseInt(maxRent, 10) : null;
            const matchesMin = min == null || (l.monthly_rent_rwf != null && l.monthly_rent_rwf >= min);
            const matchesMax = max == null || (l.monthly_rent_rwf != null && l.monthly_rent_rwf <= max);
            const matchesUtils = utilities.length === 0 || utilities.every((u) => l.utilities?.includes(u));
            const matchesVerified = !verifiedOnly || !!l.verified_badge;
            return matchesSearch && matchesType && matchesMin && matchesMax && matchesUtils && matchesVerified;
        })
        .sort((a, b) => {
            if (sortBy === 'price_asc') return (a.monthly_rent_rwf ?? Infinity) - (b.monthly_rent_rwf ?? Infinity);
            if (sortBy === 'price_desc') return (b.monthly_rent_rwf ?? 0) - (a.monthly_rent_rwf ?? 0);
            return 0;
        });

    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Property type */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Property Type</p>
                <div className="space-y-1">
                    {PROPERTY_TYPE_OPTIONS.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setPropertyType(opt.key)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                propertyType === opt.key
                                    ? 'bg-primary text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            {opt.label}
                            {propertyType === opt.key && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price range */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range (RWF/mo)</p>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minRent}
                        onChange={(e) => setMinRent(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <span className="text-slate-300 dark:text-slate-600 shrink-0">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxRent}
                        onChange={(e) => setMaxRent(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>
            </div>

            {/* Utilities */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Utilities Included</p>
                <div className="space-y-1.5">
                    {UTILITY_OPTIONS.map((u) => (
                        <label key={u.key} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={utilities.includes(u.key)}
                                onChange={() => toggleUtility(u.key)}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="material-symbols-outlined text-[18px] text-slate-400">{u.icon}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{u.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Verified only */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Listing Quality</p>
                <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">Verified listings only</span>
                </label>
            </div>

            {/* Clear */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
                    Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-slate-950/50">

            {/* Mobile filter drawer backdrop */}
            {filtersOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)} />
            )}

            {/* Mobile filter drawer */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 lg:hidden ${filtersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <p className="font-bold text-slate-900 dark:text-white">Filters</p>
                    <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5">
                    <FilterPanel />
                </div>
                <div className="p-5 border-t border-slate-200 dark:border-slate-800 shrink-0">
                    <button
                        onClick={() => setFiltersOpen(false)}
                        className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                        Show {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </aside>

            {/* Top bar */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="hidden sm:block">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Browse Listings</h1>
                        <p className="text-sm text-slate-500">Find your perfect student accommodation</p>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-72">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none text-slate-900 dark:text-white"
                                placeholder="Address or neighbourhood…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="hidden sm:block bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                        </select>
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setFiltersOpen(true)}
                            className="lg:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                        <Link href="/add-listing" className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0">
                            <span className="material-symbols-outlined text-lg">add</span>
                            <span className="hidden sm:inline">Add Listing</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Body: sidebar + listings */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 items-start">

                {/* Desktop filter sidebar */}
                <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm sticky top-36">
                    <div className="flex items-center justify-between mb-5">
                        <p className="font-bold text-slate-900 dark:text-white">Filters</p>
                        {activeFilterCount > 0 && (
                            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                        )}
                    </div>
                    <FilterPanel />
                </aside>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Result bar */}
                    <div className="flex items-center justify-between mb-5 gap-3">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {loading ? 'Loading…' : <><span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> listing{filtered.length !== 1 ? 's' : ''} found</>}
                        </p>
                        {/* Sort on mobile */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortKey)}
                            className="sm:hidden bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-white outline-none"
                        >
                            <option value="default">Default</option>
                            <option value="price_asc">Price ↑</option>
                            <option value="price_desc">Price ↓</option>
                        </select>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="hidden sm:flex items-center gap-1 text-xs text-red-500 hover:underline font-medium">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                                Clear filters
                            </button>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6">
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

                    {/* Empty — no listings at all */}
                    {!loading && !error && listings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">apartment</span>
                            <div>
                                <p className="font-bold text-slate-600 dark:text-slate-400 text-lg">No listings yet</p>
                                <p className="text-sm text-slate-400 mt-1">Check back soon — new listings are added regularly.</p>
                            </div>
                        </div>
                    )}

                    {/* Empty — filters produced no matches */}
                    {!loading && !error && listings.length > 0 && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">search_off</span>
                            <div>
                                <p className="font-bold text-slate-600 dark:text-slate-400 text-lg">No matches</p>
                                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters.</p>
                            </div>
                            <button onClick={clearFilters} className="text-sm font-semibold text-primary hover:underline">Clear all filters</button>
                        </div>
                    )}

                    {/* Listings */}
                    {!loading && filtered.length > 0 && (
                        <div className="grid grid-cols-1 gap-5">
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
                                                <img className="w-full h-full object-cover" src={cover} alt={listing.full_address ?? 'Listing'} />
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

                                            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800 my-4">
                                                {listing.utilities && listing.utilities.length > 0
                                                    ? listing.utilities.map((u) => (
                                                        <div key={u} className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm capitalize">
                                                            <span className="material-symbols-outlined text-lg">
                                                                {UTILITY_OPTIONS.find((o) => o.key === u)?.icon ?? 'check_circle'}
                                                            </span>
                                                            {u}
                                                        </div>
                                                    ))
                                                    : <span className="text-sm text-slate-400">No utilities listed</span>
                                                }
                                                {availableFrom && (
                                                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                                                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                                                        From {availableFrom}
                                                    </div>
                                                )}
                                            </div>

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
            </div>
        </div>
    );
}
