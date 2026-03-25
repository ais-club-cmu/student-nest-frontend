import React from 'react';
import Link from 'next/link';

export default function LandlordDashboardPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] font-display bg-background-light dark:bg-slate-950/50">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">home_work</span>
                    </div>
                    <div>
                        <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-none">StudentNest</h1>
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Landlord Portal</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group">
                        <span className="material-symbols-outlined text-[22px]">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">location_city</span>
                        <span className="text-sm font-medium">My Listings</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">description</span>
                        <span className="text-sm font-medium">Applications</span>
                        <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">12</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">payments</span>
                        <span className="text-sm font-medium">Payments</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">star</span>
                        <span className="text-sm font-medium">Reviews</span>
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
                    </div>

                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">help</span>
                        <span className="text-sm font-medium">Help Center</span>
                    </Link>
                </nav>

                <div className="p-4 mt-auto mb-20 md:mb-0">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm">
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Add New Listing</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 relative min-w-0">
                {/* Top Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Landlord Dashboard</h2>
                        <p className="text-slate-500 text-sm">Welcome back, your properties are performing well.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm mr-1.5">verified_user</span>
                            <span className="text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-tight">Verified Landlord</span>
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-2xl">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">Jean-Paul Habimana</p>
                                <p className="text-[11px] text-slate-500 font-medium">Kigali, RW</p>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border border-slate-300 dark:border-slate-600"
                                data-alt="Landlord professional profile picture"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALFGoiy3PDPnCayytSYEBM48N7q4iRMnYQkxw0cF3CRME2d1qPbLxF7x2FNoyy5L1WDsBJsk0KkFCk_J1zk8MyK3A0_KzYjnSV7i86q7LXir0t0vP7A925RsPzxnzo-96NAQibI6EwHCw04JXfOaOqnP82KCPnO3xmo0g_YeP51j7XZK0yarV2EQCP3HQMoh8X0fvgLSIasdjYcT1MwApob77kzuWzU0jo0rmBt8TPlSuUYGz1WIecY5u7U8YTk5NFPjW9TC0wrbhj')" }}>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Trust Indicators Bar */}
                <div className="mb-8 flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">security</span>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Escrow System Active</p>
                            <p className="text-xs text-slate-500 mt-1">Payments for 3 bookings are securely held and ready for release on move-in.</p>
                        </div>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">View Policy</button>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">account_balance_wallet</span>
                            <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center">+12.5% <span className="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$4,200.00</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">apartment</span>
                            <span className="text-slate-400 text-xs font-bold uppercase">Stable</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Active Listings</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">5</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg">assignment_late</span>
                            <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center">+3 New</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Pending Apps</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">12</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">pie_chart</span>
                            <span className="text-green-600 dark:text-green-400 text-xs font-bold flex items-center">+2%</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Occupancy Rate</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">94%</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
                    {/* Earnings Trend Graph */}
                    <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Earnings Trend</h4>
                                <p className="text-sm text-slate-500">Monthly revenue overview</p>
                            </div>
                            <select className="bg-slate-50 dark:bg-slate-800 border-none text-xs font-bold rounded-lg focus:ring-primary h-9 outline-none">
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                        </div>
                        <div className="h-64 flex flex-col justify-end">
                            <div className="flex items-end gap-3 h-full px-2">
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[40%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$1,200</div>
                                </div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[55%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$2,100</div>
                                </div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[45%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$1,800</div>
                                </div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[75%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$3,200</div>
                                </div>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-[85%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$3,800</div>
                                </div>
                                <div className="flex-1 bg-primary rounded-t-lg h-[95%] relative group">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-100 transition-opacity">$4,200</div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities or Quick Actions */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Action Needed</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                                <span className="material-symbols-outlined text-red-500">priority_high</span>
                                <div>
                                    <p className="text-xs font-bold text-red-700 dark:text-red-400">Lease expiring soon</p>
                                    <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-1">Modern Studio unit 4B lease ends in 15 days.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                <span className="material-symbols-outlined text-amber-500">rate_review</span>
                                <div>
                                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">New Review</p>
                                    <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">A student left a 5-star review for the Shared Apartment.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                                <span className="material-symbols-outlined text-primary">chat_bubble</span>
                                <div>
                                    <p className="text-xs font-bold text-primary dark:text-blue-400">New Inquiry</p>
                                    <p className="text-[11px] text-primary/80 dark:text-blue-400/80 mt-1">Divine K. asked about internet speed in CMU apartment.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            View All Activities
                        </button>
                    </div>
                </div>

                {/* Property Management Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Active Listings</h4>
                        <button className="text-primary text-sm font-bold flex items-center gap-1">Manage All <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Property Card 1 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 bg-cover bg-center relative" data-alt="Modern studio apartment interior in Kigali" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwO6LlmjXLA-NDw43Ff02UtzjeGlJRPBkwt0cPsKsyHKOxOQWJZ4xHKtlwyOCh6e7E-6tkKm49GRiQtRSfcblmlzNa2QPINzo-jJDq7fZGnb40pdmSVF57WKvwMOHCnjbvjjIxx6UTdTpFD0a7TZotlE9tZLl6XDvo793-rSrRZJ1IHakI4YLoBZRNaLnyPsjVO2hKX-_g-w4J7gFtIjzvC0lzBjQg9_n_sBUZi8WioOeAc9JGQr0hLwrTo4ZY63bCFU9Yh8p4x1gZ')" }}>
                                <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Active</div>
                                <div className="absolute bottom-3 left-3 text-white">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">star</span>
                                        <span className="text-xs font-bold">4.9 (24 Reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Modern Studio in Kigali</h5>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4"><span className="material-symbols-outlined text-sm">location_on</span> Gasabo District, Kigali</p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rent</p>
                                        <p className="text-sm font-bold text-primary">$450/mo</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Views</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">1,240</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Card 2 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-40 bg-cover bg-center relative" data-alt="Shared apartment living room near CMU" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFQptERstx2kFoVkv9aKJwIvFJmxI0ywqo7tEz_6o-pUWa7RuRh8P2f86atpAeKCi0Q3KZPOeiJURj3rgTZOp-5vUEEyV6ATnUxOXQYsGUgZz6VCG_IwUfcgEnRuiHCtrLdDaDZonTGAlWURqQ501ysz4You53azPcOmVwbhgVlDPJLUXxVwFzyX2K-p2YB8ORnxYDdeuKACX2qM8vQdwUzeV8LQgZ-T6I_qIll7rlzog_7S_tbSPu27CRKUlUFCEzPPtwP1l7puci')" }}>
                                <div className="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Rented</div>
                                <div className="absolute bottom-3 left-3 text-white">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">star</span>
                                        <span className="text-xs font-bold">4.7 (18 Reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Shared Apartment near CMU</h5>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4"><span className="material-symbols-outlined text-sm">location_on</span> Bumbogo, Kigali</p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rent</p>
                                        <p className="text-sm font-bold text-primary">$280/mo</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Views</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Card 3 */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-75">
                            <div className="h-40 bg-cover bg-center relative" data-alt="Exterior of a building under renovation" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaRUCEoIfOmhwztPXgV0UNx7DAAeLOdQ0ulMNU1gOF3N7ffaKEaA8YvLgMLIwfxWjtkWfS4nMWq-7ePfqHmLtzwOHoJm9ZKm337ysf0agR7XhdwfBg6SlDkldYy3lYJRxGbiuINwxjR7k35ifAFXxmFAGY8SDYY5hWtxIIaxS6LL8wUzytSNK-zZaObDZwfv2BR32XtapNQxUYxgD2ez5jR8-rcUN-opTehq_m3W7O15cpgY4oZZgzDq3B60Nh66Ct6KJs39Z5QJGJ')" }}>
                                <div className="absolute top-3 left-3 bg-slate-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Under Review</div>
                            </div>
                            <div className="p-5">
                                <h5 className="font-bold text-slate-900 dark:text-white mb-1">Cozy Annex near University of Rwanda</h5>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4"><span className="material-symbols-outlined text-sm">location_on</span> Huye, Southern Province</p>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Proposed Rent</p>
                                        <p className="text-sm font-bold text-primary">$150/mo</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verification</p>
                                        <p className="text-sm font-bold text-orange-500">Pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Applications Table */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Recent Applications</h4>
                        <div className="flex gap-2">
                            <button className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded text-xs font-semibold">Filter</button>
                            <button className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded text-xs font-semibold">Export</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Property</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date Applied</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden bg-cover bg-center" data-alt="Student profile photo" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcF2tdymmcVFEJUrCIZdxsvGfALsHIbMnLw9zT8N3mU1Kgq3nxnQ7aSpEoxeom9GkG9bbuZ3CVYwOspEp2Iutv00La3fGf29JkRrAXFIt_yG2qm2czwetpESYfWYH5gUo-LeB5nu3KBnAa6JxGn0XEHwF74WJ2_I_yArLQJBdy_UkQHENGU3YSzBRZkhSnpSt6vljDbabgvrHpROHvAliHP1R2pjAoTsgQOoxcQmbX0QN8RIwv3EWV2a4HirkdMRp-h5dwNQokdzPk')" }}></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Alice Uwase</p>
                                                <p className="text-[10px] text-slate-500">CMU Africa Student</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Modern Studio Kigali</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 uppercase">Pending</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 12, 2023</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary text-xs font-bold hover:underline">View Details</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden bg-cover bg-center" data-alt="Student profile photo" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-xbSHnbJ1LV6ri628DkcEBY-ac_YZROEpqHXdaNtfy6eQxEi99ok11pRU0o5odFgqqkaOv3h1xJUBMlTXbdu8RbIaY6oC_MUHiZN9dv7-wmtA7CSXtkG2OECXxQlam489VRIg_KGUR78Qr49yhdFrG0gIbvOPBk-AVbKx3FX27i96inLtE2xj6V0wZtM42sXs8M8r0E3Jccnvs7rAIzffqSL2ZaRkF8VWdNYPJijB5zJF6Ve5vrbYJVl0iWtjRaSR69rSAbyxcgbk')" }}></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">John Kagabo</p>
                                                <p className="text-[10px] text-slate-500">ALU Student</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Shared Apartment CMU</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase">Interviewing</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 10, 2023</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary text-xs font-bold hover:underline">View Details</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden bg-cover bg-center" data-alt="Student profile photo" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBN1Us83-o3fscMmeBNrJcDFY8NEcRBflc5-7tQiSzPMQgQA-H8xRrJ2K_Y26Su0H1sWscUV0UcvmWpJunxyjbG2o6MLP3AcEZ9wSCjIhRJa2_RjUKGmhaYOWm0CMTd4jJxegP3DEhfhs81yjNyFyGykICOilHxwmBKbMX0yogkCeSJAts0mgTP8UfsQve7a4JbfQcmP-GmtyV4v7tJPHuI5pVin_f82d3Ye7PJYn1C-v599iVCmBfUwVs4hN-KtMsqc7vtRsEVVdXO')" }}></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Smith</p>
                                                <p className="text-[10px] text-slate-500">Exchange Student</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Modern Studio Kigali</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase">Approved</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 08, 2023</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary text-xs font-bold hover:underline">View Details</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button className="text-slate-500 text-xs font-bold hover:text-primary transition-colors">View All Applications</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
