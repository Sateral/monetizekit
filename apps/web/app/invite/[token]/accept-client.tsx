'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';

type AcceptInviteClientProps = {
  token: string;
  orgName: string;
  inviterName?: string | null;
  email: string;
};

export function AcceptInviteClient({
  token,
  orgName,
  inviterName,
  email,
}: AcceptInviteClientProps) {
  const router = useRouter();
  const acceptInvite = trpc.org.inviteAccept.useMutation({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
        Organization invite
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">Join {orgName}</h1>
      <p className="mt-3 text-sm text-slate-500">
        {inviterName ? `${inviterName} invited you` : 'You were invited'} at {email}.
      </p>
      {acceptInvite.error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
          {acceptInvite.error.message}
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => acceptInvite.mutate({ token })}
          disabled={acceptInvite.isPending}
          className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          {acceptInvite.isPending ? 'Accepting...' : 'Accept invite'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/')}
          className="h-11 rounded-xl border-slate-200 text-sm text-slate-600"
        >
          Return home
        </Button>
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-slate-400">
        You must be signed in with {email}.
      </p>
    </div>
  );
}
