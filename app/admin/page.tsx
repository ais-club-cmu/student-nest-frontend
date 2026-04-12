'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    getPendingKycAction,
    approveLandlordKycAction,
    rejectLandlordKycAction,
} from '@/app/actions/nestActions';
import type { PendingKycUser } from '@/lib/types/api.types';

type Tab = 'overview' | 'landlord-approvals' | 'student-verifications';

// ── Reject modal ─────────────────────────────────────────────────────────────
function RejectModal({
    user,
    onClose,
    onConfirm,
}: {
    user: PendingKycUser;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}) {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reject KYC — {user.full_name}</h3>
                <p className="text-sm text-slate-500">Provide a reason that will be sent to the landlord.</p>
                <textarea
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 text-sm resize-none h-28 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. Document is blurry or expired..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => reason.trim() && onConfirm(reason.trim())}
                        disabled={!reason.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── KYC document viewer card ──────────────────────────────────────────────────
function KycCard({
    user,
    onApprove,
    onReject,
    busy,
}: {
    user: PendingKycUser;
    onApprove: () => void;
    onReject: () => void;
    busy: boolean;
}) {
    const [open, setOpen] = useState(false);
    const initials = user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
    const submitted = new Date(user.submitted_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        Pending
                    </span>
                    <span className="text-[10px] text-slate-400">Submitted {submitted}</span>
                </div>
            </div>

            {/* Documents */}
            {user.documents && user.documents.length > 0 && (
                <div className="px-5 pb-3">
                    <button
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            {open ? 'expand_less' : 'expand_more'}
                        </span>
                        {open ? 'Hide' : 'View'} {user.documents.length} document{user.documents.length !== 1 ? 's' : ''}
                    </button>
                    {open && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {user.documents.map((doc) => (
                                <div key={doc.id} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{doc.doc_type.replace(/_/g, ' ')}</span>
                                    <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 h-36"
                                    >
                                        {doc.file_url.match(/\.(jpe?g|png|webp)$/i) ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={doc.file_url} alt={doc.doc_type} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                                <span className="material-symbols-outlined text-4xl text-slate-400">picture_as_pdf</span>
                                                <span className="text-xs text-slate-500">Click to open</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">open_in_new</span>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <button
                    onClick={onApprove}
                    disabled={busy}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve
                </button>
                <button
                    onClick={onReject}
                    disabled={busy}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Reject
                </button>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('overview');
    const [pendingKyc, setPendingKyc] = useState<PendingKycUser[]>([]);
    const [kycLoading, setKycLoading] = useState(false);
    const [kycError, setKycError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [rejectTarget, setRejectTarget] = useState<PendingKycUser | null>(null);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

    const showToast = (msg: string, ok: boolean) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const getToken = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) { router.push('/login'); return null; }
        return token;
    };

    const loadPendingKyc = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        setKycLoading(true);
        setKycError(null);
        const result = await getPendingKycAction(token);
        setKycLoading(false);
        if (result.error) { setKycError(result.error.message); return; }
        setPendingKyc(result.data ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tab === 'landlord-approvals') loadPendingKyc();
    }, [tab, loadPendingKyc]);

    const handleApprove = async (user: PendingKycUser) => {
        const token = getToken();
        if (!token) return;
        setBusyId(user.user_id);
        const result = await approveLandlordKycAction(token, user.user_id);
        setBusyId(null);
        if (result.error) { showToast(result.error.message, false); return; }
        showToast(`${user.full_name} approved.`, true);
        setPendingKyc((prev) => prev.filter((u) => u.user_id !== user.user_id));
    };

    const handleReject = async (user: PendingKycUser, reason: string) => {
        const token = getToken();
        if (!token) return;
        setRejectTarget(null);
        setBusyId(user.user_id);
        const result = await rejectLandlordKycAction(token, user.user_id, reason);
        setBusyId(null);
        if (result.error) { showToast(result.error.message, false); return; }
        showToast(`${user.full_name} rejected.`, true);
        setPendingKyc((prev) => prev.filter((u) => u.user_id !== user.user_id));
    };

    const NAV: { id: Tab; label: string; icon: string }[] = [
        { id: 'overview', label: 'Overview', icon: 'dashboard' },
        { id: 'student-verifications', label: 'Student Verifications', icon: 'how_to_reg' },
        { id: 'landlord-approvals', label: 'Landlord Approvals', icon: 'domain_verification' },
    ];

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
                    {NAV.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => setTab(n.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                tab === n.id
                                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                            {n.label}
                            {n.id === 'landlord-approvals' && pendingKyc.length > 0 && (
                                <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {pendingKyc.length}
                                </span>
                            )}
                        </button>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Settings
                        </button>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Logged in as</p>
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">Admin</p>
                                <p className="text-[10px] text-slate-500 truncate">Admin Portal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-64 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">school</span>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">CMU-Africa Admin</h2>
                    </div>
                    <div className="relative p-1">
                        <span className="material-symbols-outlined text-slate-500 cursor-pointer hover:text-primary transition-colors block">notifications</span>
                        {pendingKyc.length > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        )}
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full">

                    {/* ── Overview tab ── */}
                    {tab === 'overview' && (
                        <div className="space-y-8">
                            {/* Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined block">group</span></div>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+5.2%</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Verified Students</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">1,240</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><span className="material-symbols-outlined block">map</span></div>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+2.4%</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Listings</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">85</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><span className="material-symbols-outlined block">pending_actions</span></div>
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">Attention</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Verifications</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">12</h3>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><span className="material-symbols-outlined block">handshake</span></div>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+12%</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Successful Matches</p>
                                    <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">450</h3>
                                </div>
                            </div>

                            {/* Pending KYC alert */}
                            {pendingKyc.length > 0 && (
                                <div className="flex items-center gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                                    <span className="material-symbols-outlined text-amber-500 text-3xl">pending_actions</span>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900 dark:text-white">{pendingKyc.length} landlord KYC submission{pendingKyc.length !== 1 ? 's' : ''} awaiting review</p>
                                        <p className="text-sm text-slate-500">Review and approve or reject their identity documents.</p>
                                    </div>
                                    <button onClick={() => setTab('landlord-approvals')} className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors">
                                        Review Now
                                    </button>
                                </div>
                            )}

                            {/* Main grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: verification table + flagged listings */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Pending student verifications */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pending Student Verifications</h3>
                                            <button onClick={() => setTab('student-verifications')} className="text-primary text-sm font-semibold hover:underline">View All</button>
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
                                                    {[
                                                        { name: 'Jean Doe', email: 'j.doe@andrew.cmu.edu', dept: 'Information Tech' },
                                                        { name: 'Alice Keza', email: 'akeza@andrew.cmu.edu', dept: 'Engineering' },
                                                        { name: 'Bob Smith', email: 'bsmith@andrew.cmu.edu', dept: 'Business Management' },
                                                    ].map((s) => (
                                                        <tr key={s.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{s.name}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{s.email}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{s.dept}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Activate</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Flagged listings */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Flagged Listings</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {[
                                                { title: 'Modern Studio near Bumbogo', reason: 'Incorrect Pricing / Student Scam Report', hot: true },
                                                { title: 'Cozy Room for Graduate Students', reason: 'Amenities not as described', hot: false },
                                            ].map((f) => (
                                                <div key={f.title} className={`flex items-center gap-4 p-4 rounded-lg border ${f.hot ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
                                                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                                        <span className="material-symbols-outlined text-slate-400">home</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold truncate text-slate-900 dark:text-white">{f.title}</h4>
                                                        <p className={`text-xs font-medium truncate ${f.hot ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>Reason: {f.reason}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="p-2 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 rounded-lg transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                                                        </button>
                                                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: housing status chart + neighbourhood activity */}
                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                                        <h3 className="font-bold text-lg mb-6 text-slate-900 dark:text-white">Housing Status</h3>
                                        <div className="relative w-48 h-48 mx-auto">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3" />
                                                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="68, 100" strokeWidth="3" />
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

                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                        <div className="p-6">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Neighbourhood Activity</h3>
                                            <p className="text-xs text-slate-500 mt-1">Highest listing density in Bumbogo</p>
                                        </div>
                                        <div className="h-40 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/40 animate-pulse flex items-center justify-center">
                                                    <span className="material-symbols-outlined block">location_on</span>
                                                </div>
                                                <span className="text-xs font-bold mt-2 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-2 py-1 rounded shadow-sm backdrop-blur-md">Bumbogo Campus</span>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {[{ label: 'Kacyiru', pct: '45%' }, { label: 'Nyarutarama', pct: '70%' }].map((n) => (
                                                <div key={n.label} className="flex items-center justify-between text-xs">
                                                    <span className="font-medium text-slate-600 dark:text-slate-300">{n.label}</span>
                                                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="bg-primary h-full" style={{ width: n.pct }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Landlord Approvals tab ── */}
                    {tab === 'landlord-approvals' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Landlord Approvals</h2>
                                    <p className="text-slate-500 text-sm mt-1">Review submitted KYC documents and approve or reject each landlord.</p>
                                </div>
                                <button
                                    onClick={loadPendingKyc}
                                    disabled={kycLoading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    <span className={`material-symbols-outlined text-[18px] ${kycLoading ? 'animate-spin' : ''}`}>refresh</span>
                                    Refresh
                                </button>
                            </div>

                            {kycError && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{kycError}</p>
                                </div>
                            )}

                            {kycLoading && (
                                <div className="flex items-center justify-center py-20">
                                    <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                                </div>
                            )}

                            {!kycLoading && !kycError && pendingKyc.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">verified_user</span>
                                    <p className="font-semibold text-slate-600 dark:text-slate-400">No pending KYC submissions</p>
                                    <p className="text-sm text-slate-400">All landlords have been reviewed.</p>
                                </div>
                            )}

                            {!kycLoading && pendingKyc.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {pendingKyc.map((user) => (
                                        <KycCard
                                            key={user.user_id}
                                            user={user}
                                            busy={busyId === user.user_id}
                                            onApprove={() => handleApprove(user)}
                                            onReject={() => setRejectTarget(user)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Student Verifications tab ── */}
                    {tab === 'student-verifications' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Verifications</h2>
                                <p className="text-slate-500 text-sm mt-1">Students pending email confirmation or account activation.</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <p className="font-semibold text-slate-900 dark:text-white">Pending Verifications</p>
                                    <span className="text-xs text-slate-400">Student activation is handled via email confirmation — verified automatically by Supabase.</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Student</th>
                                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
                                                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {/* Placeholder rows — replace with real data when a student list endpoint is available */}
                                            {[
                                                { name: 'Jean Doe', email: 'j.doe@andrew.cmu.edu', status: 'Pending Email' },
                                                { name: 'Alice Keza', email: 'akeza@andrew.cmu.edu', status: 'Pending Email' },
                                                { name: 'Bob Smith', email: 'bsmith@andrew.cmu.edu', status: 'Pending Email' },
                                            ].map((s) => (
                                                <tr key={s.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{s.name}</td>
                                                    <td className="px-6 py-4 text-sm text-primary">{s.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                                                            {s.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]">info</span>
                                        A dedicated admin endpoint for listing students is not yet available. Rows above are placeholders.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Reject modal */}
            {rejectTarget && (
                <RejectModal
                    user={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                    onConfirm={(reason) => handleReject(rejectTarget, reason)}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold transition-all ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    <span className="material-symbols-outlined text-[18px]">{toast.ok ? 'check_circle' : 'error'}</span>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}
