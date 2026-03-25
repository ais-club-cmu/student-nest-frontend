import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandlordPendingPage() {
    return (
        <div className="flex flex-1 justify-center py-8 md:py-12 px-4 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[640px] flex-1">
                {/* Progress Indicator */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
                    <div className="bg-primary h-full w-[100%] rounded-full"></div>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center gap-4 mb-10">
                    <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-5xl">verified_user</span>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                        Verification Pending
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">
                        Your application has been received and is currently being reviewed by our compliance team.
                    </p>
                </div>

                {/* OTP Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-6">
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-center">
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Contact Verification</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter the 6-digit OTP sent to your registered phone number</p>
                        </div>

                        <fieldset className="relative flex gap-2 md:gap-4 justify-center">
                            {['4', '8', '2', '', '', ''].map((val, i) => (
                                <input
                                    key={i}
                                    className="flex h-12 md:h-14 w-10 md:w-12 text-center [appearance:textfield] focus:outline-none focus:ring-2 focus:ring-primary/20 border-0 border-b-2 border-slate-300 dark:border-slate-700 bg-transparent text-xl font-bold text-primary focus:border-primary transition-all"
                                    max="9"
                                    maxLength={1}
                                    type="number"
                                    defaultValue={val}
                                    placeholder={val ? "" : "·"}
                                    name={`otp-${i}`}
                                />
                            ))}
                        </fieldset>

                        <div className="flex flex-col items-center gap-2">
                            <button type="button" className="text-primary text-sm font-semibold hover:underline bg-transparent border-none p-0">
                                Resend Code (Available in 0:45)
                            </button>
                            <Button variant="primary" className="px-8 py-3 rounded-lg shadow-lg shadow-primary/25">
                                Verify Code
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-primary">
                            <span className="material-symbols-outlined">timer</span>
                            <span className="font-bold text-sm">48 Hour Review</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Our team manually verifies every document. Expect your final activation within 2 business days.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-green-600">
                            <span className="material-symbols-outlined">verified</span>
                            <span className="font-bold text-sm">Verified Badge</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Once approved, you'll receive the 'Verified Landlord' badge, boosting tenant trust by up to 60%.
                        </p>
                    </div>
                </div>

                {/* Visual Asset */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                    <img
                        alt="Professional landlord workspace"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvUfOjt5k-RSEi1RuyEVNer52xv-idLMmQaS9QBWyqWRM7OKpDiYLcFOUFskZ-3LxREcFMnJkcKUeHVGsSVNjitLk7ffS63novl4GDpX7uFCIVl1xShgJGQvjZPbBpsHmVFX6nZoslemzY4SW2HgclGApZaghWPAeofsK3SuSJbjqKdy5vCU41MpeyTxR_EzsvG8OoVWTIDZyn2TNF7UApGlg0fe5GzuUXo40Jqk89-KJ4qk6l-oaaPP_qwX3Ec68xpi4_o8NUiZKP"
                    />
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                        <div className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded">Security First</div>
                        <div className="text-white text-xs font-medium">Protecting the integrity of our marketplace</div>
                    </div>
                </div>

                {/* Support Link */}
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Have questions about your registration?
                        <Link className="text-primary font-semibold hover:underline ml-1" href="#">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
