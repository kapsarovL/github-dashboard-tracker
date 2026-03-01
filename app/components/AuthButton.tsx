import { Button } from "@/app/ui/Primitives/ui/Button";
import type { Session } from "next-auth";
import { GitBranch } from "lucide-react";
import { handleSignIn, handleSignOut } from "@/app/api/auth/actions";

export function AuthButton({ session }: { session: Session | null }) {
  if (session) {
    return (
      <div className="bg-muted/30 border-border/50 flex items-center gap-4 rounded-full border px-4 py-1.5 shadow-xs">
        <span className="text-foreground text-sm font-semibold tracking-tight">
          {session.user?.name}
        </span>
        <form action={handleSignOut}>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="h-8 rounded-full px-4 text-xs font-bold transition-all"
          >
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form action={handleSignIn}>
      <Button type="submit" className="shadow-md">
        <GitBranch className="mr-2 h-5 w-5" />
        Sign In with GitHub
      </Button>
    </form>
  );
}
