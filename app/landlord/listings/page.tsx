import React from 'react';
import Link from 'next/link';

export default function LandlordListingsPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] font-display bg-background-light dark:bg-slate-950/50">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-2 text-white">
                        <span className="material-symbols-outlined block">home_work</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none text-slate-900 dark:text-white">StudentNest</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Landlord Portal</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <Link href="/landlord" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="/landlord/listings" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                        <span className="material-symbols-outlined fill">list_alt</span>
                        <span className="text-sm font-medium">My Listings</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl">description</span>
                        <span className="text-sm font-medium">Applications</span>
                        <span className="ml-auto bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm font-medium">Payments</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="material-symbols-outlined">star</span>
                        <span className="text-sm font-medium">Reviews</span>
                    </Link>

                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 mb-20 md:mb-0">
                    <div className="flex items-center gap-3 p-2">
                        <img
                            className="size-9 rounded-full object-cover"
                            data-alt="Landlord profile headshot"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuClPJXak9r31LeAPMZyURDSwrlx1BhO-y0dOW_2Qxrfmp7ulyG8V5Yk7Dvwcp__pXho6uYfnGrX4eLlRBydhIbX9aF5GLfumKKGiQHnUdQMH0EH_7hNnE66-g3WO9JcT6wf_zBS5nWThGjsbXWQ5G8gpgMx3R8STeIzzJOgd4H0FC7ZlBYKKzhyMvKMHJ4_sggZmlI-bkv_OZuJvjn4qw1ErI-m6VzBXRCvnG7gv6yr4QoeKZDrpr9qWc4KwFq3quIiYJL8jtKm2h41"
                            alt="Profile"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-slate-900 dark:text-white">Jean Pierre</p>
                            <p className="text-xs text-slate-500 truncate">Premium Landlord</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white"
                                placeholder="Search your listings..."
                                type="text"
                                name="search"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            <span className="hidden sm:inline">Add New Listing</span>
                        </button>
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col gap-6">

                        {/* Title & Filter Bar */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Listings</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your properties and track their performance</p>
                            </div>
                            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto whitespace-nowrap">
                                <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-primary text-white transition-colors">All</button>
                                <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Active</button>
                                <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Rented</button>
                                <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Under Review</button>
                                <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Draft</button>
                            </div>
                        </div>

                        {/* Listings Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Listing Card 1: Active */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative w-full lg:w-72 h-48 lg:h-auto shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Modern studio apartment interior"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXUDfqeAk_j5rozgfZ6UidPEwtVVoY5YHk1ZZmsfA49fdGiyew7Mq5M37bWbm4UxmNZw4rvfvUCdhiQIBeGFH4r36CHgNx_YqIgkdDTZILqnowRkfCLlqq0kHNTwsWTKbxj-FOxq_CEnV7VFmk4Dz3sfzQiKDIsmXWY1i4sLIiQzZ2p8t7h9jTkekdrHnmH41U3RdlcsLRB7OtusBxlQrkfkY2I1ifv3Y_XBnm_w4tywdcShAN2tQ8hXAiGgdJE7a2u2za_6s7eJiC"
                                        alt="Property"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <span className="size-1.5 bg-emerald-500 rounded-full"></span>
                                            Active
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Modern Studio in Kigali</h3>
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1">
                                                <span className="material-symbols-outlined text-lg">location_on</span>
                                                Kacyiru, Kigali
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">$450</p>
                                            <p className="text-xs text-slate-500">per month</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-800 my-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Views</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">1,240</span>
                                        </div>
                                        <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-6">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Applications</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">15</span>
                                        </div>
                                        <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-6">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Inquiries</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">8</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex gap-2">
                                            <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Edit</button>
                                            <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Deactivate</button>
                                        </div>
                                        <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                            View Details
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Listing Card 2: Rented */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-shadow opacity-90">
                                <div className="relative w-full lg:w-72 h-48 lg:h-auto shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Luxury 2 bedroom apartment living room"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuArBD3XZKuTKbf_ZKpJVKsxTxUttM28fZ3l0aMwPAlWzZb-nBYhHUPX4p8CMNYCjpHi-MNmXc0xrLdWMLoHtWYP7BSCeGkebG8jgKFJWMh8macDlexsrZ8lErTHmSRmmogkv5hdE9UjG-Poq0ckrNIDJZUIoxRaOmsbY7vmJVKzpMKPgx_HoydeHGhMWT7x9UWV6UgJuTW3fHHaDvtJ8ZUKofLRMVugo7-0bV26sgXVSfI80ERhh3hoOZ42TyPTApFSTe0Wjks99CTo"
                                        alt="Property"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <span className="size-1.5 bg-slate-500 rounded-full"></span>
                                            Rented
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Luxury 2BR Apartment</h3>
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1">
                                                <span className="material-symbols-outlined text-lg">location_on</span>
                                                Nyarutarama, Kigali
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">$800</p>
                                            <p className="text-xs text-slate-500">per month</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-800 my-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Views</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">3,402</span>
                                        </div>
                                        <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-6">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Applications</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">42</span>
                                        </div>
                                        <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-6">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Inquiries</span>
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">12</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex gap-2">
                                            <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Edit</button>
                                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">List Again</button>
                                        </div>
                                        <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                            Manage Tenancy
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Listing Card 3: Under Review */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative w-full lg:w-72 h-48 lg:h-auto shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Charming student house exterior"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA66h-2jUjSDTZCxHreQVQ6mQLTXV4QS5Lq2NoABWKIgEJvZSjmi-3nH14CIbT_u6h33bvK_uGcGJ-zSgPX5DwoYLk6D5XrvquQheyRefWnUN903f2oVev0wDtZQqMTiYBGLt73-vzuAqzVuhG-vYPwpyvbeLCmX0qCoodu9JdLkzrq1BiHa2Yv_hCXPHMATx3QnRNzIjtknXwMv_6cw05-xeuP4_f82EUIfD-nEiuvcsgjQ_8F4JTu5297GS90iBBCv5Yl16X4RPSi"
                                        alt="Property"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <span className="size-1.5 bg-amber-500 rounded-full"></span>
                                            Under Review
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Charming Student En-suite</h3>
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1">
                                                <span className="material-symbols-outlined text-lg">location_on</span>
                                                Remera, Kigali
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">$350</p>
                                            <p className="text-xs text-slate-500">per month</p>
                                        </div>
                                    </div>

                                    {/* Info Notice */}
                                    <div className="flex items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-800 my-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg px-4">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <span className="material-symbols-outlined text-amber-500">info</span>
                                            <span className="text-sm">Listing is being verified by the StudentNest team. Usually takes 24-48h.</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex gap-2">
                                            <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Edit Draft</button>
                                            <button className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">Cancel Submission</button>
                                        </div>
                                        <button className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium">
                                            Preview Listing
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
