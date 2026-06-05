'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { registerStudentAction } from '@/app/actions/nestActions';
import type { StudentRegisterRequest, EducationLevel } from '@/lib/types/api.types';
import { PASSWORD_RULES, friendlyApiError, validateField } from '@/lib/utils/registerValidation';

// ── Input + error wrapper ─────────────────────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {msg}
        </p>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        occupation_type: '',
        educational_type: '',
        education_level: '' as EducationLevel | '',
    });

    // tracks which fields the user has left at least once
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    // inline error per field
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setApiError(null);
        // re-validate live once the field has been touched
        if (touched[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    // border colour helper
    const inputClass = (name: string) => {
        const hasError = touched[name] && fieldErrors[name];
        const isOk = touched[name] && !fieldErrors[name] && formData[name as keyof typeof formData];
        return [
            'w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 outline-none transition-all',
            hasError
                ? 'border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-400/40'
                : isOk
                ? 'border-emerald-400 dark:border-emerald-500 focus:ring-2 focus:ring-emerald-400/40'
                : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-transparent',
        ].join(' ');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // validate all required fields before submitting
        const required = ['full_name', 'email', 'password', 'education_level'];
        const newErrors: Record<string, string> = {};
        const newTouched: Record<string, boolean> = { ...touched };
        for (const name of required) {
            newTouched[name] = true;
            newErrors[name] = validateField(name, formData[name as keyof typeof formData] as string);
        }
        if (formData.phone) newErrors.phone = validateField('phone', formData.phone);
        setTouched(newTouched);
        setFieldErrors((prev) => ({ ...prev, ...newErrors }));
        if (Object.values(newErrors).some(Boolean)) return;

        setIsLoading(true);
        setApiError(null);

        const payload: StudentRegisterRequest = {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone.trim() || undefined,
            password: formData.password,
            occupation_type: formData.occupation_type || undefined,
            educational_type: formData.educational_type || undefined,
            education_level: formData.education_level as EducationLevel,
        };

        const result = await registerStudentAction(payload);
        setIsLoading(false);

        if (result.error) {
            setApiError(friendlyApiError(result.error.message || 'Registration failed. Please try again.'));
            return;
        }

        if (result.data) {
            router.push('/verify');
        } else {
            setApiError('No response from server. Please try again.');
        }
    };

    const pwRules = PASSWORD_RULES.map((r) => ({ ...r, met: r.test(formData.password) }));
    const showPwChecklist = passwordFocused || (touched.password && !!formData.password);

    return (
        <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-[640px] flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
                        Create your account
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base leading-normal">
                        Join the StudentNest community to connect with peers and organisations.
                    </p>
                </div>

                {/* CMU email notice */}
                <div className="flex items-start gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">school</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold">CMU students only.</span> You must register with your{' '}
                        <span className="font-mono font-semibold text-primary">@andrew.cmu.edu</span> email address.
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

                    {/* API-level error */}
                    {apiError && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 shrink-0">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{apiError}</p>
                        </div>
                    )}

                    {/* Full name + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="full_name">
                                Full name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="full_name"
                                className={inputClass('full_name')}
                                placeholder="Jane Doe"
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="name"
                            />
                            <FieldError msg={touched.full_name ? fieldErrors.full_name ?? '' : ''} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="email">
                                Student email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                className={inputClass('email')}
                                placeholder="name@andrew.cmu.edu"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="email"
                            />
                            <FieldError msg={touched.email ? fieldErrors.email ?? '' : ''} />
                        </div>
                    </div>

                    {/* Phone + Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="phone">
                                Phone number <span className="text-slate-400 font-normal text-xs">(optional)</span>
                            </label>
                            <input
                                id="phone"
                                className={inputClass('phone')}
                                placeholder="+250 700 000 000"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="tel"
                            />
                            <FieldError msg={touched.phone ? fieldErrors.phone ?? '' : ''} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    className={`${inputClass('password')} pr-12`}
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={(e) => { setPasswordFocused(false); handleBlur(e); }}
                                    onFocus={() => setPasswordFocused(true)}
                                    autoComplete="new-password"
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
                            {showPwChecklist && (
                                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                                    {pwRules.map((r) => (
                                        <div key={r.id} className="flex items-center gap-2">
                                            <span className={`material-symbols-outlined text-[16px] shrink-0 ${r.met ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}>
                                                {r.met ? 'check_circle' : 'radio_button_unchecked'}
                                            </span>
                                            <span className={`text-xs ${r.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {r.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Only show the single failing rule as an error after blur if checklist is hidden */}
                            {!showPwChecklist && touched.password && fieldErrors.password && (
                                <FieldError msg={fieldErrors.password} />
                            )}
                        </div>
                    </div>

                    {/* Occupation + Educational type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="occupation_type">
                                Occupation type <span className="text-slate-400 font-normal text-xs">(optional)</span>
                            </label>
                            <input
                                id="occupation_type"
                                className={inputClass('occupation_type')}
                                placeholder="e.g. Student, Working Professional"
                                type="text"
                                name="occupation_type"
                                value={formData.occupation_type}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="educational_type">
                                Educational type <span className="text-slate-400 font-normal text-xs">(optional)</span>
                            </label>
                            <input
                                id="educational_type"
                                className={inputClass('educational_type')}
                                placeholder="e.g. Full-time, Part-time"
                                type="text"
                                name="educational_type"
                                value={formData.educational_type}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Education level */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-900 dark:text-slate-100 text-sm font-semibold" htmlFor="education_level">
                            Education level <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="education_level"
                            className={`${inputClass('education_level')} appearance-none`}
                            name="education_level"
                            value={formData.education_level}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            <option value="">Select your education level</option>
                            <option value="undergrad">Undergraduate</option>
                            <option value="masters">Master&apos;s</option>
                            <option value="phd">PhD</option>
                            <option value="other">Other</option>
                        </select>
                        <FieldError msg={touched.education_level ? fieldErrors.education_level ?? '' : ''} />
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 py-2">
                        <input
                            className="mt-1 size-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary"
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                        />
                        <label className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed" htmlFor="terms">
                            I agree to the{' '}
                            <Link className="text-primary hover:underline" href="/terms#terms" target="_blank">Terms of Service</Link>
                            {' '}and{' '}
                            <Link className="text-primary hover:underline" href="/terms#privacy" target="_blank">Privacy Policy</Link>.
                        </label>
                    </div>

                    <Button variant="primary" size="lg" className="w-full rounded-xl" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating Account…' : 'Create Account'}
                    </Button>

                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link className="text-primary font-semibold hover:underline" href="/login">Log in here</Link>
                    </p>
                </form>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
                        <p>© 2024 StudentNest. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link className="hover:text-primary transition-colors" href="#">Support</Link>
                            <Link className="hover:text-primary transition-colors" href="/terms#privacy">Privacy</Link>
                            <Link className="hover:text-primary transition-colors" href="/terms#terms">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
