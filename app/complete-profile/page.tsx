import React from 'react';
import { Button } from '@/components/ui/Button';

export default function CompleteProfilePage() {
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

                {/* Profile Photo Section */}
                <div className="flex p-4 items-center justify-center">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="relative group cursor-pointer">
                            <div
                                className="bg-primary/10 dark:bg-primary/20 flex items-center justify-center aspect-square bg-cover rounded-full min-h-32 w-32 border-2 border-dashed border-primary/50"
                                data-alt="Placeholder for user profile photo upload"
                            >
                                <span className="material-symbols-outlined text-primary text-4xl">add_a_photo</span>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900">
                                <span className="material-symbols-outlined text-sm block">edit</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] text-center">
                                Profile Photo
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal text-center">
                                Click to upload JPG or PNG
                            </p>
                        </div>
                    </div>
                </div>

                <form className="flex flex-col">
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
