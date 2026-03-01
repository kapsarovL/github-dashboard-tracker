import { getDashboardStats } from "@/lib/github";
import { auth } from "@/app/api/auth/auth";
import { WelcomeScreen } from "@/app/components/WelcomeScreen";
import { InvalidFormatScreen } from "@/app/components/InvalidFormatScreen";
import { RepoOverviewPage } from "@/components/repo-overview-page";
import { parseRepoString } from "@/lib/repo-parser";
import { RepoStats } from "@/lib/pdf";
import { ensureUser, isRepositorySaved } from "@/lib/db/service";

export async function DashboardLayout({ repo }: { repo?: string }) {
  const session = await auth();
  let dbUser = null;

  if (session?.user?.email) {
    dbUser = await ensureUser({
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    });
  }

  let stats: RepoStats | null = null;
  let repoName = "";
  let owner: string | undefined = undefined;
  let repoNameStr: string | undefined = undefined;
  let initialIsSaved = false;

  if (repo) {
    const parsed = parseRepoString(repo);
    if (parsed) {
      owner = parsed.owner;
      repoNameStr = parsed.repo; // Corrected from parsed.name
    }
  }

  // Attempt to fetch stats if we have a session OR if a repo was provided
  if (session?.accessToken) {
    stats = (await getDashboardStats({
      owner,
      repo: repoNameStr,
      accessToken: session.accessToken,
    })) as RepoStats | null;
  } else if (owner && repoNameStr) {
    // Fallback for public repos if not logged in
    stats = (await getDashboardStats({
      owner,
      repo: repoNameStr,
    })) as RepoStats | null;
  }

  if (stats) {
    repoName = stats.repository.full_name;
    if (dbUser) {
      initialIsSaved = await isRepositorySaved(repoName, dbUser.id);
    }
  }

  // If we still don't have stats, decide which screen to show
  if (!stats) {
    if (repo && !parseRepoString(repo)) {
      return <InvalidFormatScreen />;
    }
    return <WelcomeScreen session={session} />;
  }

  return (
    <RepoOverviewPage
      stats={stats}
      session={session}
      repoName={repoName}
      initialIsSaved={initialIsSaved}
    />
  );
}
