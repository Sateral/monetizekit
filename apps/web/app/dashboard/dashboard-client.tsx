'use client';

import { useEffect, useMemo, useState } from 'react';

import { projectSlugSchema } from '@monetizekit/config';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';

type DashboardClientProps = {
  orgId: string;
  orgName: string;
  orgSlug: string;
};

type FormErrors = {
  name?: string;
  slug?: string;
  form?: string;
};

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
};

export function DashboardClient({ orgId, orgName, orgSlug }: DashboardClientProps) {
  const [projectName, setProjectName] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [projectSlugEdited, setProjectSlugEdited] = useState(false);
  const [projectErrors, setProjectErrors] = useState<FormErrors>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyErrors, setApiKeyErrors] = useState<FormErrors>({});
  const [issuedToken, setIssuedToken] = useState<string | null>(null);

  const projectList = trpc.project.list.useQuery({ orgId });
  const apiKeyList = trpc.apiKey.list.useQuery(
    { orgId, projectId: selectedProjectId ?? '' },
    { enabled: Boolean(selectedProjectId) },
  );

  useEffect(() => {
    if (!selectedProjectId && projectList.data?.projects?.length) {
      setSelectedProjectId(projectList.data.projects[0].id);
    }
  }, [projectList.data, selectedProjectId]);

  const createProject = trpc.project.create.useMutation({
    onSuccess: async () => {
      setProjectName('');
      setProjectSlug('');
      setProjectSlugEdited(false);
      setProjectErrors({});
      await projectList.refetch();
    },
    onError: (error) => {
      setProjectErrors({ form: error.message });
    },
  });

  const createApiKey = trpc.apiKey.create.useMutation({
    onSuccess: async (data) => {
      setApiKeyName('');
      setApiKeyErrors({});
      setIssuedToken(data.token);
      await apiKeyList.refetch();
    },
    onError: (error) => {
      setApiKeyErrors({ form: error.message });
    },
  });

  const revokeApiKey = trpc.apiKey.revoke.useMutation({
    onSuccess: async () => {
      await apiKeyList.refetch();
    },
  });

  const projectSlugPreview = useMemo(
    () => slugify(projectSlug || projectName),
    [projectName, projectSlug],
  );

  const validateProject = () => {
    const nextErrors: FormErrors = {};

    if (!projectName.trim()) {
      nextErrors.name = 'Project name is required.';
    }

    const parsed = projectSlugSchema.safeParse(projectSlugPreview);
    if (!parsed.success) {
      nextErrors.slug = parsed.error.issues[0]?.message ?? 'Invalid slug.';
    }

    setProjectErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateApiKey = () => {
    const nextErrors: FormErrors = {};
    if (!apiKeyName.trim()) {
      nextErrors.name = 'API key name is required.';
    }

    setApiKeyErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateProject()) return;

    createProject.mutate({
      orgId,
      name: projectName.trim(),
      slug: projectSlugPreview,
    });
  };

  const handleCreateApiKey = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !validateApiKey()) return;

    createApiKey.mutate({
      orgId,
      projectId: selectedProjectId,
      name: apiKeyName.trim(),
    });
  };

  const handleCopyToken = async () => {
    if (!issuedToken) return;
    await navigator.clipboard.writeText(issuedToken);
  };

  const projects = projectList.data?.projects ?? [];
  const apiKeys = apiKeyList.data?.apiKeys ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f1a17]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(68%_90%_at_20%_10%,#efe4d2_0%,transparent_60%),radial-gradient(60%_60%_at_82%_12%,#e9d5b9_0%,transparent_55%),linear-gradient(120deg,#f7f4ef_0%,#f4efe7_60%,#efe7dc_100%)]" />
        <div className="absolute inset-0 opacity-25 mix-blend-multiply [background-image:radial-gradient(#1f1a17_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#8c7a6b]">
                  MonetizeKit workspace
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">{orgName}</h1>
                <p className="mt-2 text-sm text-[#6b5d52]">/{orgSlug}</p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#4d433b]">
                  Shape your product surface with intentional projects and keys. Keep it lean,
                  traceable, and ready for scale.
                </p>
              </div>
              <div className="rounded-[28px] border border-[#e2d6c4] bg-white/70 p-6 shadow-[0_30px_70px_-55px_rgba(27,20,16,0.7)] backdrop-blur">
                <div className="text-xs uppercase tracking-[0.28em] text-[#8c7a6b]">
                  Active surface
                </div>
                <p className="mt-3 text-sm text-[#5c524a]">Selected project</p>
                <div className="mt-4 rounded-2xl border border-[#eadfcf] bg-white px-4 py-4">
                  <p className="text-base font-semibold text-[#1f1a17]">
                    {selectedProject?.name ?? 'No project selected'}
                  </p>
                  <p className="mt-1 text-xs text-[#7a6b5f]">
                    {selectedProject ? `/${selectedProject.slug}` : 'Create a project to begin'}
                  </p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[#7a6b5f]">
                  API keys inherit permissions from their project. Keep scopes tight and revoke
                  unused keys.
                </p>
              </div>
            </header>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1.25fr]">
              <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">Projects</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      Organize your surface
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#e9dece] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                    {projects.length} total
                  </div>
                </div>

                <form className="mt-6 grid gap-4" onSubmit={handleCreateProject}>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7a6b5f]">
                      Project name
                    </label>
                    <input
                      value={projectName}
                      onChange={(event) => {
                        const nextName = event.target.value;
                        setProjectName(nextName);
                        if (!projectSlugEdited) {
                          setProjectSlug(slugify(nextName));
                        }
                      }}
                      placeholder="API Gateway"
                      className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
                    />
                    {projectErrors.name ? (
                      <p className="text-xs text-[#b05b3b]">{projectErrors.name}</p>
                    ) : null}
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7a6b5f]">
                      Project slug
                    </label>
                    <input
                      value={projectSlug}
                      onChange={(event) => {
                        setProjectSlugEdited(true);
                        setProjectSlug(event.target.value);
                      }}
                      placeholder="api-gateway"
                      className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
                    />
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                      Preview: {projectSlugPreview || '---'}
                    </p>
                    {projectErrors.slug ? (
                      <p className="text-xs text-[#b05b3b]">{projectErrors.slug}</p>
                    ) : null}
                  </div>
                  {projectErrors.form ? (
                    <div className="rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-3 text-xs text-[#b05b3b]">
                      {projectErrors.form}
                    </div>
                  ) : null}
                  <Button
                    type="submit"
                    disabled={createProject.isPending}
                    className="h-11 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f]"
                  >
                    {createProject.isPending ? 'Creating project...' : 'Create project'}
                  </Button>
                </form>

                <div className="mt-8 border-t border-dashed border-[#e7d9c6] pt-6">
                  {projectList.isLoading ? (
                    <p className="text-sm text-[#7a6b5f]">Loading projects...</p>
                  ) : projects.length === 0 ? (
                    <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
                      No projects yet. Create one to start issuing keys.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {projects.map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          onClick={() => setSelectedProjectId(project.id)}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                            selectedProjectId === project.id
                              ? 'border-[#1f1a17] bg-[#1f1a17] text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/20'
                              : 'border-[#e6d9c8] bg-white text-[#1f1a17] hover:border-[#1f1a17]/40'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold">{project.name}</p>
                            <p
                              className={`text-[11px] uppercase tracking-[0.28em] ${
                                selectedProjectId === project.id
                                  ? 'text-[#e7d7c6]'
                                  : 'text-[#9c8877]'
                              }`}
                            >
                              /{project.slug}
                            </p>
                          </div>
                          <span
                            className={`text-[11px] uppercase tracking-[0.28em] ${
                              selectedProjectId === project.id ? 'text-[#e7d7c6]' : 'text-[#b6a59a]'
                            }`}
                          >
                            Active
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[30px] border border-[#e0d2bf] bg-white/85 p-8 shadow-[0_24px_60px_-55px_rgba(27,20,16,0.7)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#8c7a6b]">API keys</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      Issue access tokens
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#e9dece] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                    {apiKeys.length} keys
                  </div>
                </div>

                <form className="mt-6 grid gap-4" onSubmit={handleCreateApiKey}>
                  <div className="grid gap-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-[#7a6b5f]">
                      Key label
                    </label>
                    <input
                      value={apiKeyName}
                      onChange={(event) => setApiKeyName(event.target.value)}
                      placeholder="Usage exporter"
                      className="rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3 text-sm text-[#1f1a17] shadow-sm transition focus:border-[#1f1a17] focus:outline-none focus:ring-2 focus:ring-[#1f1a17]/10"
                    />
                    {apiKeyErrors.name ? (
                      <p className="text-xs text-[#b05b3b]">{apiKeyErrors.name}</p>
                    ) : null}
                  </div>
                  {apiKeyErrors.form ? (
                    <div className="rounded-2xl border border-[#f0d5c3] bg-[#fdf3ea] px-4 py-3 text-xs text-[#b05b3b]">
                      {apiKeyErrors.form}
                    </div>
                  ) : null}
                  <Button
                    type="submit"
                    disabled={!selectedProjectId || createApiKey.isPending}
                    className="h-11 rounded-2xl bg-[#1f1a17] text-sm font-semibold text-[#f7f4ef] shadow-lg shadow-[#1f1a17]/25 transition hover:bg-[#2a231f] disabled:bg-[#cbbdaf] disabled:text-[#f7f4ef]"
                  >
                    {createApiKey.isPending ? 'Issuing key...' : 'Issue API key'}
                  </Button>
                  {!selectedProjectId ? (
                    <p className="text-xs text-[#9c8877]">Select a project before issuing a key.</p>
                  ) : null}
                </form>

                {issuedToken ? (
                  <div className="mt-6 rounded-3xl border border-[#e6d9c8] bg-[#fff8ef] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9c8877]">New API key</p>
                    <p className="mt-2 break-all font-mono text-sm text-[#1f1a17]">{issuedToken}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCopyToken}
                        className="rounded-full bg-[#1f1a17] text-xs uppercase tracking-[0.24em] text-[#f7f4ef] hover:bg-[#2a231f]"
                      >
                        Copy
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIssuedToken(null)}
                        className="rounded-full border-[#e6d9c8] text-xs uppercase tracking-[0.24em] text-[#6b5d52]"
                      >
                        Dismiss
                      </Button>
                    </div>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#9c8877]">
                      Store this token securely. You will not see it again.
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 border-t border-dashed border-[#e7d9c6] pt-6">
                  {apiKeyList.isLoading ? (
                    <p className="text-sm text-[#7a6b5f]">Loading API keys...</p>
                  ) : apiKeys.length === 0 ? (
                    <div className="rounded-2xl border border-[#eadfcf] bg-white px-4 py-4 text-sm text-[#6b5d52]">
                      No keys issued yet. Create one for your integrations.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {apiKeys.map((key) => (
                        <div
                          key={key.id}
                          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6d9c8] bg-white px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#1f1a17]">{key.name}</p>
                            <p className="text-xs text-[#9c8877]">•••• {key.keyLast4}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {key.revokedAt ? (
                              <span className="rounded-full border border-[#f2d2c4] bg-[#fdf0e7] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#b05b3b]">
                                Revoked
                              </span>
                            ) : (
                              <span className="rounded-full border border-[#dbe5d8] bg-[#eef7ed] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#3e6c42]">
                                Active
                              </span>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={Boolean(key.revokedAt) || revokeApiKey.isPending}
                              onClick={() => revokeApiKey.mutate({ orgId, apiKeyId: key.id })}
                              className="rounded-full border-[#e6d9c8] text-xs uppercase tracking-[0.24em] text-[#6b5d52]"
                            >
                              {key.revokedAt ? 'Revoked' : 'Revoke'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
