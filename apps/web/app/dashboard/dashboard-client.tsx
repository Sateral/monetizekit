'use client';

import { ApiKeySection } from './_components/api-key-section';
import { DashboardHeader } from './_components/dashboard-header';
import { MemberSection } from './_components/member-section';
import { ProjectSection } from './_components/project-section';
import { useApiKeys } from '@/hooks/use-api-keys';
import { useMembers } from '@/hooks/use-members';
import { useProjects } from '@/hooks/use-projects';
import type { DashboardClientProps } from '@/types/dashboard';

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

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1.25fr]">
              <ProjectSection model={projects.model} actions={projects.actions} />

              <ApiKeySection model={apiKeys.model} actions={apiKeys.actions} />
            </div>

            <MemberSection model={members.model} actions={members.actions} />
          </div>
        </div>
      </div>
    </div>
  );
}
