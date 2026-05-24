'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDraftAction, submitDraftAction } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { ListingDraftResponse } from '@/lib/types/api.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_BASE = process.env.NEXT_PUBLIC_NEST_API_BASE_URL ?? '';

function fmt(v: string | null | undefined) { return v || '—'; }
function fmtRwf(v: number | null | undefined) { return v ? `RWF ${v.toLocaleString()}` : '—'; }
function mediaUrl(url: string) { return url.startsWith('http') ? url : `${API_BASE}${url}`; }

export default function SubmitListingPage() {
    const router = useRouter();
    const [listingId, setListingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<ListingDraftResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = sessionStorage.getItem('currentDraftId');
        if (!id) { router.replace('/add-listing'); return; }
        setListingId(id);

        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        getDraftAction(token, id).then((r) => {
            setLoading(false);
            if (r.data) setDraft(r.data);
            else if (r.error) {
                if (handleAuthError(r.error, router)) return;
                setError(r.error.message ?? 'Failed to load draft');
            }
        });
    }, [router]);

    const handleSubmit = async () => {
        if (!listingId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setIsSubmitting(true);
        setError(null);
        const result = await submitDraftAction(token, listingId);
        setIsSubmitting(false);

        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        sessionStorage.removeItem('currentDraftId');
        const role = localStorage.getItem('userRole');
        router.push(role === 'student' ? '/student-portal/listings?submitted=1' : '/landlord/listings?submitted=1');
    };

    const progress = draft?.progress;
    const allStepsComplete = progress && progress.step_1_completed && progress.step_2_completed && progress.step_3_completed && progress.step_4_completed && progress.step_5_completed;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-slate-950/50">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-slate-950/50">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-16 z-40">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">home_work</span>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold">StudentNest</h2>
                </div>
                <button
                    onClick={() => router.push('/add-listing/step-5')}
                    className="flex items-center gap-1.5 px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back
                </button>
            </header>

            <main className="flex flex-1 justify-center py-8 px-4 md:px-0">
                <div className="flex flex-col w-full max-w-[720px] gap-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">fact_check</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review &amp; Submit</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Check everything looks right before submitting for review.</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Steps checklist */}
                    {progress && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Completion Checklist</h3>
                            <div className="space-y-2">
                                {([
                                    ['step_1_completed', 'Property Identity'],
                                    ['step_2_completed', 'Pricing & Utilities'],
                                    ['step_3_completed', 'Photos'],
                                    ['step_4_completed', 'Availability Calendar'],
                                    ['step_5_completed', 'House Rules'],
                                ] as [keyof typeof progress, string][]).map(([key, label]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <span className={`material-symbols-outlined text-lg ${progress[key] ? 'text-emerald-500' : 'text-red-400'}`}>
                                            {progress[key] ? 'check_circle' : 'cancel'}
                                        </span>
                                        <span className={`text-sm font-medium ${progress[key] ? 'text-slate-700 dark:text-slate-300' : 'text-red-500 dark:text-red-400'}`}>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    {draft && (
                        <>
                            {/* Identity */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                        Property Identity
                                    </h3>
                                    <button onClick={() => router.push('/add-listing')} className="text-primary text-xs font-semibold hover:underline">Edit</button>
                                </div>
                                <div className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                    <div><p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-0.5">Address</p><p className="text-slate-900 dark:text-white font-medium">{fmt(draft.full_address)}</p></div>
                                    <div><p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-0.5">Type</p><p className="text-slate-900 dark:text-white font-medium capitalize">{fmt(draft.property_type?.replace('_', ' '))}</p></div>
                                    <div><p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-0.5">Floor</p><p className="text-slate-900 dark:text-white font-medium capitalize">{fmt(draft.floor_level?.replace('_', ' '))}</p></div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">payments</span>
                                        Pricing
                                    </h3>
                                    <button onClick={() => router.push('/add-listing/step-2')} className="text-primary text-xs font-semibold hover:underline">Edit</button>
                                </div>
                                <div className="px-5 py-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                    <div><p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-0.5">Monthly Rent</p><p className="text-slate-900 dark:text-white font-bold text-base">{fmtRwf(draft.monthly_rent_rwf)}</p></div>
                                    <div><p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-0.5">Security Deposit</p><p className="text-slate-900 dark:text-white font-medium">{fmtRwf(draft.security_deposit_rwf)}</p></div>
                                    {draft.utilities && draft.utilities.length > 0 && (
                                        <div className="col-span-2">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1.5">Utilities Included</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {draft.utilities.map((u) => (
                                                    <span key={u} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold capitalize">{u}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Photos */}
                            {draft.media.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-xl">photo_library</span>
                                            Photos ({draft.media.length})
                                        </h3>
                                        <button onClick={() => router.push('/add-listing/step-3')} className="text-primary text-xs font-semibold hover:underline">Edit</button>
                                    </div>
                                    <div className="px-5 py-4 grid grid-cols-4 gap-2">
                                        {draft.media.slice(0, 8).map((m) => (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img key={m.id} src={mediaUrl(m.url)} alt="" className="aspect-square rounded-lg object-cover w-full" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Calendar snippet */}
                            {draft.calendar && draft.calendar.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                                            Availability
                                        </h3>
                                        <button onClick={() => router.push('/add-listing/step-4')} className="text-primary text-xs font-semibold hover:underline">Edit</button>
                                    </div>
                                    <div className="px-5 py-4 flex flex-wrap gap-2">
                                        {draft.calendar.map((e) => (
                                            <span key={`${e.year}-${e.month}`} className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                e.status === 'available' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                                e.status === 'occupied' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                            }`}>
                                                {MONTHS[e.month - 1]} {e.year}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Notice */}
                    <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                        <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Your listing will be reviewed by the StudentNest team before going live. This usually takes 24–48 hours.
                        </p>
                    </div>

                    {/* Submit button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !allStepsComplete}
                        className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <><span className="material-symbols-outlined animate-spin">progress_activity</span> Submitting…</>
                        ) : (
                            <><span className="material-symbols-outlined">send</span> Submit for Review</>
                        )}
                    </button>
                    {!allStepsComplete && (
                        <p className="text-center text-xs text-red-500 -mt-2">Complete all steps before submitting.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
