'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserProfileAction } from '@/app/actions/nestActions';
import { getListingDashboardAction } from '@/app/actions/listingsActions';
import { handleAuthError } from '@/lib/auth-redirect';
import type { UserProfileResponse, ListingDashboardResponse, ListingDashboardCard, KYCStatus } from '@/lib/types/api.types';

function fmtRwf(n: number | null | undefined) {
    return n != null ? `RWF ${n.toLocaleString()}` : '—';
}

const API_BASE = process.env.NEXT_PUBLIC_NEST_API_BASE_URL ?? '';
function mediaUrl(url: string) { return url.startsWith('http') ? url : `${API_BASE}${url}`; }

function KycBadge({ status }: { status: KYCStatus }) {
    if (status === 'approved') {
        return (
            <div className="hidden md:flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm mr-1.5">verified_user</span>
                <span className="text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-tight">Verified Landlord</span>
            </div>
        );
    }
    if (status === 'pending') {
        return (
            <div className="hidden md:flex items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-800">
                <span className="material-symbols-outlined text-amber-500 text-sm mr-1.5">pending</span>
                <span className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-tight">KYC Pending Review</span>
            </div>
        );
    }
    if (status === 'rejected') {
        return (
            <div className="hidden md:flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-800">
                <span className="material-symbols-outlined text-red-500 text-sm mr-1.5">gpp_bad</span>
                <span className="text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-tight">Verification Rejected</span>
            </div>
        );
    }
    return null;
}

function ActiveListingCard({ card }: { card: ListingDashboardCard }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                {card.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(card.cover_url)} alt="Listing" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-300 text-5xl">apartment</span>
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Active</div>
            </div>
            <div className="p-5">
                <h5 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{card.full_address}</h5>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4 truncate">
                    <span className="material-symbols-outlined text-sm shrink-0">location_on</span>
                    {card.neighborhood_name ?? card.full_address}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rent</p>
                        <p className="text-sm font-bold text-primary">{fmtRwf(card.monthly_rent_rwf)}/mo</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Type</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{card.property_type ? card.property_type.replace(/_/g, ' ') : '—'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandlordDashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [dashboard, setDashboard] = useState<ListingDashboardResponse | null>(null);
    const [ready, setReady] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token || role !== 'landlord') {
            router.push('/login');
            return;
        }

        getUserProfileAction(token).then((result) => {
            if (result.error) {
                if (handleAuthError(result.error, router)) return;
            }
            if (result.data) {
                const { kyc_status } = result.data;
                if (kyc_status === 'rejected') {
                    router.replace('/landlord-registration/id-verification');
                    return;
                }
                setProfile(result.data);
            }
            setReady(true);

            // Load dashboard listings in parallel
            getListingDashboardAction(token).then((dash) => {
                if (dash.data) setDashboard(dash.data);
            });
        });
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        router.push('/');
    };

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-slate-950/50">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    const activeListings = dashboard?.active ?? [];
    const pendingListings = dashboard?.pending_review ?? [];
    const filledListings = dashboard?.filled ?? [];
    const archivedListings = dashboard?.archived ?? [];
    const draftListings = dashboard?.drafts ?? [];

    // Derive counts from the arrays (more reliable than summary field names)
    const counts = {
        active: activeListings.length,
        pending_review: pendingListings.length,
        filled: filledListings.length,
        archived: archivedListings.length,
        drafts: draftListings.length,
    };

    const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

    return (
        <div className="flex min-h-screen font-display bg-background-light dark:bg-slate-950/50">

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-2xl">home_work</span>
                        </div>
                        <div>
                            <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-none">StudentNest</h1>
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Landlord Portal</span>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                    <Link href="/landlord" onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[22px]">dashboard</span>
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="/landlord/listings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">location_city</span>
                        <span className="text-sm font-medium">My Listings</span>
                        {counts.active > 0 && (
                            <span className="ml-auto bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">{counts.active}</span>
                        )}
                    </Link>
                    <Link href="/landlord/notifications" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">notifications</span>
                        <span className="text-sm font-medium">Notifications</span>
                    </Link>
                    <Link href="/landlord-registration/id-verification" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">verified_user</span>
                        <span className="text-sm font-medium">ID Verification</span>
                        {profile?.kyc_status === 'pending' && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        )}
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">help</span>
                        <span className="text-sm font-medium">Help Center</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    <Link href="/landlord/listings/add">
                        <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Add New Listing</span>
                        </button>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 relative min-w-0">
                {/* Top Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Landlord Dashboard</h2>
                            <p className="text-slate-500 text-sm">Welcome back, {firstName}.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {profile && <KycBadge status={profile.kyc_status} />}
                        <Link href="/notifications" className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <span className="material-symbols-outlined text-2xl">notifications</span>
                        </Link>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{profile?.full_name ?? '—'}</p>
                                <p className="text-[11px] text-slate-500 font-medium capitalize">{profile?.kyc_status === 'approved' ? 'Verified Landlord' : 'Landlord'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-xl">person</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* KYC pending banner */}
                {profile?.kyc_status === 'pending' && (
                    <div className="mb-8 flex items-center justify-between bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-500">pending</span>
                            <div>
                                <p className="text-sm font-bold text-amber-800 dark:text-amber-300 leading-none">KYC verification in progress</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Your identity documents are under review. Listings you create will go live once your account is verified.</p>
                            </div>
                        </div>
                        <Link href="/landlord-registration/id-verification" className="text-amber-700 dark:text-amber-400 text-xs font-bold hover:underline shrink-0 ml-4">View Status</Link>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">apartment</span>
                            <span className="text-slate-400 text-xs font-bold uppercase">Listings</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Active Listings</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{dashboard ? counts.active : '—'}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg">rate_review</span>
                            <span className="text-slate-400 text-xs font-bold uppercase">Listings</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Under Review</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{dashboard ? counts.pending_review : '—'}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg">inventory_2</span>
                            <span className="text-slate-400 text-xs font-bold uppercase">Listings</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Filled</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{dashboard ? counts.filled : '—'}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="material-symbols-outlined p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">edit_note</span>
                            <span className="text-slate-400 text-xs font-bold uppercase">Listings</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Drafts</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{dashboard ? counts.drafts : '—'}</h3>
                    </div>
                </div>

                {/* Active Listings Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Active Listings</h4>
                        <Link href="/landlord/listings" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                            Manage All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>

                    {activeListings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed gap-3">
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-5xl">apartment</span>
                            <p className="text-slate-500 font-medium text-sm">No active listings yet</p>
                            <Link href="/landlord/listings/add">
                                <button className="mt-1 flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                    Add Your First Listing
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {activeListings.slice(0, 3).map((card) => (
                                <ActiveListingCard key={card.id} card={card} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Account Details */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Account Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile?.full_name ?? '—'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{profile?.phone ?? 'Not provided'}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">KYC Status</p>
                            <p className={`text-sm font-bold capitalize ${
                                profile?.kyc_status === 'approved' ? 'text-emerald-600 dark:text-emerald-400' :
                                profile?.kyc_status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                                'text-amber-600 dark:text-amber-400'
                            }`}>
                                {profile?.kyc_status === 'approved' ? '✓ Verified' :
                                 profile?.kyc_status === 'pending' ? 'Pending Review' :
                                 profile?.kyc_status === 'rejected' ? 'Rejected' : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Status</p>
                            <p className={`text-sm font-bold capitalize ${profile?.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                {profile?.status ?? '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Login</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {profile?.last_login_at ? new Date(profile.last_login_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
