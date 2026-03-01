"use server";

import { auth } from "@/app/api/auth/auth";
import { Octokit } from "octokit";
import { triggerRevalidate } from "@/app/actions/revalidate";

// React 19 requires Server Actions used in useActionState to accept `prevState`
export async function createIssue(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session?.accessToken) {
    return { error: "Unauthorized. Please sign in." };
  }

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const owner = formData.get("owner") as string;
  const repo = formData.get("repo") as string;

  if (!title || !owner || !repo) {
    return { error: "Missing required fields" };
  }

  try {
    const octokit = new Octokit({ auth: session.accessToken });

    await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
    });

    // Revalidate the dashboard and clear Redis cache for this repo
    await triggerRevalidate(owner, repo);

    return { success: "Issue created successfully!", timestamp: Date.now() };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create issue",
    };
  }
}
