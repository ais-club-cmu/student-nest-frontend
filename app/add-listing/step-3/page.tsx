'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDraftAction, deleteDraftMediaAction, completeDraftStep3Action } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { ListingMedia } from '@/lib/types/api.types';

const API_BASE = process.env.NEXT_PUBLIC_NEST_API_BASE_URL ?? '';
function mediaUrl(url: string) { return url.startsWith('http') ? url : `${API_BASE}${url}`; }

function checkImageDimensions(file: File): Promise<string | null> {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            if (img.width < 800 || img.height < 600) {
                resolve(`"${file.name}" is too small (${img.width}×${img.height}px). Minimum size is 800×600px.`);
            } else {
                resolve(null);
            }
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
    });
}

function parseBackendError(payload: unknown): string {
    if (!payload || typeof payload !== 'object') return 'Upload failed';
    const p = payload as Record<string, unknown>;
    if (typeof p.detail === 'string') return p.detail;
    if (Array.isArray(p.detail)) return p.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join('; ') || 'Upload failed';
    if (typeof p.message === 'string') return p.message;
    return 'Upload failed';
}

export default function AddListingStep3Page() {
    const router = useRouter();
    const [listingId, setListingId] = useState<string | null>(null);
    const [media, setMedia] = useState<ListingMedia[]>([]);
    const [canProceed, setCanProceed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const id = sessionStorage.getItem('currentDraftId');
        if (!id) { router.replace('/add-listing'); return; }
        setListingId(id);

        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        getDraftAction(token, id).then((result) => {
            if (result.data) {
                const m = result.data.media ?? [];
                setMedia(m);
                setCanProceed(result.data.progress.step_3_completed || m.length >= 5);
            }
        });
    }, [router]);

    const handleUpload = async (files: FileList | null) => {
        if (!files || !listingId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setUploading(true);
        setError(null);

        for (const file of Array.from(files)) {
            const dimError = await checkImageDimensions(file);
            if (dimError) { setError(dimError); break; }

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`/api/listing-media?listing_id=${encodeURIComponent(listingId)}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const payload = await res.json().catch(() => null);
            if (!res.ok) {
                setError(parseBackendError(payload));
                break;
            }

            // Re-fetch draft to get updated media list and derive canProceed
            const draftResult = await getDraftAction(token, listingId);
            if (draftResult.data) {
                const updatedMedia = draftResult.data.media ?? [];
                setMedia(updatedMedia);
                setCanProceed(updatedMedia.length >= 5);
            }
        }

        // Reset file input so the same files can be re-selected if needed
        if (fileInputRef.current) fileInputRef.current.value = '';

        setUploading(false);
    };

    const handleDelete = async (mediaId: string) => {
        if (!listingId) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        const result = await deleteDraftMediaAction(token, listingId, mediaId);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }

        setMedia((prev) => {
            const updated = prev.filter((m) => m.id !== mediaId);
            setCanProceed(updated.length >= 5);
            return updated;
        });
    };

    const handleComplete = async () => {
        if (!listingId || !canProceed) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return; }

        setIsLoading(true);
        setError(null);
        const result = await completeDraftStep3Action(token, listingId);
        setIsLoading(false);

        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setError(result.error.message);
            return;
        }
        router.push('/add-listing/step-4');
    };

    const sorted = [...media].sort((a, b) => a.display_order - b.display_order);

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
                                <h1 className="text-slate-900 dark:text-white text-2xl font-bold">Property Photos</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step 3 of 5 — Upload at least 5 photos</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary text-sm font-bold">60%</p>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Complete</p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: '60%' }} />
                        </div>
                        <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            {['Identity', 'Pricing', 'Photos', 'Calendar', 'Rules'].map((s, i) => (
                                <span key={s} className={i === 2 ? 'text-primary' : ''}>{i + 1}. {s}</span>
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

                        {/* Upload zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
                        >
                            <span className="material-symbols-outlined text-primary text-4xl">add_photo_alternate</span>
                            <div className="text-center">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Click to upload photos</p>
                                <p className="text-xs text-slate-400 mt-1">JPG, PNG — max 5 MB each · min 800×600px · at least 5 photos required</p>
                            </div>
                            {uploading && (
                                <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            className="sr-only"
                            onChange={(e) => handleUpload(e.target.files)}
                        />

                        {/* Photo grid */}
                        {sorted.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {sorted.map((m) => (
                                    <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={mediaUrl(m.url)}
                                            alt="Listing photo"
                                            className="w-full h-full object-cover"
                                        />
                                        {m.is_cover && (
                                            <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(m.id)}
                                            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full text-red-500 opacity-100 transition-opacity hover:bg-white shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-sm block">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {sorted.length === 0 && (
                            <div className="flex flex-col items-center gap-2 py-6 text-slate-400">
                                <span className="material-symbols-outlined text-4xl">photo_library</span>
                                <p className="text-sm font-medium">No photos uploaded yet</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className={`text-sm font-semibold flex items-center gap-1.5 ${canProceed ? 'text-emerald-600' : 'text-slate-400'}`}>
                                <span className="material-symbols-outlined text-lg">{canProceed ? 'check_circle' : 'radio_button_unchecked'}</span>
                                {media.length} photo{media.length !== 1 ? 's' : ''} uploaded
                                {!canProceed && ' (need at least 5)'}
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => router.push('/add-listing/step-2')}
                            className="flex items-center gap-2 px-6 h-12 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleComplete}
                            disabled={isLoading || !canProceed || uploading}
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
