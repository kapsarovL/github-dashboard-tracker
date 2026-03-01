"use client";

import { useEffect } from "react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { FadeIn } from "@/app/components/MotionWrappers";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <FadeIn className="bg-card w-full max-w-md rounded-2xl border p-8 text-center shadow-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-8">
          We couldn&apos;t load the repository data from GitHub. The repository
          might be private, deleted, or you&apos;ve hit the API rate limit.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => reset()} className="w-full sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" /> Try again
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
