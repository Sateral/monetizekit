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
      <div className="mx-auto max-w-xl">
        <div className="rounded-[32px] border border-zinc-200 bg-white/90 p-10 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)] backdrop-blur">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-zinc-400">
              Organization setup
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Create your organization</h1>
            <p className="mt-2 text-sm text-zinc-500">
              This becomes the owner of your products, plans, and API keys.
            </p>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Organization name</label>
              <input
                value={name}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setName(nextName);
                  if (!slugEdited) {
                    setSlug(slugify(nextName));
                  }
                }}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm transition focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                placeholder="MonetizeKit Labs"
              />
              {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Organization slug</label>
              <input
                value={slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSlug(event.target.value);
                }}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm transition focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                placeholder="monetizekit"
              />
              <p className="text-xs text-zinc-500">Preview: {preview}</p>
              {errors.slug ? <p className="text-sm text-red-500">{errors.slug}</p> : null}
            </div>

            {errors.form ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errors.form}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={createOrg.isPending}
              className="h-11 w-full rounded-2xl bg-zinc-950 text-sm font-semibold text-white shadow-lg shadow-zinc-950/20 transition hover:bg-zinc-800 hover:cursor-pointer"
            >
              {createOrg.isPending ? 'Creating organization...' : 'Create organization'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
