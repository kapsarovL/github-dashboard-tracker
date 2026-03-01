import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `auth`, contains our custom accessToken.
   */
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `auth`, contains our custom accessToken.
   */
  interface JWT {
    accessToken?: string;
  }
}
