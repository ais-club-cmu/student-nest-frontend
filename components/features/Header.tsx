'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { logoutAction } from '@/app/actions/nestActions';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        setIsLoggingOut(false);
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-primary text-3xl">domain</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StudentNest</h2>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="listings" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
                            Browse Listings
                        </Link>
                        <Link href="/landlord-registration" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
                            For Landlords
                        </Link>
                        <Link href="#" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
                            About Us
                        </Link>
                        <Link href="#" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
                            Partners
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <Link href="/login">
                                    <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="relative" ref={menuRef}>
                                {/* Avatar circle */}
                                <button
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary/90 transition-colors"
                                    aria-label="User menu"
                                    aria-expanded={menuOpen}
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                </button>

                                {/* Dropdown */}
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
                    </div>
                </div>
            </div>
        </header>
    );
}
