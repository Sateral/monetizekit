'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { orgSlugSchema } from '@monetizekit/config';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';

type FormErrors = {
  name?: string;
  slug?: string;
  form?: string;
};

type CreateOrgFormProps = {
  onCreated?: (org: { id: string; name: string; slug: string }) => void;
};

const slugify = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
};

export function CreateOrgForm({ onCreated }: CreateOrgFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const createOrg = trpc.org.create.useMutation({
    onSuccess: (org) => {
      setName('');
      setSlug('');
      setSlugEdited(false);
      setErrors({});
      if (onCreated) {
        onCreated(org);
      } else {
        router.push(`/dashboard?orgId=${org.id}`);
      }
    },
    onError: (error) => {
      setErrors({ form: error.message });
    },
  });

  const preview = useMemo(() => slugify(slug || name), [name, slug]);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Organization name is required.';
    }

    const parsed = orgSlugSchema.safeParse(slugify(slug || name));
    if (!parsed.success) {
      nextErrors.slug = parsed.error.issues[0]?.message ?? 'Invalid slug.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    createOrg.mutate({
      name: name.trim(),
      slug: slugify(slug || name),
    });
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
          Organization name
        </label>
        <input
          value={name}
          onChange={(event) => {
            const nextName = event.target.value;
            setName(nextName);
            if (!slugEdited) {
              setSlug(slugify(nextName));
            }
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="MonetizeKit Labs"
        />
        {errors.name ? <p className="text-xs text-rose-600">{errors.name}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
          Organization slug
        </label>
        <input
          value={slug}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="monetizekit"
        />
        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Preview: {preview}</p>
        {errors.slug ? <p className="text-xs text-rose-600">{errors.slug}</p> : null}
      </div>

      {errors.form ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
          {errors.form}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={createOrg.isPending}
        className="h-11 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        {createOrg.isPending ? 'Creating organization...' : 'Create organization'}
      </Button>
    </form>
  );
}
