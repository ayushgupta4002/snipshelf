import { createUser } from "@/helpers/users";
import prisma from "@/lib/prisma";
import NextAuth, { DefaultSession, AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      userId?: number;
    } & DefaultSession["user"]
  }

  interface User {
    userId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;
      const image = user.image;
      const name = user.name;

      try {
        console.log("User:", user);
        if (!email) {
          return false;
        }

        const userExist = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!userExist) {
          if (name && email) {
            await createUser({ name, email });
          } else {
            throw new Error("Name or email is missing");
          }
        }
      } catch (error) {
        console.error("Error inserting user into the database:", error);
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
        }
      }

      // Handle updates
      if (trigger === "update" && session?.user) {
        token.userId = session.user.userId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && typeof token.userId === "number") {
        session.user.userId = token.userId;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };