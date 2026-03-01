"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/Primitives/ui/Card";
import { GitFork, Star, AlertCircle, Eye } from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";

interface StatsGridData {
  repository: {
    stargazers_count: number;
    description: string | null;
    forks_count: number;
    open_issues_count: number;
    subscribers_count: number;
    watchers_count: number;
  };
}

export function StatsGrid({ data }: { data: StatsGridData }) {
  const stats = [
    {
      title: "Stargazers",
      value: data.repository.stargazers_count.toLocaleString(),
      description: data.repository.description || "No description provided",
      icon: Star,
      gradient: "from-amber-500/20 to-orange-500/20",
      iconGradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Forks",
      value: data.repository.forks_count.toLocaleString(),
      description: "Community contributions",
      icon: GitFork,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconGradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Open Issues",
      value: data.repository.open_issues_count.toLocaleString(),
      description: "Needs attention",
      icon: AlertCircle,
      gradient: "from-red-500/20 to-pink-500/20",
      iconGradient: "from-red-500 to-pink-500",
    },
    {
      title: "Watchers",
      value: data.repository.watchers_count.toLocaleString(),
      description: "Subscribed for updates",
      icon: Eye,
      gradient: "from-purple-500/20 to-violet-500/20",
      iconGradient: "from-purple-500 to-violet-500",
    },
  ];

  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StaggerItem key={stat.title}>
          <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            {/* Subtle gradient background effect on hover */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 transition-opacity duration-200 group-hover:opacity-10 dark:group-hover:opacity-20`}
            />

            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                {stat.title}
              </CardTitle>
              <div
                className={`rounded-lg bg-linear-to-br ${stat.iconGradient} p-2 shadow-sm transition-transform duration-200 group-hover:scale-110`}
              >
                <stat.icon className="h-4 w-4 shrink-0 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative space-y-1">
              <div className="text-foreground text-2xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-muted-foreground line-clamp-1 text-[11px] leading-relaxed">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
