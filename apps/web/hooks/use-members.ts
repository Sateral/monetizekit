'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { trpc } from '@/lib/trpc/client';

import type { Member, MemberActions, MemberFormErrors, MemberModel } from '@/types/dashboard';

export function useMembers(orgId: string, orgRole: 'OWNER' | 'MEMBER', userId: string) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<MemberFormErrors>({});

  const memberList = trpc.org.listMembers.useQuery({ orgId });
  const addMember = trpc.org.addMember.useMutation({
    onSuccess: async () => {
      setEmail('');
      setErrors({});
      await memberList.refetch();
    },
    onError: (error) => {
      setErrors({ form: error.message });
    },
  });

  const removeMember = trpc.org.removeMember.useMutation({
    onSuccess: async () => {
      await memberList.refetch();
    },
  });

  const updateMemberRole = trpc.org.updateMemberRole.useMutation({
    onSuccess: async () => {
      await memberList.refetch();
    },
  });

  const validate = () => {
    const nextErrors: MemberFormErrors = {};
    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    addMember.mutate({
      orgId,
      email: email.trim().toLowerCase(),
    });
  };

  const handleTransferOwner = (memberId: string, memberName: string | null) => {
    const label = memberName ? memberName : 'this member';
    const confirmed = window.confirm(
      `Transfer ownership to ${label}? You will remain a member but lose owner privileges.`,
    );
    if (!confirmed) return;

    updateMemberRole.mutate({
      orgId,
      userId: memberId,
      role: 'OWNER',
    });
  };

  const handleDemoteOwner = (memberId: string, memberName: string | null) => {
    const label = memberName ? memberName : 'this member';
    const confirmed = window.confirm(`Change ${label} to a member role?`);
    if (!confirmed) return;

    updateMemberRole.mutate({
      orgId,
      userId: memberId,
      role: 'MEMBER',
    });
  };

  const handleRemove = (memberId: string, memberName: string | null) => {
    const label = memberName ? memberName : 'this member';
    const confirmed = window.confirm(`Remove ${label} from the organization?`);
    if (!confirmed) return;

    removeMember.mutate({
      orgId,
      userId: memberId,
    });
  };

  const members: Member[] = memberList.data?.members ?? [];
  const isOwner = orgRole === 'OWNER';

  const model: MemberModel = {
    members,
    isLoading: memberList.isLoading,
    isOwner,
    isSubmitting: addMember.isPending,
    userId,
    email,
    errors,
  };

  const actions: MemberActions = {
    onEmailChange: setEmail,
    onSubmit: handleSubmit,
    onRemove: handleRemove,
    onTransferOwner: handleTransferOwner,
    onDemoteOwner: handleDemoteOwner,
  };

  return {
    model,
    actions,
  };
}
