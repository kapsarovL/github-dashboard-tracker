"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/ui/Primitives/ui/Input";
import { Search, AlertCircle, ArrowRight } from "lucide-react";
import {
  parseRepoString,
  isValidRepoFormat,
} from "@/lib/repo-parser";

export function RepoSelector() {
  const [repo, setRepo] = useState("");
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepoString(repo);
    if (parsed) {
      setError(false);
      const repoPath = `${parsed.owner}/${parsed.repo}`;
      router.push(`/?repo=${encodeURIComponent(repoPath)}`);
      setRepo("");
    } else if (repo.trim()) {
      setError(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRepo(val);
    if (error && (isValidRepoFormat(val) || !val.trim())) {
      setError(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="group relative flex w-full justify-center">
      <div className="flex w-full items-center justify-center gap-2">
        <div className="relative w-full max-w-lg">
          <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transition-colors" />
          <Input
            type="text"
            placeholder="owner/repo or GitHub URL"
            value={repo}
            onChange={handleChange}
            className={`bg-input-bg focus-visible:ring-primary h-12 w-full rounded-xl border-border pl-11 pr-4 font-medium shadow-xs transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 ${
              error
                ? "border-destructive focus-visible:ring-destructive focus:ring-destructive/20"
                : ""
            }`}
          />
          {error && (
            <div className="text-destructive absolute -bottom-7 left-0 flex items-center gap-1.5 text-[11px] font-bold tracking-wide">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Use format: owner/repo</span>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!repo.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary-hover group/btn inline-flex h-12 shrink-0 cursor-pointer items-center justify-center rounded-xl px-6 font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="mr-1.5">Explore</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
