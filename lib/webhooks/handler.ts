import { createHmac, timingSafeEqual } from "crypto";
import { delCache } from "@/lib/cache/client";
import { revalidatePath } from "next/cache";

export interface WebhookPayload {
  action?: string;
  repository?: {
    full_name?: string;
    [key: string]: unknown;
  };
  pusher?: {
    name?: string;
    [key: string]: unknown;
  };
  issue?: {
    title?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type GitHubWebhookEvent = {
  event: string;
  payload: WebhookPayload;
};

export class WebhookHandler {
  static verifySignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    if (!signature) return false;

    const hmac = createHmac("sha256", secret);
    const expectedSignature = `sha256=${hmac.update(payload).digest("hex")}`;

    try {
      return timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch {
      // Buffers of different lengths throw; treat as invalid
      return false;
    }
  }

  static async handleEvent({ event, payload }: GitHubWebhookEvent) {
    console.log("[WebhookHandler] Received event: %s", event);

    switch (event) {
      case "repository":
        await this.handleRepositoryEvent(payload);
        break;
      case "push":
        await this.handlePushEvent(payload);
        break;
      case "issues":
        await this.handleIssueEvent(payload);
        break;
      default:
        console.log("[WebhookHandler] Unhandled event type: %s", event);
    }
  }

  private static async handleRepositoryEvent(payload: WebhookPayload) {
    const action = payload.action;
    const repoFullName = payload.repository?.full_name;
    console.log(
      "[WebhookHandler] Repository event - Action: %s, Repo: %s",
      action,
      repoFullName,
    );

    if (repoFullName) {
      await this.invalidateCacheAndRevalidate(repoFullName);
    }
  }

  private static async handlePushEvent(payload: WebhookPayload) {
    const repoFullName = payload.repository?.full_name;
    const pusher = payload.pusher?.name;
    console.log(
      "[WebhookHandler] Push event - Repo: %s, Pusher: %s",
      repoFullName,
      pusher,
    );

    if (repoFullName) {
      await this.invalidateCacheAndRevalidate(repoFullName);
    }
  }

  private static async handleIssueEvent(payload: WebhookPayload) {
    const action = payload.action;
    const issueTitle = payload.issue?.title;
    const repoFullName = payload.repository?.full_name;
    console.log(
      "[WebhookHandler] Issue event - Action: %s, Title: %s",
      action,
      issueTitle,
    );
    console.log(
      "[WebhookHandler] Issue event - Action: %s, Repo: %s",
      action,
      repoFullName,
    );

    if (repoFullName) {
      await this.invalidateCacheAndRevalidate(repoFullName);
    }
  }

  private static async invalidateCacheAndRevalidate(repoFullName: string) {
    try {
      const [owner, repo] = repoFullName.split("/");
      if (owner && repo) {
        const statsCacheKey = `github:stats:${owner}:${repo}`;
        const metadataCacheKey = `github:metadata:${owner}:${repo}`;
        console.log("[WebhookHandler] Clearing cache for %s", repoFullName);
        await Promise.all([
          delCache(statsCacheKey),
          delCache(metadataCacheKey),
        ]);
        revalidatePath("/", "layout");
      }
    } catch (error) {
      console.error(
        "[WebhookHandler] Cache invalidation failed for %s:",
        repoFullName,
        error,
      );
      throw error;
    }
  }
}
