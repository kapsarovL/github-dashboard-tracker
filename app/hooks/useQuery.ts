import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

// Query keys factory for type-safe query keys
export const queryKeys = {
  github: {
    all: ["github"] as const,
    repo: (owner: string, repo: string) =>
      ["github", "repo", owner, repo] as const,
    activity: (owner: string, repo: string) =>
      ["github", "repo", owner, repo, "activity"] as const,
    commits: (owner: string, repo: string) =>
      ["github", "repo", owner, repo, "commits"] as const,
    issues: (owner: string, repo: string) =>
      ["github", "repo", owner, repo, "issues"] as const,
    pullRequests: (owner: string, repo: string) =>
      ["github", "repo", owner, repo, "pullRequests"] as const,
    contributors: (owner: string, repo: string) =>
      ["github", "repo", owner, repo, "contributors"] as const,
    languages: (owner: string, repo: string) =>
      ["github", "repo", owner, repo, "languages"] as const,
    search: (query: string) =>
      ["github", "search", query] as const,
  },
  user: {
    all: ["user"] as const,
    savedRepos: (userId: string) =>
      ["user", "savedRepos", userId] as const,
  },
};

// Type for GitHub query keys
export type GithubQueryKey = ReturnType<
  | typeof queryKeys.github.repo
  | typeof queryKeys.github.activity
  | typeof queryKeys.github.commits
  | typeof queryKeys.github.issues
  | typeof queryKeys.github.pullRequests
  | typeof queryKeys.github.contributors
  | typeof queryKeys.github.languages
  | typeof queryKeys.github.search
>;

// Generic query hook
export function useGithubQuery<T>(
  queryKey: GithubQueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    ...options,
  });
}

// Export hooks from react-query for direct use
export { useMutation, useQueryClient };
