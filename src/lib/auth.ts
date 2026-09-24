/**
 * NextAuth v5 configuration — Credentials provider only.
 *
 * Strategy: JWT sessions (no database sessions table needed at runtime).
 * The admin user's email + bcrypt hash is stored in admin_users table.
 * Only server-side code touches this file.
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sql } from "@/lib/db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    /**
     * jwt callback — runs when token is created/refreshed.
     * Embeds the user id and role so we can check it in middleware
     * without hitting the DB on every request.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = "admin";
      }
      return token;
    },
    /**
     * session callback — shapes what client components see via useSession().
     * We expose only non-sensitive fields.
     */
    session({ session, token }) {
      session.user.id = token.id as string;
      // @ts-expect-error — role is not in the default Session type
      session.user.role = token.role;
      return session;
    },
    /**
     * authorized callback — runs in middleware to gate routes.
     */
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        return !!auth?.user; // must be authenticated
      }
      return true;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Query admin_users — server-only, never exposed to client
        const rows = await sql`
          SELECT id, email, name, password_hash
          FROM admin_users
          WHERE email = ${email}
          LIMIT 1
        `;

        const admin = rows[0] as
          | { id: string; email: string; name: string; password_hash: string }
          | undefined;

        if (!admin) return null;

        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
