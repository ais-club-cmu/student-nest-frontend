'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { loginAction } from '@/app/actions/nestActions';
import type { LoginRequest } from '@/lib/types/api.types';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') setVerified(true);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(formData);

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      if (result.data) {
        // Store tokens in localStorage (or use secure cookie in production)
        localStorage.setItem('accessToken', result.data.access_token);
        localStorage.setItem('refreshToken', result.data.refresh_token);
        localStorage.setItem('userRole', result.data.role);

        // Redirect based on role
        const role = result.data.role;
        if (role === 'landlord') {
          router.push('/landlord');
        } else if (role === 'student') {
          router.push('/listings');
        } else {
          // moderator, uni_admin, super_admin — any other privileged role
          router.push('/admin');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-[480px] flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome back
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
            Sign in to your StudentNest account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {verified && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 shrink-0">check_circle</span>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">Email confirmed! You can now sign in.</p>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <label className="flex flex-col gap-2">
            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Email address</span>
            <input
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="name@university.edu"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Password</span>
              <Link
                href="/password-reset"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </label>

          <Button
            variant="primary"
            size="lg"
            className="w-full mt-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="text-sm font-medium text-slate-500">Or</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            New to StudentNest?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
            Are you a landlord?{' '}
            <Link href="/landlord-registration" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
