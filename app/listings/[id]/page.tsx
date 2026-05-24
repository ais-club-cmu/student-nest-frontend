'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getPublicListingDetailAction, applyToListingAction } from '@/app/actions/listingsActions';
import { getConversationsAction } from '@/app/actions/conversationsActions';
import type { CalendarStatus, PropertyType, PublicListing } from '@/lib/types/api.types';

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

const FLOOR_LABELS: Record<string, string> = {
    ground: 'Ground Floor',
    first: '1st Floor',
    second: '2nd Floor',
    third: '3rd Floor',
    fourth_plus: '4th Floor+',
};

const LEASE_LABELS: Record<string, string> = {
    '1_month': '1 Month',
    '3_months': '3 Months',
    '6_months': '6 Months',
    '12_months': '12 Months',
    flexible: 'Flexible',
};

const UTILITY_ICONS: Record<string, string> = {
    electricity: 'bolt',
    water: 'water_drop',
    gas: 'local_fire_department',
    security: 'security',
    garbage: 'delete',
};

const CALENDAR_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CALENDAR_COLORS: Record<CalendarStatus, string> = {
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    occupied: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    unavailable: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
};

export default function ListingDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [listing, setListing] = useState<PublicListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // gallery
    const [activeImg, setActiveImg] = useState(0);

    const [role, setRole] = useState<string | null>(null);
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState<string | null>(null);
    const [applySuccess, setApplySuccess] = useState(false);

    useEffect(() => {
        const r = localStorage.getItem('userRole');
        setRole(r);
        if (r !== 'student') return;
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        getConversationsAction(token).then((result) => {
            if (result.data?.some((c) => c.listing_id === id)) setApplySuccess(true);
        });
    }, [id]);

    const load = useCallback(async () => {
        setLoading(true);
        const result = await getPublicListingDetailAction(id);
        setLoading(false);
        if (result.error) { setError(result.error.message); return; }
        setListing(result.data);
    }, [id]);

    useEffect(() => { load(); }, [load]);

    const handleApply = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }
        setApplying(true);
        setApplyError(null);
        const result = await applyToListingAction(token, id);
        if (result.error) { setApplying(false); setApplyError(result.error.message); return; }
        setApplying(false);
        setApplySuccess(true);
        router.push('/student-portal/conversations');
    };

    const allMedia = listing?.media?.length
        ? [...listing.media].sort((a, b) => a.display_order - b.display_order)
        : [];
    const coverSrc = allMedia[activeImg]
        ? mediaUrl(allMedia[activeImg].url)
        : listing?.cover_url ? mediaUrl(listing.cover_url) : null;

    // Calendar — current + next 11 months
    const now = new Date();
    const calendarGrid = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const entry = listing?.calendar?.find((e) => e.year === y && e.month === m);
        return { year: y, month: m, label: `${CALENDAR_MONTHS[m - 1]} ${y}`, status: entry?.status ?? 'unavailable' };
    });

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4 text-center px-4">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">error</span>
                <p className="font-bold text-slate-700 dark:text-slate-300">{error ?? 'Listing not found'}</p>
                <Link href="/listings" className="text-sm text-primary hover:underline">← Back to listings</Link>
            </div>
        );
    }

    const typeLabel = listing.property_type ? PROPERTY_TYPE_LABELS[listing.property_type] : null;
    const canApply = role === 'student';

    return (
        <>
            <div className="min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-950/50">

                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-2 text-sm">
                        <Link href="/listings" className="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            Browse Listings
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs">{listing.full_address ?? 'Listing Detail'}</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* ── Left column ── */}
                        <div className="flex-1 min-w-0 flex flex-col gap-6">

                            {/* Hero image */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="relative w-full h-[50vh] bg-slate-100 dark:bg-slate-800">
                                    {coverSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={coverSrc} alt={listing.full_address ?? 'Listing'} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-7xl">apartment</span>
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <span className="size-1.5 bg-emerald-500 rounded-full" />
                                            Available
                                        </span>
                                        {listing.verified_badge && (
                                            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">verified</span>
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    {typeLabel && (
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-bold">
                                                {typeLabel}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail strip */}
                                {allMedia.length > 1 && (
                                    <div className="flex gap-2 p-4 overflow-x-auto">
                                        {allMedia.map((m, i) => (
                                            <button
                                                key={m.id}
                                                onClick={() => setActiveImg(i)}
                                                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                                    activeImg === i ? 'border-primary' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={mediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Address & meta */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                                    {listing.full_address ?? 'Address not provided'}
                                </h1>
                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1 mb-5">
                                    <span className="material-symbols-outlined text-lg">location_on</span>
                                    {listing.neighborhood_name ?? 'Kigali'}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { icon: 'apartment', label: 'Type', value: typeLabel ?? '—' },
                                        { icon: 'stairs', label: 'Floor', value: listing.floor_level ? FLOOR_LABELS[listing.floor_level] ?? listing.floor_level : '—' },
                                        { icon: 'payments', label: 'Rent', value: fmtRwf(listing.monthly_rent_rwf) },
                                        { icon: 'lock', label: 'Deposit', value: fmtRwf(listing.security_deposit_rwf) },
                                    ].map(({ icon, label, value }) => (
                                        <div key={label} className="flex flex-col gap-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Utilities */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Included Utilities</h2>
                                {listing.utilities && listing.utilities.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {listing.utilities.map((u) => (
                                            <div key={u} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm capitalize">
                                                <span className="material-symbols-outlined text-primary text-lg">{UTILITY_ICONS[u] ?? 'check_circle'}</span>
                                                {u}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">No utilities listed</p>
                                )}
                            </div>

                            {/* Lease durations */}
                            {listing.lease_durations && listing.lease_durations.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Lease Options</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.lease_durations.map((l) => (
                                            <span key={l} className="px-3 py-1.5 rounded-lg border border-primary/30 text-primary text-sm font-medium bg-primary/5">
                                                {LEASE_LABELS[l] ?? l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Availability calendar */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Availability</h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                                    {calendarGrid.map(({ label, status }) => (
                                        <div
                                            key={label}
                                            className={`rounded-lg px-2 py-2 text-center text-xs font-medium ${CALENDAR_COLORS[status]}`}
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-800" />Available</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-200 dark:bg-red-800" />Occupied</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700" />Unavailable</span>
                                </div>
                            </div>

                            {/* House rules */}
                            {listing.house_rules && (
                                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">House Rules</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { icon: 'pets', label: 'Pets', value: listing.house_rules.pets_allowed ?? null },
                                            { icon: 'smoking_rooms', label: 'Smoking', value: listing.house_rules.smoking_policy?.replace(/_/g, ' ') ?? null },
                                            { icon: 'wc', label: 'Gender preference', value: listing.house_rules.gender_preference?.replace(/_/g, ' ') ?? null },
                                            { icon: 'door_front', label: 'Visitors', value: listing.house_rules.visitor_policy?.replace(/_/g, ' ') ?? null },
                                        ].map(({ icon, label, value }) => value && (
                                            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                                <span className="material-symbols-outlined text-slate-400 text-xl">{icon}</span>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {listing.house_rules.quiet_hours_start_utc && listing.house_rules.quiet_hours_end_utc && (
                                        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <span className="material-symbols-outlined text-slate-400 text-xl">nights_stay</span>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Quiet hours</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {listing.house_rules.quiet_hours_start_utc} – {listing.house_rules.quiet_hours_end_utc} UTC
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {listing.house_rules.additional_rules && (
                                        <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Additional Rules</p>
                                            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{listing.house_rules.additional_rules}</p>
                                        </div>
                                    )}
                                    {listing.house_rules.virtual_tour_url && (
                                        <a
                                            href={listing.house_rules.virtual_tour_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                                        >
                                            <span className="material-symbols-outlined text-lg">360</span>
                                            Virtual Tour
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Right column (sticky sidebar) ── */}
                        <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-32 flex flex-col gap-4">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                                <p className="text-3xl font-black text-primary">{fmtRwf(listing.monthly_rent_rwf)}</p>
                                <p className="text-sm text-slate-500 mb-1">per month</p>
                                {listing.security_deposit_rwf != null && (
                                    <p className="text-xs text-slate-400 mb-5">+ {fmtRwf(listing.security_deposit_rwf)} security deposit</p>
                                )}

                                {canApply ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={handleApply}
                                            disabled={applying || applySuccess}
                                            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                                                applySuccess
                                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 disabled:opacity-60'
                                            }`}
                                        >
                                            {applying ? (
                                                <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Sending…</>
                                            ) : applySuccess ? (
                                                <><span className="material-symbols-outlined text-lg">check_circle</span>Already Applied</>
                                            ) : (
                                                <><span className="material-symbols-outlined text-lg">favorite</span>I&apos;m Interested</>
                                            )}
                                        </button>
                                        {applyError && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">error</span>
                                                {applyError}
                                            </p>
                                        )}
                                    </div>
                                ) : role === null ? (
                                    <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined text-lg">login</span>
                                        Log in to Apply
                                    </Link>
                                ) : (
                                    <div className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 px-6 py-3 rounded-xl font-semibold text-sm cursor-not-allowed">
                                        Applications open to students
                                    </div>
                                )}

                                <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400 dark:text-slate-500">
                                    {listing.verified_badge && (
                                        <span className="flex items-center gap-1 text-primary font-medium">
                                            <span className="material-symbols-outlined text-sm">verified</span>
                                            KYC-verified landlord
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">shield</span>
                                        Safe & verified listing
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}
