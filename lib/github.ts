import { Octokit } from "octokit";
import { getCache, setCache } from "@/lib/cache/client";
import { getTTL } from "@/lib/cache/ttl";

interface GitHubStatsParams {
  owner?: string;
  repo?: string;
  accessToken?: string;
}

export async function getDashboardStats({
  owner,
  repo,
  accessToken,
}: GitHubStatsParams = {}) {
  // Initialize Octokit with user token if provided, else fallback to global env token
  const auth = accessToken || process.env.GITHUB_TOKEN;
  const octokit = new Octokit({ auth });

  // If no owner or repo is provided, fetch the authenticated user's most recently updated repository
  if (!owner || !repo) {
    try {
      const repos = await octokit.rest.repos.listForAuthenticatedUser({
        sort: "updated",
        per_page: 1,
      });

      if (repos.data.length === 0) {
        return null;
      }
      const latestRepo = repos.data[0];
      owner = latestRepo.owner.login;
      repo = latestRepo.name;
    } catch (e) {
      console.error("Failed to fetch authenticated user repos", e);
      return null;
    }
  }

  const cacheKey = `github:stats:${owner}:${repo}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedData = await getCache<any>(cacheKey);

  if (cachedData) {
    console.log(`[Cache Hit] Serving stats from Redis for ${owner}/${repo}`);
    return cachedData;
  }

  console.log(`[Cache Miss] Fetching stats from GitHub for ${owner}/${repo}`);

  try {
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Using Promise.all to fetch multiple endpoints concurrently
    const [
      repoData,
      issuesData,
      commitsData,
      pullsData,
      contributorsData,
      languagesData,
      recentIssuesActivity,
    ] = await Promise.all([
      octokit.rest.repos.get({ owner, repo }),
      octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: "open",
        per_page: 5,
      }),
      octokit.rest.repos.listCommits({
        owner,
        repo,
        since: thirtyDaysAgo.toISOString(),
        per_page: 100,
      }),
      octokit.rest.pulls.list({
        owner,
        repo,
        state: "all",
        per_page: 5,
      }),
      octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 5,
      }),
      octokit.rest.repos.listLanguages({
        owner,
        repo,
      }),
      octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: "all",
        since: thirtyDaysAgo.toISOString(),
        per_page: 100,
      }),
    ]);

    // Group activity by date for the Activity Timeline
    const activityMap = new Map<string, { commits: number; issues: number }>();

    // Initialize last 30 days with 0 to ensure continuous chart rendering
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      activityMap.set(dateString, { commits: 0, issues: 0 });
    }

    commitsData.data.forEach((commit) => {
      if (commit.commit.author?.date) {
        const date = new Date(commit.commit.author.date);
        const dateString = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (activityMap.has(dateString)) {
          const current = activityMap.get(dateString)!;
          activityMap.set(dateString, {
            ...current,
            commits: current.commits + 1,
          });
        }
      }
    });

    recentIssuesActivity.data.forEach((issue) => {
      if (issue.created_at) {
        const date = new Date(issue.created_at);
        const dateString = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (activityMap.has(dateString)) {
          const current = activityMap.get(dateString)!;
          activityMap.set(dateString, {
            ...current,
            issues: current.issues + 1,
          });
        }
      }
    });

    const activityTimeline = Array.from(activityMap.entries()).map(
      ([date, counts]) => ({
        date,
        commits: counts.commits,
        issues: counts.issues,
      }),
    );

    // Calculate language percentages
    const totalBytes = Object.values(languagesData.data).reduce(
      (a, b) => a + b,
      0,
    );
    const languages =
      totalBytes > 0
        ? Object.entries(languagesData.data)
            .map(([name, bytes]) => ({
              name,
              value: bytes,
              percentage: ((bytes / totalBytes) * 100).toFixed(1),
            }))
            .sort((a, b) => b.value - a.value)
        : [];

    const resultData = {
      repository: repoData.data,
      recentIssues: issuesData.data,
      recentCommits: commitsData.data.slice(0, 5), // Keep only top 5 for sidebar
      activityTimeline,
      recentPullRequests: pullsData.data,
      topContributors: contributorsData.data,
      projectLanguages: languages,
    };

    // Asynchronously update cache so we don't block the return
    const ttl = getTTL("stats");
    setCache(cacheKey, resultData, ttl).catch(console.error);

    return resultData;
  } catch (error) {
    console.error("Error fetching repository stats:", error);
    return null;
  }
}

export async function getRepoMetadata({
  owner,
  repo,
  accessToken,
}: GitHubStatsParams) {
  const auth = accessToken || process.env.GITHUB_TOKEN;
  const octokit = new Octokit({ auth });

  if (!owner || !repo) return null;

  const cacheKey = `github:metadata:${owner}:${repo}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cachedData = await getCache<any>(cacheKey);

  if (cachedData) {
    console.log(`[Cache Hit] Serving metadata from Redis for ${owner}/${repo}`);
    return cachedData;
  }

  console.log(
    `[Cache Miss] Fetching metadata from GitHub for ${owner}/${repo}`,
  );

  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });

    const ttl = getTTL("metadata");
    setCache(cacheKey, data, ttl).catch(console.error);

    return data;
  } catch (error) {
    console.error("Error fetching repository metadata:", error);
    return null;
  }
}
