'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Detects Supabase auth hash fragments (e.g. #access_token=...&type=recovery)
 * that land on any page and redirects them to the right destination.
 *
 * Supabase appends these fragments to the configured site URL (/) rather than
 * a dedicated callback route, so this runs globally in the layout.
 */
export default function AuthHashHandler() {
    const router = useRouter();

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;

        const params = new URLSearchParams(hash.slice(1)); // strip leading #
        const type = params.get('type');
        const accessToken = params.get('access_token');

        if (type === 'recovery' && accessToken) {
            // Clear the hash so we don't re-trigger on back navigation
            window.history.replaceState(null, '', window.location.pathname);
            router.replace(`/password-reset?token=${encodeURIComponent(accessToken)}`);
        }
    }, [router]);

    return null;
}
