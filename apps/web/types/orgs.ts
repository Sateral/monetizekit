export type OrgMembershipSummary = {
  orgId: string;
  orgName: string;
  orgSlug: string;
  role: 'OWNER' | 'MEMBER';
};
