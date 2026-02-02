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

export type MemberFormErrors = {
  email?: string;
  form?: string;
};

export type MemberModel = {
  members: Member[];
  isLoading: boolean;
  isOwner: boolean;
  isSubmitting: boolean;
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
};

export type MemberSectionProps = {
  model: MemberModel;
  actions: MemberActions;
};
