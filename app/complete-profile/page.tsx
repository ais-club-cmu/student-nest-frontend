'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { updateStudentProfileAction } from '@/app/actions/nestActions';
import type { StudentProfileUpdateRequest, AcademicYear } from '@/lib/types/api.types';

export default function CompleteProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [formData, setFormData] = useState<StudentProfileUpdateRequest>({
        cohort_year: undefined,
        home_country: undefined,
        program: undefined,
        bio: undefined,
        academic_year: undefined,
        housing_prefs: {
            room_type: 'private',
            budget: undefined,
        },
        is_seeking: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }
        setAccessToken(token);
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        
        if (type === 'number' && name === 'cohortYear') {
            setFormData((prev) => ({ ...prev, cohort_year: value ? parseInt(value) : undefined }));
        } else if (name === 'homeCountry') {
            setFormData((prev) => ({ ...prev, home_country: value || undefined }));
        } else if (name === 'programName') {
            setFormData((prev) => ({ ...prev, program: value || undefined }));
        } else if (name === 'bio') {
            setFormData((prev) => ({ ...prev, bio: value || undefined }));
        } else if (name === 'academicYear') {
            setFormData((prev) => ({ ...prev, academic_year: value as AcademicYear | undefined }));
        }
        setError(null);
    };

    const handleRoomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            housing_prefs: {
                ...(prev.housing_prefs as Record<string, any>),
                room_type: e.target.value,
            },
        }));
    };

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        setFormData((prev) => ({
            ...prev,
            housing_prefs: {
                ...(prev.housing_prefs as Record<string, any>),
                budget: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) {
            setError('Authentication required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await updateStudentProfileAction(accessToken, formData);

            if (result.error) {
                setError(result.error.message);
                setIsLoading(false);
                return;
            }

            if (result.data) {
                router.push('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-1 justify-center py-10 px-4 md:px-0 min-h-[calc(100vh-80px)]">
            <div className="flex flex-col max-w-[640px] flex-1">
                {/* Header Section */}
                <div className="flex flex-col gap-3 p-4 text-center">
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
                        Complete your profile
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
                        Help us find the best matches for your student journey and housing needs.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    {error && (
                        <div className="flex items-center gap-3 p-4 mx-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Academic Details */}
                    <section className="mt-6">
                        <div className="flex items-center gap-2 px-4 pb-3 pt-5">
                            <span className="material-symbols-outlined text-primary">school</span>
                            <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                Academic Details
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3">
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Cohort Year</p>
                                <input
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                                    placeholder="e.g. 2024"
                                    type="number"
                                    name="cohortYear"
                                    value={formData.cohort_year || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Academic Year</p>
                                <select
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base appearance-none"
                                    name="academicYear"
                                    value={formData.academic_year || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Select academic year</option>
                                    <option value="year_1">Year 1</option>
                                    <option value="year_2">Year 2</option>
                                    <option value="year_3+">Year 3+</option>
                                    <option value="graduating">Graduating</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Home Country</p>
                                <input
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                                    placeholder="e.g. India"
                                    type="text"
                                    name="homeCountry"
                                    value={formData.home_country || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="flex flex-col md:col-span-2">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Program / Course Name</p>
                                <input
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                                    placeholder="e.g. MSc Computer Science"
                                    type="text"
                                    name="programName"
                                    value={formData.program || ''}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="flex flex-col md:col-span-2">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Short Bio</p>
                                <textarea
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-24 p-4 text-base resize-y"
                                    placeholder="Tell us a bit about yourself, your interests, and what you're looking for..."
                                    name="bio"
                                    value={formData.bio || ''}
                                    onChange={handleChange}
                                ></textarea>
                            </label>
                        </div>
                    </section>

                    {/* Housing Preferences */}
                    <section className="mt-6">
                        <div className="flex items-center gap-2 px-4 pb-3 pt-5">
                            <span className="material-symbols-outlined text-primary">home</span>
                            <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                Housing Preferences
                            </h2>
                        </div>
                        <div className="flex flex-col gap-6 px-4 py-3">
                            <div className="flex flex-col gap-3">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal">Room Type</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input 
                                            className="sr-only" 
                                            name="room_type" 
                                            type="radio" 
                                            value="private"
                                            checked={(formData.housing_prefs as any)?.room_type === 'private'}
                                            onChange={handleRoomTypeChange}
                                        />
                                        <span className="text-sm font-semibold">Private Room</span>
                                    </label>
                                    <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input 
                                            className="sr-only" 
                                            name="room_type" 
                                            type="radio" 
                                            value="shared"
                                            checked={(formData.housing_prefs as any)?.room_type === 'shared'}
                                            onChange={handleRoomTypeChange}
                                        />
                                        <span className="text-sm font-semibold">Shared Room</span>
                                    </label>
                                </div>
                            </div>
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Maximum Monthly Budget ($)</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                    <input
                                        className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-8 pr-4 text-base"
                                        placeholder="1200"
                                        type="number"
                                        name="budget"
                                        value={(formData.housing_prefs as any)?.budget || ''}
                                        onChange={handleBudgetChange}
                                    />
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 p-4 mt-8">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="w-full rounded-xl" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Complete Profile'}
                        </Button>
                        <button 
                            type="button"
                            onClick={() => router.push('/')}
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-transparent text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <span className="truncate">I'll do this later</span>
                        </button>
                    </div>
                </form>

                {/* Footer Help */}
                <div className="p-4 text-center">
                    <p className="text-slate-400 text-xs">
                        Your data is stored securely and used only to improve your experience on StudentNest.
                    </p>
                </div>
            </div>
        </div>
    );
}
                    {/* Academic Details */}
                    <section className="mt-6">
                        <div className="flex items-center gap-2 px-4 pb-3 pt-5">
                            <span className="material-symbols-outlined text-primary">school</span>
                            <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                Academic Details
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3">
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Cohort Year</p>
                                <input
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                                    placeholder="e.g. 2024"
                                    type="number"
                                    name="cohortYear"
                                />
                            </label>
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Home Country</p>
                                <input
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                                    placeholder="e.g. India"
                                    type="text"
                                    name="homeCountry"
                                />
                            </label>
                            <label className="flex flex-col md:col-span-2">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Program / Course Name</p>
                                <input
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                                    placeholder="e.g. MSc Computer Science"
                                    type="text"
                                    name="programName"
                                />
                            </label>
                            <label className="flex flex-col md:col-span-2">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Short Bio</p>
                                <textarea
                                    className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-24 p-4 text-base resize-y"
                                    placeholder="Tell us a bit about yourself, your interests, and what you're looking for..."
                                    name="bio"
                                ></textarea>
                            </label>
                        </div>
                    </section>

                    {/* Housing Preferences */}
                    <section className="mt-6">
                        <div className="flex items-center gap-2 px-4 pb-3 pt-5">
                            <span className="material-symbols-outlined text-primary">home</span>
                            <h2 className="text-slate-900 dark:text-slate-100 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                                Housing Preferences
                            </h2>
                        </div>
                        <div className="flex flex-col gap-6 px-4 py-3">
                            <div className="flex flex-col gap-3">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal">Room Type</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input defaultChecked className="sr-only" name="room_type" type="radio" value="private" />
                                        <span className="text-sm font-semibold">Private Room</span>
                                    </label>
                                    <label className="relative flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                        <input className="sr-only" name="room_type" type="radio" value="shared" />
                                        <span className="text-sm font-semibold">Shared Room</span>
                                    </label>
                                </div>
                            </div>
                            <label className="flex flex-col">
                                <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-normal pb-2">Maximum Monthly Budget ($)</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                    <input
                                        className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-8 pr-4 text-base"
                                        placeholder="1200"
                                        type="number"
                                        name="budget"
                                    />
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 p-4 mt-8">
                        <Button variant="primary" size="lg" className="w-full rounded-xl" type="submit">
                            Complete Profile
                        </Button>
                        <button type="button" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-transparent text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                            <span className="truncate">I'll do this later</span>
                        </button>
                    </div>
                </form>

                {/* Footer Help */}
                <div className="p-4 text-center">
                    <p className="text-slate-400 text-xs">
                        Your data is stored securely and used only to improve your experience on StudentNest.
                    </p>
                </div>
            </div>
        </div>
    );
}
