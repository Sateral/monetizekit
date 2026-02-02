'use client';

import { useMemo, useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiKeys } from '@/hooks/use-api-keys';
import { useMembers } from '@/hooks/use-members';
import { useProjects } from '@/hooks/use-projects';
import type { DashboardClientProps } from '@/types/dashboard';

import { ApiKeySection } from './_components/api-key-section';
import { DashboardHeader } from './_components/dashboard-header';
import { MemberSection } from './_components/member-section';
import { OverviewTab } from './_components/overview-tab';
import { ProjectSection } from './_components/project-section';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'keys' | 'members'>(
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

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1a17]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(68%_90%_at_20%_10%,#efe4d2_0%,transparent_60%),radial-gradient(60%_60%_at_82%_12%,#e9d5b9_0%,transparent_55%),linear-gradient(120deg,#f7f4ef_0%,#f4efe7_60%,#efe7dc_100%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-multiply [background-image:radial-gradient(#1f1a17_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <DashboardHeader
              orgId={orgId}
              orgName={orgName}
              orgSlug={orgSlug}
              orgs={orgs}
              selectedProjectName={projects.selectedProject?.name}
              selectedProjectSlug={projects.selectedProject?.slug}
            />

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
              className="mt-10"
            >
              <TabsList
                variant="line"
                className="flex w-full flex-wrap justify-start gap-4 border-b border-[#eadfcf] bg-transparent p-0"
              >
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 text-xs uppercase tracking-[0.28em] text-[#9c8877] data-[state=active]:border-[#1f1a17] data-[state=active]:text-[#1f1a17]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 text-xs uppercase tracking-[0.28em] text-[#9c8877] data-[state=active]:border-[#1f1a17] data-[state=active]:text-[#1f1a17]"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="keys"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 text-xs uppercase tracking-[0.28em] text-[#9c8877] data-[state=active]:border-[#1f1a17] data-[state=active]:text-[#1f1a17]"
                >
                  API Keys
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  className="rounded-none border-b-2 border-transparent px-0 pb-3 text-xs uppercase tracking-[0.28em] text-[#9c8877] data-[state=active]:border-[#1f1a17] data-[state=active]:text-[#1f1a17]"
                >
                  Members & Invites
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-8">
                <OverviewTab
                  orgName={orgName}
                  selectedProjectName={projects.selectedProject?.name}
                  selectedProjectSlug={projects.selectedProject?.slug}
                  stats={overviewStats}
                  onSelectTab={setActiveTab}
                />
              </TabsContent>

              <TabsContent value="projects" className="pt-8">
                <ProjectSection model={projects.model} actions={projects.actions} />
              </TabsContent>

              <TabsContent value="keys" className="pt-8">
                <ApiKeySection model={apiKeys.model} actions={apiKeys.actions} />
              </TabsContent>

              <TabsContent value="members" className="pt-8">
                <MemberSection model={members.model} actions={members.actions} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
