import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function StudentApplicationDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col bg-background-light dark:bg-slate-950/50 font-display">
            {/* Navigation Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/landlord" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="text-primary size-8 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">home_work</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Landlord Portal</h2>
                    </Link>
                </div>
                <div className="flex flex-1 justify-end gap-4 items-center">
                    <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Alex Johnson</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Property Manager</p>
                        </div>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20"
                            data-alt="Landlord profile professional headshot"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6ARe5lZxWk_4keBB7vfTeEFc5FHAKhOco3ODwOrROawKroIJIfbLRcSTy_nZ3INncF9l2mwuqVyA5sM-JzQvh9vFm7VmPVrgeYPVDftgPNKQp-rrDDuxYsPoTrDiczIZWaePWPpBJe7YKRGzcHyGbVnlk3Ve2l2UJl6PyjLX8NmTj6_mUwcmmoHKn9SpDyQbuaap8Qd5QDWDW07Ibelki9wpye0TPxdYX62ddkmL0YquqQP0RLVzaHt0basUOXyPsMx4h0FbraJCy")' }}
                        ></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-[1200px] mx-auto w-full p-4 md:p-8 gap-8">
                {/* Profile Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-6 items-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 md:size-32 border-4 border-primary/10"
                                data-alt="Student profile photo of Kofi Mensah"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFpKRmV3TpVuGuIWG9l7hWHgVa3uiT4TOCCdSj10fF39N2aMiXZwf85R5dN7Gd7lxrsKBs_IKY0r0ejxpN15TV-E5HqXRDYvBVT8AVbfLfLcpuwG8bTxZ_B_L-WTxxdxl7ZJ-qUZzQuw_KcSDhmFqnM1IErvz2JymbzfsKtbWFUNuDFiaxtPYEkBSE5lKv9OLXFwq8_LPFU6FtMdlk_gstFLacDv00LaPktgOPi4ardIkg5xkprh9jvyj4MfRr-pHeXqd2Jd5knacm")' }}
                            ></div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h1 className="text-slate-900 dark:text-slate-100 text-2xl md:text-3xl font-bold tracking-tight">Kofi Mensah</h1>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold rounded-full uppercase tracking-wider">Pending</span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-base flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">school</span> MSIT Student • CMU-Africa
                                </p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Applied on Oct 12, 2023 • Ref: #APP-2024-089</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-lg">mail</span>
                                Message
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white font-bold hover:opacity-90 transition-opacity shadow-sm">
                                <span className="material-symbols-outlined text-lg">calendar_today</span>
                                Schedule Interview
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation Tabs */}
                        <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8 overflow-x-auto whitespace-nowrap">
                            <button className="border-b-2 border-primary text-primary pb-3 font-bold text-sm">Application Details</button>
                            <button className="border-b-2 border-transparent text-slate-500 pb-3 font-bold text-sm hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Conversation History</button>
                            <button className="border-b-2 border-transparent text-slate-500 pb-3 font-bold text-sm hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Activity Log</button>
                        </div>

                        {/* Academic & Personal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">auto_stories</span> Academic Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500 text-sm">University</span>
                                        <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">CMU-Africa</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500 text-sm">Program</span>
                                        <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">MSIT</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <span className="text-slate-500 text-sm">Cohort</span>
                                        <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">Class of 2024</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 text-sm">Student ID Status</span>
                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-bold uppercase tracking-tighter">
                                            <span className="material-symbols-outlined text-sm">verified</span> Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span> Personal Info
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Home Country</p>
                                        <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">Ghana</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Bio</p>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                            Incoming MSIT student focusing on software engineering. Quiet, tidy, and looking for a study-friendly environment. Non-smoker.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Housing Preferences */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bed</span> Housing Preferences
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Move-in Date</p>
                                    <p className="text-slate-900 dark:text-slate-100 font-bold">Aug 15, 2024</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Monthly Budget</p>
                                    <p className="text-primary font-bold text-lg">$450 - $600</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Room Preference</p>
                                    <p className="text-slate-900 dark:text-slate-100 font-bold">Ensuite Private</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">description</span> Uploaded Documents
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Passport_Kofi_M.pdf</p>
                                            <p className="text-[10px] text-slate-500">Government ID • 1.2 MB</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-500">description</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Enrollment_Letter_2024.pdf</p>
                                            <p className="text-[10px] text-slate-500">Proof of Enrollment • 850 KB</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">download</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Notes & Quick Actions */}
                    <div className="space-y-6">
                        {/* Landlord Notes */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">sticky_note_2</span> Landlord Notes
                            </h3>
                            <div className="mb-4 space-y-3">
                                <div className="p-3 bg-blue-50/50 dark:bg-primary/5 rounded-lg border-l-4 border-primary">
                                    <p className="text-xs text-slate-500 mb-1">Oct 14 • Internal Note</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">"Spoke to references in Ghana. Very positive feedback on character and punctuality."</p>
                                </div>
                            </div>
                            <textarea
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:ring-1 focus:ring-primary focus:border-primary p-3 min-h-[100px] transition-all resize-y outline-none"
                                placeholder="Add a private note about this student..."
                                name="landlord_notes"
                            ></textarea>
                            <button className="mt-3 w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Save Note
                            </button>
                        </div>

                        {/* Message History Snippet */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">forum</span> Recent Messages
                            </h3>
                            <div className="space-y-4 mb-4">
                                <div className="flex flex-col items-start">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none max-w-[90%] border border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-800 dark:text-slate-200">Hi, I'm interested in the ensuite room. Is it available for August move-in?</p>
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 ml-1">Kofi • 2:14 PM</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="bg-primary p-3 rounded-2xl rounded-tr-none max-w-[90%]">
                                        <p className="text-sm text-white">Yes, Kofi! We have one left. Would you like to schedule a virtual tour?</p>
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 mr-1">You • 2:30 PM</span>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-2 pl-4 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Reply to Kofi..."
                                    type="text"
                                    name="chat_reply"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors p-1 flex items-center justify-center">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>

                        {/* Action Bar (Sidebar Style) */}
                        <div className="flex flex-col gap-3 pt-2">
                            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-sm">
                                <span className="material-symbols-outlined">check_circle</span>
                                Approve Application
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900">
                                <span className="material-symbols-outlined">block</span>
                                Reject Application
                            </button>
                            <p className="text-center text-[11px] text-slate-400 mt-2 px-4 italic">
                                Approving will automatically generate a lease agreement template for the student.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer for additional metadata */}
            <footer className="mt-auto py-10 px-6 border-t border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
                <p className="text-slate-400 text-xs">© 2024 Housing Portal • All Data Protected • Verified CMU-Africa Housing Partner</p>
            </footer>
        </div>
    );
}
