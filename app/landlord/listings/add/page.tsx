import React from 'react';
import Link from 'next/link';

export default function AddListingStepOnePage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col">
            {/* Header Section */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                        </svg>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">StudentNest</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                        Cancel
                    </button>
                </div>
            </header>

            <main className="flex flex-1 justify-center py-8 px-4 md:px-0">
                <div className="flex flex-col max-w-[720px] flex-1">
                    {/* Progress Bar Component */}
                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex gap-6 justify-between items-end">
                            <div>
                                <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Add New Listing</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Property Basics</p>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold">Step 1 of 4</p>
                                <p className="text-primary text-xs font-medium uppercase tracking-wider">25% Complete</p>
                            </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '25%' }}></div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        {/* Property Title */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-slate-100 text-base font-semibold">Property Title</label>
                            <input
                                className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base transition-all"
                                placeholder="e.g. Modern Studio near University Gate 2"
                                type="text"
                            />
                            <p className="text-slate-500 text-xs">Use a clear, descriptive title to attract students.</p>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-slate-100 text-base font-semibold">Category</label>
                            <div className="relative">
                                <select defaultValue="" className="flex w-full appearance-none rounded-lg text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base">
                                    <option disabled value="">Select property type</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="studio">Studio</option>
                                    <option value="private-room">Private Room</option>
                                    <option value="shared-room">Shared Room</option>
                                    <option value="dorm">Dormitory</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-900 dark:text-slate-100 text-base font-semibold">Location</label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">location_on</span>
                                <input
                                    className="flex w-full pl-10 pr-4 rounded-lg text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 text-base"
                                    placeholder="Enter property address or city"
                                    type="text"
                                />
                            </div>

                            {/* Placeholder Map Picker */}
                            <div className="mt-3 relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                <img
                                    className="w-full h-full object-cover opacity-80"
                                    data-alt="Interactive map for location selection"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2XHcuhK6-p2g_GNJunV9JXJh1JV3qxAb2ixmlZvC5BumyFLwDQDLfp3Imn9L23LMCqyIzmu09fVabUWA0I_8d4wtK1Xxg17VIDx2EGHiOn9vnWO_fdXDoKGRGtzmS6r3DtJU_hsHOiHLvTHl6tv_IHh4fTGDoNjavS30O0dtwqiTd9WCFLxoVdIDUlhdOKYjpLHiN9w-QFtlhP-pnjYzjwff5ZFyRmcukV6gNYFdRG4kTruCnH-SEd0aSgBqM3WMzNvbQK1yGJM1T"
                                    alt="Map Location Placeholder"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg border border-primary/20">
                                        <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <button className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">fullscreen</span>
                                        Full Map
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rooms Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-100 text-base font-semibold">Total Rooms</label>
                                <div className="relative flex items-center">
                                    <button type="button" className="absolute left-2 size-8 flex items-center justify-center text-slate-400 hover:text-primary z-10">
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <input
                                        className="flex w-full text-center rounded-lg text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 text-base"
                                        type="number"
                                        defaultValue="1"
                                    />
                                    <button type="button" className="absolute right-2 size-8 flex items-center justify-center text-slate-400 hover:text-primary z-10">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs">Total bedrooms in the entire property.</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-100 text-base font-semibold">Available for Rent</label>
                                <div className="relative flex items-center">
                                    <button type="button" className="absolute left-2 size-8 flex items-center justify-center text-slate-400 hover:text-primary z-10">
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <input
                                        className="flex w-full text-center rounded-lg text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-1 focus:ring-primary h-12 text-base"
                                        type="number"
                                        defaultValue="1"
                                    />
                                    <button type="button" className="absolute right-2 size-8 flex items-center justify-center text-slate-400 hover:text-primary z-10">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                </div>
                                <p className="text-slate-500 text-xs">Number of rooms you want to list now.</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Footer */}
                    <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button className="flex items-center gap-2 px-6 h-12 rounded-lg text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </button>
                        <button className="flex items-center justify-center min-w-[140px] px-8 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                            Next Step
                        </button>
                    </div>
                </div>
            </main>

            {/* Small Footer */}
            <footer className="py-6 px-10 text-center">
                <p className="text-slate-400 text-xs">© 2024 StudentNest Housing Solutions. Secure &amp; Verified Listings.</p>
            </footer>
        </div>
    );
}
