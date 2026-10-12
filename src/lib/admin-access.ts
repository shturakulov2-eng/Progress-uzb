const allowedAdminEmails = (
  process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS ||
  process.env.ADMIN_ALLOWED_EMAILS ||
  ""
)
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) return false;
  if (allowedAdminEmails.length === 0) return true;

  return allowedAdminEmails.includes(email.toLowerCase());
}
