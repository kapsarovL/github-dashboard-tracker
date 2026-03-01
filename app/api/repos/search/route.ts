import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Search repositories
    const response = await octokit.rest.search.repos({
      q: query,
      sort: "stars",
      order: "desc",
      per_page: 10,
    });

    // Format results for autocomplete
    const results = response.data.items
      .filter((repo): repo is typeof repo & { owner: { login: string; avatar_url: string } } => !!repo.owner)
      .map((repo) => ({
        full_name: repo.full_name,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        avatar_url: repo.owner.avatar_url,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Repo search error:", error);
    
    // Handle rate limiting
    if (error instanceof Error && 'status' in error && error.status === 403) {
      return NextResponse.json(
        { error: "GitHub API rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to search repositories" },
      { status: 500 }
    );
  }
}
