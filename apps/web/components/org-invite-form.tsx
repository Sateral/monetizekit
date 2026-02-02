'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

type OrgInviteFormProps = {
  title: string;
  description: string;
  buttonLabel?: string;
};

const extractToken = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/invite\/(.+)$/);
    if (match?.[1]) return match[1];
  } catch {
    // ignore parse errors
  }

  return trimmed.replace(/^invite\//, '');
};

export function OrgInviteForm({ title, description, buttonLabel }: OrgInviteFormProps) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = extractToken(value);
    if (!token) {
      setError('Paste a valid invite link or token.');
      return;
    }

    setError(null);
    router.push(`/invite/${token}`);
  };

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Paste invite link or token"
        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      />
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
          {error}
        </div>
      ) : null}
      <Button
        type="submit"
        className="h-10 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        {buttonLabel ?? 'Join with invite'}
      </Button>
    </form>
  );
}
