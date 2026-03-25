import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950/50">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
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
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white shadow-sm shadow-primary/20 transition-all">
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                        <span className="text-sm font-medium">Student Verifications</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">domain_verification</span>
                        <span className="text-sm font-medium">Landlord Approvals</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                        <span className="text-sm font-medium">Housing Analytics</span>
                    </Link>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Logged in as</p>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover shrink-0"
                                data-alt="University Administrator Profile Image"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmWyV1DQL-pdBsPjd1zSmgdh096pAxike1GiL1xcnb9flQkzZunJ5vHXYYb08GgWJ85JL0XC0Mor9hKfppxS49b5h0ADu68gHex7EQ-69tavwidzZ4WpkShynuaQ3wQhT52HOHBvaV6s6dRGmcyr4YDqKo2pp82y1mFPUoOE_HStntXU5qnpia4xtKfWRCOI1IWmYet42jobxiy5-8Zzp26TayU5lPgoLegpxvWiXIQx6rL-p1Jxw4SORGz9kaHdPWONM7tx3jbpGO')" }}
                            ></div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">Dr. David K.</p>
                                <p className="text-[10px] text-slate-500 truncate">Dean of Students</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-slate-400">school</span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">CMU-Africa</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative group p-1">
                            <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-primary transition-colors block">notifications</span>
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Admin Portal</p>
                                <p className="text-xs text-slate-500">Kigali Campus</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
                    {/* Metrics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined block">group</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+5.2%</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Verified Students</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">1,240</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined block">map</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+2.4%</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Listings</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">85</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                    <span className="material-symbols-outlined block">pending_actions</span>
                                </div>
                                <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Attention</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Verifications</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">12</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                    <span className="material-symbols-outlined block">handshake</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+12%</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Successful Matches</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">450</h3>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Verification & Flagged */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Verification Table */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pending Student Verifications</h3>
                                    <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Student Name</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">University Email</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Department</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">Jean Doe</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">j.doe@andrew.cmu.edu</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">Information Tech</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Activate</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">Alice Keza</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">akeza@andrew.cmu.edu</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">Engineering</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Activate</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">Bob Smith</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">bsmith@andrew.cmu.edu</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">Business Management</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Activate</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Flagged Listings */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Flagged Listings</h3>
                                </div>
                                <div className="p-6 space-y-4">

                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 relative group overflow-hidden">
                                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                                            <img
                                                className="w-full h-full object-cover"
                                                data-alt="Apartment Interior with modern furniture"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCThH2Ps_yK0O9Pti7fSdx18EQWeWvw2hGXRPNaUziEXQ0gm1I36NBv1aQ5OP9o9Kv_aVmGpPXpGeb0f9uYpTq4EpemB3SCLAEFzP63_yc_Xvu2uSElnnaNBds6fDmVYhonOgb8VrP8sgyGZVTyc-993YSWikCYkTRW_mxjS6KwDdjkfbz_K1ug88NUMB8KpfUoffSIhwQ1CdK3xOOkY3BrMvkP5LC12MPJKimxPjagCWjxkoVT_khyOsoNJXgwyltAnXpFsmPP_jMp"
                                                alt="Flagged Listing 1"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">Modern Studio near Bumbogo</h4>
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium truncate">Reason: Incorrect Pricing / Student Scam Report</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0">
                                            <img
                                                className="w-full h-full object-cover"
                                                data-alt="Minimalist cozy living room space"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfiNAv4TOXIqzTmgfN-QUenzst6vGcR2xwF5m0BkztaGiwZ4HgLVF87KMtU5SHSKEeeYneh2V4yLG6cxpBkkIUCuXwaqrY0C6NIFlbumPFA74Hy37H8r_WPZU9nujXCscH3xTH4sX972KHKSXhkuzwtinwJsx888q1OROu2OEJCVkRjOL26GuKHtwVLkXA-W0RuC-wTrLIJSbZ4UOm6wkebgagJPAvjwY7F9HFOjBq4XTvV5fZ1LjR6glXO0Vx5Xx7qI9xMmYCKOD6"
                                                alt="Flagged Listing 2"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">Cozy Room for Graduate Students</h4>
                                            <p className="text-xs text-slate-500 font-medium truncate">Reason: Amenities not as described</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                            </button>
                                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Right Column: Charts & Activity */}
                        <div className="space-y-8">

                            {/* Housing Status Chart Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Housing Status</h3>

                                {/* Donut Chart Data */}
                                <div className="relative w-48 h-48 mx-auto">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-100 dark:text-slate-800"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray="100, 100"
                                            strokeWidth="3"
                                        ></path>
                                        <path
                                            className="text-primary"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeDasharray="68, 100"
                                            strokeWidth="3"
                                        ></path>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">68%</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Matched</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/30"></span>
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Found Housing</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">843 Students</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Still Searching</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">397 Students</span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    View Analytics Report
                                </button>
                            </div>

                            {/* Neighborhood Activity Map Preview */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Neighborhood Activity</h3>
                                    <p className="text-xs text-slate-500 mt-1">Highest listing density in Bumbogo</p>
                                </div>
                                <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                                    <img
                                        className="w-full h-full object-cover opacity-50 dark:opacity-30"
                                        data-alt="Stylized map showing neighborhood data points"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhEbx9hf0OeWzwxm-F_G_vubjlzJ4m46uX1ODkgR73mcoxUaLVeza_dxjHJ-qX6m5foErhqh6AwRGyV2vfXzfh1TcFltp4bls49wzK0EI1SEgFtUeY1RU_RXnNHySD1uVxGas69LwNT9sC_AQRwQgUPpmrgwGAlCH_YJ-XOpyA6La2zNQqXDuglwGLMB02xnrgBoplKMW2cQ_AjU_bWT_WyBrpMNq3XKRq_k8rDbYiSr5iggCvYEn7wiwM6MzMuQ3pxcxMqdu75-lt"
                                        alt="Map showing listing density"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex flex-col items-center">
                                            <div className="p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/40 animate-pulse flex items-center justify-center">
                                                <span className="material-symbols-outlined block">location_on</span>
                                            </div>
                                            <span className="text-xs font-bold mt-2 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-2 py-1 rounded shadow-sm backdrop-blur-md">Bumbogo Campus</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-600 dark:text-slate-300">Kacyiru</span>
                                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[45%]"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium text-slate-600 dark:text-slate-300">Nyarutarama</span>
                                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[70%]"></div>
                                        </div>
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
