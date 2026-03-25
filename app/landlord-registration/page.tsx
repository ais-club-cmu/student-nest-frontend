import React from 'react';
import { Button } from '@/components/ui/Button';

export default function LandlordRegistrationPage() {
    return (
        <div className="flex-grow flex items-center justify-center p-4 md:p-8 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Landlord Registration</h1>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Step 1 of 4</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-1/4"></div>
                    </div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                        Please provide your personal identification details to begin your journey with StudentNest.
                    </p>
                </div>

                {/* Registration Form */}
                <form className="p-8 space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="full_name">Full Name</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person</span>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                id="full_name"
                                name="full_name"
                                placeholder="Enter your full legal name"
                                type="text"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">mail</span>
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                    id="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="phone">Phone Number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-300 border-r-0 dark:border-slate-700 rounded-l-lg">
                                    +250
                                </span>
                                <input
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                    id="phone"
                                    name="phone"
                                    placeholder="7XX XXX XXX"
                                    type="tel"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* ID Number */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="id_number">National / Residence ID Number</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">badge</span>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                id="id_number"
                                name="id_number"
                                placeholder="1 19XX X XXXXXXX X XX"
                                type="text"
                                required
                            />
                        </div>
                        <p className="text-[11px] text-slate-500 italic">Format: 16 digits as appearing on your ID card.</p>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="address">Home / Business Address</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-4 text-slate-400 text-sm">location_on</span>
                            <textarea
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white resize-y"
                                id="address"
                                name="address"
                                placeholder="Street name, Sector, District, Province"
                                rows={3}
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                        <Button variant="ghost" className="px-6 py-3" type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" className="flex-grow md:flex-none md:min-w-[160px] px-8 py-3 flex items-center justify-center gap-2" type="submit">
                            Next Step
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
