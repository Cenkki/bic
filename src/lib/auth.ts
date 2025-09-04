import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Only configure email provider if environment variables are set
const providers = [];
if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    session: async ({ session, user }: any) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Add error handling
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      console.log("User signed in:", user);
    },
    signOut: async ({ session, token }) => {
      console.log("User signed out");
    },
  },
  // Add debug mode for development
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);