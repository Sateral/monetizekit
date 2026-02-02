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
        <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">{title}</p>
        <p className="mt-2 text-sm text-[#6b5d52]">{description}</p>
      </div>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Paste invite link or token"
        className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
      />
      {error ? (
        <div className="rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-2 text-xs text-[#b05b3b]">
          {error}
        </div>
      ) : null}
      <Button
        type="submit"
        className="h-10 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
      >
        {buttonLabel ?? 'Join with invite'}
      </Button>
    </form>
  );
}
