'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDraftStep5Action } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { GenderPreference, SmokingPolicy, VisitorPolicy } from '@/lib/types/api.types';

export default function AddListingStep5Page() {
    const router = useRouter();
    const [listingId, setListingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [petsAllowed, setPetsAllowed] = useState<string | null>(null);
    const [smokingPolicy, setSmokingPolicy] = useState<SmokingPolicy | ''>('');
    const [genderPreference, setGenderPreference] = useState<GenderPreference | ''>('no_preference');
    const [visitorPolicy, setVisitorPolicy] = useState<VisitorPolicy | ''>('');
    const [quietStart, setQuietStart] = useState('');
    const [quietEnd, setQuietEnd] = useState('');
    const [additionalRules, setAdditionalRules] = useState('');
    const [virtualTourUrl, setVirtualTourUrl] = useState('');

    useEffect(() => {
        const id = sessionStorage.getItem('currentDraftId');
        if (!id) { router.replace('/landlord/listings/add'); return; }
        setListingId(id);
    }, [router]);

    const handleSubmit = async () => {
        if (!listingId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setIsLoading(true);
        setError(null);

        const result = await updateDraftStep5Action(token, listingId, {
            pets_allowed: petsAllowed,
            smoking_policy: smokingPolicy || null,
            gender_preference: genderPreference || null,
            visitor_policy: visitorPolicy || null,
            quiet_hours_start_utc: quietStart || null,
            quiet_hours_end_utc: quietEnd || null,
            additional_rules: additionalRules || null,
            virtual_tour_url: virtualTourUrl || null,
        });

        setIsLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        router.push('/landlord/listings/add/submit');
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
                                <h1 className="text-slate-900 dark:text-white text-2xl font-bold">House Rules</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step 5 of 5 — All fields are optional</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary text-sm font-bold">95%</p>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Complete</p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: '95%' }} />
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            {['Identity', 'Pricing', 'Photos', 'Calendar', 'Rules'].map((s, i) => (
                                <span key={s} className={i === 4 ? 'text-primary' : ''}>{i + 1}. {s}</span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8">

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Gender Preference */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">group</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Gender Preference</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {([
                                    { value: 'male_only', label: 'Male Only', icon: 'male' },
                                    { value: 'female_only', label: 'Female Only', icon: 'female' },
                                    { value: 'no_preference', label: 'No Preference', icon: 'diversity_3' },
                                ] as { value: GenderPreference; label: string; icon: string }[]).map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            genderPreference === opt.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40'
                                        }`}
                                    >
                                        <input type="radio" className="sr-only" name="gender" value={opt.value}
                                            checked={genderPreference === opt.value}
                                            onChange={() => setGenderPreference(opt.value)} />
                                        <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                                        <span className="text-sm font-semibold">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Pets */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">pets</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Pets</h3>
                            </div>
                            <div className="flex gap-3">
                                {([
                                    { value: 'allowed', label: 'Allowed' },
                                    { value: 'not_allowed', label: 'Not Allowed' },
                                ] as { value: string; label: string }[]).map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${
                                            petsAllowed === opt.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40'
                                        }`}
                                    >
                                        <input type="radio" className="sr-only" name="pets"
                                            checked={petsAllowed === opt.value}
                                            onChange={() => setPetsAllowed(opt.value)} />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Smoking */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">smoking_rooms</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Smoking Policy</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {([
                                    { value: 'allowed', label: 'Allowed' },
                                    { value: 'outside_only', label: 'Outside Only' },
                                    { value: 'no_smoking', label: 'No Smoking' },
                                ] as { value: SmokingPolicy; label: string }[]).map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${
                                            smokingPolicy === opt.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40'
                                        }`}
                                    >
                                        <input type="radio" className="sr-only" name="smoking"
                                            checked={smokingPolicy === opt.value}
                                            onChange={() => setSmokingPolicy(opt.value)} />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Visitors */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">group_add</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Visitor Policy</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {([
                                    { value: 'visitors_allowed', label: 'Allowed' },
                                    { value: 'no_overnight_visitors', label: 'No Overnight' },
                                    { value: 'no_visitors', label: 'Not Allowed' },
                                ] as { value: VisitorPolicy; label: string }[]).map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 cursor-pointer font-semibold text-sm transition-all ${
                                            visitorPolicy === opt.value
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40'
                                        }`}
                                    >
                                        <input type="radio" className="sr-only" name="visitors"
                                            checked={visitorPolicy === opt.value}
                                            onChange={() => setVisitorPolicy(opt.value)} />
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Quiet Hours */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">bedtime</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Quiet Hours (UTC)</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Start</label>
                                    <input type="time" value={quietStart} onChange={(e) => setQuietStart(e.target.value)}
                                        className="h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">End</label>
                                    <input type="time" value={quietEnd} onChange={(e) => setQuietEnd(e.target.value)}
                                        className="h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* Virtual Tour */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">3d_rotation</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Virtual Tour URL</h3>
                            </div>
                            <input type="url" value={virtualTourUrl} onChange={(e) => setVirtualTourUrl(e.target.value)}
                                placeholder="https://my.matterport.com/show/?m=..."
                                className="w-full h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm outline-none" />
                        </section>

                        {/* Additional Rules */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">notes</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">Additional Rules</h3>
                            </div>
                            <textarea
                                value={additionalRules}
                                onChange={(e) => setAdditionalRules(e.target.value)}
                                rows={4}
                                placeholder="Any other rules or important information for tenants..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-y outline-none"
                            />
                        </section>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => router.push('/landlord/listings/add/step-4')}
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
                                <>Review &amp; Submit <span className="material-symbols-outlined">check_circle</span></>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
