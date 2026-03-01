"use server";

import { revalidatePath } from "next/cache";
import { delCache } from "@/lib/cache/client";

/**
 * Triggers a revalidation of the dashboard data by clearing the Next.js cache
 * and optionally the Redis cache for a specific repo if provided.
 */
export async function triggerRevalidate(owner?: string, repo?: string) {
  try {
    if (owner && repo) {
      const statsCacheKey = `github:stats:${owner}:${repo}`;
      const metadataCacheKey = `github:metadata:${owner}:${repo}`;
      console.log(`[Revalidation] Clearing Redis cache for ${owner}/${repo}`);
      await Promise.all([delCache(statsCacheKey), delCache(metadataCacheKey)]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Revalidation failed:", error);
    return { success: false, error: "Failed to sync data" };
  }
}
