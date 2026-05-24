'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const CHROME_FREE_ROUTES = ['/admin'];
const FOOTER_FREE_ROUTES = ['/landlord', '/student-portal', '/add-listing'];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideChrome = CHROME_FREE_ROUTES.some((route) => pathname?.startsWith(route));
    const hideFooter = FOOTER_FREE_ROUTES.some((route) => pathname?.startsWith(route));

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            {!hideFooter && <Footer />}
        </>
    );
}
