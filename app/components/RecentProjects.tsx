"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { History, ChevronRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrappers";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/ui/Primitives/ui/Avatar";

interface RecentProject {
  fullName: string;
  owner: string;
  name: string;
  primaryLanguage: string;
  avatarUrl: string;
}

interface RecentProjectsProps {
  currentRepo?: RecentProject;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "from-blue-500 to-blue-600",
  JavaScript: "from-yellow-400 to-yellow-500",
  Python: "from-green-500 to-emerald-600",
  HTML: "from-orange-500 to-orange-600",
  CSS: "from-purple-500 to-purple-600",
  "C++": "from-pink-500 to-pink-600",
  Go: "from-cyan-500 to-cyan-600",
  Rust: "from-orange-400 to-orange-500",
  Ruby: "from-red-500 to-red-600",
  Java: "from-orange-600 to-red-600",
};

export function RecentProjects({ currentRepo }: RecentProjectsProps) {
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  useEffect(() => {
    const updateRecentProjects = () => {
      const stored = localStorage.getItem("recent_github_projects");
      let projects: RecentProject[] = stored ? JSON.parse(stored) : [];

      if (currentRepo) {
        projects = [
          currentRepo,
          ...projects.filter((p) => p.fullName !== currentRepo.fullName),
        ].slice(0, 5);

        localStorage.setItem(
          "recent_github_projects",
          JSON.stringify(projects),
        );
      }
      setRecentProjects(projects);
    };

    updateRecentProjects();
  }, [currentRepo]);

  if (recentProjects.length === 0) return null;

  return (
    <FadeIn>
      <div className="bg-card border-border mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/5 flex h-8 w-8 items-center justify-center rounded-lg">
            <History className="text-primary h-4 w-4" />
          </div>
          <span className="text-foreground text-sm font-semibold tracking-tight">
            Jump Back In
          </span>
        </div>

        <StaggerContainer className="flex flex-wrap gap-2">
          {recentProjects.map((project) => (
            <StaggerItem key={project.fullName}>
              <Link
                href={`/?repo=${encodeURIComponent(project.fullName)}`}
                className="group bg-muted/30 border-border hover:border-primary/30 hover:bg-muted/50 flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-all hover:shadow-sm"
              >
                <Avatar className="h-5 w-5 rounded-md">
                  <AvatarImage
                    src={project.avatarUrl}
                    alt={`${project.owner} avatar`}
                    sizes="20px"
                    className="grayscale transition-all group-hover:grayscale-0"
                  />
                  <AvatarFallback className="text-[8px]">
                    {project.owner.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="text-foreground truncate text-xs font-semibold">
                    {project.name}
                  </span>
                  <div
                    className={`h-1.5 w-1.5 rounded-full bg-linear-to-r ${LANGUAGE_COLORS[project.primaryLanguage] || "from-gray-400 to-gray-500"}`}
                  />
                  <ChevronRight className="text-muted-foreground/50 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </FadeIn>
  );
}
