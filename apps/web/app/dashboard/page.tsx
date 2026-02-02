import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const membership = await prisma.orgMember.findFirst({
    where: { userId: session.user.id },
    include: { org: true },
  });

  if (!membership) {
    redirect('/onboarding/create-org');
  }

  return (
    <DashboardClient
      orgId={membership.org.id}
      orgName={membership.org.name}
      orgSlug={membership.org.slug}
    />
  );
}
