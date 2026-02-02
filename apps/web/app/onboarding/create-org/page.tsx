'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { orgSlugSchema } from '@monetizekit/config';

import { trpc } from '@/lib/trpc/client';

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

export default function CreateOrgPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const createOrg = trpc.org.create.useMutation({
    onSuccess: () => {
      router.push('/dashboard');
    },
    onError: (error) => {
      setErrors({
        form: error.message,
      });
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

    const finalSlug = slugify(slug || name);
    createOrg.mutate({
      name: name.trim(),
      slug: finalSlug,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-950">
      <div className="mx-auto max-w-xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)]">
        <h1 className="text-3xl font-semibold tracking-tight">Create your organization</h1>
        <p className="mt-2 text-sm text-zinc-500">
          This becomes the owner of your products, plans, and API keys.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Organization name</label>
            <input
              value={name}
              onChange={(event) => {
                const nextName = event.target.value;
                setName(nextName);
                if (!slugEdited) {
                  setSlug(slugify(nextName));
                }
              }}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-900 focus:outline-none"
              placeholder="MonetizeKit Labs"
            />
            {errors.name ? (
              <p className="text-sm text-red-500">{errors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Organization slug</label>
            <input
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(event.target.value);
              }}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm focus:border-zinc-900 focus:outline-none"
              placeholder="monetizekit"
            />
            <p className="text-xs text-zinc-500">Preview: {preview}</p>
            {errors.slug ? (
              <p className="text-sm text-red-500">{errors.slug}</p>
            ) : null}
          </div>

          {errors.form ? (
            <p className="text-sm text-red-500">{errors.form}</p>
          ) : null}

          <button
            type="submit"
            disabled={createOrg.isPending}
            className="inline-flex w-full items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createOrg.isPending ? 'Creating organization...' : 'Create organization'}
          </button>
        </form>
      </div>
    </div>
  );
}
