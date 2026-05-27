'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import type { KycUploadResponse } from '@/lib/types/api.types';

async function uploadKycDocument(
    accessToken: string,
    docType: string,
    file: File,
): Promise<{ data: KycUploadResponse | null; error: string | null }> {
    const body = new FormData();
    body.append('file', file);
    try {
        const res = await fetch(`/api/kyc-upload?doc_type=${encodeURIComponent(docType)}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
            body,
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
            let message = 'Upload failed';
            if (payload?.detail) {
                if (Array.isArray(payload.detail)) {
                    message = payload.detail
                        .map((d: { loc: string[]; msg: string }) =>
                            d.loc?.length ? `${d.loc.join(' → ')}: ${d.msg}` : d.msg
                        )
                        .join('; ');
                } else if (typeof payload.detail === 'string') {
                    message = payload.detail;
                }
            } else if (payload?.message) {
                message = payload.message;
            }
            return { data: null, error: message };
        }
        return { data: payload as KycUploadResponse, error: null };
    } catch (e) {
        return { data: null, error: e instanceof Error ? e.message : 'Network error' };
    }
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const DOC_TYPES = [
    {
        value: 'national_id',
        label: 'National ID Card',
        description: 'Front of your Rwandan national ID or passport',
        icon: 'badge',
    },
    {
        value: 'proof_of_ownership',
        label: 'Proof of Ownership',
        description: 'Title deed, lease agreement, or utility bill',
        icon: 'home',
    },
];

type SlotStatus = 'idle' | 'uploading' | 'done' | 'error';

type DocSlot = {
    file: File | null;
    preview: string | null;
    status: SlotStatus;
    error: string | null;
};

const emptySlot = (): DocSlot => ({ file: null, preview: null, status: 'idle', error: null });

function formatSize(bytes: number) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function LandlordIDVerificationPage() {
    const router = useRouter();
    const inputRefs = useRef<Partial<Record<string, HTMLInputElement>>>({});

    const [slots, setSlots] = useState<Record<string, DocSlot>>(
        Object.fromEntries(DOC_TYPES.map((dt) => [dt.value, emptySlot()]))
    );
    const [dragging, setDragging] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const validate = (f: File): string | null => {
        if (!ACCEPTED_TYPES.includes(f.type)) return 'Only JPG, PNG, or PDF files are accepted.';
        if (f.size > MAX_SIZE_BYTES) return `File too large — maximum size is ${MAX_SIZE_MB} MB.`;
        return null;
    };

    const applyFile = useCallback((docType: string, f: File) => {
        const err = validate(f);
        if (err) {
            setSlots((prev) => ({ ...prev, [docType]: { ...prev[docType], error: err } }));
            return;
        }
        if (f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) =>
                setSlots((prev) => ({
                    ...prev,
                    [docType]: { file: f, preview: e.target?.result as string, status: 'idle', error: null },
                }));
            reader.readAsDataURL(f);
        } else {
            setSlots((prev) => ({
                ...prev,
                [docType]: { file: f, preview: null, status: 'idle', error: null },
            }));
        }
        setGlobalError(null);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFileChange = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) applyFile(docType, f);
    };

    const handleDrop = (docType: string, e: React.DragEvent) => {
        e.preventDefault();
        setDragging(null);
        const f = e.dataTransfer.files?.[0];
        if (f) applyFile(docType, f);
    };

    const handleRemove = (docType: string) => {
        setSlots((prev) => ({ ...prev, [docType]: emptySlot() }));
        const input = inputRefs.current[docType];
        if (input) input.value = '';
    };

    const allSlotsReady = DOC_TYPES.every((dt) => {
        const s = slots[dt.value];
        return s.status === 'done' || (s.file !== null && s.status !== 'uploading');
    });

    const handleSubmit = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) { router.push('/login'); return; }

        const toUpload = DOC_TYPES.filter(
            (dt) => slots[dt.value].file && slots[dt.value].status !== 'done'
        );
        if (toUpload.length === 0) return;

        setIsSubmitting(true);
        setGlobalError(null);

        let lastResult: KycUploadResponse | null = null;

        for (const dt of toUpload) {
            const { file } = slots[dt.value];
            if (!file) continue;

            setSlots((prev) => ({
                ...prev,
                [dt.value]: { ...prev[dt.value], status: 'uploading', error: null },
            }));

            const result = await uploadKycDocument(accessToken, dt.value, file);

            if (result.error) {
                setSlots((prev) => ({
                    ...prev,
                    [dt.value]: { ...prev[dt.value], status: 'error', error: result.error },
                }));
                setIsSubmitting(false);
                return;
            }

            setSlots((prev) => ({
                ...prev,
                [dt.value]: { ...prev[dt.value], status: 'done', error: null },
            }));
            lastResult = result.data;
        }

        setIsSubmitting(false);

        if (lastResult?.ready_for_review) {
            router.push('/landlord-registration/pending');
        }
    };

    const uploadedCount = DOC_TYPES.filter((dt) => slots[dt.value].status === 'done').length;
    const totalCount = DOC_TYPES.length;

    return (
        <div className="flex flex-1 justify-center py-10 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[720px] flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Progress */}
                <div className="flex flex-col gap-3 p-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                        <p className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider">Step 2 of 4</p>
                        <p className="text-primary text-sm font-bold">50% Complete</p>
                    </div>
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 h-2 w-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: '50%' }} />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Identity Verification</p>
                    </div>
                </div>

                <div className="p-8 flex flex-col gap-8">

                    {/* Heading */}
                    <div>
                        <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mb-2">Verify your identity</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                            Upload both documents below before submitting. All files are encrypted and only accessible to verified staff.
                        </p>
                    </div>

                    {/* Security notice */}
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        <div className="text-sm">
                            <p className="font-bold text-slate-900 dark:text-white">Your data is secure</p>
                            <p className="text-slate-500 dark:text-slate-400">Encrypted transmission &amp; secure storage. Only verified staff can access your documents.</p>
                        </div>
                    </div>

                    {/* Progress pills */}
                    <div className="flex items-center gap-3">
                        {DOC_TYPES.map((dt) => {
                            const s = slots[dt.value];
                            const done = s.status === 'done';
                            const hasFile = !!s.file;
                            return (
                                <div
                                    key={dt.value}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                        done
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                                            : hasFile
                                            ? 'bg-primary/5 border-primary/30 text-primary'
                                            : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[14px]">
                                        {done ? 'check_circle' : hasFile ? 'attach_file' : 'radio_button_unchecked'}
                                    </span>
                                    {dt.label}
                                </div>
                            );
                        })}
                        <span className="ml-auto text-xs text-slate-400 font-medium">{uploadedCount}/{totalCount} uploaded</span>
                    </div>

                    {/* Global error */}
                    {globalError && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{globalError}</p>
                        </div>
                    )}

                    {/* Document slots */}
                    <div className="flex flex-col gap-5">
                        {DOC_TYPES.map((dt) => {
                            const slot = slots[dt.value];
                            const isDraggingThis = dragging === dt.value;
                            const isDone = slot.status === 'done';
                            const isUploading = slot.status === 'uploading';

                            return (
                                <div
                                    key={dt.value}
                                    className={`rounded-xl border-2 overflow-hidden transition-colors ${
                                        isDone
                                            ? 'border-emerald-300 dark:border-emerald-700'
                                            : slot.error
                                            ? 'border-red-300 dark:border-red-700'
                                            : slot.file
                                            ? 'border-primary'
                                            : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    {/* Slot header */}
                                    <div className={`flex items-center justify-between px-4 py-3 border-b ${
                                        isDone
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-lg ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}`}>
                                                {isDone ? 'check_circle' : dt.icon}
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{dt.label}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{dt.description}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                            isDone
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                : 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                            {isDone ? 'Uploaded' : 'Required'}
                                        </span>
                                    </div>

                                    {/* Hidden input */}
                                    <input
                                        ref={(el) => { inputRefs.current[dt.value] = el ?? undefined; }}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        className="sr-only"
                                        onChange={(e) => handleFileChange(dt.value, e)}
                                    />

                                    {/* Content area */}
                                    {isDone ? (
                                        <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900">
                                            <span className="material-symbols-outlined text-emerald-500 text-xl">
                                                {slot.file?.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{slot.file?.name}</p>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400">Uploaded successfully</p>
                                            </div>
                                        </div>
                                    ) : !slot.file ? (
                                        /* Drop zone */
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => inputRefs.current[dt.value]?.click()}
                                            onKeyDown={(e) => e.key === 'Enter' && inputRefs.current[dt.value]?.click()}
                                            onDrop={(e) => handleDrop(dt.value, e)}
                                            onDragOver={(e) => { e.preventDefault(); setDragging(dt.value); }}
                                            onDragLeave={() => setDragging(null)}
                                            className={`flex items-center gap-5 px-5 py-5 cursor-pointer bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                                                isDraggingThis ? 'bg-primary/5' : ''
                                            }`}
                                        >
                                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {isDraggingThis ? 'Drop file here' : 'Click or drag to upload'}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">JPG, PNG or PDF — max {MAX_SIZE_MB} MB</p>
                                            </div>
                                            <Button variant="outline" size="sm" type="button" className="shrink-0">
                                                Browse
                                            </Button>
                                        </div>
                                    ) : (
                                        /* File selected */
                                        <div className="bg-white dark:bg-slate-900">
                                            {slot.preview && (
                                                <div className="bg-slate-100 dark:bg-slate-800 flex items-center justify-center h-40">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={slot.preview} alt="Preview" className="max-h-40 max-w-full object-contain" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 px-4 py-3">
                                                <span className={`material-symbols-outlined text-xl shrink-0 ${isUploading ? 'text-primary animate-spin' : 'text-primary'}`}>
                                                    {isUploading ? 'progress_activity' : slot.file.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{slot.file.name}</p>
                                                    <p className="text-xs text-slate-500">{formatSize(slot.file.size)}{isUploading ? ' · Uploading…' : ''}</p>
                                                </div>
                                                {!isUploading && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(dt.value)}
                                                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors shrink-0"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            {slot.error && (
                                                <div className="px-4 pb-3">
                                                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                                        {slot.error}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Requirements */}
                    <div className="flex flex-col gap-3">
                        <p className="text-slate-900 dark:text-white font-semibold text-sm uppercase tracking-wide">Requirements</p>
                        <div className="grid gap-3">
                            {[
                                { label: 'Clear and legible', sub: 'No glare, blur, or cropping of important details' },
                                { label: 'Valid and not expired', sub: 'Documents must be current and government-issued' },
                                { label: 'Accepted formats', sub: 'JPG, PNG, or PDF — max 5 MB each' },
                            ].map((r) => (
                                <div key={r.label} className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                    <div>
                                        <p className="text-slate-900 dark:text-white text-sm font-medium">{r.label}</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs">{r.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-4">
                        <Button
                            variant="secondary"
                            className="gap-2 px-6 py-3"
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 gap-2 px-8 py-3"
                            type="button"
                            disabled={!allSlotsReady || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                    Uploading {uploadedCount + 1} of {totalCount}…
                                </>
                            ) : (
                                <>
                                    Submit for Review
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
