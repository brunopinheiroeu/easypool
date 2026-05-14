import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await sql`
        INSERT INTO users (id, name, email, image, created_at)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.image}, now())
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image
      `;
      return true;
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (!token.id && token.email) {
        const rows = await sql`SELECT id FROM users WHERE email = ${token.email}`;
        if (rows[0]) token.id = rows[0].id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
