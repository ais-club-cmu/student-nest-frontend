import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand & Description */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-primary text-2xl">domain</span>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">StudentNest</h2>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                            The most trusted student housing marketplace in Rwanda, bridging the gap between quality education and quality living.
                        </p>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Search Houses</Link></li>
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Shared Rooms</Link></li>
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Near ALU</Link></li>
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Near UR</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Landlords</Link></li>
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Partnerships</Link></li>
                            <li><Link href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Connect</h3>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined text-sm">public</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined text-sm">alternate_email</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined text-sm">call</span>
                            </a>
                        </div>
                        <p className="text-xs text-slate-500">
                            Kigali, Rwanda<br />
                            contact@studentnest.rw
                        </p>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-slate-100 dark:border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">© 2024 StudentNest Housing. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
