'use client';

import { useMemo, useState } from 'react';

import { useApiKeys } from '@/hooks/use-api-keys';
import { useMembers } from '@/hooks/use-members';
import { useProjects } from '@/hooks/use-projects';
import type { DashboardClientProps } from '@/types/dashboard';

import { ApiKeySection } from './_components/api-key-section';
import { DashboardHeader } from './_components/dashboard-header';
import { MemberSection } from './_components/member-section';
import { OverviewTab } from './_components/overview-tab';
import { ProjectSection } from './_components/project-section';
import { SidebarNav } from './_components/sidebar-nav';

export function DashboardClient({
  orgId,
  orgName,
  orgSlug,
  orgRole,
  userId,
  orgs,
}: DashboardClientProps) {
  const projects = useProjects(orgId);
  const apiKeys = useApiKeys(orgId, projects.model.selectedProjectId);
  const members = useMembers(orgId, orgRole, userId);
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'keys' | 'members'>(
    'overview',
  );

  const overviewStats = useMemo(
    () => ({
      projects: projects.model.projects.length,
      members: members.model.members.length,
      activeKeys: apiKeys.model.apiKeys.filter((key) => !key.revokedAt).length,
      pendingInvites: members.model.invites.length,
    }),
    [
      projects.model.projects.length,
      members.model.members.length,
      apiKeys.model.apiKeys,
      members.model.invites.length,
    ],
  );

  const headerContent = useMemo(() => {
    switch (activeSection) {
      case 'projects':
        return {
          title: 'Projects',
          subtitle: 'Organize products and manage their surface area.',
        };
      case 'keys':
        return {
          title: 'API Keys',
          subtitle: 'Issue and manage secure access tokens.',
        };
      case 'members':
        return {
          title: 'Members & Invites',
          subtitle: 'Keep ownership tight and invite collaborators.',
        };
      default:
        return {
          title: 'Overview',
          subtitle: 'Operational clarity for your org and product surface.',
        };
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <SidebarNav
          orgId={orgId}
          orgName={orgName}
          orgSlug={orgSlug}
          orgs={orgs}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />
        <main className="flex-1 px-6 py-10 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <DashboardHeader
              title={headerContent.title}
              subtitle={headerContent.subtitle}
              orgName={orgName}
            />

            <div className="mt-8">
              {activeSection === 'overview' ? (
                <OverviewTab
                  orgName={orgName}
                  selectedProjectName={projects.selectedProject?.name}
                  selectedProjectSlug={projects.selectedProject?.slug}
                  stats={overviewStats}
                  onSelectSection={setActiveSection}
                />
              ) : null}

              {activeSection === 'projects' ? (
                <ProjectSection model={projects.model} actions={projects.actions} />
              ) : null}

              {activeSection === 'keys' ? (
                <ApiKeySection model={apiKeys.model} actions={apiKeys.actions} />
              ) : null}

              {activeSection === 'members' ? (
                <MemberSection model={members.model} actions={members.actions} />
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
