export const RESERVED_HANDLES = new Set([
  "admin", "administrator", "api", "app", "auth", "dashboard",
  "explore", "help", "login", "logout", "root", "settings",
  "signup", "signin", "status", "terms", "privacy", "u", "undefined", "null"
]);

export function validateHandle(handle: string): { isValid: boolean; error?: string } {
  const clean = handle.trim().toLowerCase();
  if (clean.length < 3 || clean.length > 30) {
    return { isValid: false, error: "Handle must be between 3 and 30 characters long." };
  }
  if (!/^[a-z0-9_-]+$/.test(clean)) {
    return { isValid: false, error: "Only alphanumeric characters, underscores, and hyphens allowed." };
  }
  if (RESERVED_HANDLES.has(clean)) {
    return { isValid: false, error: "This handle is a reserved system word." };
  }
  return { isValid: true };
}

export function isLinkActiveNow(link: {
  isActive: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}, currentTime: Date = new Date()): boolean {
  if (!link.isActive) return false;
  if (link.startDate && new Date(link.startDate) > currentTime) return false;
  if (link.endDate && new Date(link.endDate) < currentTime) return false;
  return true;
}