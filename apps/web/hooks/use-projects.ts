'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { projectSlugSchema } from '@monetizekit/config';

import { trpc } from '@/lib/trpc/client';

import type { Project, ProjectActions, ProjectFormErrors, ProjectModel } from '@/types/dashboard';

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
};

export function useProjects(orgId: string) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const projectList = trpc.project.list.useQuery({ orgId });
  const createProject = trpc.project.create.useMutation({
    onSuccess: async () => {
      setName('');
      setSlug('');
      setSlugEdited(false);
      setErrors({});
      await projectList.refetch();
    },
    onError: (error) => {
      setErrors({ form: error.message });
    },
  });

  useEffect(() => {
    if (!selectedProjectId && projectList.data?.projects?.length) {
      setSelectedProjectId(projectList.data.projects[0].id);
    }
  }, [projectList.data, selectedProjectId]);

  const slugPreview = useMemo(() => slugify(slug || name), [name, slug]);

  const validate = () => {
    const nextErrors: ProjectFormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Project name is required.';
    }

    const parsed = projectSlugSchema.safeParse(slugPreview);
    if (!parsed.success) {
      nextErrors.slug = parsed.error.issues[0]?.message ?? 'Invalid slug.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlug(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    createProject.mutate({
      orgId,
      name: name.trim(),
      slug: slugPreview,
    });
  };

  const projects: Project[] = projectList.data?.projects ?? [];
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  const model: ProjectModel = {
    projects,
    selectedProjectId,
    isLoading: projectList.isLoading,
    isSubmitting: createProject.isPending,
    name,
    slug,
    slugPreview,
    errors,
  };

  const actions: ProjectActions = {
    onNameChange: handleNameChange,
    onSlugChange: handleSlugChange,
    onSelectProject: setSelectedProjectId,
    onSubmit: handleSubmit,
  };

  return {
    model,
    actions,
    selectedProject,
  };
}
