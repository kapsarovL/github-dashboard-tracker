"use client";

import { useState } from "react";
import {
  GitCompare,
  Star,
  GitFork,
  AlertCircle,
  Users,
  TrendingUp,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { Input } from "@/app/ui/Primitives/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/Primitives/ui/Card";

interface RepoData {
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  subscribers_count: number;
  pushed_at: string;
  created_at: string;
  topics?: string[];
}

interface ComparisonRepo {
  id: string;
  repoPath: string;
  data: RepoData | null;
  error?: string;
}

export function RepositoryComparison() {
  const [repos, setRepos] = useState<ComparisonRepo[]>([
    { id: "1", repoPath: "", data: null },
    { id: "2", repoPath: "", data: null },
  ]);
  const [isComparing, setIsComparing] = useState(false);

  const addRepo = () => {
    if (repos.length < 3) {
      setRepos([
        ...repos,
        { id: Date.now().toString(), repoPath: "", data: null },
      ]);
    }
  };

  const removeRepo = (id: string) => {
    if (repos.length > 2) {
      setRepos(repos.filter((r) => r.id !== id));
    }
  };

  const updateRepoPath = (id: string, path: string) => {
    setRepos(repos.map((r) => (r.id === id ? { ...r, repoPath: path } : r)));
  };

  const fetchRepoData = async (repoPath: string): Promise<RepoData | null> => {
    if (!repoPath.includes("/")) return null;

    const [owner, repo] = repoPath.split("/");
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
    );

    if (!response.ok) {
      throw new Error(`Repository "${repoPath}" not found`);
    }

    return response.json() as Promise<RepoData>;
  };

  const handleCompare = async () => {
    setIsComparing(true);

    try {
      const updatedRepos = await Promise.all(
        repos.map(async (repo) => {
          try {
            const data = await fetchRepoData(repo.repoPath);
            return { ...repo, data, error: undefined };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            return { ...repo, data: null, error: errorMessage };
          }
        }),
      );

      setRepos(updatedRepos);
    } finally {
      setIsComparing(false);
    }
  };

  const validRepos = repos.filter((r) => r.data !== null);

  // Calculate comparison metrics
  const getWinner = (metric: keyof RepoData) => {
    if (validRepos.length < 2) return null;

    const max = Math.max(
      ...validRepos.map((r) => (r.data?.[metric] as number) || 0),
    );
    return validRepos.find((r) => (r.data?.[metric] as number) === max);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-card border-border mb-6 rounded-2xl border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/5 flex h-10 w-10 items-center justify-center rounded-lg">
                <GitCompare className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  Compare Repositories
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                  Compare up to 3 repositories side-by-side
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Repo Inputs */}
        <div className="mt-6 space-y-3">
          {repos.map((repo, index) => (
            <div key={repo.id} className="flex items-center gap-3">
              <span className="text-muted-foreground w-6 text-center text-[10px] font-bold uppercase tracking-wider">
                {index + 1}.
              </span>
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="owner/repo (e.g., facebook/react)"
                  value={repo.repoPath}
                  onChange={(e) => updateRepoPath(repo.id, e.target.value)}
                  className="bg-input-bg border-border h-11 pr-10 shadow-xs focus-visible:ring-primary/20"
                />
                {repos.length > 2 && (
                  <button
                    onClick={() => removeRepo(repo.id)}
                    className="text-muted-foreground hover:text-destructive absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {repos.length < 3 && (
            <Button
              onClick={addRepo}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-2 font-bold uppercase tracking-wider text-[10px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Another Repository
            </Button>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
          <Button
            onClick={handleCompare}
            disabled={repos.every((r) => !r.repoPath.trim()) || isComparing}
            className="gap-2 font-bold shadow-sm"
          >
            <GitCompare className="h-4 w-4" />
            {isComparing ? "Comparing..." : "Compare Now"}
          </Button>
        </div>
      </div>

      {/* Comparison Results */}
      {validRepos.length > 0 && (
        <div className="space-y-6">
          {/* Main Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {validRepos.map((repo) => (
              <Card
                key={repo.id}
                className={`border-border bg-card transition-all hover:shadow-md ${
                  getWinner("stargazers_count")?.id === repo.id
                    ? "border-primary/50 shadow-primary/5 shadow-md"
                    : "shadow-sm"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold tracking-tight">
                        {repo.data?.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                        {repo.data?.owner?.login}
                      </p>
                    </div>
                    {getWinner("stargazers_count")?.id === repo.id && (
                      <div className="bg-primary/10 rounded-full px-2 py-1 flex items-center gap-1.5">
                        <TrendingUp className="text-primary h-3.5 w-3.5" />
                        <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Top</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-muted-foreground line-clamp-2 text-sm font-medium leading-relaxed">
                    {repo.data?.description || "No description"}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <Star className="h-3.5 w-3.5 opacity-50" />
                        Stars
                      </div>
                      <p className="text-foreground text-lg font-bold tracking-tight">
                        {repo.data?.stargazers_count.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <GitFork className="h-3.5 w-3.5 opacity-50" />
                        Forks
                      </div>
                      <p className="text-foreground text-lg font-bold tracking-tight">
                        {repo.data?.forks_count.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <AlertCircle className="h-3.5 w-3.5 opacity-50" />
                        Issues
                      </div>
                      <p className="text-foreground text-lg font-bold tracking-tight">
                        {repo.data?.open_issues_count.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        <Users className="h-3.5 w-3.5 opacity-50" />
                        Watchers
                      </div>
                      <p className="text-foreground text-lg font-bold tracking-tight">
                        {repo.data?.subscribers_count.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  {/* Language & Last Updated */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    {repo.data?.language && (
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {repo.data.language}
                        </div>
                      </div>
                    )}
                    <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      {new Date(repo.data?.pushed_at || "").toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Side-by-Side Comparison Table */}
          <Card className="bg-card border-border overflow-hidden shadow-sm">
            <CardHeader className="border-b border-border bg-muted/30">
              <h3 className="text-foreground text-lg font-bold tracking-tight">
                Detailed Comparison
              </h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-muted-foreground px-6 py-4 text-left text-[10px] font-bold tracking-wider uppercase">
                        Metric
                      </th>
                      {validRepos.map((repo) => (
                        <th
                          key={repo.id}
                          className="text-foreground px-6 py-4 text-center text-[11px] font-bold tracking-wider uppercase"
                        >
                          {repo.data?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <ComparisonRow
                      label="Stars"
                      repos={validRepos}
                      metric="stargazers_count"
                      format={(v) =>
                        typeof v === "number" ? v.toLocaleString() : "0"
                      }
                    />
                    <ComparisonRow
                      label="Forks"
                      repos={validRepos}
                      metric="forks_count"
                      format={(v) =>
                        typeof v === "number" ? v.toLocaleString() : "0"
                      }
                    />
                    <ComparisonRow
                      label="Open Issues"
                      repos={validRepos}
                      metric="open_issues_count"
                      format={(v) =>
                        typeof v === "number" ? v.toLocaleString() : "0"
                      }
                    />
                    <ComparisonRow
                      label="Watchers"
                      repos={validRepos}
                      metric="subscribers_count"
                      format={(v) =>
                        typeof v === "number" ? v.toLocaleString() : "0"
                      }
                    />
                    <ComparisonRow
                      label="Language"
                      repos={validRepos}
                      metric="language"
                      format={(v) => (typeof v === "string" ? v : "N/A")}
                    />
                    <ComparisonRow
                      label="Created"
                      repos={validRepos}
                      metric="created_at"
                      format={(v) =>
                        typeof v === "string"
                          ? new Date(v).toLocaleDateString()
                          : "N/A"
                      }
                    />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {repos.some((r) => r.error) && (
        <div className="border-destructive/50 bg-destructive/5 mt-6 rounded-xl border p-4">
          <h3 className="text-destructive mb-2 font-semibold">Errors Found</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            {repos
              .filter((r) => r.error)
              .map((r) => (
                <li key={r.id}>
                  <strong>{r.repoPath}:</strong> {r.error}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper component for comparison table rows
function ComparisonRow({
  label,
  repos,
  metric,
  format,
}: {
  label: string;
  repos: ComparisonRepo[];
  metric: keyof RepoData;
  format: (value: unknown) => string;
}) {
  const values = repos.map((r) => r.data?.[metric]);
  const maxValue =
    typeof values[0] === "number" ? Math.max(...(values as number[])) : null;

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="text-foreground px-6 py-4 text-sm font-medium">{label}</td>
      {repos.map((repo, index) => {
        const value = repo.data?.[metric];
        const isWinner =
          maxValue !== null &&
          typeof value === "number" &&
          value === maxValue &&
          maxValue > 0;

        return (
          <td
            key={repo.id}
            className={`px-6 py-4 text-center text-sm ${
              isWinner
                ? "bg-primary/5 text-primary font-semibold"
                : "text-muted-foreground"
            } ${index < repos.length - 1 ? "border-border/40 border-r" : ""}`}
          >
            {format(value)}
            {isWinner && <span className="ml-1.5">🏆</span>}
          </td>
        );
      })}
    </tr>
  );
}
