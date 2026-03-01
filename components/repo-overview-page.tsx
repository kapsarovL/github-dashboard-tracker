import { StatsGrid } from "@/app/components/StatsGrid";
import { ActivityChart } from "@/app/components/ActivityChart";
import { AuthButton } from "@/app/components/AuthButton";
import { RecentIssues } from "@/app/components/RecentIssues";
import { RecentCommits } from "@/app/components/RecentCommits";
import { RecentPullRequests } from "@/app/components/RecentPullRequests";
import { TopContributors } from "@/app/components/TopContributors";
import { ProjectLanguages } from "@/app/components/ProjectLanguages";
import { RepoSelector } from "@/app/components/RepoSelector";
import { SyncButton } from "@/app/components/SyncButtonLegacy";
import { PDFReportGenerator } from "@/app/components/PDFReportGenerator";
import { SaveRepoButton } from "@/app/components/SaveRepoButton";
import { RecentProjects } from "@/app/components/RecentProjects";
import { IssueForm } from "@/app/components/IssueForm.client";
import { Badge } from "@/app/ui/Primitives/ui/Badge";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";
import { ExternalLink, Scale, History, MousePointer2 } from "lucide-react";
import type { Session } from "next-auth";
import { RepoStats } from "@/lib/pdf";

interface RepoOverviewPageProps {
  stats: RepoStats;
  session: Session | null;
  repoName: string;
  initialIsSaved: boolean;
}

export function RepoOverviewPage({
  stats,
  session,
  repoName,
  initialIsSaved,
}: RepoOverviewPageProps) {
  return (
    <div className="min-h-screen">
      <StaggerContainer className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* ── Repo Header ────────────────────────────────────────── */}
        <StaggerItem>
          <div className="border-border/40 bg-card/50 overflow-hidden rounded-2xl border shadow-sm backdrop-blur-sm">
            {/* Top bar: search + actions */}
            <div className="border-border/30 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-6">
              <div className="min-w-0 flex-1 sm:max-w-sm">
                <RepoSelector />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SaveRepoButton
                  owner={stats.repository.owner.login}
                  repo={stats.repository.name}
                  initialIsSaved={initialIsSaved}
                  isAuthenticated={!!session}
                />
                <SyncButton
                  owner={stats.repository.owner.login}
                  repo={stats.repository.name}
                />
                <PDFReportGenerator repoName={repoName} stats={stats} />
                <AuthButton session={session} />
              </div>
            </div>

            {/* Repo identity */}
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {stats.repository.owner.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={stats.repository.owner.avatar_url}
                    alt={stats.repository.owner.login}
                    className="border-border/40 h-12 w-12 shrink-0 rounded-xl border object-cover sm:h-14 sm:w-14"
                  />
                )}

                <div className="min-w-0 flex-1 space-y-2">
                  {/* Name + link */}
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                      {stats.repository.name}
                    </h1>
                    <span className="text-muted-foreground text-sm font-medium">
                      {stats.repository.owner.login}
                    </span>
                  </div>

                  {/* Description */}
                  {stats.repository.description && (
                    <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                      {stats.repository.description}
                    </p>
                  )}

                  {/* Meta pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    {stats.repository.license && (
                      <span className="text-muted-foreground border-border/50 bg-muted/40 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                        <Scale className="h-3 w-3" />
                        {stats.repository.license.name}
                      </span>
                    )}
                    <span className="text-muted-foreground border-border/50 bg-muted/40 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
                      <History className="h-3 w-3" />
                      Updated{" "}
                      {new Date(
                        stats.repository.pushed_at,
                      ).toLocaleDateString()}
                    </span>
                    {stats.repository.homepage && (
                      <a
                        href={stats.repository.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary border-primary/20 hover:bg-primary/10 bg-primary/5 flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors"
                      >
                        <MousePointer2 className="h-3 w-3" />
                        Website
                      </a>
                    )}
                    <a
                      href={stats.repository.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary border-primary/20 hover:bg-primary/10 bg-primary/5 flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      GitHub
                    </a>
                  </div>

                  {/* Topics */}
                  {stats.repository.topics &&
                    stats.repository.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {stats.repository.topics.map((topic: string) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="bg-primary/8 text-primary border-primary/15 hover:bg-primary/15 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* ── Stats Grid ─────────────────────────────────────────── */}
        <StaggerItem>
          <StatsGrid data={stats} />
        </StaggerItem>

        {/* ── Activity + Recent Commits ──────────────────────────── */}
        <StaggerItem>
          <div className="grid gap-5 lg:grid-cols-7">
            <div className="border-border/40 bg-card/50 col-span-1 rounded-2xl border p-5 shadow-sm backdrop-blur-sm lg:col-span-4 lg:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-foreground text-base font-semibold tracking-tight">
                    Activity Timeline
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Commits over the last 30 days
                  </p>
                </div>
              </div>
              <div className="h-65">
                <ActivityChart data={stats.activityTimeline ?? []} />
              </div>
            </div>

            <div className="border-border/40 bg-card/50 col-span-1 rounded-2xl border p-5 shadow-sm backdrop-blur-sm lg:col-span-3 lg:p-6">
              <SectionHeader
                title="Recent Commits"
                subtitle="Latest changes to the codebase"
              />
              <RecentCommits commits={stats.recentCommits ?? []} />
            </div>
          </div>
        </StaggerItem>

        {/* ── Issues + Pull Requests ─────────────────────────────── */}
        <StaggerItem>
          <div className="grid gap-5 lg:grid-cols-7">
            <div className="border-border/40 bg-card/50 col-span-1 rounded-2xl border p-5 shadow-sm backdrop-blur-sm lg:col-span-4 lg:p-6">
              <SectionHeader
                title="Recent Issues"
                subtitle="Bugs and feature requests"
              />
              <RecentIssues issues={stats.recentIssues ?? []} />
            </div>
            <div className="border-border/40 bg-card/50 col-span-1 rounded-2xl border p-5 shadow-sm backdrop-blur-sm lg:col-span-3 lg:p-6">
              <SectionHeader
                title="Pull Requests"
                subtitle="Code reviews and contributions"
              />
              <RecentPullRequests
                pullRequests={stats.recentPullRequests ?? []}
              />
            </div>
          </div>
        </StaggerItem>

        {/* ── Create Issue ───────────────────────────────────────── */}
        <StaggerItem>
          <IssueForm
            owner={stats.repository.owner.login}
            repo={stats.repository.name}
          />
        </StaggerItem>

        {/* ── Contributors + Languages ───────────────────────────── */}
        <StaggerItem>
          <div className="grid gap-5 lg:grid-cols-7">
            <div className="border-border/40 bg-card/50 col-span-1 rounded-2xl border p-5 shadow-sm backdrop-blur-sm lg:col-span-4 lg:p-6">
              <SectionHeader
                title="Top Contributors"
                subtitle="People who make this project possible"
              />
              <TopContributors contributors={stats.topContributors ?? []} />
            </div>
            <div className="border-border/40 bg-card/50 col-span-1 rounded-2xl border p-5 shadow-sm backdrop-blur-sm lg:col-span-3 lg:p-6">
              <SectionHeader
                title="Languages"
                subtitle="Technologies used in this repository"
              />
              <ProjectLanguages languages={stats.projectLanguages ?? []} />
            </div>
          </div>
        </StaggerItem>

        {/* ── Recently Viewed ────────────────────────────────────── */}
        <StaggerItem>
          <RecentProjects
            currentRepo={{
              fullName: stats.repository.full_name,
              owner: stats.repository.owner.login,
              name: stats.repository.name,
              primaryLanguage: stats.repository.language || "Other",
              avatarUrl: stats.repository.owner.avatar_url,
            }}
          />
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-foreground text-base font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
    </div>
  );
}
