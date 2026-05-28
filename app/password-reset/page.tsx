'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  requestPasswordResetAction,
  confirmPasswordResetAction,
  fetchSecurityQuestionAction,
  verifySecurityQuestionAction,
} from '@/app/actions/nestActions';
import { PASSWORD_RULES } from '@/lib/utils/registerValidation';

function PasswordResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Steps:
  //  'email'    – enter email, look up security question
  //  'question' – answer security question to get reset token
  //  'confirm'  – set new password (reached via security question OR email link ?token=)
  //  'fallback' – no security question set; offer email link reset
  const [step, setStep] = useState<'email' | 'question' | 'confirm' | 'fallback'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [tokenTtl, setTokenTtl] = useState<number | null>(null); // countdown seconds
  const [tokenSource, setTokenSource] = useState<'url' | 'question'>('url');

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // If landing from an email link with ?token=..., skip to confirm step
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setResetToken(urlToken);
      setTokenSource('url');
      setStep('confirm');
    }
  }, [searchParams]);

  // Countdown timer for the security-question reset token
  useEffect(() => {
    if (tokenTtl === null || tokenTtl <= 0) return;
    const t = setTimeout(() => setTokenTtl((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [tokenTtl]);

  // Step 1 — look up security question for this email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await fetchSecurityQuestionAction(email);

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message ?? 'Could not find an account with that email.');
      return;
    }

    if (!result.data?.question) {
      setStep('fallback');
      return;
    }

    setSecurityQuestion(result.data.question);
    setStep('question');
  };

  // Step 2 — verify security question answer
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await verifySecurityQuestionAction(email, answer);

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message ?? 'Incorrect answer. Please try again.');
      return;
    }

    setResetToken(result.data!.reset_token);
    setTokenTtl(result.data!.expires_in ?? null);
    setTokenSource('question');
    setStep('confirm');
  };

  const restartFlow = () => {
    setError(null);
    setSuccess(null);
    setAnswer('');
    setResetToken('');
    setTokenTtl(null);
    setNewPassword('');
    setConfirmPassword('');
    // If we already have the security question loaded, skip back to that step
    // so the user just re-answers — no need to re-enter their email
    if (securityQuestion) {
      setStep('question');
    } else {
      setStep('email');
    }
  };

  // Fallback — send email reset link
  const handleSendResetEmail = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await requestPasswordResetAction({ email });

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess('Check your email for a reset link. Click it to set your new password.');
    }
  };

  // Step 3 — set new password
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const failedRules = PASSWORD_RULES.filter((r) => !r.test(newPassword));
    if (failedRules.length > 0) {
      setError(`Password must meet all requirements.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const result = await confirmPasswordResetAction({
      access_token: resetToken,
      new_password: newPassword,
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message);
      setTokenTtl(null); // token is consumed; hide the misleading countdown
    } else {
      setSuccess('Password reset successful! Redirecting to sign in...');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  const stepTitle = {
    email: 'Reset your password',
    question: 'Answer your security question',
    confirm: 'Set a new password',
    fallback: 'Reset via email',
  }[step];

  const stepSubtitle = {
    email: "Enter your email and we'll look up your security question.",
    question: 'Answer the question you set up when you created your account.',
    confirm: 'Choose a strong new password for your account.',
    fallback: "You haven't set a security question. We'll send a reset link to your email instead.",
  }[step];

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-[480px] flex flex-col gap-8">

        {/* Back button */}
        {(step === 'question' || step === 'fallback' || (step === 'confirm' && tokenSource === 'question')) && (
          <button
            type="button"
            onClick={restartFlow}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors self-start"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Start over
          </button>
        )}

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-[-0.033em]">
            {stepTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
            {stepSubtitle}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex flex-col gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 shrink-0">error</span>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
            </div>
            {step === 'confirm' && tokenSource === 'question' && (
              <div className="ml-8 flex flex-col gap-1">
                <p className="text-xs text-red-600 dark:text-red-400">
                  Reset tokens are one-time use. Re-answer your security question to get a new one.
                </p>
                <button
                  type="button"
                  onClick={restartFlow}
                  className="self-start text-sm font-semibold text-primary hover:underline"
                >
                  Re-answer security question →
                </button>
              </div>
            )}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Step 1 — email lookup */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
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
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Looking up…' : 'Continue'}
            </Button>
          </form>
        )}

        {/* Step 2 — security question */}
        {step === 'question' && (
          <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Your security question</p>
              <p className="text-slate-900 dark:text-slate-100 text-base font-medium">{securityQuestion}</p>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Your answer</span>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Enter your answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                autoComplete="off"
              />
            </label>
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying…' : 'Verify Answer'}
            </Button>
          </form>
        )}

        {/* Fallback — no security question, send email instead */}
        {step === 'fallback' && !success && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
              <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5">info</span>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                No security question is set on your account. We&apos;ll send a reset link to <strong>{email}</strong> instead.
              </p>
            </div>
            <Button variant="primary" size="lg" className="w-full" type="button" disabled={isLoading} onClick={handleSendResetEmail}>
              {isLoading ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </div>
        )}

        {/* Step 3 — new password */}
        {step === 'confirm' && (
          <form onSubmit={handleConfirmReset} className="flex flex-col gap-6">
            {/* Token expiry countdown (security question path only) */}
            {tokenSource === 'question' && tokenTtl !== null && tokenTtl > 0 && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                <span className="material-symbols-outlined text-amber-500 text-[18px]">timer</span>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Your reset token expires in{' '}
                  <span className="font-semibold tabular-nums">
                    {Math.floor(tokenTtl / 60)}:{String(tokenTtl % 60).padStart(2, '0')}
                  </span>
                  . Submit before it runs out.
                </p>
              </div>
            )}
            {tokenSource === 'question' && tokenTtl !== null && tokenTtl <= 0 && (
              <div className="flex flex-col gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[18px]">timer_off</span>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">Your reset token has expired.</p>
                </div>
                <button type="button" onClick={restartFlow} className="self-start text-sm font-semibold text-primary hover:underline">
                  Start over to get a new one
                </button>
              </div>
            )}
            {/* New password */}
            <div className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">New Password</span>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {/* Password requirements checklist */}
              <ul className="flex flex-col gap-1 mt-1">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(newPassword);
                  return (
                    <li key={rule.id} className={`flex items-center gap-2 text-xs transition-colors ${passed ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[14px]">{passed ? 'check_circle' : 'radio_button_unchecked'}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">Confirm Password</span>
              <div className="relative">
                <input
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-12 px-4 pr-12 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting…' : 'Reset Password'}
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

export default function PasswordResetPage() {
  return (
    <Suspense>
      <PasswordResetForm />
    </Suspense>
  );
}
