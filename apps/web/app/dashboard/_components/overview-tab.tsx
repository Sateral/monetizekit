import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OverviewTabProps } from '@/types/dashboard';

export function OverviewTab({
  orgName,
  selectedProjectName,
  selectedProjectSlug,
  stats,
  onSelectTab,
}: OverviewTabProps) {
  const hasProject = Boolean(selectedProjectName && selectedProjectSlug);

  return (
    <div className="grid gap-8">
      <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">Overview</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">{orgName} at a glance</h2>
        <p className="mt-2 text-sm text-[#5c524a]">
          Monitor your surface area and keep key actions close.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-[22px] border-[#eadfcf] bg-white/90 shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-[#9c8877]">
                Projects
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-[#1f1a17]">
                {stats.projects}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-[#7a6b5f]">
              Active workspaces for products.
            </CardContent>
          </Card>
          <Card className="rounded-[22px] border-[#eadfcf] bg-white/90 shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-[#9c8877]">
                Members
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-[#1f1a17]">
                {stats.members}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-[#7a6b5f]">
              Roles and access coverage.
            </CardContent>
          </Card>
          <Card className="rounded-[22px] border-[#eadfcf] bg-white/90 shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-[#9c8877]">
                Active keys
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-[#1f1a17]">
                {stats.activeKeys}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-[#7a6b5f]">
              Keys for the selected project.
            </CardContent>
          </Card>
          <Card className="rounded-[22px] border-[#eadfcf] bg-white/90 shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-[#9c8877]">
                Invites
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-[#1f1a17]">
                {stats.pendingInvites}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-[#7a6b5f]">
              Pending access requests.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-[26px] border border-[#eadfcf] bg-[#fffaf2] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">Quick actions</p>
          <h3 className="mt-3 text-lg font-semibold text-[#1f1a17]">Keep momentum</h3>
          <p className="mt-2 text-sm text-[#6b5d52]">
            Jump into the sections that need attention right now.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => onSelectTab('projects')}
              className="h-10 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
            >
              Create project
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectTab('keys')}
              className="h-10 rounded-2xl border-[#e6d9c8] text-sm text-[#6b5d52]"
            >
              Issue key
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectTab('members')}
              className="h-10 rounded-2xl border-[#e6d9c8] text-sm text-[#6b5d52]"
            >
              Invite member
            </Button>
          </div>
        </div>

        <div className="rounded-[26px] border border-[#eadfcf] bg-white p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">Current focus</p>
          <h3 className="mt-3 text-lg font-semibold text-[#1f1a17]">Selected project</h3>
          <div className="mt-4 rounded-2xl border border-[#e6d9c8] bg-white px-4 py-4">
            <p className="text-base font-semibold text-[#1f1a17]">
              {selectedProjectName ?? 'No project selected'}
            </p>
            <p className="mt-1 text-xs text-[#7a6b5f]">
              {hasProject ? `/${selectedProjectSlug}` : 'Create a project to begin'}
            </p>
          </div>
          <p className="mt-4 text-sm text-[#6b5d52]">
            Keys and usage metrics focus on this project.
          </p>
        </div>
      </section>
    </div>
  );
}
