import React from 'react';
import { Button } from '@/components/ui/Button';

export default function LandlordIDVerificationPage() {
    return (
        <div className="flex flex-1 justify-center py-10 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[720px] flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

                {/* Progress Indicator */}
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

                {/* Main Content */}
                <div className="p-8">
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Verify your identity</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                            To ensure the safety of our property community and comply with regulations, please upload a clear photo of your government-issued identification.
                        </p>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-8">
                        <span className="material-symbols-outlined text-primary">lock</span>
                        <div className="text-sm">
                            <p className="font-bold text-slate-900 dark:text-white">Your data is secure</p>
                            <p className="text-slate-500 dark:text-slate-400">Encrypted transmission &amp; secure storage. Only verified staff can access your documents.</p>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="flex flex-col mb-8">
                        <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-14 hover:border-primary transition-colors cursor-pointer group">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <div className="flex max-w-[480px] flex-col items-center gap-2">
                                <p className="text-slate-900 dark:text-white text-lg font-bold text-center">Upload ID Document</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm text-center">Drag and drop or click to browse. <br />Supports JPG, PNG or PDF (Max 5MB)</p>
                            </div>
                            <Button variant="primary" className="min-w-[140px] px-6 py-3">
                                Select File
                            </Button>
                        </div>
                    </div>

                    {/* Requirements Checklist */}
                    <div className="space-y-4 mb-8">
                        <p className="text-slate-900 dark:text-white font-semibold text-sm uppercase tracking-wide">Requirements Checklist</p>
                        <div className="grid gap-3">
                            <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-primary/50 transition-colors">
                                <input defaultChecked disabled className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 dark:bg-slate-800 dark:border-slate-700" type="checkbox" />
                                <div className="flex flex-col">
                                    <span className="text-slate-900 dark:text-white text-sm font-medium">Valid ID Document</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">National ID Card, Passport, or Driver's License</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer hover:border-primary/50 transition-colors">
                                <input className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 dark:bg-slate-800 dark:border-slate-700" type="checkbox" />
                                <div className="flex flex-col">
                                    <span className="text-slate-900 dark:text-white text-sm font-medium">Visibility &amp; Expiry</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Information must be clearly visible, no glare, and not expired</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-4">
                        <Button variant="secondary" className="gap-2 px-6 py-3">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Back
                        </Button>
                        <Button variant="primary" className="flex-1 gap-2 px-8 py-3">
                            Submit for Review
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
