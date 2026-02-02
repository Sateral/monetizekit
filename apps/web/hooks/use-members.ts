'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { trpc } from '@/lib/trpc/client';

import type {
  Member,
  MemberActions,
  MemberFormErrors,
  MemberModel,
  OrgInvite,
} from '@/types/dashboard';

export function useMembers(orgId: string, orgRole: 'OWNER' | 'MEMBER', userId: string) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<MemberFormErrors>({});
  const isOwner = orgRole === 'OWNER';

  const memberList = trpc.org.listMembers.useQuery({ orgId });
  const inviteList = trpc.org.inviteList.useQuery({ orgId }, { enabled: isOwner });
  const createInvite = trpc.org.inviteCreate.useMutation({
    onSuccess: async () => {
      setEmail('');
      setErrors({});
      await memberList.refetch();
      await inviteList.refetch();
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

  const revokeInvite = trpc.org.inviteRevoke.useMutation({
    onSuccess: async () => {
      await inviteList.refetch();
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

    createInvite.mutate({
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

  const handleRevokeInvite = (inviteId: string, inviteEmail: string) => {
    const confirmed = window.confirm(`Revoke the invite sent to ${inviteEmail}?`);
    if (!confirmed) return;

    revokeInvite.mutate({ orgId, inviteId });
  };

  const members: Member[] = memberList.data?.members ?? [];
  const invites: OrgInvite[] = inviteList.data?.invites ?? [];

  const model: MemberModel = {
    members,
    invites,
    isLoading: memberList.isLoading,
    isInvitesLoading: isOwner ? inviteList.isLoading : false,
    isOwner,
    isInviting: createInvite.isPending,
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
    onRevokeInvite: handleRevokeInvite,
  };

  return {
    model,
    actions,
  };
}
