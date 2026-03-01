import Link from "next/link";
import { getSavedRepositories } from "@/lib/db/service";
import { Card } from "@/app/ui/Primitives/ui/Card";
import { Star, ArrowRight } from "lucide-react";

interface SavedReposListProps {
  userId: string;
}

export async function SavedReposList({ userId }: SavedReposListProps) {
  const savedRepos = await getSavedRepositories(userId);

  if (!savedRepos || savedRepos.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-foreground flex items-center gap-2.5 text-lg font-bold tracking-tight">
          <div className="bg-amber-500/5 flex h-8 w-8 items-center justify-center rounded-lg">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          </div>
          Saved Repositories
        </h3>
        <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {savedRepos.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {savedRepos.map((repo) => (
          <Link key={repo.id} href={`/?repo=${repo.full_name}`}>
            <Card className="hover:bg-muted/50 group cursor-pointer border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-lg p-2 transition-all">
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-foreground group-hover:text-primary truncate text-sm font-bold transition-colors">
                      {repo.name}
                    </p>
                    <p className="text-muted-foreground text-[11px] font-medium">
                      {repo.owner}
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 h-4 w-4 transition-all" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
