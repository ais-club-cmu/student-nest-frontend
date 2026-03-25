import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
    return (
        <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[640px] flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
                        Create your account
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                        Join the StudentNest community to connect with peers and organizations.
                    </p>
                </div>

                <form className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Full name</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                                type="text"
                                name="fullName"
                                required
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Student email</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="name@university.edu"
                                type="email"
                                name="email"
                                required
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Phone number</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                                name="phone"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Password</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                                name="password"
                                required
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2">
                        <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Organization / University</span>
                        <select
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none transition-all"
                            name="university"
                            defaultValue=""
                            required
                        >
                            <option disabled value="">Select your university</option>
                            <option value="cmua">Carnegie Mellon University Africa</option>
                            <option value="alu">African Leadership University</option>
                            <option value="ur">University of Rwanda</option>
                            <option value="other">Other</option>
                        </select>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Occupation (Education Type)</span>
                            <select
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none transition-all"
                                name="occupation"
                                defaultValue=""
                                required
                            >
                                <option disabled value="">Select educational type</option>
                                <option value="undergrad">Undergrad</option>
                                <option value="masters">Masters</option>
                                <option value="phd">PhD</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Education Level</span>
                            <select
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none transition-all"
                                name="educationLevel"
                                defaultValue=""
                                required
                            >
                                <option disabled value="">Select current year</option>
                                <option value="1">First year</option>
                                <option value="2">Second year</option>
                                <option value="3">Third year</option>
                                <option value="4">Fourth year+</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex items-start gap-3 py-2">
                        <input
                            className="mt-1 size-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary"
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                        />
                        <label className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed" htmlFor="terms">
                            I agree to the <Link className="text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>.
                        </label>
                    </div>

                    <Button variant="primary" size="lg" className="w-full rounded-xl" type="submit">
                        Create Account
                    </Button>

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
                        Already have an account? <Link className="text-primary font-semibold hover:underline" href="/login">Log in here</Link>
                    </p>
                </form>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
                        <p>© 2024 StudentNest. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link className="hover:text-primary transition-colors" href="#">Support</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
                            <Link className="hover:text-primary transition-colors" href="#">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
