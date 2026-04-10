'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { requestPasswordResetAction, confirmPasswordResetAction } from '@/app/actions/nestActions';
import type { PasswordResetRequest, PasswordResetConfirm } from '@/lib/types/api.types';

export default function PasswordResetPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [resetData, setResetData] = useState({
    access_token: '',
    new_password: '',
    confirm_password: '',
  });

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestPasswordResetAction({ email });

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess('Check your email for password reset instructions.');
        setTimeout(() => setStep('confirm'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (resetData.new_password !== resetData.confirm_password) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await confirmPasswordResetAction({
        access_token: resetData.access_token,
        new_password: resetData.new_password,
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
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
            Reset your password
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
            {step === 'request'
              ? 'Enter your email address and we\'ll send you instructions to reset your password.'
              : 'Enter the reset token from your email and your new password.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{success}</p>
          </div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Email address</span>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirmReset} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Reset Token</span>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Paste the token from your email"
                type="text"
                value={resetData.access_token}
                onChange={(e) => setResetData((prev) => ({ ...prev, access_token: e.target.value }))}
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">New Password</span>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                type="password"
                value={resetData.new_password}
                onChange={(e) => setResetData((prev) => ({ ...prev, new_password: e.target.value }))}
                required
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Confirm Password</span>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                type="password"
                value={resetData.confirm_password}
                onChange={(e) => setResetData((prev) => ({ ...prev, confirm_password: e.target.value }))}
                required
              />
            </label>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
