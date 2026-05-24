'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { logoutAction } from '@/app/actions/nestActions';
import { getNotificationsAction } from '@/app/actions/listingsActions';

const STATIC_NAV_LINKS = [
    { label: 'Browse Listings', href: '/listings' },
    { label: 'About Us', href: '/about' },
    { label: 'Partners', href: '/partners' },
];

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);       // avatar dropdown
    const [drawerOpen, setDrawerOpen] = useState(false);   // mobile nav drawer
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, [pathname]);

    // Poll unread notification count for students and landlords
    const fetchUnreadCount = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const result = await getNotificationsAction(token);
        if (result.data) setUnreadNotifs(result.data.filter((n) => !n.is_read).length);
    }, []);

    useEffect(() => {
        if (!isLoggedIn || (userRole !== 'student' && userRole !== 'landlord')) {
            setUnreadNotifs(0);
            return;
        }
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [isLoggedIn, userRole, fetchUnreadCount]);

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close drawer on route change
    useEffect(() => {
        setDrawerOpen(false);
    }, [pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                await logoutAction({ access_token: token });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
        setMenuOpen(false);
        setDrawerOpen(false);
        setIsLoggingOut(false);
        router.push('/');
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined text-primary text-3xl">domain</span>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StudentNest</h2>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {STATIC_NAV_LINKS.filter((link) =>
                                link.href !== '/listings' || userRole === 'student'
                            ).map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href={userRole === 'landlord' ? '/landlord/listings' : '/landlord-registration'}
                                className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors"
                            >
                                For Landlords
                            </Link>
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center gap-2">
                            {/* Quick-access icons for logged-in students / landlords */}
                            {isLoggedIn && (userRole === 'student' || userRole === 'landlord') && (
                                <>
                                    <Link
                                        href={userRole === 'student' ? '/student-portal/conversations' : '/landlord/conversations'}
                                        className="flex items-center justify-center w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        aria-label="Messages"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">forum</span>
                                    </Link>
                                    <Link
                                        href={userRole === 'student' ? '/student-portal/notifications' : '/landlord/notifications'}
                                        className="relative flex items-center justify-center w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        aria-label="Notifications"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                                        {unreadNotifs > 0 && (
                                            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                                                {unreadNotifs > 9 ? '9+' : unreadNotifs}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}

                            {!isLoggedIn ? (
                                <>
                                    <Link href="/login" className="hidden sm:block">
                                        <Button variant="secondary" size="sm">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="primary" size="sm">Sign Up</Button>
                                    </Link>
                                </>
                            ) : (
                                /* Avatar dropdown */
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setMenuOpen((prev) => !prev)}
                                        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary/90 transition-colors"
                                        aria-label="User menu"
                                        aria-expanded={menuOpen}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg py-1 z-50">
                                            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{userRole ?? 'User'}</p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-slate-500">account_circle</span>
                                                Profile
                                            </Link>
                                            {(userRole === 'student' || userRole === 'landlord') && (
                                                <Link
                                                    href={userRole === 'student' ? '/student-portal/listings' : '/landlord/listings'}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] text-slate-500">apartment</span>
                                                    My Listings
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hamburger — mobile only */}
                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
                                aria-label="Open menu"
                            >
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile drawer backdrop */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 md:hidden"
                    onClick={() => setDrawerOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-slate-900 shadow-xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
                    drawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-label="Mobile navigation"
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-2xl">domain</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">StudentNest</span>
                    </Link>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Close menu"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
                    {STATIC_NAV_LINKS.filter((link) =>
                        link.href !== '/listings' || userRole === 'student'
                    ).map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href={userRole === 'landlord' ? '/landlord/listings' : '/landlord-registration'}
                        onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        For Landlords
                    </Link>

                    {isLoggedIn && (
                        <>
                            <div className="my-3 border-t border-slate-100 dark:border-slate-800" />
                            <Link
                                href="/profile"
                                onClick={() => setDrawerOpen(false)}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px] text-slate-500">account_circle</span>
                                Profile
                            </Link>
                            {(userRole === 'student' || userRole === 'landlord') && (
                                <>
                                    <Link
                                        href={userRole === 'student' ? '/student-portal/listings' : '/landlord/listings'}
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">apartment</span>
                                        My Listings
                                    </Link>
                                    <Link
                                        href={userRole === 'student' ? '/student-portal/conversations' : '/landlord/conversations'}
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-slate-500">forum</span>
                                        Messages
                                    </Link>
                                    <Link
                                        href={userRole === 'student' ? '/student-portal/notifications' : '/landlord/notifications'}
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[18px] text-slate-500">notifications</span>
                                            Notifications
                                        </div>
                                        {unreadNotifs > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                                                {unreadNotifs > 9 ? '9+' : unreadNotifs}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </nav>

                {/* Drawer footer — auth actions */}
                <div className="px-4 py-5 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" onClick={() => setDrawerOpen(false)}>
                                <Button variant="secondary" size="lg" className="w-full">Login</Button>
                            </Link>
                            <Link href="/register" onClick={() => setDrawerOpen(false)}>
                                <Button variant="primary" size="lg" className="w-full">Sign Up</Button>
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}
