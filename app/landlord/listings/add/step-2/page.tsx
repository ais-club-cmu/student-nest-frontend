import React from 'react';
import Link from 'next/link';

export default function AddListingStepTwoPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col bg-background-light dark:bg-slate-950/50 font-display">
            {/* Header Section */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-40 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="text-primary">
                        <span className="material-symbols-outlined text-3xl">domain</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">StudentNest</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="hidden md:flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                        Save Draft
                    </button>
                    <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">person</span>
                    </button>
                </div>
            </header>

            <main className="flex flex-1 justify-center py-8 px-4 md:px-0">
                <div className="flex flex-col max-w-[800px] flex-1">
                    {/* Form Container */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">

                        {/* Progress Section */}
                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Amenities &amp; Details</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step 2 of 5: Property specifics</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary text-lg font-bold">40%</p>
                                    <p className="text-slate-400 text-xs uppercase tracking-wider">Complete</p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
                            </div>
                        </div>

                        {/* Main Form */}
                        <form className="space-y-10">
                            {/* Bills Included */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Bills Included</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">Electricity</span>
                                        <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="bills_electricity" />
                                    </label>
                                    <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">Internet (High-speed)</span>
                                        <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="bills_internet" />
                                    </label>
                                    <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">Gas</span>
                                        <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="bills_gas" />
                                    </label>
                                    <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">Water &amp; Sewage</span>
                                        <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="bills_water" />
                                    </label>
                                    <label className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">Security/Maintenance</span>
                                        <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="bills_security" />
                                    </label>
                                </div>
                            </section>

                            {/* Features & Appliances */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">countertops</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Features &amp; Appliances</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="feature_microwave" />
                                        <span className="text-slate-700 dark:text-slate-300">Microwave</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="feature_washingmachine" />
                                        <span className="text-slate-700 dark:text-slate-300">Washing Machine</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="feature_waterheater" />
                                        <span className="text-slate-700 dark:text-slate-300">Water Heater</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="feature_ac" />
                                        <span className="text-slate-700 dark:text-slate-300">Air Conditioning</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="feature_fridge" />
                                        <span className="text-slate-700 dark:text-slate-300">Fridge</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                        <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" name="feature_stove" />
                                        <span className="text-slate-700 dark:text-slate-300">Kitchen Stove</span>
                                    </label>
                                </div>
                            </section>

                            {/* Furnishing Status */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">chair</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Furnishing Status</h3>
                                </div>
                                <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-md">
                                    <label className="cursor-pointer">
                                        <input className="sr-only peer" name="furnishing" type="radio" value="unfurnished" />
                                        <div className="text-center py-2.5 rounded-lg text-sm font-semibold text-slate-500 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-primary peer-checked:shadow-sm transition-all">
                                            Unfurnished
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input defaultChecked className="sr-only peer" name="furnishing" type="radio" value="semi-furnished" />
                                        <div className="text-center py-2.5 rounded-lg text-sm font-semibold text-slate-500 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-primary peer-checked:shadow-sm transition-all">
                                            Semi
                                        </div>
                                    </label>
                                    <label className="cursor-pointer">
                                        <input className="sr-only peer" name="furnishing" type="radio" value="furnished" />
                                        <div className="text-center py-2.5 rounded-lg text-sm font-semibold text-slate-500 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-primary peer-checked:shadow-sm transition-all">
                                            Furnished
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* Important Notes */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Important Notes</h3>
                                </div>
                                <textarea
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:border-primary focus:ring-primary resize-y"
                                    placeholder="Add any additional details, house rules, or specific terms..."
                                    rows={4}
                                    name="important_notes"
                                ></textarea>
                                <p className="text-xs text-slate-400 mt-2 italic">Visible to potential tenants on the listing details page.</p>
                            </section>
                        </form>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between mt-4">
                        <Link href="/landlord/listings/add" className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </Link>
                        <div className="flex gap-4">
                            <button className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                Cancel
                            </button>
                            <button className="flex items-center gap-2 px-10 py-3 rounded-lg font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                Next Step
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="mt-12 mb-8 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
                        <div className="flex justify-center flex-wrap gap-4 sm:gap-8 text-slate-400 text-xs font-semibold uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span className="size-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px]">1</span>
                                Location
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                                <span className="size-6 rounded-full border-2 border-primary flex items-center justify-center text-[10px]">2</span>
                                Amenities
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px]">3</span>
                                Media
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px]">4</span>
                                Pricing
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
