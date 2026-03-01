"use client";

import { GitPullRequest, GitMerge, GitPullRequestDraft } from "lucide-react";
import { Badge } from "@/app/ui/Primitives/ui/Badge";

interface PullRequest {
  id: number;
  html_url: string;
  title: string;
  state: "open" | "closed";
  merged_at: string | null;
  created_at: string;
  draft: boolean;
  number: number;
  user: {
    login: string;
  } | null;
}

interface RecentPullRequestsProps {
  pullRequests: PullRequest[];
}

export function RecentPullRequests({ pullRequests }: RecentPullRequestsProps) {
  if (!pullRequests || pullRequests.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/30">
        <div className="text-center">
          <GitPullRequest className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">No pull requests</p>
        </div>
      </div>
    );
  }

  const getStateDetails = (pr: PullRequest) => {
    if (pr.merged_at) {
      return {
        icon: GitMerge,
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-500",
        text: "Merged",
        variant: "default" as const,
      };
    }
    if (pr.state === "closed") {
      return {
        icon: GitPullRequest,
        iconBg: "bg-rose-500/10",
        iconColor: "text-rose-500",
        text: "Closed",
        variant: "destructive" as const,
      };
    }
    if (pr.draft) {
      return {
        icon: GitPullRequestDraft,
        iconBg: "bg-muted/50",
        iconColor: "text-muted-foreground",
        text: "Draft",
        variant: "secondary" as const,
      };
    }
    return {
      icon: GitPullRequest,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      text: "Open",
      variant: "success" as const,
    };
  };

  return (
    <div className="space-y-3">
      {pullRequests.map((pr) => {
        const stateDetails = getStateDetails(pr);
        const IconComponent = stateDetails.icon;

        return (
          <a
            key={pr.id}
            href={pr.html_url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start justify-between gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-muted/50 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${stateDetails.iconBg}`}
              >
                <IconComponent className={`h-4 w-4 ${stateDetails.iconColor}`} />
              </div>
              <div className="space-y-2">
                <p className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-medium leading-snug transition-colors">
                  {pr.title}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs font-medium">
                    #{pr.number}
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(pr.merged_at || pr.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant={stateDetails.variant}
              className="h-5 shrink-0 text-xs capitalize"
            >
              {stateDetails.text}
            </Badge>
          </a>
        );
      })}
    </div>
  );
}
