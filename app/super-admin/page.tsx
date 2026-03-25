import React from 'react';
import Link from 'next/link';

export default function SuperAdminConsolePage() {
    return (
        <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-slate-950/50">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-1.5 text-white shadow-sm shadow-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">nest_multi_room</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-none text-slate-900 dark:text-white">StudentNest</h1>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Super Admin</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4 px-2">Core</div>
                    <Link href="/super-admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium transition-colors">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm">Overview</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm">User Management</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">domain</span>
                        <span className="text-sm">Property Oversight</span>
                    </Link>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">Reports & Logs</div>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm">Financial Reports</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">verified_user</span>
                        <span className="text-sm">Escrow Volume</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">history</span>
                        <span className="text-sm">Audit Logs</span>
                    </Link>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-2">System</div>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm">System Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div
                            className="size-8 rounded-full bg-slate-300 bg-cover shrink-0 relative overflow-hidden"
                            data-alt="Admin user profile picture"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyOUo5khx5o89q0Dqxnc_FyjF9fxO27uXhg3SB1yHzVLZTSeA5QEuEjoOOGe9SPWLeJS8an9a0QacJoMLLNw2ZLGlU7jLrt_9A5I6zp_9s7a2x4MDEh50xDj5Hx09ykLstoVGKAP6cbMMPvH7RjxkWOqHfVowWwGOgMby5JT4me8vwX7ELMyDUMq_pu3DNCMaanytOCbHE5igbfOExOwW1a61dsxO5t2vRjlA9LEVNifGj5PAC6JG3ZlskvZgl_seSBCDGYFg4mrOr')" }}
                        ></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">Alex Sterling</p>
                            <p className="text-[10px] text-slate-500 truncate">Global Admin</p>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center justify-center p-1">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto flex flex-col relative z-10">

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Platform Overview</h2>
                        <div className="flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold shadow-sm">
                            <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                            SYSTEMS NORMAL
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input
                                className="bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm w-64 lg:w-80 focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-white transition-all outline-none"
                                placeholder="Search accounts, properties..."
                                type="text"
                            />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-8 space-y-8 flex-1 max-w-[1600px] w-full mx-auto">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg shadow-sm">
                                    <span className="material-symbols-outlined">groups</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">+12.4%</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Active Users</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">24,502</h3>
                            </div>
                            <div className="flex gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-tighter flex-wrap">
                                <span>14k Students</span>
                                <span>•</span>
                                <span>8k Landlords</span>
                                <span>•</span>
                                <span>2k Uni</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg shadow-sm">
                                    <span className="material-symbols-outlined">holiday_village</span>
                                </div>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">5.2% New</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Listings</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,280</h3>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                                <div className="bg-primary h-full w-3/4"></div>
                                <div className="bg-orange-400 h-full w-1/4"></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-semibold">
                                <span className="text-slate-500 uppercase">960 Active</span>
                                <span className="text-slate-500 uppercase">320 Pending</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg shadow-sm">
                                    <span className="material-symbols-outlined">account_balance_wallet</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">+18% MoM</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Escrow Volume</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$450,230</h3>
                            </div>
                            <p className="text-xs text-slate-400">Current active deposits in custody</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="size-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg shadow-sm">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Target 92%</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Platform Revenue</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$85,200</h3>
                            </div>
                            <p className="text-xs text-slate-400">Fees from successful matches</p>
                        </div>
                    </div>

                    {/* Graphs and Health Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Performance Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Platform Growth</h4>
                                    <p className="text-xs text-slate-500">Transaction Volume vs New Users</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors">User Growth</button>
                                    <button className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Volume</button>
                                </div>
                            </div>

                            <div className="h-64 relative flex flex-col justify-end mt-auto">
                                <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2 px-1 sm:px-2">
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[40%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">4k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[55%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">5.5k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[45%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">4.5k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[70%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">7k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[65%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">6.5k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[85%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">8.5k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[80%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">8k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[90%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">9k Users</span>
                                    </div>
                                    <div className="w-full bg-primary/20 hover:bg-primary transition-colors h-[75%] rounded-t-sm cursor-pointer group relative">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">7.5k Users</span>
                                    </div>
                                    <div className="w-full bg-primary h-[95%] rounded-t-sm shadow-[0_0_15px_rgba(17,82,212,0.5)] cursor-pointer relative group">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">9.5k Users</span>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4 border-t border-slate-100 dark:border-slate-800 pt-2 px-1 sm:px-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Jan</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Feb</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Mar</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Apr</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">May</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Jun</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Jul</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Aug</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase truncate">Sep</span>
                                    <span className="text-[10px] text-primary font-bold uppercase truncate">Oct</span>
                                </div>
                            </div>
                        </div>

                        {/* System Health & Audit Widget */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
                            <h4 className="font-bold mb-4 text-slate-900 dark:text-white">System Health</h4>

                            <div className="space-y-4 flex-1">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-green-500">dns</span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">Main API Cluster</span>
                                            <span className="text-[10px] text-slate-500 uppercase">99.98% Uptime</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400">ACTIVE</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-green-500">database</span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">PostgreSQL DB</span>
                                            <span className="text-[10px] text-slate-500 uppercase">Latency: 14ms</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-400">ACTIVE</span>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Audit Logs</h5>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-3 text-xs">
                                            <div className="size-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-white truncate">User #8492 Suspended</p>
                                                <p className="text-slate-500 text-[10px] truncate">Action by Admin Alex • 2m ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 text-xs">
                                            <div className="size-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-white truncate">New Landlord Verification</p>
                                                <p className="text-slate-500 text-[10px] truncate">Manual review required • 15m ago</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 text-xs">
                                            <div className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-white truncate">System Update V2.4.1</p>
                                                <p className="text-slate-500 text-[10px] truncate">Automated deployment • 1h ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                                View Full History
                            </button>
                        </div>
                    </div>

                    {/* User Management Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Recent Registrations</h4>
                                <p className="text-xs text-slate-500">Last 50 users registered across the platform</p>
                            </div>
                            <div className="flex gap-2 self-start sm:self-auto">
                                <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 shadow-sm text-slate-700 dark:text-slate-300">
                                    <span className="material-symbols-outlined text-base">filter_list</span> Filter
                                </button>
                                <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-base">person_add</span> Add User
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:border-slate-800/50 dark:divide-slate-800/50">

                                    {/* Row 1 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover shrink-0"
                                                    data-alt="User avatar"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABkoANoptmsrM1CEdY2RwAE2TAXQLlVmnrC8aZfIGlkdaUNYSZJqlnz__auQdZYvA_NE26InSasr4Lfa75yF9QF98bG9vgvG6exRyW6LxdsDg7rYwcBjL9h_NwC9bswW4i1zZEDMgxzCM-Wn2mgdRTR8gZlyDdE9DQYxqaCZPZ3uXqs_9BQ-Hj_ZRgQvW5gR3xRWtXPx5iK8ZH4w_Rad4Kt5ALpRAi1B0L8FYDcYdr1cdytQIdysNSYDGpBbx8USg_O4BjHQ6Pvz-x')" }}
                                                ></div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Sarah Jenkins</span>
                                                    <span className="text-[10px] text-slate-400 uppercase truncate">sarah.j@example.com</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded uppercase">Student</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">UC Berkeley</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-500">
                                                <span className="size-1.5 rounded-full bg-green-500"></span> Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">Oct 24, 2023</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Row 2 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover shrink-0"
                                                    data-alt="User avatar"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBp9HzTGcsdMCgtvdTMHZb1i-fFzUMWi03BH3ekxZv2VatXs1WY_6hPv-1-4p1FzFAgMiaHjrP7O_cHDxnSW2v0NMt5jRH_UEiBmQhb0_r-boD9tF94s-IgiDjfkwTAgGIUf9UNHANy0JyPk-B_j3-TBgBW-lsewt-N5mZ4ZDa6SXuoQ3P0nD0V-njHumAOO-WVydDB2QzJCLRzv947fgydhl_FwFXtTwc9dXJSvdcrZjlWdwL87dyOGsThVqnPcjh7nQQAimE7Lc16')" }}
                                                ></div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">David Thompson</span>
                                                    <span className="text-[10px] text-slate-400 uppercase truncate">d.thompson@realestate.com</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-[10px] font-bold rounded uppercase">Landlord</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">N/A</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 dark:text-orange-400">
                                                <span className="size-1.5 rounded-full bg-orange-500"></span> Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">Oct 23, 2023</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Row 3 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover shrink-0"
                                                    data-alt="User avatar"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYI0rnyFwM9MQKDRO2_d17myRiyjbjqx67TR5JdOfF06hA_OI0kdfTNmsAq0QEl_IOzrOxN5Lr9C5Y_WdkxgS2FtrmMIbk06aAIeoNrGN1XskQTCnd-eflP4g8JY76Z63IgfcueYE4NY5SmCzcf945Ht5Zek8kPU0TxXoxkNEU6XPvxARykd5mRBJ-CBfhkEdX7UgaL8P--7bpZF8sUiZmNb9qk17nBZKZnE1ZSbYvsdfh5pWPyohIRGLY_61fRqCQN5JAqMgm1gm6')" }}
                                                ></div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Marcus Rivera</span>
                                                    <span className="text-[10px] text-slate-400 uppercase truncate">m.rivera@stanford.edu</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded uppercase">Uni Admin</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">Stanford University</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-500">
                                                <span className="size-1.5 rounded-full bg-red-500"></span> Suspended
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">Oct 21, 2023</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Row 4 */}
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-8 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover shrink-0"
                                                    data-alt="User avatar"
                                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqV6paclHB6E2YYVPuDl-CkF1Ro4aZ6XBxCdpsniBPdITYLzoa3nhyXFamhkCGJ0ZNIxSYPF0assIhFnZ3nah33SwPuyNnNMVJJRc3PItnLrC9J6VNrDo88CGqE10MqN45Z9w92BAV8YpK3tGERt6DgLNp2V6gt2g8rOS7wjIkwSD2S2c0T-0Fs-UPSAHRMloW29ASh7tYkXWuYbeXVi-3Kap7bF796FXBm5kcWgg5xz1bvJzikLxffZuPTTpCGkIuswQkaZXkSN3U')" }}
                                                ></div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Elena Gilbert</span>
                                                    <span className="text-[10px] text-slate-400 uppercase truncate">egilbert@mit.edu</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded uppercase">Student</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">MIT</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-500">
                                                <span className="size-1.5 rounded-full bg-green-500"></span> Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">Oct 20, 2023</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center justify-center">
                                                <span className="material-symbols-outlined text-lg">more_horiz</span>
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-medium text-slate-500 flex-wrap gap-4">
                            <span>Showing 4 of 50 users</span>
                            <div className="flex gap-1">
                                <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">Previous</button>
                                <button className="px-3 py-1 bg-primary text-white rounded font-bold shadow-sm">1</button>
                                <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">2</button>
                                <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 shadow-sm font-medium">Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="p-6 sm:p-8 mt-auto text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">StudentNest Super Admin Console v4.2.1 • © 2023 StudentNest Inc.</p>
                </footer>
            </main>
        </div>
    );
}
