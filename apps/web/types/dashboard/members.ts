import type { FormEvent } from 'react';

export type Member = {
  id: string;
  role: 'OWNER' | 'MEMBER';
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export type OrgInvite = {
  id: string;
  email: string;
  role: 'OWNER' | 'MEMBER';
  expiresAt: string | Date;
  acceptedAt: string | Date | null;
  revokedAt: string | Date | null;
  createdAt: string | Date;
};

export type MemberFormErrors = {
  email?: string;
  form?: string;
};

export type MemberModel = {
  members: Member[];
  invites: OrgInvite[];
  isLoading: boolean;
  isInvitesLoading: boolean;
  isOwner: boolean;
  isInviting: boolean;
  userId: string;
  email: string;
  errors: MemberFormErrors;
};

export type MemberActions = {
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRemove: (memberId: string, memberName: string | null) => void;
  onTransferOwner: (memberId: string, memberName: string | null) => void;
  onDemoteOwner: (memberId: string, memberName: string | null) => void;
  onRevokeInvite: (inviteId: string, inviteEmail: string) => void;
};

export type MemberSectionProps = {
  model: MemberModel;
  actions: MemberActions;
};
