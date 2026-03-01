"use client";

import { AlertCircle } from "lucide-react";
import { Badge } from "@/app/ui/Primitives/ui/Badge";

interface Issue {
  id: number;
  html_url: string;
  title: string;
  state: string;
  created_at: string;
  number: number;
  user: {
    login: string;
  } | null;
}

interface RecentIssuesProps {
  issues: Issue[];
}

export function RecentIssues({ issues }: RecentIssuesProps) {
  if (!issues || issues.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/30">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">No open issues</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => (
        <a
          key={issue.id}
          href={issue.html_url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <div className="mt-0.5 shrink-0">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                issue.state === "open"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-foreground group-hover:text-primary line-clamp-2 text-sm font-medium leading-snug transition-colors">
              {issue.title}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={issue.state === "open" ? "success" : "destructive"}
                className="h-5 text-xs"
              >
                {issue.state === "open" ? "Open" : "Closed"}
              </Badge>
              <span className="text-muted-foreground font-mono text-xs font-medium">
                #{issue.number}
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground text-xs">
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
