// Whitelist of authorized admin emails
export const ADMIN_EMAILS = [
  'abirsabirhossain@gmail.com',
  'toiral.dev@gmail.com',
  'aminulislam004474@gmail.com'
];

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};
