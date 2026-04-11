'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { registerLandlordAction } from '@/app/actions/nestActions';
import type { LandlordRegisterRequest } from '@/lib/types/api.types';

export default function LandlordRegistrationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<LandlordRegisterRequest>({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        national_id: '',
        address: '',
        business_name: undefined,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            // Validate step 1 fields
            if (!formData.full_name || !formData.email || !formData.phone || !formData.national_id || !formData.address) {
                setError('Please fill in all required fields');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Validate step 2 (password)
            if (!formData.password) {
                setError('Please enter a password');
                return;
            }
            // Submit registration
            submitRegistration();
        }
    };

    const submitRegistration = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await registerLandlordAction(formData);

            if (result.error) {
                setError(result.error.message);
                setIsLoading(false);
                return;
            }

            if (result.data) {
                // Ask landlord to confirm email before ID verification
                router.push('/landlord-registration/confirm-email');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center p-4 md:p-8 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Landlord Registration</h1>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Step {step} of 2</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }}></div>
                    </div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                        {step === 1
                            ? 'Please provide your personal identification details to begin your journey with StudentNest.'
                            : 'Create a secure password for your account.'}
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleNext} className="p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <>
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="full_name">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                        id="full_name"
                                        name="full_name"
                                        placeholder="Enter your full legal name"
                                        type="text"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email Address */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">mail</span>
                                        <input
                                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                            id="email"
                                            name="email"
                                            placeholder="name@example.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="phone">Phone Number</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-300 border-r-0 dark:border-slate-700 rounded-l-lg">
                                            +250
                                        </span>
                                        <input
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                            id="phone"
                                            name="phone"
                                            placeholder="7XX XXX XXX"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ID Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="national_id">National / Residence ID Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">badge</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                        id="national_id"
                                        name="national_id"
                                        placeholder="1 19XX X XXXXXXX X XX"
                                        type="text"
                                        value={formData.national_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 italic">Format: 16 digits as appearing on your ID card.</p>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="address">Home / Business Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-4 text-slate-400 text-sm">location_on</span>
                                    <textarea
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white resize-y"
                                        id="address"
                                        name="address"
                                        placeholder="Street name, Sector, District, Province"
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Step 2: Password */}
                    {step === 2 && (
                        <>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                        id="password"
                                        name="password"
                                        placeholder="Enter a secure password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500">Minimum 8 characters recommended for security</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="business_name">Business Name (Optional)</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">business</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                        id="business_name"
                                        name="business_name"
                                        placeholder="e.g., Your Property Management Company"
                                        type="text"
                                        value={formData.business_name || ''}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, business_name: e.target.value || undefined }))}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                        <Button 
                            variant="ghost" 
                            className="px-6 py-3" 
                            type="button"
                            onClick={() => step === 2 ? setStep(1) : router.push('/')}
                        >
                            {step === 2 ? 'Back' : 'Cancel'}
                        </Button>
                        <Button 
                            variant="primary" 
                            className="flex-grow md:flex-none md:min-w-[160px] px-8 py-3 flex items-center justify-center gap-2" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : step === 2 ? 'Create Account' : 'Next Step'}
                            {!isLoading && <span className="material-symbols-outlined text-sm">{step === 2 ? 'check' : 'arrow_forward'}</span>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

