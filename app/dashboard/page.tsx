"use server";
import { auth } from "@/app/api/auth/auth";
import { db } from "@/lib/db/client";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/Primitives/ui/Card";
import { Button } from "@/app/ui/Primitives/ui/Button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/ui/Primitives/ui/Avatar";
import {
  ExternalLink,
  GitFork,
  Trash2,
  Plus,
  Star,
  Database,
} from "lucide-react";
import { unsaveRepository } from "@/lib/db/service";
import { revalidatePath } from "next/cache";
import Link from "next/link";

async function deleteRepo(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  await unsaveRepository(fullName);
  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  // Get user from database
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      savedRepos: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return (
    <main className="bg-background min-h-screen pb-12">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="border-border bg-card flex flex-col gap-6 rounded-xl border p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Dashboard
                </h1>
                <p className="text-muted-foreground text-base">
                  Manage your saved repositories
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-muted flex items-center gap-2 rounded-lg px-3 py-1.5">
                  <Database className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground text-xs font-medium">
                    {user.savedRepos.length}{" "}
                    {user.savedRepos.length === 1
                      ? "repository"
                      : "repositories"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-foreground text-sm font-semibold">
                  {session.user.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {session.user.email}
                </p>
              </div>
              <Avatar className="border-primary/20 h-12 w-12 border-2">
                {session.user.image && (
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    sizes="48px"
                    loading="eager"
                  />
                )}
                <AvatarFallback>
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Saved Repositories Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-foreground text-2xl font-bold tracking-tight">
                Saved Repositories
              </h2>
              <p className="text-muted-foreground text-sm">
                Quick access to your tracked projects
              </p>
            </div>
            <Button asChild className="shadow-primary/20 shadow-md">
              <Link href="/">
                <Plus className="mr-2 h-4 w-4" />
                Add Repository
              </Link>
            </Button>
          </div>

          {user.savedRepos.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-xl">
                  <GitFork className="text-muted-foreground/60 h-10 w-10" />
                </div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No saved repositories
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">
                  Start tracking your favorite GitHub repositories to get
                  insights, analytics, and updates in one place.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="shadow-md"
                >
                  <Link href="/">
                    <Plus className="mr-2 h-4 w-4" />
                    Browse Repositories
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user.savedRepos.map((repo) => (
                <Card
                  key={repo.id}
                  className="group border-border bg-card hover:border-primary/50 relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Subtle accent on hover */}
                  <div className="from-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          <a
                            href={`https://github.com/${repo.owner}/${repo.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-foreground hover:text-primary inline-flex items-center gap-1.5 font-semibold transition-colors hover:underline"
                          >
                            {repo.name}
                            <ExternalLink className="text-muted-foreground/50 h-3 w-3" />
                          </a>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5">
                          <span className="font-medium">{repo.owner}</span>
                        </CardDescription>
                      </div>
                      <form action={deleteRepo}>
                        <input
                          type="hidden"
                          name="full_name"
                          value={repo.full_name}
                        />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 h-9 w-9 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-muted-foreground flex items-center gap-3 text-xs">
                      <div className="bg-muted/50 flex items-center gap-1.5 rounded-full px-2.5 py-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="font-medium">
                          Saved{" "}
                          {repo.createdAt.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
