import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // Request 'repo' scope to read/write issues and pull requests
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    // Pass the GitHub access token to the JWT
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Expose the token to the session object
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
