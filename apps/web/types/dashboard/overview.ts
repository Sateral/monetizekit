export type OverviewStats = {
  projects: number;
  members: number;
  activeKeys: number;
  pendingInvites: number;
};

export type OverviewTabProps = {
  orgName: string;
  selectedProjectName?: string | null;
  selectedProjectSlug?: string | null;
  stats: OverviewStats;
  onSelectTab: (tab: 'projects' | 'keys' | 'members') => void;
};
