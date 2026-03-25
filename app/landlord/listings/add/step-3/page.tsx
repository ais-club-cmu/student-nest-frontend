import React from 'react';
import Link from 'next/link';

export default function AddListingStepThreePage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col bg-background-light dark:bg-slate-950/50 font-display">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-40 py-4 bg-white dark:bg-slate-900 sticky top-0 z-50">
                <div className="flex items-center gap-3 text-primary">
                    <span className="material-symbols-outlined text-3xl">apartment</span>
                    <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">StudentNest</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="flex items-center">
                        <button className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors">
                            Cancel &amp; Exit
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center py-10 px-4">
                <div className="w-full max-w-[800px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-primary/5 p-6 md:p-10">

                    {/* Progress Bar Section */}
                    <div className="flex flex-col gap-3 mb-10">
                        <div className="flex gap-6 justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Final Step</span>
                                <p className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight">Step 3: Room Types &amp; Pricing</p>
                            </div>
                            <p className="text-primary text-sm font-bold leading-normal">100%</p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-primary/10">
                            <div className="h-2 rounded-full bg-primary" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    <form className="space-y-10">
                        {/* Room Details Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">bed</span>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Room Details</h3>
                            </div>
                            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="h-5 w-5 rounded border border-primary/30 bg-transparent text-primary focus:ring-primary focus:ring-offset-0 focus:outline-none cursor-pointer" type="checkbox" name="fully_ensuite" />
                                    <div className="flex flex-col">
                                        <span className="text-slate-900 dark:text-slate-100 text-base font-semibold group-hover:text-primary transition-colors">Fully ensuite</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm">Room includes a private attached bathroom</span>
                                    </div>
                                </label>
                            </div>
                        </section>

                        {/* Gender Preference Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">group</span>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Gender Preference</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label className="relative flex items-center justify-center p-4 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/40 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                    <input className="sr-only" name="gender" type="radio" value="male" />
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined">male</span>
                                        <span className="font-medium">Male</span>
                                    </div>
                                </label>
                                <label className="relative flex items-center justify-center p-4 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/40 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                    <input className="sr-only" name="gender" type="radio" value="female" />
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined">female</span>
                                        <span className="font-medium">Female</span>
                                    </div>
                                </label>
                                <label className="relative flex items-center justify-center p-4 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-800 hover:border-primary/40 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                    <input defaultChecked className="sr-only" name="gender" type="radio" value="any" />
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined">diversity_3</span>
                                        <span className="font-medium">Any</span>
                                    </div>
                                </label>
                            </div>
                        </section>

                        {/* Monthly Rent Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">payments</span>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Monthly Rent Amount</h3>
                            </div>
                            <div className="relative max-w-sm">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 dark:text-slate-400 text-lg font-medium">$</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-20 py-3 rounded-xl border border-primary/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-primary focus:ring-1 outline-none text-lg font-semibold transition-all"
                                    placeholder="0.00"
                                    type="number"
                                    name="monthly_rent"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 dark:text-slate-400 text-sm">/ month</span>
                                </div>
                            </div>
                        </section>

                        {/* Photo Upload Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                                <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">Property Photos</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors group">
                                    <span className="material-symbols-outlined text-primary text-3xl mb-2 group-hover:scale-110 transition-transform">upload_file</span>
                                    <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Upload</span>
                                </div>

                                {/* Uploaded Image 1 */}
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 relative">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Modern student bedroom with desk and bed"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQkXbQcSsagIjtHbczg-mE5YkpTlbZULvo2iuORcalMil4OnaNlDkM_9lgL9JMkMmTok-qJ8gOTVcjX8UktzVo8aoQ3XGqxUqrh4ayGI4IlNwao8FQad44_WReeKHKml8UsmZbqYl9hQJsvmVWhuMRpLFIb1s-y8Rq3SQckWyoDJNijcuCs3Np3d8VCO5w3VUoCOe3BduftlWHFTjM2WBjxZGW2W0YiE_VCSC8BVI2uJD5WUx5iQQfw7iqALiLNNF-Q5SZaSmE9jnL"
                                        alt="Uploaded Room Photo 1"
                                    />
                                    <button type="button" className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-slate-900 hover:bg-white transition-colors">
                                        <span className="material-symbols-outlined text-sm block">close</span>
                                    </button>
                                </div>

                                {/* Uploaded Image 2 */}
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 relative">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Clean minimalist bathroom with white tiles"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuFbZL6KNPgYzXHEHsw2wt8Co9WQzavFQzVwKSxyiqKZf21fir28Jn8w90YaiiNLK4usUJii5VxXepWSYgxRVCiQ9vQWx6FrHm7FCFu9SsEN5Mf1NnBitTZRoo2ZuzYXCWO6rpDvKEPLukmqxTZWaVRYCgbQtG_0pVIMxovqRiDZxXZLi2cFM0--TxVkDUFFrEMF7aAcNNSRXlur49gDD0trFc-ODSGSsitDt-B8aDhBbKla_ydwdSN9_XIbW7681Iv1_9cnKur5En"
                                        alt="Uploaded Room Photo 2"
                                    />
                                    <button type="button" className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-slate-900 hover:bg-white transition-colors">
                                        <span className="material-symbols-outlined text-sm block">close</span>
                                    </button>
                                </div>

                                {/* Uploaded Image 3 */}
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 relative">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Compact modern kitchen area for students"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGFgP1cYwriJWkdJWcICdH-FGmExjxSNla7mVPVKcVGcfk8_L0_RaVs2NGYFrPEVvKWGbY51MWb7Divfq2F0eLgFo1wVY0sjAigCgw9PmZFoSQkZLRs4QE_wTyg8jltdmb-vpqM0sLXhvnncGZKFXBRC5B9ZnxJjaZ6_ajwTSwmonM_e9veL2QIGOGWB19Ffbu5uS5E8G14LB0sdgH3EV2-_b7EIJjwZcaqJoV-Y5WjYoAJnGAzYSiacsj_RLXTePz59bIqA2GEuzz"
                                        alt="Uploaded Room Photo 3"
                                    />
                                    <button type="button" className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-slate-900 hover:bg-white transition-colors">
                                        <span className="material-symbols-outlined text-sm block">close</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Navigation Footer */}
                        <div className="flex flex-col md:flex-row items-center justify-between pt-10 gap-4 border-t border-primary/10">
                            <Link href="/landlord/listings/add/step-2" className="w-full md:w-auto px-8 py-3 rounded-xl border border-primary/20 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                Back
                            </Link>
                            <button className="w-full md:w-auto px-10 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2" type="submit">
                                Submit Listing
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="px-6 md:px-40 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                <p>© 2024 StudentNest. All rights reserved. Secure listing management.</p>
            </footer>
        </div>
    );
}
