'use client';

import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-10 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome to MonetizeKit</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Sign in with GitHub to create your organization and start metering usage.
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={isSubmitting}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Connecting to GitHub...' : 'Continue with GitHub'}
        </button>
      </div>
    </div>
  );
}
