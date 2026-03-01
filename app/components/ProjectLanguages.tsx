"use client";

import { Code2 } from "lucide-react";

interface Language {
  name: string;
  value: number;
  percentage: string;
}

interface ProjectLanguagesProps {
  languages: Language[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "from-blue-500 to-blue-600",
  JavaScript: "from-yellow-400 to-yellow-500",
  Python: "from-green-500 to-emerald-600",
  HTML: "from-orange-500 to-orange-600",
  CSS: "from-purple-500 to-purple-600",
  "C++": "from-pink-500 to-pink-600",
  Go: "from-cyan-500 to-cyan-600",
  Rust: "from-orange-400 to-orange-500",
  Ruby: "from-red-500 to-red-600",
  Java: "from-orange-600 to-red-600",
  Svelte: "from-orange-400 to-red-500",
  Vue: "from-green-400 to-emerald-500",
  React: "from-cyan-400 to-blue-500",
};

export function ProjectLanguages({ languages }: ProjectLanguagesProps) {
  if (!languages || languages.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/30">
        <div className="text-center">
          <Code2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-muted-foreground text-sm">No language data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Language distribution bar */}
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full border bg-muted"
        role="img"
        aria-label={`Language distribution: ${languages.map((l) => `${l.name} ${l.percentage}%`).join(", ")}`}
      >
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{ width: `${lang.percentage}%` }}
            className={`h-full bg-gradient-to-r ${LANGUAGE_COLORS[lang.name] || "from-gray-400 to-gray-500"}`}
            title={`${lang.name}: ${lang.percentage}%`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Language list */}
      <div className="space-y-2">
        {languages.slice(0, 6).map((lang) => (
          <div
            key={lang.name}
            className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${LANGUAGE_COLORS[lang.name] || "from-gray-400 to-gray-500"} shadow-sm`}
              />
              <span className="text-foreground text-sm font-medium">
                {lang.name}
              </span>
            </div>
            <span className="text-muted-foreground font-mono text-xs font-semibold">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
