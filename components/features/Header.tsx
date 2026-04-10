'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { logoutAction } from '@/app/actions/nestActions';

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

    const handleLogout = async () => {
        setIsLoading(true);
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
        setIsLoading(false);
        router.push('/');
    };

    const handleDashboardClick = () => {
        if (userRole === 'landlord') {
            router.push('/landlord');
        } else if (userRole === 'student') {
            router.push('/complete-profile');
        } else {
            router.push('/');
        }
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
                        <Link href="#" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
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
                            <>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="hidden sm:inline-flex"
                                    onClick={handleDashboardClick}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging out...' : 'Logout'}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

