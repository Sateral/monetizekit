export type DashboardClientProps = {
  orgId: string;
  orgName: string;
  orgSlug: string;
  orgRole: 'OWNER' | 'MEMBER';
  userId: string;
};
