import React from 'react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(17,82,212,0.08)_0%,rgba(246,246,248,0)_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              Official Housing Partner for Rwandan Universities
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl">
              Find Your Home <span className="text-primary">Near Campus</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
              Secure, verified housing for university students. Partnering with top institutions in Rwanda to ensure your peace of mind.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl mt-4">
              <div className="relative flex items-center p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-200 dark:border-slate-800">
                <span className="material-symbols-outlined absolute left-5 text-slate-400">search</span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                  placeholder="Search by location or university (e.g. Kigali, ALU...)"
                  type="text"
                />
                <Button variant="primary" className="hidden md:block px-8 py-3 w-40">
                  Search
                </Button>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                100% Verified Listings
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                No Hidden Fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-white dark:bg-background-dark/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-slate-400 mb-10">Our University Partners</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3">
              <img alt="CMU-Africa Logo" className="h-12 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXhSNt4QItBaZoDjHiNI59g4gBCf2Qaib8jF9yhvkfS6w5Roq0XO1I9426EQ1nLYnczIV9vrQ6l8kOPd-68c-MTrxfXLJ9eVXzApe-BXP8S3V_3KFVMdcdwhrIuxFWVgkXIfaZFS5FlfKxl-GNCuomtSIzzHIZWoIXS0dcUiG6JCqt8VCxMUbJM78tMCCg6KT-owEEZOGsmfWKDCIp9xrmzH_whprniAZ5KjQ6AEhvnHlI5AkbvkphPfulEiukQ7ThUkmNDJCdaNf3" />
              <span className="font-bold text-xl text-slate-800 dark:text-slate-200">CMU-Africa</span>
            </div>
            <div className="flex items-center gap-3">
              <img alt="ALU Logo" className="h-12 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_Z5MgqSy7ez3CnIHLk8N2bOYXqVkpqfGX3IBO-xcl4D534MTXtOZiiE0xCW4gBICh8BzAMds5M-n4fHR_UwOAKYDjD7a6Sor5sgA-Wt-R8O-GpKLPzieQTDku7ckUP6ROefcXmhNIlrvT0l2ci0KCZN4g0vHD3c5sJJ2UQCmDY8Qcu5flCVxndbCeBATwgFQbUf1-fZzGEbTq7y_iWomUqldieI7JFSieQW6PF8OFY_CCbkahbqAcUpI5oarYqPQfTmB11YWsTnFu" />
              <span className="font-bold text-xl text-slate-800 dark:text-slate-200">ALU Rwanda</span>
            </div>
            <div className="flex items-center gap-3">
              <img alt="UR Logo" className="h-12 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu3t9jNUb8YfI2oMLh6xQWhJS1ssJxM9jlSexEQqlBeoYOLhTz1WHeEV1XJ9ZD-6L9SAn40Ve0tV_sFomQ9t7kQ358s4o7o-F0taysR-F956vKRwGfa4Y-zPXm1TG4EV8CpzEFczEIp6sVEhmpeSZbV6AQeAXkjgtgg_cF1SsX-9hiC2i-CB8Qqe7pGwG8_o6QBcfSyQhfUV_EmJbhsJ8wSvmyIMB7F0otPHozcSteHLGz0lwxbn5pz4CXUvfsK78krLSwt30LMY02" />
              <span className="font-bold text-xl text-slate-800 dark:text-slate-200">UR Rwanda</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Trust Layers */}
      <section className="py-24 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Built on Trust and Safety</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">We bridge the gap between students and landlords through institutional oversight.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">verified_user</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Verified Identity</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Mandatory student ID and landlord verification for every account on our platform.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">reviews</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Community Reviews</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Genuine feedback from verified student tenants helps you make informed decisions.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">payments</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Escrow Payments</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Your deposit is held securely until you move in and confirm the property state.</p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">account_balance</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Institutional Oversight</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Backed and monitored by local university administrations for maximum compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Landlords Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-primary/10 py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute inset-0 opacity-20 -z-10">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1073')] bg-cover bg-center"></div>
            </div>
            <div className="max-w-lg text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Maximize Your Occupancy with StudentNest</h2>
              <p className="text-slate-300 text-lg mb-8">List your property to a curated, verified community of thousands of students from Rwanda's top universities.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button variant="primary" className="py-4">List Your Property</Button>
                <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20">Learn More</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-bold text-white">5k+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Students</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Occupancy</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-bold text-white">0%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Scam Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
