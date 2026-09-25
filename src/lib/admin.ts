import "server-only";

import { auth } from "@/lib/auth";

export class AdminAccessError extends Error {
  constructor() {
    super("Administrator authentication is required.");
    this.name = "AdminAccessError";
  }
}

function configuredAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
}

/**
 * The credentials provider only authorizes the configured single admin.
 * Re-checking here keeps server actions and route handlers protected even if
 * they are called directly rather than through the dashboard UI.
 */
export async function getAdminSession() {
  const session = await auth();
  const allowedEmail = configuredAdminEmail();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  if (!allowedEmail || !sessionEmail || sessionEmail !== allowedEmail) return null;
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new AdminAccessError();
  return session;
}

export function isAdminAccessError(error: unknown) {
  return error instanceof AdminAccessError;
}
