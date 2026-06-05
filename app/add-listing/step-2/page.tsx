'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDraftStep2Action } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { UtilityType, LeaseDuration } from '@/lib/types/api.types';

const UTILITIES: { value: UtilityType; label: string; icon: string }[] = [
    { value: 'electricity', label: 'Electricity', icon: 'bolt' },
    { value: 'water', label: 'Water', icon: 'water_drop' },
];

const LEASE_DURATIONS: { value: LeaseDuration; label: string }[] = [
    { value: '1_month', label: '1 Month' },
    { value: '3_months', label: '3 Months' },
    { value: '6_months', label: '6 Months' },
    { value: '12_months', label: '12 Months' },
    { value: 'flexible', label: 'Flexible' },
];

export default function AddListingStep2Page() {
    const router = useRouter();
    const [listingId, setListingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [usdHint, setUsdHint] = useState<number | null>(null);
    const [avgHint, setAvgHint] = useState<number | null>(null);
    const [confirmAboveAvg, setConfirmAboveAvg] = useState(false);

    const [monthlyRent, setMonthlyRent] = useState('');
    const [securityDeposit, setSecurityDeposit] = useState('');
    const [utilities, setUtilities] = useState<UtilityType[]>([]);
    const [leaseDurations, setLeaseDurations] = useState<LeaseDuration[]>([]);

    useEffect(() => {
        const id = sessionStorage.getItem('currentDraftId');
        if (!id) { router.replace('/add-listing'); return; }
        setListingId(id);
    }, [router]);

    const toggleUtility = (v: UtilityType) =>
        setUtilities((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

    const toggleLease = (v: LeaseDuration) =>
        setLeaseDurations((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!listingId || !monthlyRent) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setIsLoading(true);
        setError(null);

        const result = await updateDraftStep2Action(token, listingId, {
            monthly_rent_rwf: Number(monthlyRent),
            security_deposit_rwf: securityDeposit ? Number(securityDeposit) : null,
            utilities: utilities.length > 0 ? utilities : null,
            lease_durations: leaseDurations.length > 0 ? leaseDurations : null,
            confirm_above_average: confirmAboveAvg,
        });

        setIsLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }

        const d = result.data!;
        if (d.usd_equivalent) setUsdHint(d.usd_equivalent);
        if (d.neighborhood_average_rwf) setAvgHint(d.neighborhood_average_rwf);
        if (d.warning) {
            setWarning(d.warning);
            return;
        }
        router.push('/add-listing/step-3');
    };

    const handleContinueWithWarning = async () => {
        setConfirmAboveAvg(true);
        setWarning(null);
        await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-slate-950/50">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-16 z-40">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">home_work</span>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold">StudentNest</h2>
                </div>
                <button
                    onClick={() => { sessionStorage.removeItem('currentDraftId'); router.push(localStorage.getItem('userRole') === 'student' ? '/student-portal/listings' : '/landlord/listings'); }}
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
                                <h1 className="text-slate-900 dark:text-white text-2xl font-bold">Pricing &amp; Utilities</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step 2 of 5 — Set your rent and what&apos;s included</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary text-sm font-bold">40%</p>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Complete</p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: '40%' }} />
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            {['Identity', 'Pricing', 'Photos', 'Calendar', 'Rules'].map((s, i) => (
                                <span key={s} className={i === 1 ? 'text-primary' : ''}>{i + 1}. {s}</span>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8">

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {warning && (
                            <div className="flex flex-col gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
                                    <p className="text-sm text-amber-700 dark:text-amber-400">{warning}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleContinueWithWarning}
                                    disabled={isLoading}
                                    className="self-end px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
                                >
                                    Continue Anyway
                                </button>
                            </div>
                        )}

                        {/* Rent */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Monthly Rent</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Rent (RWF) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">RWF</span>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            value={monthlyRent}
                                            onChange={(e) => setMonthlyRent(e.target.value)}
                                            placeholder="e.g. 350000"
                                            className="w-full pl-12 pr-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all outline-none"
                                        />
                                    </div>
                                    {usdHint && (
                                        <p className="text-xs text-slate-500">≈ ${usdHint.toFixed(2)} USD at current rate</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Security Deposit (RWF)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold pointer-events-none">RWF</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={securityDeposit}
                                            onChange={(e) => setSecurityDeposit(e.target.value)}
                                            placeholder="Optional"
                                            className="w-full pl-12 pr-4 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            {avgHint && (
                                <p className="mt-2 text-xs text-slate-500">
                                    Neighbourhood average: <span className="font-semibold">RWF {avgHint.toLocaleString()}</span>
                                </p>
                            )}
                        </section>

                        {/* Utilities */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Utilities Included</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {UTILITIES.map((u) => {
                                    const checked = utilities.includes(u.value);
                                    return (
                                        <label
                                            key={u.value}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                checked
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={checked}
                                                onChange={() => toggleUtility(u.value)}
                                            />
                                            <span className="material-symbols-outlined text-[18px]">{u.icon}</span>
                                            <span className="text-sm font-medium">{u.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Lease Durations */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">event_note</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Lease Durations Offered</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {LEASE_DURATIONS.map((l) => {
                                    const checked = leaseDurations.includes(l.value);
                                    return (
                                        <label
                                            key={l.value}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-semibold text-sm transition-all ${
                                                checked
                                                    ? 'border-primary bg-primary text-white shadow-sm'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={checked}
                                                onChange={() => toggleLease(l.value)}
                                            />
                                            {l.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    </form>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => router.push('/add-listing')}
                            className="flex items-center gap-2 px-6 h-12 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                            disabled={isLoading || !monthlyRent}
                            className="flex items-center gap-2 px-8 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
