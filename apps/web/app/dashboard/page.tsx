import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/server/db';

import { DashboardClient } from './dashboard-client';
import { EmptyDashboard } from './empty-dashboard';

type DashboardPageProps = {
  searchParams: {
    orgId?: string;
  };
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const memberships = await prisma.orgMember.findMany({
    where: { userId: session.user.id },
    include: { org: true },
    orderBy: { createdAt: 'asc' },
  });

  if (memberships.length === 0) {
    return <EmptyDashboard />;
  }

  const requestedOrgId = searchParams.orgId;
  const membership = requestedOrgId
    ? memberships.find((item) => item.orgId === requestedOrgId)
    : memberships[0];

  if (!membership) {
    redirect('/orgs');
  }

  return (
    <DashboardClient
      orgId={membership.org.id}
      orgName={membership.org.name}
      orgSlug={membership.org.slug}
      orgRole={membership.role}
      userId={session.user.id}
    />
  );
}
