import type { OrgMembershipSummary } from '@/types/orgs';

export type DashboardHeaderProps = {
  orgId: string;
  orgName: string;
  orgSlug: string;
  orgs: OrgMembershipSummary[];
  selectedProjectName?: string | null;
  selectedProjectSlug?: string | null;
};
