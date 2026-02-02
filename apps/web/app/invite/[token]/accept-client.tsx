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
    <div className="rounded-[28px] border border-[#e2d6c4] bg-white/90 p-8 shadow-[0_30px_80px_-55px_rgba(27,20,16,0.65)]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">Organization invite</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Join {orgName}</h1>
      <p className="mt-3 text-sm text-[#6b5d52]">
        {inviterName ? `${inviterName} invited you` : 'You were invited'} at {email}.
      </p>
      {acceptInvite.error ? (
        <div className="mt-4 rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-3 text-xs text-[#b05b3b]">
          {acceptInvite.error.message}
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => acceptInvite.mutate({ token })}
          disabled={acceptInvite.isPending}
          className="h-11 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
        >
          {acceptInvite.isPending ? 'Accepting...' : 'Accept invite'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/')}
          className="h-11 rounded-2xl border-[#e6d9c8] text-sm text-[#6b5d52]"
        >
          Return home
        </Button>
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
        You must be signed in with {email}.
      </p>
    </div>
  );
}
