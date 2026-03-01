import { RecentProjects } from "@/app/components/RecentProjects";
import { RepoSelector } from "@/app/components/RepoSelector";
import { AuthButton } from "@/app/components/AuthButton";
import { SavedReposList } from "@/app/components/SavedReposList";
import { AdvancedSearch } from "@/app/components/AdvancedSearch";
import { ensureUser } from "@/lib/db/service";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";
import { GitBranch, Search, TrendingUp, Users, BarChart3, GitCompare, FileText } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

interface WelcomeScreenProps {
  session: Session | null;
}

export async function WelcomeScreen({ session }: WelcomeScreenProps) {
  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await ensureUser({
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    });
  }

  return (
    <div className="bg-background min-h-screen">
      <StaggerContainer className="mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-20">
        {/* Hero Section */}
        <StaggerItem className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <GitBranch className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-foreground mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            GitHub Dashboard
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Search for any public GitHub repository to view its activity,
            contributors, pull requests, and more.
          </p>
        </StaggerItem>

        {/* Search Section */}
        <StaggerItem className="mb-8 flex w-full flex-col items-center gap-4">
          <div className="border-border bg-card w-full max-w-2xl rounded-xl border p-3 shadow-md">
            <RepoSelector />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">or</span>
            <AdvancedSearch />
          </div>
        </StaggerItem>

        {/* Quick Access Cards */}
        <StaggerItem className="mb-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/analytics" className="group">
            <div className="bg-card border-border hover:bg-muted/50 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-sm">
              <div className="bg-primary/5 group-hover:bg-primary/10 flex h-14 w-14 items-center justify-center rounded-lg transition-colors">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Analytics</h3>
                <p className="text-muted-foreground text-xs">View insights</p>
              </div>
            </div>
          </Link>

          <Link href="/compare" className="group">
            <div className="bg-card border-border hover:bg-muted/50 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-sm">
              <div className="bg-primary/5 group-hover:bg-primary/10 flex h-14 w-14 items-center justify-center rounded-lg transition-colors">
                <GitCompare className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Compare</h3>
                <p className="text-muted-foreground text-xs">Compare repos</p>
              </div>
            </div>
          </Link>

          <Link href="/reports" className="group">
            <div className="bg-card border-border hover:bg-muted/50 flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-sm">
              <div className="bg-primary/5 group-hover:bg-primary/10 flex h-14 w-14 items-center justify-center rounded-lg transition-colors">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Reports</h3>
                <p className="text-muted-foreground text-xs">Export data</p>
              </div>
            </div>
          </Link>
        </StaggerItem>

        {/* Features Grid */}
        <StaggerItem className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card border-border group rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-foreground mb-1.5 text-sm font-semibold">Activity Tracking</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Monitor commits, issues, and pull requests over time
            </p>
          </div>
          <div className="bg-card border-border group rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-foreground mb-1.5 text-sm font-semibold">Contributors</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              See top contributors and their impact on the project
            </p>
          </div>
          <div className="bg-card border-border group rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-foreground mb-1.5 text-sm font-semibold">Deep Insights</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Get detailed analytics and generate PDF reports
            </p>
          </div>
        </StaggerItem>

        {/* Auth Section */}
        <StaggerItem className="mb-8 flex justify-center">
          <AuthButton session={session} />
        </StaggerItem>

        {/* Saved Repositories */}
        {dbUser && (
          <StaggerItem className="w-full max-w-4xl">
            <SavedReposList userId={dbUser.id} />
          </StaggerItem>
        )}

        {/* Recent Projects */}
        <StaggerItem className="w-full max-w-4xl">
          <RecentProjects />
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}
