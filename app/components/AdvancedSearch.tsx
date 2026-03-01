"use client";

import React, { useState, useCallback } from "react";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Star,
  GitFork,
} from "lucide-react";
import { Button } from "@/app/ui/Primitives/ui/Button";
import { Input } from "@/app/ui/Primitives/ui/Input";
import {
  StaggerContainer,
  StaggerItem,
} from "@/app/components/MotionWrappers";

interface SearchFilters {
  query: string;
  language: string;
  minStars: string;
  maxStars: string;
  hasIssues: boolean;
  hasWiki: boolean;
  sort: "stars" | "forks" | "updated" | "name";
  order: "asc" | "desc";
}

const POPULAR_LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "C++",
  "C#",
  "Shell",
  "HTML",
  "CSS",
  "Vue",
  "Svelte",
];

interface AdvancedSearchProps {
  onSearchComplete?: (results: unknown[]) => void;
}

export function AdvancedSearch({ onSearchComplete }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    language: "",
    minStars: "",
    maxStars: "",
    hasIssues: false,
    hasWiki: false,
    sort: "stars",
    order: "desc",
  });

  const [searchResults, setSearchResults] = useState<unknown[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!filters.query.trim()) return;

    setIsSearching(true);
    try {
      // Build GitHub search query
      let searchQuery = filters.query;

      if (filters.language) {
        searchQuery += ` language:${filters.language}`;
      }

      if (filters.minStars) {
        searchQuery += ` stars:>=${filters.minStars}`;
      }

      if (filters.maxStars) {
        searchQuery += ` stars:<=${filters.maxStars}`;
      }

      if (filters.hasIssues) {
        searchQuery += ` has:issues`;
      }

      if (filters.hasWiki) {
        searchQuery += ` has:wiki`;
      }

      // Search GitHub repositories
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          searchQuery,
        )}&sort=${filters.sort}&order=${filters.order}&per_page=10`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.items || []);
      onSearchComplete?.(data.items || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [filters, onSearchComplete]);

  const resetFilters = () => {
    setFilters({
      query: "",
      language: "",
      minStars: "",
      maxStars: "",
      hasIssues: false,
      hasWiki: false,
      sort: "stars",
      order: "desc",
    });
    setSearchResults([]);
  };

  const handleRepoSelect = (repo: unknown) => {
    if (
      typeof repo === "object" &&
      repo !== null &&
      "full_name" in repo &&
      typeof repo.full_name === "string"
    ) {
      window.location.href = `/?repo=${repo.full_name}`;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Advanced Search
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/40 backdrop-blur-xs">
          <div className="flex min-h-screen items-start justify-center p-4 sm:p-8">
            <StaggerContainer className="bg-card border-border w-full max-w-5xl rounded-2xl border p-6 shadow-2xl sm:p-8">
              {/* Header */}
              <StaggerItem className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-foreground text-2xl font-bold tracking-tight">
                    Advanced Repository Search
                  </h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Find repositories with powerful filters
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-all"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </button>
              </StaggerItem>

              {/* Search Bar */}
              <StaggerItem className="mt-8">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Search repositories (e.g., 'machine learning', 'react dashboard')"
                      value={filters.query}
                      onChange={(e) =>
                        setFilters({ ...filters, query: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="bg-input-bg border-border h-12 pr-4 pl-11 shadow-xs focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSearch}
                      disabled={!filters.query.trim() || isSearching}
                      size="lg"
                      className="flex-1 px-8 font-bold shadow-sm sm:flex-none"
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                    <Button
                      onClick={resetFilters}
                      variant="ghost"
                      size="lg"
                      className="text-muted-foreground hover:text-foreground px-4 font-bold"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </StaggerItem>

              {/* Filters Grid */}
              <StaggerItem className="mt-8">
                <div className="bg-muted/30 border-border rounded-xl border p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Filter className="text-primary h-4 w-4" />
                    <h3 className="text-foreground text-[10px] font-bold uppercase tracking-wider">
                      Advanced Filters
                    </h3>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Language */}
                    <div className="space-y-2">
                      <label className="text-foreground text-[10px] font-bold uppercase tracking-wider">
                        Language
                      </label>
                      <select
                        value={filters.language}
                        onChange={(e) =>
                          setFilters({ ...filters, language: e.target.value })
                        }
                        className="bg-input-bg border-border text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-primary/20 flex h-10 w-full rounded-lg border px-3 py-2 text-sm font-medium shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none transition-all"
                      >
                        <option value="">Any Language</option>
                        {POPULAR_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Min Stars */}
                    <div className="space-y-2">
                      <label className="text-foreground text-[10px] font-bold uppercase tracking-wider">
                        Min Stars
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minStars}
                        onChange={(e) =>
                          setFilters({ ...filters, minStars: e.target.value })
                        }
                        className="bg-input-bg border-border h-10 shadow-xs"
                      />
                    </div>

                    {/* Max Stars */}
                    <div className="space-y-2">
                      <label className="text-foreground text-[10px] font-bold uppercase tracking-wider">
                        Max Stars
                      </label>
                      <Input
                        type="number"
                        placeholder="Any"
                        value={filters.maxStars}
                        onChange={(e) =>
                          setFilters({ ...filters, maxStars: e.target.value })
                        }
                        className="bg-input-bg border-border h-10 shadow-xs"
                      />
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <label className="text-foreground text-[10px] font-bold uppercase tracking-wider">
                        Sort By
                      </label>
                      <select
                        value={filters.sort}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            sort: e.target.value as
                              | "stars"
                              | "forks"
                              | "updated"
                              | "name",
                          })
                        }
                        className="bg-input-bg border-border text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-primary/20 flex h-10 w-full rounded-lg border px-3 py-2 text-sm font-medium shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none transition-all"
                      >
                        <option value="stars">Most Stars</option>
                        <option value="forks">Most Forks</option>
                        <option value="updated">Recently Updated</option>
                        <option value="name">Name (A-Z)</option>
                      </select>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-4">
                    <label className="group flex cursor-pointer items-center gap-3">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-border bg-input-bg transition-all group-hover:border-primary">
                        <input
                          type="checkbox"
                          checked={filters.hasIssues}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              hasIssues: e.target.checked,
                            })
                          }
                          className="peer absolute h-full w-full cursor-pointer opacity-0"
                        />
                        <div className="bg-primary h-2 w-2 rounded-sm opacity-0 transition-opacity peer-checked:opacity-100" />
                      </div>
                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider transition-colors group-hover:text-foreground">
                        Has Issues
                      </span>
                    </label>

                    <label className="group flex cursor-pointer items-center gap-3">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded border border-border bg-input-bg transition-all group-hover:border-primary">
                        <input
                          type="checkbox"
                          checked={filters.hasWiki}
                          onChange={(e) =>
                            setFilters({ ...filters, hasWiki: e.target.checked })
                          }
                          className="peer absolute h-full w-full cursor-pointer opacity-0"
                        />
                        <div className="bg-primary h-2 w-2 rounded-sm opacity-0 transition-opacity peer-checked:opacity-100" />
                      </div>
                      <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider transition-colors group-hover:text-foreground">
                        Has Wiki
                      </span>
                    </label>
                  </div>
                </div>
              </StaggerItem>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <StaggerItem className="mt-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="text-foreground text-[10px] font-bold uppercase tracking-wider">
                        {searchResults.length} Results Found
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchResults([])}
                        className="text-muted-foreground hover:text-foreground font-bold uppercase tracking-wider text-[10px]"
                      >
                        Clear Results
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {searchResults.slice(0, 10).map((repo) => {
                        const repoObj = repo as {
                          id: number;
                          name: string;
                          owner?: { login: string };
                          description?: string;
                          language?: string;
                          stargazers_count?: number;
                          forks_count?: number;
                        };
                        return (
                          <button
                            key={repoObj.id}
                            onClick={() => handleRepoSelect(repoObj)}
                            className="bg-muted/30 border-border hover:bg-muted/50 group rounded-xl border p-4 text-left transition-all hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-foreground group-hover:text-primary font-bold tracking-tight transition-colors">
                                    {repoObj.name}
                                  </h4>
                                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider opacity-60">
                                    / {repoObj.owner?.login}
                                  </span>
                                </div>
                                <p className="text-muted-foreground line-clamp-2 text-[13px] font-medium leading-relaxed">
                                  {repoObj.description || "No description"}
                                </p>
                                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                                  {repoObj.language && (
                                    <span className="bg-primary/5 text-primary rounded-full px-2 py-0.5">
                                      {repoObj.language}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1.5">
                                    <Star className="h-3 w-3 fill-current opacity-40" />
                                    {repoObj.stargazers_count?.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <GitFork className="h-3 w-3 opacity-40" />
                                    {repoObj.forks_count?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </StaggerItem>
              )}

              {/* No Results */}
              {searchResults.length === 0 && filters.query && !isSearching && (
                <StaggerItem className="mt-12 text-center">
                  <div className="bg-muted/20 border-border mx-auto max-w-md rounded-2xl border border-dashed p-10">
                    <div className="bg-primary/5 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Search className="text-primary/40 h-8 w-8" />
                    </div>
                    <h3 className="text-foreground font-bold tracking-tight">
                      No repositories found
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm font-medium">
                      Try adjusting your search query or filters to find what you're looking for.
                    </p>
                  </div>
                </StaggerItem>
              )}
            </StaggerContainer>
          </div>
        </div>
      )}
    </>
  );
}
