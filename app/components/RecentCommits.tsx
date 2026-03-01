"use client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/ui/Primitives/ui/Avatar";
import { GitCommit } from "lucide-react";

export interface CommitData {
  sha: string;
  html_url: string;
  author: {
    avatar_url: string;
  } | null;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    } | null;
  };
}

export function RecentCommits({ commits }: { commits: CommitData[] }) {
  if (!commits || commits.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed bg-muted/30">
        <div className="text-center">
          <GitCommit className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">No recent commits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {commits.map((commitData: CommitData) => (
        <a
          key={commitData.sha}
          href={commitData.html_url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <Avatar className="border-border/60 group-hover:border-primary/50 h-9 w-9 shrink-0 transition-colors">
            <AvatarImage
              src={commitData.author?.avatar_url || ""}
              alt={commitData.commit.author?.name || "Author"}
              sizes="36px"
            />
            <AvatarFallback>
              {(commitData.commit.author?.name || "U").substring(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-medium leading-snug transition-colors">
              {commitData.commit.message}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono font-medium">
                {commitData.sha.substring(0, 7)}
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground truncate">
                {new Date(commitData.commit.author?.date || "").toLocaleDateString()}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
