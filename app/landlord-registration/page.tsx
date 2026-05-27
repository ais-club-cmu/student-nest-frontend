'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { registerLandlordAction } from '@/app/actions/nestActions';
import { getUserProfileAction } from '@/app/actions/nestActions';
import type { LandlordRegisterRequest } from '@/lib/types/api.types';
import { PASSWORD_RULES } from '@/lib/utils/registerValidation';

const COUNTRY_CODES = [
    { code: '+250', label: '🇷🇼 +250' },
    { code: '+256', label: '🇺🇬 +256' },
    { code: '+254', label: '🇰🇪 +254' },
    { code: '+255', label: '🇹🇿 +255' },
    { code: '+257', label: '🇧🇮 +257' },
    { code: '+243', label: '🇨🇩 +243' },
    { code: '+251', label: '🇪🇹 +251' },
    { code: '+27',  label: '🇿🇦 +27'  },
    { code: '+234', label: '🇳🇬 +234' },
    { code: '+233', label: '🇬🇭 +233' },
    { code: '+1',   label: '🇺🇸 +1'   },
    { code: '+44',  label: '🇬🇧 +44'  },
    { code: '+33',  label: '🇫🇷 +33'  },
    { code: '+91',  label: '🇮🇳 +91'  },
];

export default function LandlordRegistrationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState('+250');
    const [phoneLocal, setPhoneLocal] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [addressTouched, setAddressTouched] = useState(false);
    const [addressError, setAddressError] = useState('');

    const validateAddress = (val: string) => {
        if (!val.trim()) return 'Address is required.';
        if (val.trim().length < 10) return 'Please enter a more complete address (at least 10 characters).';
        return '';
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (!token || role !== 'landlord') return;
        getUserProfileAction(token).then((result) => {
            if (!result.data) return;
            const { kyc_status } = result.data;
            if (kyc_status === 'rejected') {
                router.replace('/landlord-registration/id-verification');
            } else {
                router.replace('/landlord/listings');
            }
        });
    }, [router]);
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
        // National ID: digits only, max 16 characters
        const sanitized = name === 'national_id' ? value.replace(/\D/g, '').slice(0, 16) : value;
        setFormData((prev) => ({ ...prev, [name]: sanitized }));
        setError(null);
        // Re-validate address live once the user has already blurred it
        if (name === 'address' && addressTouched) {
            setAddressError(validateAddress(sanitized));
        }
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            if (!formData.full_name || !formData.email || !formData.phone || !formData.national_id || !formData.address) {
                setError('Please fill in all required fields.');
                return;
            }
            const addrErr = validateAddress(formData.address);
            if (addrErr) {
                setAddressTouched(true);
                setAddressError(addrErr);
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.password) {
                setError('Please enter a password.');
                return;
            }
            const failedRule = PASSWORD_RULES.find((r) => !r.test(formData.password));
            if (failedRule) {
                setError(failedRule.label + ' — please update your password.');
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
                router.push(`/landlord-registration/confirm-email?email=${encodeURIComponent(formData.email)}`);
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
                                        <select
                                            value={countryCode}
                                            onChange={(e) => {
                                                setCountryCode(e.target.value);
                                                setFormData((prev) => ({ ...prev, phone: e.target.value + phoneLocal }));
                                            }}
                                            className="shrink-0 px-2 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 border-r-0 rounded-l-lg focus:ring-2 focus:ring-primary outline-none text-slate-700 dark:text-slate-300 text-sm cursor-pointer"
                                        >
                                            {COUNTRY_CODES.map(({ code, label }) => (
                                                <option key={code} value={code}>{label}</option>
                                            ))}
                                        </select>
                                        <div className="relative w-full">
                                            <input
                                                className="w-full px-4 py-3 pr-14 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                                id="phone"
                                                name="phone"
                                                placeholder="7XXXXXXXX"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={9}
                                                value={phoneLocal}
                                                onChange={(e) => {
                                                    // digits only, strip leading zero, max 9
                                                    const val = e.target.value
                                                        .replace(/\D/g, '')
                                                        .replace(/^0+/, '')
                                                        .slice(0, 9);
                                                    setPhoneLocal(val);
                                                    setFormData((prev) => ({ ...prev, phone: countryCode + val }));
                                                }}
                                                required
                                            />
                                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums ${
                                                phoneLocal.length === 9
                                                    ? 'text-emerald-500'
                                                    : phoneLocal.length > 0
                                                    ? 'text-slate-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                            }`}>
                                                {phoneLocal.length}/9
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        9 digits after the country code, no leading zero — e.g. <span className="font-medium text-slate-500 dark:text-slate-400">7XXXXXXXX</span>
                                    </p>
                                </div>
                            </div>

                            {/* ID Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="national_id">National / Residence ID Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">badge</span>
                                    <input
                                        className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                        id="national_id"
                                        name="national_id"
                                        placeholder="1199XXXXXXXXXXX"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={16}
                                        value={formData.national_id}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums ${
                                        formData.national_id.length === 16
                                            ? 'text-emerald-500'
                                            : formData.national_id.length > 0
                                            ? 'text-slate-400'
                                            : 'text-slate-300 dark:text-slate-600'
                                    }`}>
                                        {formData.national_id.length}/16
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 italic">16 digits, numbers only — as printed on your Rwandan ID card.</p>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="address">Home / Business Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-4 text-slate-400 text-sm">location_on</span>
                                    <textarea
                                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 rounded-lg focus:ring-2 outline-none transition-all dark:text-white resize-y ${
                                            addressTouched && addressError
                                                ? 'border-2 border-red-400 dark:border-red-500 focus:ring-red-400/40'
                                                : addressTouched && !addressError && formData.address
                                                ? 'border-2 border-emerald-400 dark:border-emerald-500 focus:ring-emerald-400/40'
                                                : 'border border-slate-300 dark:border-slate-700 focus:ring-primary focus:border-primary'
                                        }`}
                                        id="address"
                                        name="address"
                                        placeholder="e.g. Kimihurura, Gasabo, Kigali"
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleChange}
                                        onBlur={() => {
                                            setAddressTouched(true);
                                            setAddressError(validateAddress(formData.address));
                                        }}
                                        required
                                    />
                                </div>
                                {/* Inline error */}
                                {addressTouched && addressError && (
                                    <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                                        <span className="material-symbols-outlined text-[14px]">error</span>
                                        {addressError}
                                    </p>
                                )}
                                {/* Format hint */}
                                {!(addressTouched && addressError) && (
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        Include village/cell, sector, and district — e.g. <span className="font-medium text-slate-500 dark:text-slate-400">Zindiro, Kicukiro, Kigali</span>
                                    </p>
                                )}
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
                                        className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all dark:text-white"
                                        id="password"
                                        name="password"
                                        placeholder="Enter a secure password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>

                                {/* Password requirements checklist */}
                                {(passwordFocused || formData.password.length > 0) && (
                                    <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                                        {PASSWORD_RULES.map((r) => {
                                            const met = r.test(formData.password);
                                            return (
                                                <div key={r.id} className="flex items-center gap-2">
                                                    <span className={`material-symbols-outlined text-[16px] shrink-0 ${met ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}>
                                                        {met ? 'check_circle' : 'radio_button_unchecked'}
                                                    </span>
                                                    <span className={`text-xs ${met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {r.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
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

