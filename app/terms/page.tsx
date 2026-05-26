import Link from 'next/link';

const LAST_UPDATED = 'May 2026';

export default function TermsAndPrivacyPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-950/50">
            {/* Hero */}
            <section className="bg-primary text-white py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="material-symbols-outlined text-5xl mb-4 block opacity-80">gavel</span>
                    <h1 className="text-4xl font-black mb-3">Terms & Privacy</h1>
                    <p className="text-primary-100 text-lg opacity-90">
                        How we operate and how we protect your data.
                    </p>
                    <p className="text-sm opacity-60 mt-3">Last updated: {LAST_UPDATED}</p>
                </div>
            </section>

            {/* Jump links */}
            <div className="sticky top-16 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6 overflow-x-auto whitespace-nowrap py-3 text-sm font-semibold">
                        <a href="#terms" className="text-primary hover:underline shrink-0">Terms of Service</a>
                        <a href="#privacy" className="text-primary hover:underline shrink-0">Privacy Policy</a>
                        <a href="#contact" className="text-primary hover:underline shrink-0">Contact</a>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* ── Terms of Service ── */}
                <section id="terms" className="scroll-mt-32">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Terms of Service</h2>
                    <p className="text-sm text-slate-400 mb-8">Effective: {LAST_UPDATED}</p>

                    <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                            <p>
                                By creating an account or using StudentNest (the &quot;Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. StudentNest is operated by the StudentNest team at Carnegie Mellon University Africa, Kigali, Rwanda.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Who Can Use StudentNest</h3>
                            <p>
                                StudentNest is intended for students enrolled at Carnegie Mellon University Africa and verified landlords offering accommodation in the Greater Kigali area. You must be at least 18 years old to register. By registering, you confirm that the information you provide is accurate and complete.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Student Accounts</h3>
                            <p>
                                Students may browse listings, save favourites, contact landlords, and indicate interest in a property. You are responsible for maintaining the security of your account credentials. Any activity under your account is your responsibility. Do not share your login details with others.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Landlord Accounts & KYC</h3>
                            <p>
                                Landlords must complete identity verification (KYC) before their listings are published. By submitting KYC documents, you confirm that all submitted materials are genuine and belong to you. Listings must accurately represent the property. Misleading descriptions, false photos, or fraudulent pricing are grounds for immediate suspension.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Listing Content</h3>
                            <p>
                                Landlords are solely responsible for the accuracy of their listings. StudentNest moderates listings before they go live but does not guarantee the accuracy of any listing content. All listings must comply with Rwandan housing laws and regulations. Pricing must be expressed in Rwandan Francs (RWF).
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Prohibited Conduct</h3>
                            <ul className="list-disc pl-5 space-y-1.5 mt-2">
                                <li>Posting false, misleading, or fraudulent listings.</li>
                                <li>Harassing, threatening, or abusing other users.</li>
                                <li>Attempting to bypass verification or moderation processes.</li>
                                <li>Using the Platform for any unlawful purpose.</li>
                                <li>Scraping, copying, or redistributing Platform content without permission.</li>
                                <li>Creating multiple accounts to circumvent a suspension.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">7. Scam Reporting</h3>
                            <p>
                                Users may report suspicious listings. Reports are reviewed by moderators. StudentNest reserves the right to remove listings and suspend accounts found to be fraudulent. StudentNest is not liable for losses arising from transactions conducted outside the Platform.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">8. Intellectual Property</h3>
                            <p>
                                All Platform content, design, and code are the property of StudentNest. Users retain ownership of content they submit (such as listing photos) but grant StudentNest a non-exclusive licence to display that content on the Platform.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">9. Limitation of Liability</h3>
                            <p>
                                StudentNest is provided &quot;as is&quot; without warranties of any kind. We are not party to any rental agreement between students and landlords. We are not liable for any loss, damage, or injury arising from the use of the Platform or from rental arrangements made through it.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">10. Changes to These Terms</h3>
                            <p>
                                We may update these Terms at any time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms. We will notify registered users of material changes via the in-app notification system.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* ── Privacy Policy ── */}
                <section id="privacy" className="scroll-mt-32">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Privacy Policy</h2>
                    <p className="text-sm text-slate-400 mb-8">Effective: {LAST_UPDATED}</p>

                    <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Information We Collect</h3>
                            <p className="mb-3">We collect information you provide directly when you register or use the Platform:</p>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Account data:</span> Full name, email address, phone number, and password (stored as a secure hash).</li>
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Student profile:</span> Program, academic year, arrival and departure dates, housing preferences.</li>
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Landlord KYC:</span> National ID, address, business name, and uploaded identity documents.</li>
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Listing content:</span> Property addresses, photos, pricing, and availability calendars.</li>
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Usage data:</span> Pages visited, actions taken, and device/browser information for analytics and security.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. How We Use Your Information</h3>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>To operate and improve the Platform.</li>
                                <li>To verify landlord identities and moderate listings.</li>
                                <li>To connect students with suitable accommodation.</li>
                                <li>To send notifications about applications, messages, and account activity.</li>
                                <li>To detect and prevent fraud, abuse, and security incidents.</li>
                                <li>To comply with legal obligations under Rwandan law.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. How We Share Your Information</h3>
                            <p className="mb-3">We do not sell your personal data. We may share limited information in the following cases:</p>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Between users:</span> When a student applies to a listing, their name and program may be shared with the landlord. Landlord names and listing details are shown to logged-in students.</li>
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Service providers:</span> We use Supabase for data storage and authentication. These providers process data on our behalf under strict confidentiality obligations.</li>
                                <li><span className="font-semibold text-slate-700 dark:text-slate-300">Legal requirements:</span> We may disclose data if required by law or to protect the rights and safety of users.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Data Retention</h3>
                            <p>
                                We retain your account data for as long as your account is active. KYC documents are retained for the duration required by applicable regulations. You may request deletion of your account and associated data by contacting us — see Section 7.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Security</h3>
                            <p>
                                We use industry-standard measures including encrypted storage, HTTPS, and hashed passwords to protect your data. No system is completely secure, and we cannot guarantee absolute security. Please notify us immediately if you suspect unauthorised access to your account.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Your Rights</h3>
                            <p className="mb-3">You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-1.5">
                                <li>Access the personal data we hold about you.</li>
                                <li>Correct inaccurate or incomplete data.</li>
                                <li>Request deletion of your data, subject to legal obligations.</li>
                                <li>Withdraw consent for processing where consent is the legal basis.</li>
                                <li>Lodge a complaint with the relevant data protection authority in Rwanda.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">7. Cookies & Analytics</h3>
                            <p>
                                StudentNest uses essential cookies for authentication and session management. We may use anonymised analytics to understand how the Platform is used. We do not use third-party advertising cookies.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">8. Changes to This Policy</h3>
                            <p>
                                We may update this Privacy Policy from time to time. We will post the revised policy on this page with an updated effective date and notify you via the in-app notification system for material changes.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="border-t border-slate-200 dark:border-slate-800" />

                {/* Contact */}
                <section id="contact" className="scroll-mt-32">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Contact Us</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        If you have questions about these Terms or our Privacy Policy, or wish to exercise your data rights, please reach out to the StudentNest team.
                    </p>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-primary text-xl">school</span>
                            <span>Carnegie Mellon University Africa, Kigali, Rwanda</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-primary text-xl">mail</span>
                            <a href="mailto:studentnest@andrew.cmu.edu" className="text-primary hover:underline">studentnest@andrew.cmu.edu</a>
                        </div>
                    </div>
                </section>

                {/* Back to register */}
                <div className="text-center pt-4">
                    <Link href="/register" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Back to Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
