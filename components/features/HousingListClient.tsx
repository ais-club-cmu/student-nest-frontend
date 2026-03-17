'use client';

import { useHousingStore } from '@/store/useHousingStore';
import { submitHousingInquiry } from '@/app/actions/formHelpers';

export interface HousingItem {
    id: number;
    title: string;
    price: number;
}

interface HousingListClientProps {
    initialData: HousingItem[]; // Using proper types instead of any
}

export default function HousingListClient({ initialData }: HousingListClientProps) {
    const { favorites, addFavorite, removeFavorite } = useHousingStore();

    const handleInquiry = async (formData: FormData) => {
        // Calling server action directly from client component
        const result = await submitHousingInquiry(formData);
        if (result?.success) {
            alert(result.message);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Featured Properties</h2>
                <p className="text-zinc-500 font-medium">{favorites.length} Saved</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialData.map((item) => {
                    const id = item.id;
                    const isFavorite = favorites.includes(String(id));
                    return (
                        <div key={id} className="group flex flex-col justify-between p-6 rounded-2xl border border-zinc-200/50 bg-white/60 dark:bg-zinc-900/40 dark:border-zinc-800 backdrop-blur-sm shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-1">
                            <div>
                                <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6 overflow-hidden relative">
                                    {/* Placeholder for property images using next/image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600 font-medium">Property Image</div>
                                </div>
                                <h3 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100 tracking-tight">{item.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                                    Spacious 4 bedroom property with beautiful views and modern amenities.
                                </p>
                            </div>

                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <button
                                        onClick={() => isFavorite ? removeFavorite(String(id)) : addFavorite(String(id))}
                                        className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${isFavorite
                                                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20'
                                                : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {isFavorite ? '♥ Saved' : '♡ Save'}
                                    </button>
                                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">${item.price.toLocaleString()}</span>
                                </div>

                                {/* Form using Server Action */}
                                <form action={handleInquiry} className="flex flex-col gap-3 pt-5 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <input type="hidden" name="name" value={`User inquiring about ${item.title}`} />
                                    <input type="hidden" name="message" value="I would like more information." />
                                    <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                                        Quick Inquiry
                                    </button>
                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
