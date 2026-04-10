'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { registerStudentAction } from '@/app/actions/nestActions';
import type { StudentRegisterRequest, EducationLevel } from '@/lib/types/api.types';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        occupation_type: '',
        educational_type: '',
        education_level: '' as EducationLevel | '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!formData.education_level) {
                setError('Please select an education level');
                setIsLoading(false);
                return;
            }

            const payload: StudentRegisterRequest = {
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone && formData.phone.trim() ? formData.phone : undefined,
                password: formData.password,
                occupation_type: formData.occupation_type || undefined,
                educational_type: formData.educational_type || undefined,
                education_level: formData.education_level as EducationLevel,
            };

            console.log('Submitting registration with payload:', JSON.stringify(payload, null, 2));
            const result = await registerStudentAction(payload);
            console.log('Registration result:', result);

            if (result.error) {
                console.error('Registration error:', result.error);
                setError(result.error.message || 'Registration failed');
                setIsLoading(false);
                return;
            }

            if (result.data) {
                console.log('Registration successful:', result.data);
                // Redirect to verify page
                router.push('/verify');
            } else {
                setError('No response received from server. Please try again.');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-[640px] flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
                        Create your account
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
                        Join the StudentNest community to connect with peers and organizations.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Full name</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
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
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Password</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Occupation Type</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Student, Working Professional"
                                type="text"
                                name="occupation_type"
                                value={formData.occupation_type}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Educational Type</span>
                            <input
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Full-time, Part-time"
                                type="text"
                                name="educational_type"
                                value={formData.educational_type}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <label className="flex flex-col gap-2">
                        <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Education Level</span>
                        <select
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none transition-all"
                            name="education_level"
                            value={formData.education_level}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select your education level</option>
                            <option value="undergrad">Undergraduate</option>
                            <option value="masters">Master's</option>
                            <option value="phd">PhD</option>
                            <option value="other">Other</option>
                        </select>
                    </label>

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

                    <Button variant="primary" size="lg" className="w-full rounded-xl" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
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
