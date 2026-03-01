"use client";

import { Users, Trophy } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/ui/Primitives/ui/Avatar";
import { Badge } from "@/app/ui/Primitives/ui/Badge";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface TopContributorsProps {
  contributors: Contributor[];
}

export function TopContributors({ contributors }: TopContributorsProps) {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/30">
        <div className="text-center">
          <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">No contributors yet</p>
        </div>
      </div>
    );
  }

  // Sort contributors by contributions
  const sortedContributors = [...contributors].sort(
    (a, b) => b.contributions - a.contributions
  );

  return (
    <div className="space-y-2">
      {sortedContributors.map((contributor, index) => (
        <a
          key={contributor.login}
          href={contributor.html_url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between gap-3 rounded-xl border border-transparent p-3 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            {/* Rank badge for top 3 */}
            {index < 3 ? (
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm"
                    : index === 1
                    ? "bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-sm"
                    : "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-sm"
                }`}
              >
                <Trophy className="h-3 w-3" />
              </div>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
            )}

            <Avatar className="border-border/60 group-hover:border-primary/50 h-10 w-10 ring-2 ring-transparent transition-all group-hover:ring-primary/20">
              <AvatarImage
                src={contributor.avatar_url}
                alt={contributor.login}
                sizes="40px"
              />
              <AvatarFallback>
                {contributor.login.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                {contributor.login}
              </p>
              <p className="text-muted-foreground text-xs">
                {contributor.contributions} contributions
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0 font-mono text-xs">
            #{index + 1}
          </Badge>
        </a>
      ))}
    </div>
  );
}
