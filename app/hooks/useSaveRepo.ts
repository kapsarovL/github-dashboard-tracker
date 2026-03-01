"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./useQuery";

interface SaveRepoMutation {
  owner: string;
  repo: string;
  userId: string;
}

interface SaveRepoResponse {
  success: boolean;
  message: string;
}

async function saveRepository(data: SaveRepoMutation): Promise<SaveRepoResponse> {
  const response = await fetch("/api/repos/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save repository");
  }

  return response.json();
}

interface UnsaveRepoMutation {
  fullName: string;
  userId: string;
}

async function unsaveRepository(data: UnsaveRepoMutation): Promise<void> {
  const response = await fetch("/api/repos/unsave", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: data.fullName }),
  });

  if (!response.ok) {
    throw new Error("Failed to unsave repository");
  }
}

export function useSaveRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveRepository,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.savedRepos(variables.userId),
      });

      // Snapshot the previous value
      const previousRepos = queryClient.getQueryData<unknown[]>(
        queryKeys.user.savedRepos(variables.userId)
      );

      // Optimistically add the repo
      queryClient.setQueryData<unknown[]>(
        queryKeys.user.savedRepos(variables.userId),
        (old: unknown[] = []) => [
          ...old,
          {
            id: Date.now().toString(),
            owner: variables.owner,
            name: variables.repo,
            full_name: `${variables.owner}/${variables.repo}`,
            createdAt: new Date().toISOString(),
          },
        ]
      );

      return { previousRepos };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousRepos) {
        queryClient.setQueryData<unknown[]>(
          queryKeys.user.savedRepos(variables.userId),
          context.previousRepos as unknown[]
        );
      }
      console.error("Failed to save repo:", err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.all,
      });
    },
  });
}

export function useUnsaveRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsaveRepository,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.savedRepos(variables.userId),
      });

      // Snapshot the previous value
      const previousRepos = queryClient.getQueryData<unknown[]>(
        queryKeys.user.savedRepos(variables.userId)
      );

      // Optimistically remove the repo
      queryClient.setQueryData<unknown[]>(
        queryKeys.user.savedRepos(variables.userId),
        (old: unknown[] = []) => old.filter((repo) => {
          const repoObj = repo as { full_name?: string };
          return repoObj.full_name !== variables.fullName;
        })
      );

      return { previousRepos };
    },
    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousRepos) {
        queryClient.setQueryData<unknown[]>(
          queryKeys.user.savedRepos(variables.userId),
          context.previousRepos as unknown[]
        );
      }
      console.error("Failed to unsave repo:", err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.all,
      });
    },
  });
}
