'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDraftAction, updateDraftStep1Action, getNeighborhoodsAction } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { NeighborhoodResponse, PropertyType, FloorLevel } from '@/lib/types/api.types';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
    { value: 'single_room', label: 'Single Room' },
    { value: 'shared_room', label: 'Shared Room' },
    { value: 'self_contained_studio', label: 'Self-Contained Studio' },
    { value: 'full_apartment', label: 'Full Apartment' },
];

const FLOOR_LEVELS: { value: FloorLevel; label: string }[] = [
    { value: 'ground', label: 'Ground Floor' },
    { value: 'first', label: '1st Floor' },
    { value: 'second', label: '2nd Floor' },
    { value: 'third', label: '3rd Floor' },
    { value: 'fourth_plus', label: '4th Floor or Higher' },
];

export default function AddListingStep1Page() {
    const router = useRouter();
    const [listingId, setListingId] = useState<string | null>(null);
    const [neighborhoods, setNeighborhoods] = useState<NeighborhoodResponse[]>([]);
    const [initializing, setInitializing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const [fullAddress, setFullAddress] = useState('');
    const [neighborhoodId, setNeighborhoodId] = useState('');
    const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
    const [floorLevel, setFloorLevel] = useState<FloorLevel | ''>('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token || (role !== 'landlord' && role !== 'student')) {
            router.push('/login');
            return;
        }

        async function init() {
            const existing = sessionStorage.getItem('currentDraftId');

            const [neighborhoodsResult] = await Promise.all([
                getNeighborhoodsAction(),
            ]);
            if (neighborhoodsResult.data) setNeighborhoods(neighborhoodsResult.data);

            if (existing) {
                setListingId(existing);
            } else {
                const draftResult = await createDraftAction(token!);
                if (draftResult.error) {
                    if (handleAuthError(draftResult.error, router)) return;
                    setError(draftResult.error.message);
                    setInitializing(false);
                    return;
                }
                const newId = draftResult.data!.id;
                sessionStorage.setItem('currentDraftId', newId);
                setListingId(newId);
            }
            setInitializing(false);
        }

        init();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!listingId || !fullAddress || !neighborhoodId || !propertyType || !floorLevel) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setIsLoading(true);
        setError(null);
        setWarning(null);

        const result = await updateDraftStep1Action(token, listingId, {
            full_address: fullAddress,
            neighborhood_id: neighborhoodId,
            property_type: propertyType as PropertyType,
            floor_level: floorLevel as FloorLevel,
        });

        setIsLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        if (result.data?.warning) setWarning(result.data.warning);
        router.push('/add-listing/step-2');
    };

    const handleCancel = () => {
        sessionStorage.removeItem('currentDraftId');
        const role = localStorage.getItem('userRole');
        router.push(role === 'student' ? '/student-portal/listings' : '/landlord/listings');
    };

    if (initializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-slate-950/50">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-slate-950/50">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-16 z-40">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">home_work</span>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold">StudentNest</h2>
                </div>
                <button
                    onClick={handleCancel}
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
                                <h1 className="text-slate-900 dark:text-white text-2xl font-bold">Add New Listing</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step 1 of 5 — Property Identity</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary text-sm font-bold">20%</p>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Complete</p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: '20%' }} />
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            {['Identity', 'Pricing', 'Photos', 'Calendar', 'Rules'].map((s, i) => (
                                <span key={s} className={i === 0 ? 'text-primary' : ''}>{i + 1}. {s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Form card */}
                    <form id="step1-form" onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}
                        {warning && (
                            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <span className="material-symbols-outlined text-amber-500">warning</span>
                                <p className="text-sm text-amber-700 dark:text-amber-400">{warning}</p>
                            </div>
                        )}

                        {/* Full Address */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                                Full Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">location_on</span>
                                <input
                                    required
                                    type="text"
                                    value={fullAddress}
                                    onChange={(e) => setFullAddress(e.target.value)}
                                    placeholder="e.g. KG 15 Ave, Kacyiru, Kigali"
                                    className="w-full pl-10 pr-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all outline-none"
                                />
                            </div>
                            <p className="text-slate-400 text-xs">Include street, district, and city.</p>
                        </div>

                        {/* Neighborhood */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                                Neighbourhood <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">map</span>
                                <select
                                    required
                                    value={neighborhoodId}
                                    onChange={(e) => setNeighborhoodId(e.target.value)}
                                    className="w-full pl-10 pr-4 h-12 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all outline-none"
                                >
                                    <option value="">Select neighbourhood</option>
                                    {neighborhoods.map((n) => (
                                        <option key={n.id} value={n.id}>{n.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Property Type + Floor Level */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                                    Property Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">apartment</span>
                                    <select
                                        required
                                        value={propertyType}
                                        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                                        className="w-full pl-10 pr-4 h-12 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all outline-none"
                                    >
                                        <option value="">Select type</option>
                                        {PROPERTY_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                                    Floor Level <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">stairs</span>
                                    <select
                                        required
                                        value={floorLevel}
                                        onChange={(e) => setFloorLevel(e.target.value as FloorLevel)}
                                        className="w-full pl-10 pr-4 h-12 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all outline-none"
                                    >
                                        <option value="">Select floor</option>
                                        {FLOOR_LEVELS.map((f) => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-6 h-12 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </button>
                        <button
                            form="step1-form"
                            type="submit"
                            disabled={isLoading || !fullAddress || !neighborhoodId || !propertyType || !floorLevel}
                            className="flex items-center gap-2 px-8 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                            ) : (
                                <>Next Step <span className="material-symbols-outlined">arrow_forward</span></>
                            )}
                        </button>
                    </div>
                </div>
            </main>

            <footer className="py-6 text-center">
                <p className="text-slate-400 text-xs">© 2025 StudentNest Housing Solutions. Secure &amp; Verified Listings.</p>
            </footer>
        </div>
    );
}
