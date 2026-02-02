import { createHash } from 'crypto';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

import { AcceptInviteClient } from './accept-client';

type InvitePageProps = {
  params: Promise<{
    token?: string;
  }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Invite status
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Invite not found</h1>
          <p className="mt-3 text-sm text-slate-500">This invite link is invalid or missing.</p>
        </div>
      </div>
    );
  }
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const invite = await prisma.orgInvite.findUnique({
    where: { tokenHash },
    include: {
      org: {
        select: {
          name: true,
        },
      },
      invitedBy: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!invite) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Invite status
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Invite not found</h1>
          <p className="mt-3 text-sm text-slate-500">
            This invite link is invalid or has already been used.
          </p>
        </div>
      </div>
    );
  }

  const now = Date.now();
  const isInactive =
    Boolean(invite.revokedAt) || Boolean(invite.acceptedAt) || invite.expiresAt.getTime() < now;

  if (isInactive) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Invite status
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Invite expired</h1>
          <p className="mt-3 text-sm text-slate-500">
            Ask your organization owner to resend your invite.
          </p>
        </div>
      </div>
    );
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    redirect(`/sign-in?next=/invite/${token}`);
  }

  const sessionEmail = session.user.email?.toLowerCase();
  if (!sessionEmail || sessionEmail !== invite.email.toLowerCase()) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Invite status
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Wrong account</h1>
          <p className="mt-3 text-sm text-slate-500">
            This invite was sent to {invite.email}. Sign in with that account to accept.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <AcceptInviteClient
          token={token}
          orgName={invite.org.name}
          inviterName={invite.invitedBy?.name}
          email={invite.email}
        />
      </div>
    </div>
  );
}
