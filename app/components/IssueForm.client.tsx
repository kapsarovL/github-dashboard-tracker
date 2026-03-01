"use client";

import React, { useActionState, useEffect } from "react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { Input } from "@/app/ui/Primitives/ui/Input";
import { Loader2, PlusCircle } from "lucide-react";
import { createIssue } from "@/app/actions/github";

export interface IssueFormProps {
  owner: string;
  repo: string;
  className?: string;
}

interface FormState {
  error?: string;
  success?: string;
  timestamp?: number;
}

export function IssueForm({ owner, repo, className = "" }: IssueFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createIssue,
    { error: "", success: "" },
  );

  // Clear success message after 5 seconds
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        // Reset by submitting an empty form action
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className={`bg-card border-border flex flex-col gap-4 rounded-xl border p-6 shadow-sm ${className}`}
    >
      {/* Hidden fields for owner and repo */}
      <input type="hidden" name="owner" value={owner} />
      <input type="hidden" name="repo" value={repo} />

      <div className="space-y-1">
        <h3 className="text-foreground text-xl font-bold tracking-tight">Create New Issue</h3>
        <p className="text-muted-foreground text-sm font-medium">
          Report a bug or request a new feature.
        </p>
      </div>

      {state.error && (
        <div
          className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm font-bold"
          role="alert"
        >
          {state.error}
        </div>
      )}

      {state.success && (
        <div
          className="bg-success-bg text-success rounded-lg p-3 text-sm font-bold"
          role="status"
        >
          {state.success}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="issue-title"
            className="text-foreground text-xs font-bold uppercase tracking-wider"
          >
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="issue-title"
            name="title"
            placeholder="E.g., Bug: Application crashes on login"
            disabled={isPending}
            className="bg-input-bg border-border"
            aria-invalid={!!state.error}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="issue-body"
            className="text-foreground text-xs font-bold uppercase tracking-wider"
          >
            Description
          </label>
          <textarea
            id="issue-body"
            name="body"
            placeholder="Provide context or steps to reproduce..."
            disabled={isPending}
            className="bg-input-bg border-border placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-2 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="font-bold transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Issue
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
