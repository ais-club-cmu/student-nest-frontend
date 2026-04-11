'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { uploadKycDocumentAction } from '@/app/actions/nestActions';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function fileIcon(type: string) {
    if (type === 'application/pdf') return 'picture_as_pdf';
    return 'image';
}

export default function LandlordIDVerificationPage() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validate = (f: File): string | null => {
        if (!ACCEPTED_TYPES.includes(f.type)) return 'Only JPG, PNG, or PDF files are accepted.';
        if (f.size > MAX_SIZE_BYTES) return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
        return null;
    };

    const applyFile = useCallback((f: File) => {
        const err = validate(f);
        if (err) {
            setValidationError(err);
            return;
        }
        setValidationError(null);
        setUploadError(null);
        setFile(f);

        if (f.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(f);
        } else {
            setPreview(null); // PDF — no image preview
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) applyFile(f);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) applyFile(f);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        setValidationError(null);
        setUploadError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!file) {
            setValidationError('Please select a file before submitting.');
            return;
        }

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setUploadError('You must be logged in to upload documents. Please log in and try again.');
            return;
        }

        setIsLoading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadKycDocumentAction(accessToken, formData);

        setIsLoading(false);

        if (result.error) {
            setUploadError(result.error.message);
            return;
        }

        router.push('/landlord-registration/pending');
    };

    return (
        <div className="flex flex-1 justify-center py-10 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[720px] flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Progress */}
                <div className="flex flex-col gap-3 p-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex gap-6 justify-between items-center">
                        <p className="text-slate-900 dark:text-white text-sm font-semibold uppercase tracking-wider">Step 2 of 4</p>
                        <p className="text-primary text-sm font-bold">50% Complete</p>
                    </div>
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 h-2 w-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: '50%' }}></div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Identity Verification</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Verify your identity</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                            Upload a clear photo of your government-issued ID so we can verify your identity and keep the StudentNest community safe.
                        </p>
                    </div>

                    {/* Security notice */}
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-8">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        <div className="text-sm">
                            <p className="font-bold text-slate-900 dark:text-white">Your data is secure</p>
                            <p className="text-slate-500 dark:text-slate-400">Encrypted transmission &amp; secure storage. Only verified staff can access your documents.</p>
                        </div>
                    </div>

                    {/* Alerts */}
                    {validationError && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{validationError}</p>
                        </div>
                    )}
                    {uploadError && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{uploadError}</p>
                        </div>
                    )}

                    {/* Upload area */}
                    <div className="mb-8">
                        {/* Hidden file input */}
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="sr-only"
                            onChange={handleFileChange}
                        />

                        {!file ? (
                            // Drop zone
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => inputRef.current?.click()}
                                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`flex flex-col items-center gap-6 rounded-xl border-2 border-dashed px-6 py-14 cursor-pointer transition-colors
                                    ${isDragging
                                        ? 'border-primary bg-primary/5'
                                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary hover:bg-primary/5'
                                    }`}
                            >
                                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-slate-900 dark:text-white text-lg font-bold text-center">
                                        {isDragging ? 'Drop your file here' : 'Upload ID Document'}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                                        Drag and drop or click to browse<br />
                                        JPG, PNG or PDF — max {MAX_SIZE_MB}MB
                                    </p>
                                </div>
                                <Button variant="primary" className="min-w-[140px] px-6 py-3" type="button">
                                    Select File
                                </Button>
                            </div>
                        ) : (
                            // File preview card
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {preview ? (
                                    <div className="relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center h-56">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={preview} alt="ID preview" className="max-h-56 max-w-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32 bg-slate-100 dark:bg-slate-800">
                                        <span className="material-symbols-outlined text-5xl text-slate-400">picture_as_pdf</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-4 px-5 py-4 bg-white dark:bg-slate-900">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="material-symbols-outlined text-primary text-2xl shrink-0">
                                            {fileIcon(file.type)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4 mb-8">
                        <p className="text-slate-900 dark:text-white font-semibold text-sm uppercase tracking-wide">Requirements</p>
                        <div className="grid gap-3">
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white text-sm font-medium">Valid ID Document</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs">National ID Card, Passport, or Driver's License</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                <div>
                                    <p className="text-slate-900 dark:text-white text-sm font-medium">Clearly visible &amp; not expired</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs">No glare, blur, or cropping of important details</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-4">
                        <Button
                            variant="secondary"
                            className="gap-2 px-6 py-3"
                            type="button"
                            onClick={() => router.back()}
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1 gap-2 px-8 py-3"
                            type="button"
                            disabled={!file || isLoading}
                            onClick={handleSubmit}
                        >
                            {isLoading ? 'Uploading...' : 'Submit for Review'}
                            {!isLoading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
