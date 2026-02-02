import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OverviewTabProps } from '@/types/dashboard';

export function OverviewTab({
  orgName,
  selectedProjectName,
  selectedProjectSlug,
  stats,
  onSelectSection,
}: OverviewTabProps) {
  const hasProject = Boolean(selectedProjectName && selectedProjectSlug);

  return (
    <div className="grid gap-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">Overview</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">{orgName} at a glance</h2>
        <p className="mt-2 text-sm text-slate-500">
          Monitor your surface area and keep key actions close.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Projects
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-slate-900">
                {stats.projects}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-slate-500">
              Active workspaces for products.
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 bg-white shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Members
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-slate-900">
                {stats.members}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-slate-500">
              Roles and access coverage.
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 bg-white shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Active keys
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-slate-900">
                {stats.activeKeys}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-slate-500">
              Keys for the selected project.
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 bg-white shadow-none">
            <CardHeader className="px-5 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Invites
              </CardDescription>
              <CardTitle className="text-3xl font-semibold text-slate-900">
                {stats.pendingInvites}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 text-xs text-slate-500">
              Pending access requests.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Quick actions
          </p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">Keep momentum</h3>
          <p className="mt-2 text-sm text-slate-500">
            Jump into the sections that need attention right now.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => onSelectSection('projects')}
              className="h-10 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Create project
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectSection('keys')}
              className="h-10 rounded-xl border-slate-200 text-sm text-slate-600"
            >
              Issue key
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectSection('members')}
              className="h-10 rounded-xl border-slate-200 text-sm text-slate-600"
            >
              Invite member
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Current focus
          </p>
          <h3 className="mt-3 text-lg font-semibold text-slate-900">Selected project</h3>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-base font-semibold text-slate-900">
              {selectedProjectName ?? 'No project selected'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {hasProject ? `/${selectedProjectSlug}` : 'Create a project to begin'}
            </p>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Keys and usage metrics focus on this project.
          </p>
        </div>
      </section>
    </div>
  );
}
