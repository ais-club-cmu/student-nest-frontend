import React from 'react';
import Link from 'next/link';

export default function HousingManagerApplicationsPage() {
    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950/50">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-2 text-white">
                        <span className="material-symbols-outlined block">domain</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white leading-tight">Housing Manager</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Student Housing Admin</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link href="/housing-manager" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">apartment</span>
                        <span className="text-sm font-medium">Properties</span>
                    </Link>
                    <Link href="/housing-manager/applications" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>folder_shared</span>
                        <span className="text-sm font-semibold">Applications</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm font-medium">Tenants</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm font-medium">Payments</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                            <img
                                alt="Admin Profile"
                                className="w-full h-full object-cover"
                                data-alt="Portrait of a professional male administrator"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOk7uqwgBykP3ihMdGao7XhUZw9iMIJTo5pm3QiiUNEBHPZQxhQkoCqTShfn38ar52t3tVKdCMeiHUWV4wFN2FpJsUAe0OviScqQis5Ey8LLRi9YwpM9rx2tIsRKbGnPaIrSivWHlN2kJ6e9HZVMjZbOOwN2s4hm9sKr24Q0lUgxn2h9m6suo6s_ZvxtOHnLmJKQReQ21uO7cGVWw_Tkin_WDK85hdDFxHSTihQ0j_6h22E82NPgsvoPMK2-YGFY58aaIBzNF-jKnB"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">James Wilson</p>
                            <p className="text-xs text-slate-500 truncate">Settings</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">settings</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applications Management</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white outline-none"
                                placeholder="Search applications..."
                                type="text"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Export
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-6">
                    {/* Page Title & Stats */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Student Applications</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage 128 active housing requests.</p>
                        </div>
                    </div>

                    {/* Tabs/Filters */}
                    <div className="border-b border-slate-200 dark:border-slate-800">
                        <nav className="flex gap-8 overflow-x-auto whitespace-nowrap">
                            <button className="border-b-2 border-primary text-primary pb-4 text-sm font-bold flex items-center gap-2 transition-colors">
                                All <span className="bg-primary/10 px-2 py-0.5 rounded-full text-xs">128</span>
                            </button>
                            <button className="border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 pb-4 text-sm font-bold flex items-center gap-2 transition-colors">
                                Pending <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">42</span>
                            </button>
                            <button className="border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 pb-4 text-sm font-bold flex items-center gap-2 transition-colors">
                                Interviewing <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">18</span>
                            </button>
                            <button className="border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 pb-4 text-sm font-bold flex items-center gap-2 transition-colors">
                                Approved <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">68</span>
                            </button>
                        </nav>
                    </div>

                    {/* Search & Filters Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                                placeholder="Search by name, university, or cohort..."
                                type="text"
                            />
                        </div>
                        <button className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm bg-white dark:bg-slate-900">
                            <span className="material-symbols-outlined text-lg">filter_list</span>
                            Filters
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Education</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Target Property</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Applied</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        alt="Kofi"
                                                        className="w-full h-full object-cover"
                                                        data-alt="Student profile photo of a smiling young man"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPVEjZKIzI71VP2NFL_OLoeulclZ3gByaRTuLoLBBHfdcAW-Sw1aJUnAEoPFkNCKqvnezM-0etwGQaC9xziYcmesTbxNKtS9qmgLaoBgSxfevnsIaj_OtOQYeNt6-o-6mdAIZxGq4LDZEayF9c6htHyEbNk-aIZjksjc0OnmsvMe8bp7CUtfktR13yC6t-qLPw0zA-HoCY-shRNUoMGTtTtQEuJP3K41M--RsCtpD2SnLQiP36bUzQFWe3dRUf511fuyROz-XZbgW1"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Kofi Mensah</p>
                                                    <p className="text-xs text-slate-500">kofi.m@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">CMU-Africa</span>
                                                <span className="text-xs text-slate-500">MSIT 2024</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">Serene Heights Apts</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            Oct 12, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-bold text-sm transition-colors">View Details</button>
                                        </td>
                                    </tr>

                                    {/* Row 2 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        alt="Amina"
                                                        className="w-full h-full object-cover"
                                                        data-alt="Student profile photo of a young woman wearing a hijab"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt6bOGPrAH63AUglJCw-nOGFWP8RHuiIlGBwQuLvmHNBmh4-GpwkSGmNFQy0mC8hZiMYByoH63OHHt9YsywgTunHpHW-l7QHwiWphcpRlhauRzE9FVthl53GK0jjjpQ0e2Jz6zm4B25nLk4vNz3U-kgZdUdQek3sQWLzR7FEEyzuqfbjaTkfcpqHlc7LDH193J_DnoWadw5hYhLBXkse-Bidp_0YBLb3_eHwzdhmCo5qFbIANXVjRdRUJKuA7kkXGbfHKdi42jhquC"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Amina Diallo</p>
                                                    <p className="text-xs text-slate-500">amina.d@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">ALU</span>
                                                <span className="text-xs text-slate-500">Software Eng 2025</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">Global Student Village</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                Interviewing
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            Oct 10, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-bold text-sm transition-colors">View Details</button>
                                        </td>
                                    </tr>

                                    {/* Row 3 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        alt="Jean"
                                                        className="w-full h-full object-cover"
                                                        data-alt="Student profile photo of a young man with glasses"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB755XQxdiyeIsjnSUPRc7WbUKPOhWWgEwBYjSM6ZaPt-Ye_jYAM3VINGjkF2_l2y2YjWW6_wW2lK2ntaeeaCzFPc4-89uJIMgBBXpN3GXzm0M7sUZuPzAs1RxARL8pCYjmQdLJMos3n0Cxsq_vtwAHzBJuVIrS4zGjXt0wPTqJuutP5O8V_yuV2O57Mfxh6SSowqQRzdkAtsVHGCDizBPJ5OhHw0Umn4_cTx6F4WuhimNpYBLItflRKiMLsDcqOCTUiBEiiwwXhRs2"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Jean-Luc Bizimana</p>
                                                    <p className="text-xs text-slate-500">j.bizimana@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">CMU-Africa</span>
                                                <span className="text-xs text-slate-500">MSE-AI 2024</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">Skyline Residency</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                Approved
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            Oct 08, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-bold text-sm transition-colors">View Details</button>
                                        </td>
                                    </tr>

                                    {/* Row 4 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        alt="Sarah"
                                                        className="w-full h-full object-cover"
                                                        data-alt="Student profile photo of a smiling young woman"
                                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdaq2YfH2FgOUDdMAZXEOFUxXTR4zUlUHbM8CXiRDUaDIV6HqPLI2nlDSWLMvibk8-EqyqluZ3tChh2TiZs8m4VhbRjciglfrVt0_iR1P2oiLZDzPj_L1Db8R_vCwJCV5ZXBlxKYBNgRtzLoiVC3b_Xom2R-D2zkAH5SU_hPLRWjmS5RRb1KQj6sfmdXthCa0D_eFYoDuy6NKsGmOaPeWNW7VMP2wsqM0leQR0CO0EJcskgGj5PnN1HDVZxfzSyPK_aF6I6wr6eoZb"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Sarah Okon</p>
                                                    <p className="text-xs text-slate-500">s.okon@example.com</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">ALU</span>
                                                <span className="text-xs text-slate-500">Entrepreneurship 2024</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">Serene Heights Apts</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                                Rejected
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            Oct 05, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary hover:text-primary/80 font-bold text-sm transition-colors">View Details</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Showing 1 to 10 of 128 entries</p>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Previous</button>
                                <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold shadow-sm">1</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">2</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">3</button>
                                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
