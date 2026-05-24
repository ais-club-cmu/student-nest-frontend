import Link from 'next/link';

export const metadata = {
    title: 'Partners | StudentNest',
    description: 'StudentNest proudly partners with Carnegie Mellon University Africa and leading institutions in Rwanda to solve student housing.',
};

const ACADEMIC_PARTNERS = [
    {
        name: 'Carnegie Mellon University Africa',
        shortName: 'CMU-Africa',
        icon: 'school',
        location: 'Kigali, Rwanda',
        description:
            'CMU-Africa is the only Carnegie Mellon campus outside the United States, offering world-class graduate engineering programs with a focus on solving Africa\'s development challenges. StudentNest was born here — built by MSIT students to solve the housing crisis their fellow students face every year.',
        tags: ['Academic Partner', 'Founding Institution'],
        highlight: true,
    },
    {
        name: 'CMU-Africa Entrepreneurship Club',
        shortName: 'E-Club',
        icon: 'rocket_launch',
        location: 'Carnegie Mellon University Africa, Kigali',
        description:
            'The CMU-Africa Entrepreneurship Club supports student-led ventures across East Africa, providing mentorship, resources, and a community for builders. StudentNest is proud to be backed by the E-Club as we turn a real student pain point into a scalable solution.',
        tags: ['Community Partner', 'Student Organisation'],
        highlight: false,
    },
];

const PARTNER_BENEFITS = [
    {
        icon: 'verified_user',
        title: 'Verified listings',
        desc: 'Every landlord connected through a partner institution goes through our KYC process before their listings are published.',
    },
    {
        icon: 'groups',
        title: 'Community trust',
        desc: 'Students arriving through partner institutions can be matched with housing communities familiar to their campus culture.',
    },
    {
        icon: 'support_agent',
        title: 'Priority support',
        desc: 'Partner institution students receive expedited housing support during high-demand periods like semester start.',
    },
    {
        icon: 'handshake',
        title: 'Institutional referrals',
        desc: 'Partner institutions can refer incoming students directly to verified listings, removing weeks of stressful searching.',
    },
];

export default function PartnersPage() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-950/50">

            {/* Hero */}
            <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
                            Partnerships
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
                            Built with institutions that <span className="text-primary">care</span> about students.
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            StudentNest works closely with universities and organisations in Kigali to ensure every incoming student has a safe, affordable, and verified place to call home.
                        </p>
                    </div>
                </div>
            </section>

            {/* Academic Partners */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="mb-12">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Our Partners</h2>
                    <p className="text-slate-500 dark:text-slate-400">Universities and organisations that shape the students we serve.</p>
                </div>

                <div className="flex flex-col gap-6">
                    {ACADEMIC_PARTNERS.map((partner) => (
                        <div
                            key={partner.name}
                            className={`bg-white dark:bg-slate-900 rounded-2xl border ${
                                partner.highlight
                                    ? 'border-primary/30 shadow-lg shadow-primary/5'
                                    : 'border-slate-200 dark:border-slate-800'
                            } p-8 flex flex-col md:flex-row gap-8 items-start`}
                        >
                            {/* Icon */}
                            <div className="shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-white text-3xl">{partner.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{partner.name}</h3>
                                    {partner.highlight && (
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Founding Partner</span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">location_on</span>
                                    {partner.location}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-4">
                                    {partner.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {partner.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* What partners get */}
            <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">What partnership means</h2>
                        <p className="text-slate-500 dark:text-slate-400">Benefits we extend to students and institutions through our partnerships.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PARTNER_BENEFITS.map(({ icon, title, desc }) => (
                            <div key={title} className="flex flex-col gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-background-light dark:bg-slate-950/50">
                                <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                                <p className="font-bold text-slate-900 dark:text-white">{title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Become a partner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-primary rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-white max-w-xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Get involved</p>
                        <h2 className="text-3xl font-black mb-3">Represent an institution?</h2>
                        <p className="text-white/80 leading-relaxed">
                            If you work at a university, student organisation, or housing body in Kigali, we'd love to explore how StudentNest can support your students. Reach out to us.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <a
                            href="mailto:contact@studentnest.rw"
                            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/90 shadow-lg"
                        >
                            <span className="material-symbols-outlined text-lg">mail</span>
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Looking for housing?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Browse verified listings near CMU-Africa and other Kigali campuses.</p>
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
