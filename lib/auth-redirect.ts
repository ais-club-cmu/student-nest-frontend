import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ApiError } from '@/lib/api';

export function isAuthError(error: ApiError | null | undefined): boolean {
    return error?.status === 401 || error?.status === 403;
}

export function clearAuthAndRedirect(router: AppRouterInstance): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
    }
    router.push('/login');
}

export function handleAuthError(
    error: ApiError | null | undefined,
    router: AppRouterInstance,
): boolean {
    if (isAuthError(error)) {
        clearAuthAndRedirect(router);
        return true;
    }
    return false;
}
