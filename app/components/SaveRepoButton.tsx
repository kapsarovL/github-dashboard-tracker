"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { toggleSaveRepo } from "@/app/actions/repo_actions";
import { cn } from "@/app/ui/utils";

interface SaveRepoButtonProps {
  owner: string;
  repo: string;
  initialIsSaved: boolean;
  isAuthenticated: boolean;
}

export function SaveRepoButton({
  owner,
  repo,
  initialIsSaved,
  isAuthenticated,
}: SaveRepoButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to save repositories");
      return;
    }

    // Optimistic update
    const nextSavedState = !isSaved;
    setIsSaved(nextSavedState);

    startTransition(async () => {
      try {
        await toggleSaveRepo(owner, repo, isSaved);
        console.log(
          nextSavedState
            ? "Repository saved!"
            : "Repository removed from favorites",
        );
      } catch {
        // Revert on error
        setIsSaved(isSaved);
        console.error("Failed to update save status");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "rounded-full transition-all duration-300",
        isSaved
          ? "fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
          : "text-muted-foreground hover:text-red-500",
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          isSaved && "animate-in zoom-in-50 fill-current duration-300",
        )}
      />
      <span className="sr-only">
        {isSaved ? "Unsave repository" : "Save repository"}
      </span>
    </Button>
  );
}
