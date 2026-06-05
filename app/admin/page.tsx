'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    getPendingKycAction,
    getLandlordKycAction,
    approveLandlordKycAction,
    rejectLandlordKycAction,
    getUserProfileAction,
} from '@/app/actions/nestActions';
import {
    getListingReviewQueueAction,
    approveListingAction,
    rejectListingAction,
    getAdminListingDetailAction,
    getPublicListingsAction,
} from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { AdminListingDetail, LandlordKycDetail, PendingKycUser, ListingModerationQueueItem, PublicListing, UserProfileResponse } from '@/lib/types/api.types';

const SUPABASE_STORAGE_BASE =
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://rsroaeikcfuadqapeqqz.supabase.co') + '/storage/v1';

function toAbsoluteUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `${SUPABASE_STORAGE_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

const API_BASE = process.env.NEXT_PUBLIC_NEST_API_BASE_URL ?? '';
function mediaUrl(url: string) { return url.startsWith('http') ? url : `${API_BASE}${url}`; }

/** Maps the API's doc_signed_urls shape into a stable list for the UI */
function docsFromDetail(detail: LandlordKycDetail) {
    return Object.entries(detail.doc_signed_urls).map(([docType, signedPath]) => ({
        id: docType,
        doc_type: docType,
        file_url: toAbsoluteUrl(signedPath),
        uploaded_at: detail.submitted_at,
    }));
}

type Tab = 'overview' | 'landlord-approvals' | 'listing-reviews';

// ── Review modal (fetches docs, approve / reject) ─────────────────────────────
function ReviewModal({
    user,
    onClose,
    onApprove,
    onReject,
    busy,
}: {
    user: PendingKycUser;
    onClose: () => void;
    onApprove: () => void;
    onReject: (reason: string) => void;
    busy: boolean;
}) {
    type Doc = { id: string; doc_type: string; file_url: string; uploaded_at: string };
    const [docs, setDocs] = useState<Doc[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);
    const [docsError, setDocsError] = useState<string | null>(null);
    const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
    const [rejectMode, setRejectMode] = useState(false);
    const [reason, setReason] = useState('');

    const modalRouter = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { modalRouter.push('/login'); return; }
        getLandlordKycAction(token, user.user_id).then((result) => {
            setDocsLoading(false);
            if (result.error) {
                if (handleAuthError(result.error, modalRouter)) return;
                setDocsError(result.error.message);
                return;
            }
            const d = result.data ? docsFromDetail(result.data) : [];
            setDocs(d);
            if (d.length > 0) setActiveDoc(d[0]);
        });
    }, [user.user_id, modalRouter]);

    const initials = user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const submitted = new Date(user.submitted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const isImage = (url: string) => /\.(jpe?g|png|webp)(\?|$)/i.test(url);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

                {/* Modal header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email} · Submitted {submitted}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase">Pending</span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-2">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {docsLoading && (
                        <div className="flex items-center justify-center py-20">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        </div>
                    )}
                    {docsError && (
                        <div className="m-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400">{docsError}</p>
                        </div>
                    )}
                    {!docsLoading && !docsError && docs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
                            <span className="material-symbols-outlined text-4xl">folder_off</span>
                            <p className="text-sm font-medium">No documents uploaded yet.</p>
                        </div>
                    )}
                    {!docsLoading && docs.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-0 h-full">
                            {/* Doc list sidebar */}
                            <div className="md:w-48 shrink-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
                                {docs.map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setActiveDoc(doc)}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-xs font-semibold whitespace-nowrap md:whitespace-normal transition-colors ${
                                            activeDoc?.id === doc.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {isImage(doc.file_url) ? 'image' : 'picture_as_pdf'}
                                        </span>
                                        {doc.doc_type.replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>

                            {/* Doc preview */}
                            {activeDoc && (
                                <div className="flex-1 flex flex-col p-5 gap-4 min-h-[320px]">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                            {activeDoc.doc_type.replace(/_/g, ' ')}
                                        </p>
                                        <a
                                            href={activeDoc.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                            Open full size
                                        </a>
                                    </div>
                                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center min-h-[240px]">
                                        {isImage(activeDoc.file_url) ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={activeDoc.file_url}
                                                alt={activeDoc.doc_type}
                                                className="max-h-[420px] max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-slate-400">
                                                <span className="material-symbols-outlined text-6xl">picture_as_pdf</span>
                                                <a
                                                    href={activeDoc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-semibold text-primary hover:underline"
                                                >
                                                    Click to open PDF
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400">
                                        Uploaded {new Date(activeDoc.uploaded_at).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reject reason input */}
                    {rejectMode && (
                        <div className="px-6 pb-4 flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rejection reason <span className="text-red-500">*</span></label>
                            <textarea
                                autoFocus
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 text-sm resize-none h-24 focus:ring-2 focus:ring-red-400 outline-none"
                                placeholder="e.g. Document is blurry, expired, or does not match the registered name..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    {!rejectMode ? (
                        <>
                            <button
                                onClick={() => setRejectMode(true)}
                                disabled={busy || docsLoading}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Reject
                            </button>
                            <button
                                onClick={onApprove}
                                disabled={busy || docsLoading}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                            >
                                {busy
                                    ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    : <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                }
                                {busy ? 'Approving…' : 'Approve'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { setRejectMode(false); setReason(''); }}
                                disabled={busy}
                                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => reason.trim() && onReject(reason.trim())}
                                disabled={!reason.trim() || busy}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                            >
                                {busy
                                    ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    : <span className="material-symbols-outlined text-[18px]">cancel</span>
                                }
                                {busy ? 'Rejecting…' : 'Confirm Rejection'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Listing detail modal ──────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function ListingDetailModal({
    item,
    onClose,
    onApprove,
    onReject,
    busy,
}: {
    item: ListingModerationQueueItem;
    onClose: () => void;
    onApprove: () => void;
    onReject: (reason: string) => void;
    busy: boolean;
}) {
    const [detail, setDetail] = useState<AdminListingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [activePhoto, setActivePhoto] = useState(0);
    const [rejectMode, setRejectMode] = useState(false);
    const [reason, setReason] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        getAdminListingDetailAction(token, item.listing_id).then((r) => {
            setLoading(false);
            if (r.data) setDetail(r.data);
            else setFetchError(r.error?.message ?? 'Failed to load listing details');
        });
    }, [item.listing_id]);

    const photos = detail?.media ?? [];
    const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.full_address}</p>
                        <p className="text-xs text-slate-500">{item.owner_name} · {item.owner_email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase shrink-0">Pending Review</span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-1">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {loading && (
                        <div className="flex items-center justify-center py-24">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        </div>
                    )}

                    {!loading && fetchError && (
                        <div className="m-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-500">error</span>
                            <p className="text-sm text-red-700 dark:text-red-400">{fetchError}</p>
                        </div>
                    )}

                    {!loading && detail && (
                        <div className="p-6 space-y-6">

                            {/* Photo gallery */}
                            {sorted.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={mediaUrl(sorted[activePhoto]?.url ?? '')}
                                            alt="Listing photo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {sorted.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {sorted.map((m, i) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setActivePhoto(i)}
                                                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                        i === activePhoto ? 'border-primary' : 'border-transparent'
                                                    }`}
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={mediaUrl(m.url)} alt="" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <span className="material-symbols-outlined text-4xl">photo_library</span>
                                    <p className="text-sm font-medium">No photos uploaded</p>
                                </div>
                            )}

                            {/* Details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Identity */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Property</p>
                                    <Row label="Address" value={detail.full_address} />
                                    <Row label="Type" value={detail.property_type?.replace(/_/g, ' ')} capitalize />
                                    <Row label="Floor" value={detail.floor_level?.replace(/_/g, ' ')} capitalize />
                                    <Row label="Submitted" value={new Date(item.submitted_at).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })} />
                                </div>

                                {/* Pricing */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pricing</p>
                                    <Row label="Monthly Rent" value={detail.monthly_rent_rwf != null ? `RWF ${detail.monthly_rent_rwf.toLocaleString()}` : undefined} />
                                    <Row label="Security Deposit" value={detail.security_deposit_rwf != null ? `RWF ${detail.security_deposit_rwf.toLocaleString()}` : undefined} />
                                    {detail.utilities && detail.utilities.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-slate-500 w-28 shrink-0">Utilities</span>
                                            <div className="flex flex-wrap gap-1">
                                                {detail.utilities.map((u) => (
                                                    <span key={u} className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full capitalize">{u}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {detail.lease_durations && detail.lease_durations.length > 0 && (
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-slate-500 w-28 shrink-0">Lease</span>
                                            <div className="flex flex-wrap gap-1">
                                                {detail.lease_durations.map((d) => (
                                                    <span key={d} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">{d.replace(/_/g, ' ')}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* House rules */}
                                {detail.house_rules && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">House Rules</p>
                                        <Row label="Smoking" value={detail.house_rules.smoking_policy?.replace(/_/g, ' ')} capitalize />
                                        <Row label="Gender" value={detail.house_rules.gender_preference?.replace(/_/g, ' ')} capitalize />
                                        <Row label="Visitors" value={detail.house_rules.visitor_policy?.replace(/_/g, ' ')} capitalize />
                                        <Row label="Pets" value={detail.house_rules.pets_allowed ?? undefined} />
                                        {detail.house_rules.additional_rules && (
                                            <div className="text-sm">
                                                <span className="text-slate-500">Additional</span>
                                                <p className="text-slate-700 dark:text-slate-300 mt-1 text-xs">{detail.house_rules.additional_rules}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Calendar */}
                                {detail.calendar && detail.calendar.length > 0 && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Availability</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {detail.calendar.map((e) => (
                                                <span key={`${e.year}-${e.month}`} className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                    e.status === 'available' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                                    e.status === 'occupied'  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                    {MONTHS[e.month - 1]} {e.year}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reject reason */}
                            {rejectMode && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rejection reason <span className="text-red-500">*</span></label>
                                    <textarea
                                        autoFocus
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 text-sm resize-none h-24 focus:ring-2 focus:ring-red-400 outline-none"
                                        placeholder="e.g. Photos too low quality, address unverifiable..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
                    {!rejectMode ? (
                        <>
                            <button
                                onClick={() => setRejectMode(true)}
                                disabled={busy || loading || !detail}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">cancel</span>
                                Reject
                            </button>
                            <button
                                onClick={onApprove}
                                disabled={busy || loading || !detail}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                            >
                                {busy
                                    ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    : <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                }
                                {busy ? 'Approving…' : 'Approve'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { setRejectMode(false); setReason(''); }}
                                disabled={busy}
                                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => reason.trim() && onReject(reason.trim())}
                                disabled={!reason.trim() || busy}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                            >
                                {busy
                                    ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    : <span className="material-symbols-outlined text-[18px]">cancel</span>
                                }
                                {busy ? 'Rejecting…' : 'Confirm Rejection'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, capitalize }: { label: string; value?: string | null; capitalize?: boolean }) {
    return (
        <div className="flex items-start gap-2 text-sm">
            <span className="text-slate-500 w-28 shrink-0">{label}</span>
            <span className={`text-slate-800 dark:text-slate-200 font-medium ${capitalize ? 'capitalize' : ''}`}>{value || '—'}</span>
        </div>
    );
}

// ── Pending KYC summary card ──────────────────────────────────────────────────
function KycCard({
    user,
    onReview,
}: {
    user: PendingKycUser;
    onReview: () => void;
}) {
    const initials = user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const submitted = new Date(user.submitted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-4 p-5 flex-1">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    {user.phone && <p className="text-xs text-slate-400 truncate">{user.phone}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wide">Pending</span>
                    <span className="text-[10px] text-slate-400">{submitted}</span>
                </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <button
                    onClick={onReview}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">rate_review</span>
                    Review Documents
                </button>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('overview');
    const [adminProfile, setAdminProfile] = useState<UserProfileResponse | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token) { router.replace('/login'); return; }
        if (role === 'student' || role === 'landlord') { router.replace('/'); return; }
        getUserProfileAction(token).then((r) => { if (r.data) setAdminProfile(r.data); });
    }, [router]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [pendingKyc, setPendingKyc] = useState<PendingKycUser[]>([]);
    const [kycLoading, setKycLoading] = useState(false);
    const [kycError, setKycError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [reviewTarget, setReviewTarget] = useState<PendingKycUser | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    // Listing reviews state
    const [listingQueue, setListingQueue] = useState<ListingModerationQueueItem[]>([]);
    const [listingsLoading, setListingsLoading] = useState(false);
    const [listingsError, setListingsError] = useState<string | null>(null);
    const [listingBusyId, setListingBusyId] = useState<string | null>(null);
    const [rejectListingTarget, setRejectListingTarget] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [detailTarget, setDetailTarget] = useState<ListingModerationQueueItem | null>(null);
    const [activeListingsCount, setActiveListingsCount] = useState<number | null>(null);
    const [activeListingsData, setActiveListingsData] = useState<PublicListing[]>([]);
    const [overviewLoading, setOverviewLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        router.push('/');
    };

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const getToken = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return null; }
        return token;
    };

    const loadPendingKyc = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        setKycLoading(true);
        setKycError(null);
        const result = await getPendingKycAction(token);
        setKycLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setKycError(result.error.message);
            return;
        }
        setPendingKyc(result.data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadListingQueue = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        setListingsLoading(true);
        setListingsError(null);
        const result = await getListingReviewQueueAction(token);
        setListingsLoading(false);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            setListingsError(result.error.message);
            return;
        }
        setListingQueue(result.data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadOverview = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        setOverviewLoading(true);
        const [kycResult, queueResult, listingsResult] = await Promise.all([
            getPendingKycAction(token),
            getListingReviewQueueAction(token),
            getPublicListingsAction(),
        ]);
        setOverviewLoading(false);
        if (kycResult.data) setPendingKyc(kycResult.data);
        if (queueResult.data) setListingQueue(queueResult.data);
        if (listingsResult.data) {
            const active = listingsResult.data.filter((l) => l.status === 'active');
            setActiveListingsCount(active.length);
            setActiveListingsData(active);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApproveListing = async (listingId: string) => {
        const token = getToken();
        if (!token) return;
        setListingBusyId(listingId);
        const result = await approveListingAction(token, listingId);
        setListingBusyId(null);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            showToast(result.error.message, false);
            return;
        }
        showToast('Listing approved.', true);
        setListingQueue((prev) => prev.filter((l) => l.listing_id !== listingId));
    };

    const rejectListing = async (listingId: string, reason: string) => {
        const token = getToken();
        if (!token || !reason.trim()) return;
        setListingBusyId(listingId);
        const result = await rejectListingAction(token, listingId, reason.trim());
        setListingBusyId(null);
        setRejectListingTarget(null);
        setRejectReason('');
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            showToast(result.error.message, false);
            return;
        }
        showToast('Listing rejected.', true);
        setListingQueue((prev) => prev.filter((l) => l.listing_id !== listingId));
    };

    const handleRejectListing = () => {
        if (!rejectListingTarget || !rejectReason.trim()) return;
        rejectListing(rejectListingTarget, rejectReason);
    };

    useEffect(() => {
        if (tab === 'overview') loadOverview();
        if (tab === 'landlord-approvals') loadPendingKyc();
        if (tab === 'listing-reviews') loadListingQueue();
    }, [tab, loadOverview, loadPendingKyc, loadListingQueue]);

    const handleApprove = async (user: PendingKycUser) => {
        const token = getToken();
        if (!token) return;
        setBusyId(user.user_id);
        const result = await approveLandlordKycAction(token, user.user_id);
        setBusyId(null);
        setReviewTarget(null);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            showToast(result.error.message, false);
            return;
        }
        showToast(`${user.full_name} approved.`, true);
        setPendingKyc((prev) => prev.filter((u) => u.user_id !== user.user_id));
    };

    const handleReject = async (user: PendingKycUser, reason: string) => {
        const token = getToken();
        if (!token) return;
        setBusyId(user.user_id);
        const result = await rejectLandlordKycAction(token, user.user_id, reason);
        setBusyId(null);
        setReviewTarget(null);
        if (result.error) {
            if (handleAuthError(result.error, router)) return;
            showToast(result.error.message, false);
            return;
        }
        showToast(`${user.full_name} rejected.`, true);
        setPendingKyc((prev) => prev.filter((u) => u.user_id !== user.user_id));
    };

    const NAV: { id: Tab; label: string; icon: string }[] = [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'landlord-approvals', label: 'Landlord Approvals', icon: 'domain_verification' },
        { id: 'listing-reviews', label: 'Listing Reviews', icon: 'rate_review' },
    ];

    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950/50">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed top-16 bottom-0 z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-2 text-white">
                        <span className="material-symbols-outlined block">home_work</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">StudentNest</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Admin Portal</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {NAV.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => setTab(n.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                tab === n.id
                                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                            {n.label}
                            {n.id === 'landlord-approvals' && pendingKyc.length > 0 && (
                                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {pendingKyc.length}
                                </span>
                            )}
                            {n.id === 'listing-reviews' && listingQueue.length > 0 && (
                                <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {listingQueue.length}
                                </span>
                            )}
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Settings
                        </button>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Logged in as</p>
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {adminProfile?.full_name
                                    ? adminProfile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                                    : 'A'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{adminProfile?.full_name ?? 'Admin'}</p>
                                <p className="text-[10px] text-slate-500 capitalize truncate">{adminProfile?.role?.replace(/_/g, ' ') ?? 'Admin Portal'}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Navbar */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-10 px-6 flex items-center justify-between gap-4">
                    {/* Left — breadcrumb */}
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-primary text-xl shrink-0">admin_panel_settings</span>
                        <span className="text-xs text-slate-400 font-medium hidden sm:block">Admin</span>
                        <span className="text-slate-300 dark:text-slate-600 hidden sm:block">/</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate capitalize">
                            {tab === 'overview' ? 'Overview' : tab === 'landlord-approvals' ? 'Landlord Approvals' : 'Listing Reviews'}
                        </span>
                    </div>

                    {/* Centre — pending action pills */}
                    <div className="flex items-center gap-2">
                        {pendingKyc.length > 0 && (
                            <button
                                onClick={() => setTab('landlord-approvals')}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                                {pendingKyc.length} KYC pending
                            </button>
                        )}
                        {listingQueue.length > 0 && (
                            <button
                                onClick={() => setTab('listing-reviews')}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">rate_review</span>
                                {listingQueue.length} listings to review
                            </button>
                        )}
                    </div>

                    {/* Right — user menu */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Notification dot if any pending */}
                        <div className="relative">
                            <button
                                onClick={() => setTab('landlord-approvals')}
                                className="flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Pending actions"
                            >
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                            </button>
                            {(pendingKyc.length > 0 || listingQueue.length > 0) && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                            )}
                        </div>

                        {/* Avatar dropdown */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((p) => !p)}
                                className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-700 focus:outline-none"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                        {adminProfile?.full_name ?? 'Admin'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 capitalize leading-tight">
                                        {adminProfile?.role?.replace(/_/g, ' ') ?? 'Administrator'}
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {adminProfile?.full_name
                                        ? adminProfile.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                                        : 'A'}
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-[18px] hidden sm:block">expand_more</span>
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-1 z-50">
                                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{adminProfile?.full_name ?? 'Admin'}</p>
                                        <p className="text-[11px] text-slate-400 capitalize truncate">{adminProfile?.role?.replace(/_/g, ' ') ?? 'Administrator'}</p>
                                    </div>
                                    <button
                                        onClick={() => { setMenuOpen(false); setTab('overview'); }}
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-400">dashboard</span>
                                        Overview
                                    </button>
                                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                                    <button
                                        onClick={() => { setMenuOpen(false); handleLogout(); }}
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full">

                    {/* ── Overview tab ── */}
                    {tab === 'overview' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h2>
                                    <p className="text-slate-500 text-sm mt-1">Live platform stats and pending actions.</p>
                                </div>
                                <button
                                    onClick={loadOverview}
                                    disabled={overviewLoading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${overviewLoading ? 'animate-spin' : ''}`}>refresh</span>
                                    Refresh
                                </button>
                            </div>

                            {/* Metric cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <span className="material-symbols-outlined block">apartment</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Live</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Listings</p>
                                    <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                        {overviewLoading ? <span className="text-slate-300 dark:text-slate-600">—</span> : (activeListingsCount ?? '—')}
                                    </h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                            <span className="material-symbols-outlined block">domain_verification</span>
                                        </div>
                                        {pendingKyc.length > 0 && (
                                            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Attention</span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Landlord KYCs</p>
                                    <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                        {overviewLoading ? <span className="text-slate-300 dark:text-slate-600">—</span> : pendingKyc.length}
                                    </h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            <span className="material-symbols-outlined block">rate_review</span>
                                        </div>
                                        {listingQueue.length > 0 && (
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">Attention</span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Listings Pending Review</p>
                                    <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                        {overviewLoading ? <span className="text-slate-300 dark:text-slate-600">—</span> : listingQueue.length}
                                    </h3>
                                </div>
                            </div>

                            {/* Action panels */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Pending KYCs */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900 dark:text-white">Landlord KYC Queue</h3>
                                        <button onClick={() => setTab('landlord-approvals')} className="text-primary text-sm font-semibold hover:underline">View All</button>
                                    </div>
                                    {overviewLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                                        </div>
                                    ) : pendingKyc.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                                            <p className="text-sm font-medium">No pending KYC submissions</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {pendingKyc.slice(0, 4).map((user) => {
                                                const initials = user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
                                                return (
                                                    <div key={user.user_id} className="flex items-center gap-3 px-5 py-4">
                                                        <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shrink-0">{initials}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                                                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setReviewTarget(user)}
                                                            className="shrink-0 text-xs font-semibold text-primary hover:underline"
                                                        >
                                                            Review
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                            {pendingKyc.length > 4 && (
                                                <div className="px-5 py-3 text-xs text-slate-400 text-center">
                                                    +{pendingKyc.length - 4} more —{' '}
                                                    <button onClick={() => setTab('landlord-approvals')} className="text-primary font-semibold hover:underline">see all</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Pending listing reviews */}
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900 dark:text-white">Listing Review Queue</h3>
                                        <button onClick={() => setTab('listing-reviews')} className="text-primary text-sm font-semibold hover:underline">View All</button>
                                    </div>
                                    {overviewLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                                        </div>
                                    ) : listingQueue.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                                            <span className="material-symbols-outlined text-4xl">task_alt</span>
                                            <p className="text-sm font-medium">No listings pending review</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {listingQueue.slice(0, 4).map((item) => (
                                                <div key={item.listing_id} className="flex items-center gap-3 px-5 py-4">
                                                    <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                        {item.cover_url ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={mediaUrl(item.cover_url)} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-slate-400 text-[18px]">apartment</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.full_address}</p>
                                                        <p className="text-xs text-slate-400 truncate">{item.owner_name} · {item.monthly_rent_rwf != null ? `RWF ${item.monthly_rent_rwf.toLocaleString()}/mo` : '—'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setDetailTarget(item)}
                                                        className="shrink-0 text-xs font-semibold text-primary hover:underline"
                                                    >
                                                        Review
                                                    </button>
                                                </div>
                                            ))}
                                            {listingQueue.length > 4 && (
                                                <div className="px-5 py-3 text-xs text-slate-400 text-center">
                                                    +{listingQueue.length - 4} more —{' '}
                                                    <button onClick={() => setTab('listing-reviews')} className="text-primary font-semibold hover:underline">see all</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Platform Insights */}
                            {!overviewLoading && activeListingsData.length > 0 && (() => {
                                const withRent = activeListingsData.filter((l) => l.monthly_rent_rwf != null);
                                const avgRent = withRent.length > 0
                                    ? Math.round(withRent.reduce((s, l) => s + (l.monthly_rent_rwf ?? 0), 0) / withRent.length)
                                    : null;
                                const minRent = withRent.length > 0 ? Math.min(...withRent.map((l) => l.monthly_rent_rwf!)) : null;
                                const maxRent = withRent.length > 0 ? Math.max(...withRent.map((l) => l.monthly_rent_rwf!)) : null;

                                const TYPE_LABELS: Record<string, string> = {
                                    single_room: 'Single Room',
                                    shared_room: 'Shared Room',
                                    self_contained_studio: 'Studio',
                                    full_apartment: 'Full Apartment',
                                };
                                const typeCounts = activeListingsData.reduce((acc, l) => {
                                    if (l.property_type) acc[l.property_type] = (acc[l.property_type] ?? 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>);
                                const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
                                const topType = typeEntries[0];

                                const neighCounts = activeListingsData.reduce((acc, l) => {
                                    const n = l.neighborhood_name ?? 'Other';
                                    acc[n] = (acc[n] ?? 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>);
                                const topNeighs = Object.entries(neighCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                                const maxNeighCount = topNeighs[0]?.[1] ?? 1;

                                return (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Insights</h3>

                                        {/* Quick stat row */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Avg Monthly Rent', value: avgRent != null ? `RWF ${avgRent.toLocaleString()}` : '—', icon: 'payments', color: 'text-primary bg-primary/10' },
                                                { label: 'Lowest Rent', value: minRent != null ? `RWF ${minRent.toLocaleString()}` : '—', icon: 'trending_down', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
                                                { label: 'Highest Rent', value: maxRent != null ? `RWF ${maxRent.toLocaleString()}` : '—', icon: 'trending_up', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
                                                { label: 'Most Listed Type', value: topType ? (TYPE_LABELS[topType[0]] ?? topType[0]) : '—', icon: 'category', color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
                                            ].map(({ label, value, icon, color }) => (
                                                <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                                                    <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
                                                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Property type breakdown */}
                                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Listings by Property Type</h4>
                                                <div className="space-y-3">
                                                    {typeEntries.map(([type, count]) => {
                                                        const pct = Math.round((count / activeListingsData.length) * 100);
                                                        return (
                                                            <div key={type}>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">
                                                                        {TYPE_LABELS[type] ?? type.replace(/_/g, ' ')}
                                                                    </span>
                                                                    <span className="text-xs font-bold text-slate-500">{count} ({pct}%)</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Neighbourhood distribution */}
                                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Top Neighbourhoods</h4>
                                                <div className="space-y-3">
                                                    {topNeighs.map(([name, count]) => {
                                                        const pct = Math.round((count / maxNeighCount) * 100);
                                                        return (
                                                            <div key={name}>
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{name}</span>
                                                                    <span className="text-xs font-bold text-slate-500">{count} listing{count !== 1 ? 's' : ''}</span>
                                                                </div>
                                                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* ── Landlord Approvals tab ── */}
                    {tab === 'landlord-approvals' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Landlord Approvals</h2>
                                    <p className="text-slate-500 text-sm mt-1">Review submitted KYC documents and approve or reject each landlord.</p>
                                </div>
                                <button
                                    onClick={loadPendingKyc}
                                    disabled={kycLoading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${kycLoading ? 'animate-spin' : ''}`}>refresh</span>
                                    Refresh
                                </button>
                            </div>

                            {kycError && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{kycError}</p>
                                </div>
                            )}

                            {kycLoading && (
                                <div className="flex items-center justify-center py-20">
                                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                                </div>
                            )}

                            {!kycLoading && !kycError && pendingKyc.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">verified_user</span>
                                    <p className="font-semibold text-slate-600 dark:text-slate-400">No pending KYC submissions</p>
                                    <p className="text-sm text-slate-400">All landlords have been reviewed.</p>
                                </div>
                            )}

                            {!kycLoading && pendingKyc.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {pendingKyc.map((user) => (
                                        <KycCard
                                            key={user.user_id}
                                            user={user}
                                            onReview={() => setReviewTarget(user)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Listing Reviews tab ── */}
                    {tab === 'listing-reviews' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Listing Reviews</h2>
                                    <p className="text-slate-500 text-sm mt-1">Review listings submitted for moderation and approve or reject each one.</p>
                                </div>
                                <button
                                    onClick={loadListingQueue}
                                    disabled={listingsLoading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${listingsLoading ? 'animate-spin' : ''}`}>refresh</span>
                                    Refresh
                                </button>
                            </div>

                            {listingsError && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{listingsError}</p>
                                </div>
                            )}

                            {listingsLoading && (
                                <div className="flex items-center justify-center py-20">
                                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                                </div>
                            )}

                            {!listingsLoading && !listingsError && listingQueue.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">task_alt</span>
                                    <p className="font-semibold text-slate-600 dark:text-slate-400">No listings pending review</p>
                                    <p className="text-sm text-slate-400">All submissions have been processed.</p>
                                </div>
                            )}

                            {!listingsLoading && listingQueue.length > 0 && (
                                <div className="space-y-4">
                                    {listingQueue.map((item) => (
                                        <div key={item.listing_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                                            {/* Cover */}
                                            <div className="w-full sm:w-48 h-36 sm:h-auto shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                {item.cover_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={mediaUrl(item.cover_url)} alt="Listing" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">apartment</span>
                                                )}
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{item.full_address}</h4>
                                                        <p className="text-sm text-slate-500 mt-0.5">
                                                            {item.neighborhood_name && <span>{item.neighborhood_name} · </span>}
                                                            <span className="capitalize">{item.property_type?.replace(/_/g, ' ') ?? '—'}</span>
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-primary text-sm shrink-0 ml-4">{item.monthly_rent_rwf != null ? `RWF ${item.monthly_rent_rwf.toLocaleString()}/mo` : '—'}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500 mb-4">
                                                    <span><span className="font-semibold text-slate-700 dark:text-slate-300">Owner:</span> {item.owner_name}</span>
                                                    <span><span className="font-semibold text-slate-700 dark:text-slate-300">Email:</span> {item.owner_email}</span>
                                                    <span><span className="font-semibold text-slate-700 dark:text-slate-300">Photos:</span> {item.media_count}</span>
                                                    <span><span className="font-semibold text-slate-700 dark:text-slate-300">Submitted:</span> {new Date(item.submitted_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                                                    {rejectListingTarget === item.listing_id ? (
                                                        <>
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                placeholder="Rejection reason (required)"
                                                                value={rejectReason}
                                                                onChange={(e) => setRejectReason(e.target.value)}
                                                                className="flex-1 h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-red-400"
                                                            />
                                                            <button
                                                                onClick={handleRejectListing}
                                                                disabled={!rejectReason.trim() || listingBusyId === item.listing_id}
                                                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                                                            >
                                                                {listingBusyId === item.listing_id ? '…' : 'Confirm Reject'}
                                                            </button>
                                                            <button
                                                                onClick={() => { setRejectListingTarget(null); setRejectReason(''); }}
                                                                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => setDetailTarget(item)}
                                                                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                                Details
                                                            </button>
                                                            <button
                                                                onClick={() => setRejectListingTarget(item.listing_id)}
                                                                disabled={!!listingBusyId}
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproveListing(item.listing_id)}
                                                                disabled={!!listingBusyId}
                                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                                                            >
                                                                {listingBusyId === item.listing_id
                                                                    ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                                                                    : <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                                }
                                                                Approve
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </main>

            {/* Listing detail modal */}
            {detailTarget && (
                <ListingDetailModal
                    item={detailTarget}
                    busy={listingBusyId === detailTarget.listing_id}
                    onClose={() => setDetailTarget(null)}
                    onApprove={() => { handleApproveListing(detailTarget.listing_id); setDetailTarget(null); }}
                    onReject={(reason) => {
                        setDetailTarget(null);
                        rejectListing(detailTarget.listing_id, reason);
                    }}
                />
            )}

            {/* Review modal */}
            {reviewTarget && (
                <ReviewModal
                    user={reviewTarget}
                    busy={busyId === reviewTarget.user_id}
                    onClose={() => setReviewTarget(null)}
                    onApprove={() => handleApprove(reviewTarget)}
                    onReject={(reason) => handleReject(reviewTarget, reason)}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    <span className="material-symbols-outlined text-[18px]">{toast.ok ? 'check_circle' : 'error'}</span>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
