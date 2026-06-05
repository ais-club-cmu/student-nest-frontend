'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { refreshTokensAction } from '@/app/actions/nestActions';

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

        // Let the dedicated callback page handle its own hash to avoid a redirect loop
        if (window.location.pathname === '/auth/callback') return;

        const params = new URLSearchParams(hash.slice(1)); // strip leading #
        const type = params.get('type');
        const accessToken = params.get('access_token');
        const error = params.get('error');

        // Expired or invalid link — hand off to auth/callback for the error UI
        if (error) {
            window.location.replace('/auth/callback' + hash);
            return;
        }

        if (!type || !accessToken) return;

        // Clear the hash so we don't re-trigger on back navigation
        window.history.replaceState(null, '', window.location.pathname);

        if (type === 'recovery') {
            router.replace(`/password-reset?token=${encodeURIComponent(accessToken)}`);
            return;
        }

        if (type === 'signup') {
            const supabaseRefreshToken = params.get('refresh_token');

            if (!supabaseRefreshToken) {
                // No refresh token — can't establish a backend session; send to login
                router.replace('/login?verified=true');
                return;
            }

            // Exchange the Supabase refresh token for a backend-issued token+role.
            // The raw Supabase JWT is NOT accepted by the backend for authenticated
            // requests; we must go through /api/v1/auth/refresh first.
            refreshTokensAction({ refresh_token: supabaseRefreshToken }).then((result) => {
                if (result.data) {
                    localStorage.setItem('accessToken', result.data.access_token);
                    localStorage.setItem('refreshToken', result.data.refresh_token);
                    localStorage.setItem('userRole', result.data.role);

                    if (result.data.role === 'landlord') {
                        router.replace('/landlord-registration/id-verification');
                    } else {
                        // Students and other roles go straight to the app
                        router.replace('/listings');
                    }
                } else {
                    // Exchange failed — fall back to manual login
                    router.replace('/login?verified=true');
                }
            });
        }
    }, [router]);

    return null;
}
