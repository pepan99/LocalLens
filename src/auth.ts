import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
