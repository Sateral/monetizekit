type OrgInviteEmailInput = {
  toEmail: string;
  orgName: string;
  inviteUrl: string;
  inviterName?: string | null;
};

export const sendOrgInviteEmail = async ({
  toEmail,
  orgName,
  inviteUrl,
  inviterName,
}: OrgInviteEmailInput) => {
  const inviterLabel = inviterName ? ` from ${inviterName}` : '';

  console.info('[org-invite] to=%s org=%s url=%s%s', toEmail, orgName, inviteUrl, inviterLabel);
};
