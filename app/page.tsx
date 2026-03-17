import HousingListClient from "@/components/features/HousingListClient";
import { getHousingData } from "@/lib/api";

export default async function Home() {
  // Demo server component fetch
  const initialHousingData = await getHousingData();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 overflow-x-hidden">
      <div className="z-10 max-w-7xl w-full items-center justify-between font-sans text-sm lg:flex mb-12">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
          Discover New Homes
        </h1>
        <p className="items-center justify-center rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md px-6 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 mt-4 lg:mt-0 text-zinc-600 dark:text-zinc-300 font-medium">
          Tailored property recommendations
        </p>
      </div>

      <div className="relative flex place-items-center w-full max-w-7xl mb-16 px-4 sm:px-0">
        <div className="w-full h-[40vh] sm:h-[60vh] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-blue-100 via-indigo-50 to-rose-50 dark:from-indigo-950 dark:via-purple-900 dark:to-zinc-900 relative group flex items-center justify-center">
          {/* Fallback stylized block since we don't have an image fetched */}
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay"></div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-800 dark:text-zinc-200 z-10 text-center drop-shadow-lg tracking-tight px-4 transition-transform group-hover:scale-105 duration-700">
            Your gateway to luxury living
          </h2>
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <HousingListClient initialData={initialHousingData} />
      </div>
    </main>
  );
}
