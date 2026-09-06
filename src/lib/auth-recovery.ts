export const RECOVERY_PENDING_COOKIE = "sb-recovery-pending";
export const RECOVERY_UPDATE_PATH = "/admin/update-password";
export const RECOVERY_LOGIN_PATH = "/admin/login";

export function isRecoveryHash(hash: string) {
  if (!hash) return false;
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return params.get("type") === "recovery";
}

export function isRecoverySearch(search: string) {
  if (!search) return false;
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  return params.get("type") === "recovery";
}

export function buildUpdatePasswordUrl(origin: string, hash = "", search = "") {
  const url = new URL(RECOVERY_UPDATE_PATH, origin);
  if (search) {
    const params = new URLSearchParams(search.replace(/^\?/, ""));
    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }
  const hashValue = hash.replace(/^#/, "");
  return `${url.pathname}${url.search}${hashValue ? `#${hashValue}` : ""}`;
}

export function setRecoveryPendingCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${RECOVERY_PENDING_COOKIE}=1; path=/; max-age=3600; SameSite=Lax`;
}

export function clearRecoveryPendingCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${RECOVERY_PENDING_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function getAuthCallbackUrl(origin: string) {
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("next", RECOVERY_UPDATE_PATH);
  return url.toString();
}
