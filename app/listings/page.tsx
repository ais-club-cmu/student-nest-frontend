import Link from 'next/link';

const LISTINGS = [
    {
        id: 1,
        title: 'Modern Studio in Kigali',
        location: 'Kacyiru, Kigali',
        price: 450,
        roomType: 'Private Room',
        status: 'Available',
        statusColor: 'emerald',
        beds: 1,
        baths: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXUDfqeAk_j5rozgfZ6UidPEwtVVoY5YHk1ZZmsfA49fdGiyew7Mq5M37bWbm4UxmNZw4rvfvUCdhiQIBeGFH4r36CHgNx_YqIgkdDTZILqnowRkfCLlqq0kHNTwsWTKbxj-FOxq_CEnV7VFmk4Dz3sfzQiKDIsmXWY1i4sLIiQzZ2p8t7h9jTkekdrHnmH41U3RdlcsLRB7OtusBxlQrkfkY2I1ifv3Y_XBnm_w4tywdcShAN2tQ8hXAiGgdJE7a2u2za_6s7eJiC',
    },
    {
        id: 2,
        title: 'Luxury 2BR Apartment',
        location: 'Nyarutarama, Kigali',
        price: 800,
        roomType: 'Shared Room',
        status: 'Available',
        statusColor: 'emerald',
        beds: 2,
        baths: 2,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArBD3XZKuTKbf_ZKpJVKsxTxUttM28fZ3l0aMwPAlWzZb-nBYhHUPX4p8CMNYCjpHi-MNmXc0xrLdWMLoHtWYP7BSCeGkebG8jgKFJWMh8macDlexsrZ8lErTHmSRmmogkv5hdE9UjG-Poq0ckrNIDJZUIoxRaOmsbY7vmJVKzpMKPgx_HoydeHGhMWT7x9UWV6UgJuTW3fHHaDvtJ8ZUKofLRMVugo7-0bV26sgXVSfI80ERhh3hoOZ42TyPTApFSTe0Wjks99CTo',
    },
    {
        id: 3,
        title: 'Charming Student En-suite',
        location: 'Remera, Kigali',
        price: 350,
        roomType: 'Private Room',
        status: 'Limited',
        statusColor: 'amber',
        beds: 1,
        baths: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA66h-2jUjSDTZCxHreQVQ6mQLTXV4QS5Lq2NoABWKIgEJvZSjmi-3nH14CIbT_u6h33bvK_uGcGJ-zSgPX5DwoYLk6D5XrvquQheyRefWnUN903f2oVev0wDtZQqMTiYBGLt73-vzuAqzVuhG-vYPwpyvbeLCmX0qCoodu9JdLkzrq1BiHa2Yv_hCXPHMATx3QnRNzIjtknXwMv_6cw05-xeuP4_f82EUIfD-nEiuvcsgjQ_8F4JTu5297GS90iBBCv5Yl16X4RPSi',
    },
    {
        id: 4,
        title: 'Cozy Room Near Campus',
        location: 'Gikondo, Kigali',
        price: 280,
        roomType: 'Shared Room',
        status: 'Available',
        statusColor: 'emerald',
        beds: 1,
        baths: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXUDfqeAk_j5rozgfZ6UidPEwtVVoY5YHk1ZZmsfA49fdGiyew7Mq5M37bWbm4UxmNZw4rvfvUCdhiQIBeGFH4r36CHgNx_YqIgkdDTZILqnowRkfCLlqq0kHNTwsWTKbxj-FOxq_CEnV7VFmk4Dz3sfzQiKDIsmXWY1i4sLIiQzZ2p8t7h9jTkekdrHnmH41U3RdlcsLRB7OtusBxlQrkfkY2I1ifv3Y_XBnm_w4tywdcShAN2tQ8hXAiGgdJE7a2u2za_6s7eJiC',
    },
];

const STATUS_STYLES: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const DOT_STYLES: Record<string, string> = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
};

export default function ListingsPage() {
    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-950/50">
            <main className="flex-1 flex flex-col min-w-0">
                {/* Page header bar */}
                <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky top-16 z-10">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Browse Listings</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Find your perfect student accommodation</p>
                    </div>
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all text-slate-900 dark:text-white"
                            placeholder="Search by location or name..."
                            type="text"
                        />
                    </div>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-6">
                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto whitespace-nowrap">
                            <button className="px-4 py-1.5 text-sm font-medium rounded-lg bg-primary text-white transition-colors">All</button>
                            <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Available</button>
                            <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Private Room</button>
                            <button className="px-4 py-1.5 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Shared Room</button>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm text-slate-500 dark:text-slate-400">{LISTINGS.length} results</span>
                        </div>
                    </div>

                    {/* Listings grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {LISTINGS.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative w-full lg:w-72 h-52 lg:h-auto shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={listing.image}
                                        alt={listing.title}
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`${STATUS_STYLES[listing.statusColor]} px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                                            <span className={`size-1.5 ${DOT_STYLES[listing.statusColor]} rounded-full`}></span>
                                            {listing.status}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-full text-xs font-bold">
                                            {listing.roomType}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{listing.title}</h3>
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm gap-1">
                                                <span className="material-symbols-outlined text-lg">location_on</span>
                                                {listing.location}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-primary">${listing.price}</p>
                                            <p className="text-xs text-slate-500">per month</p>
                                        </div>
                                    </div>

                                    {/* Amenity chips */}
                                    <div className="flex items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800 my-4">
                                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                                            <span className="material-symbols-outlined text-lg">bed</span>
                                            {listing.beds} Bed{listing.beds > 1 ? 's' : ''}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                                            <span className="material-symbols-outlined text-lg">shower</span>
                                            {listing.baths} Bath{listing.baths > 1 ? 's' : ''}
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm">
                                            <span className="material-symbols-outlined text-lg">wifi</span>
                                            WiFi included
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                                            Apply Now
                                        </button>
                                        <Link
                                            href={`/listings/${listing.id}`}
                                            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium"
                                        >
                                            View Details
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
