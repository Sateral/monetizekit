'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CreateOrgForm } from '@/components/create-org-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type CreateOrgDialogProps = {
  trigger: React.ReactNode;
};

export function CreateOrgDialog({ trigger }: CreateOrgDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Create organization
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            This becomes the owner of your projects, API keys, and billing.
          </DialogDescription>
        </DialogHeader>
        <CreateOrgForm
          onCreated={(org) => {
            setOpen(false);
            router.push(`/dashboard?orgId=${org.id}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
