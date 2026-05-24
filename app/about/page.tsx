import Link from 'next/link';

export const metadata = {
    title: 'About Us | StudentNest',
    description: 'StudentNest was built by CMU-Africa students to solve the real housing challenges faced by international students in Kigali, Rwanda.',
};

const TEAM: { name?: string; role: string; program?: string }[] = [
    {
        name: 'Emmilly Immaculate Namuganga',
        role: 'Frontend Engineer',
        program: 'MSEAI, CMU-Africa',
    },
    {
        name: 'Tracy Wanjiru',
        role: 'Frontend Engineer',
        program: 'MSIT, CMU-Africa',
    },
    {
        name: 'Innocent Ianyaele',
        role: 'Backend Engineer',
        program: 'MSEA, CMU-Africa',
    },
    { role: 'Backend Engineer' },
    { role: 'Product Manager' },
    { role: 'Product Manager' },
    { role: 'UX Designer' },
    { role: 'UX Designer' },
    { role: 'QA Tester' },
    { role: 'QA Tester' },
];

export default function AboutPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-950/50">

            {/* Hero */}
            <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
                            Built at CMU-Africa · Kigali, Rwanda
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                            Housing should be the <span className="text-primary">last</span> thing you worry about.
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            StudentNest was born out of a real problem we experienced as international students arriving in Kigali. Finding safe, affordable, verified housing near campus is harder than it should be. We built the platform we wished existed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Origin story */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Why we built this</h2>
                        <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <p>
                                When students arrive at <strong className="text-slate-900 dark:text-white">Carnegie Mellon University Africa</strong> in Kigali, many are coming from outside Rwanda for the first time. They rely on WhatsApp groups, word-of-mouth, and sheer luck to find somewhere to live — often weeks before the semester starts.
                            </p>
                            <p>
                                Landlords post the same listing across five channels. Students overpay, get scammed, or end up in unsuitable accommodation. The market works, but only barely.
                            </p>
                            <p>
                                As MSIT students ourselves, we had the skills to fix it. StudentNest brings listings, verification, and trust into one place — so the first week of grad school can be about orientation, not housing panic.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: 'verified_user', label: 'KYC-verified landlords', desc: 'Every landlord is identity-checked before their listings go live.' },
                            { icon: 'location_on', label: 'Near campus', desc: 'Listings are filtered by Kigali neighbourhood so commute time is clear.' },
                            { icon: 'security', label: 'Scam reporting', desc: 'Any listing can be flagged and escalated to moderators instantly.' },
                            { icon: 'school', label: 'Student-first', desc: 'Pricing, lease lengths, and rules are tailored for student lifestyles.' },
                        ].map(({ icon, label, desc }) => (
                            <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-3">
                                <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{label}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CMU-Africa section */}
            <section className="bg-primary/5 dark:bg-primary/10 border-y border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-10">
                    <div className="shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-3xl">school</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Our University</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Carnegie Mellon University Africa</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
                            CMU-Africa, located in Kigali, Rwanda, is the only Carnegie Mellon campus outside the United States. It offers graduate-level engineering and technology programs with a focus on addressing Africa&apos;s most pressing challenges. StudentNest is one of those solutions — built by students, for students.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">The team</h2>
                    <p className="text-slate-500 dark:text-slate-400">Students across CMU-Africa programs building the platform together.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TEAM.map(({ name, role, program }, i) => {
                        const filled = !!name;
                        const initials = filled ? name!.slice(0, 2).toUpperCase() : '?';
                        return (
                            <div key={`${role}-${i}`} className={`bg-white dark:bg-slate-900 rounded-xl border p-6 flex items-center gap-4 ${filled ? 'border-slate-200 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${filled ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                    {initials}
                                </div>
                                <div>
                                    {filled ? (
                                        <>
                                            <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                                            <p className="text-sm text-slate-500">{role}</p>
                                            {program && <p className="text-xs text-primary font-medium mt-0.5">{program}</p>}
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-medium text-slate-400 dark:text-slate-500">{role}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">Coming soon</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Ready to find your place in Kigali?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Browse verified listings near CMU-Africa and move in with confidence.</p>
                    <Link href="/listings">
                        <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">search</span>
                            Browse Listings
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
