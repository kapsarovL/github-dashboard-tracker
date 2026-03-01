"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/app/hooks/useQuery";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  license: {
    name: string;
  } | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  created_at: string;
  updated_at: string;
}

interface Commit {
  sha: string;
  html_url: string;
  author: {
    avatar_url: string;
    login: string;
  } | null;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    } | null;
  };
}

interface Issue {
  id: number;
  html_url: string;
  title: string;
  state: "open" | "closed";
  created_at: string;
  number: number;
  user: {
    login: string;
  } | null;
}

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface Language {
  name: string;
  value: number;
  percentage: string;
}

interface ActivityData {
  date: string;
  commits: number;
  issues: number;
}

// Fetch repository metadata
export function useRepoMetadata(owner: string, repo: string) {
  return useQuery<GitHubRepo>({
    queryKey: queryKeys.github.repo(owner, repo),
    queryFn: async () => {
      const response = await fetch(`/api/repos/search?repo=${owner}/${repo}`);
      if (!response.ok) {
        throw new Error("Failed to fetch repository");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Fetch commits
export function useCommits(owner: string, repo: string, limit = 30) {
  return useQuery<Commit[]>({
    queryKey: queryKeys.github.commits(owner, repo),
    queryFn: async () => {
      const response = await fetch(
        `/api/repos/search?type=commits&repo=${owner}/${repo}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch commits");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch issues
export function useIssues(owner: string, repo: string, limit = 30) {
  return useQuery<Issue[]>({
    queryKey: queryKeys.github.issues(owner, repo),
    queryFn: async () => {
      const response = await fetch(
        `/api/repos/search?type=issues&repo=${owner}/${repo}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch contributors
export function useContributors(owner: string, repo: string) {
  return useQuery<Contributor[]>({
    queryKey: queryKeys.github.contributors(owner, repo),
    queryFn: async () => {
      const response = await fetch(
        `/api/repos/search?type=contributors&repo=${owner}/${repo}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contributors");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Fetch languages
export function useLanguages(owner: string, repo: string) {
  return useQuery<Language[]>({
    queryKey: queryKeys.github.languages(owner, repo),
    queryFn: async () => {
      const response = await fetch(
        `/api/repos/search?type=languages&repo=${owner}/${repo}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Fetch activity timeline
export function useActivityTimeline(owner: string, repo: string, days = 30) {
  return useQuery<ActivityData[]>({
    queryKey: queryKeys.github.activity(owner, repo),
    queryFn: async () => {
      const response = await fetch(
        `/api/repos/search?type=activity&repo=${owner}/${repo}&days=${days}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }
      return response.json();
    },
    enabled: !!owner && !!repo,
    staleTime: 5 * 60 * 1000,
  });
}
