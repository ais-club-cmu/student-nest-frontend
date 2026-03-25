import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-3xl">domain</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">StudentNest</h2>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
                            Browse Listings
                        </Link>
                        <Link href="#" className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors">
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
                        <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
                            Login
                        </Button>
                        <Button variant="primary" size="sm">
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
