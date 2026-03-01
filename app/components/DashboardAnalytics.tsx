"use client";

import React from "react";
import {
  TrendingUp,
  Activity,
  Star,
  GitFork,
  AlertCircle,
  Users,
  Code2,
  Award,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";

interface AnalyticsData {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  totalContributors: number;
  mostUsedLanguage: string;
  activityScore: number;
  repoGrowth: number;
  starGrowth: number;
  topRepos: Array<{
    name: string;
    stars: number;
    forks: number;
    issues: number;
  }>;
  languageDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  weeklyActivity: Array<{
    week: string;
    commits: number;
    issues: number;
    prs: number;
  }>;
}

interface DashboardAnalyticsProps {
  data?: Partial<AnalyticsData>;
}

export function DashboardAnalytics({ data }: DashboardAnalyticsProps) {
  // Mock data for demonstration
  const analytics: AnalyticsData = {
    totalRepos: data?.totalRepos || 12,
    totalStars: data?.totalStars || 2453,
    totalForks: data?.totalForks || 892,
    totalIssues: data?.totalIssues || 156,
    totalContributors: data?.totalContributors || 48,
    mostUsedLanguage: data?.mostUsedLanguage || "TypeScript",
    activityScore: data?.activityScore || 87,
    repoGrowth: data?.repoGrowth || 15,
    starGrowth: data?.starGrowth || 23,
    topRepos: data?.topRepos || [
      { name: "github-dashboard", stars: 892, forks: 234, issues: 23 },
      { name: "react-components", stars: 654, forks: 189, issues: 45 },
      { name: "api-toolkit", stars: 421, forks: 156, issues: 12 },
    ],
    languageDistribution: data?.languageDistribution || [
      { name: "TypeScript", count: 8, percentage: 67 },
      { name: "JavaScript", count: 2, percentage: 17 },
      { name: "Python", count: 1, percentage: 8 },
      { name: "Rust", count: 1, percentage: 8 },
    ],
    weeklyActivity: data?.weeklyActivity || [
      { week: "Mon", commits: 23, issues: 5, prs: 8 },
      { week: "Tue", commits: 31, issues: 8, prs: 12 },
      { week: "Wed", commits: 18, issues: 3, prs: 6 },
      { week: "Thu", commits: 42, issues: 11, prs: 15 },
      { week: "Fri", commits: 27, issues: 6, prs: 9 },
      { week: "Sat", commits: 12, issues: 2, prs: 3 },
      { week: "Sun", commits: 8, issues: 1, prs: 2 },
    ],
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <StaggerContainer className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <StaggerItem>
          <div className="mb-8">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Dashboard Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights across all your repositories
            </p>
          </div>
        </StaggerItem>

        {/* Key Metrics */}
        <StaggerItem>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Repositories"
              value={analytics.totalRepos}
              change={analytics.repoGrowth}
              icon={Code2}
            />
            <MetricCard
              title="Total Stars"
              value={analytics.totalStars}
              change={analytics.starGrowth}
              icon={Star}
            />
            <MetricCard
              title="Total Forks"
              value={analytics.totalForks}
              change={12}
              icon={GitFork}
            />
            <MetricCard
              title="Open Issues"
              value={analytics.totalIssues}
              change={-5}
              icon={AlertCircle}
            />
          </div>
        </StaggerItem>

        {/* Activity Overview */}
        <StaggerItem className="grid gap-6 lg:grid-cols-2">
          {/* Activity Score */}
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-lg font-bold tracking-tight">
                  Activity Score
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Based on commits, issues, and PRs
                </p>
              </div>
              <div className="bg-primary/5 flex h-12 w-12 items-center justify-center rounded-xl">
                <Activity className="text-primary h-6 w-6" />
              </div>
            </div>

            <div className="mt-4">
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-foreground text-5xl font-bold tracking-tighter">
                    {analytics.activityScore}
                  </span>
                  <div className="bg-success-bg text-success flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12%</span>
                  </div>
                </div>
                <div className="bg-muted relative h-3 overflow-hidden rounded-full">
                  <div
                    className="bg-primary absolute h-full rounded-full transition-all"
                    style={{ width: `${analytics.activityScore}%` }}
                  />
                </div>
                <div className="text-muted-foreground flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Language */}
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-lg font-bold tracking-tight">
                  Primary Language
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Most used across repos
                </p>
              </div>
              <div className="bg-primary/5 flex h-12 w-12 items-center justify-center rounded-xl">
                <Code2 className="text-primary h-6 w-6" />
              </div>
            </div>

            <div className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary h-3 w-3 rounded-full" />
                  <span className="text-foreground text-2xl font-bold tracking-tight">
                    {analytics.mostUsedLanguage}
                  </span>
                </div>
                <div className="space-y-3">
                  {analytics.languageDistribution.map((lang) => (
                    <div key={lang.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-muted-foreground uppercase tracking-wider">
                          {lang.name}
                        </span>
                        <span className="text-foreground">
                          {lang.percentage}%
                        </span>
                      </div>
                      <div className="bg-muted relative h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary absolute h-full rounded-full transition-all"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Weekly Activity Chart */}
        <StaggerItem>
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-lg font-bold tracking-tight">
                  Weekly Activity
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Commits, issues, and PRs over the past week
                </p>
              </div>
              <div className="bg-primary/5 flex h-12 w-12 items-center justify-center rounded-xl">
                <TrendingUp className="text-primary h-6 w-6" />
              </div>
            </div>

            <div className="mt-8">
              <div className="flex h-48 items-end justify-between gap-3">
                {analytics.weeklyActivity.map((day) => {
                  const maxValue = Math.max(
                    ...analytics.weeklyActivity.map((d) => d.commits),
                  );
                  const height = (day.commits / maxValue) * 100;

                  return (
                    <div
                      key={day.week}
                      className="group flex flex-1 flex-col items-center gap-3"
                    >
                      <div
                        className="bg-primary/20 group-hover:bg-primary/80 w-full rounded-t-lg transition-all"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                        {day.week}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-border mt-6 flex justify-center gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2 w-2 rounded-full" />
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Commits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-success h-2 w-2 rounded-full" />
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Issues</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-accent-foreground h-2 w-2 rounded-full" />
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">PRs</span>
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Top Repositories */}
        <StaggerItem>
          <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-foreground text-lg font-bold tracking-tight">
                  Top Performing Repositories
                </h3>
                <p className="text-muted-foreground text-sm font-medium">
                  Ranked by stars and engagement
                </p>
              </div>
              <div className="bg-primary/5 flex h-12 w-12 items-center justify-center rounded-xl">
                <Award className="text-primary h-6 w-6" />
              </div>
            </div>

            <div className="mt-6">
              <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {analytics.topRepos.map((repo, index) => (
                  <div
                    key={repo.name}
                    className="bg-muted/30 border-border hover:bg-muted/50 flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-xs"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-linear-to-br from-amber-400 to-amber-600 text-white shadow-sm"
                            : index === 1
                              ? "bg-linear-to-br from-slate-400 to-slate-600 text-white shadow-sm"
                              : "bg-linear-to-br from-amber-700 to-amber-900 text-white shadow-sm"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-foreground text-sm font-bold tracking-tight">
                          {repo.name}
                        </h4>
                        <div className="text-muted-foreground flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {repo.stars.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            {repo.forks.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className="text-muted-foreground/30 h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Additional Insights */}
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StaggerItem>
            <InsightCard
              title="Total Contributors"
              value={analytics.totalContributors}
              description="Across all repositories"
              icon={Users}
              trend="+8 this month"
            />
          </StaggerItem>
          <StaggerItem>
            <InsightCard
              title="Avg Response Time"
              value="2.4h"
              description="For issues and PRs"
              icon={Clock}
              trend="-15% faster"
              trendPositive
            />
          </StaggerItem>
          <StaggerItem>
            <InsightCard
              title="Code Quality"
              value="A+"
              description="Based on best practices"
              icon={Target}
              trend="Consistent"
            />
          </StaggerItem>
        </StaggerContainer>
      </StaggerContainer>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
}) {
  const isPositive = change >= 0;

  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{title}</h3>
        <Icon className="text-muted-foreground h-4 w-4 opacity-50" />
      </div>
      <div className="mt-2">
        <div className="text-foreground text-2xl font-bold tracking-tight">
          {value.toLocaleString()}
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold">
          {isPositive ? (
            <div className="bg-success-bg text-success flex items-center gap-0.5 rounded-full px-1.5 py-0.5">
              <ArrowUpRight className="h-3 w-3" />
              <span>{change}%</span>
            </div>
          ) : (
            <div className="bg-destructive/10 text-destructive flex items-center gap-0.5 rounded-full px-1.5 py-0.5">
              <ArrowDownRight className="h-3 w-3" />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          <span className="text-muted-foreground ml-1 font-medium uppercase tracking-tight">vs last month</span>
        </div>
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendPositive = true,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{title}</h3>
        <Icon className="text-muted-foreground h-4 w-4 opacity-50" />
      </div>
      <div className="mt-2">
        <div className="text-foreground text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-muted-foreground mt-0.5 text-[11px] font-medium">{description}</p>
        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
          <span
            className={trendPositive ? "text-success" : "text-destructive"}
          >
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}
