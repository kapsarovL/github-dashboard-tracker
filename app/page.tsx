import { DashboardLayout } from "@/components/dashboard-layout";
import { getRepoMetadata } from "@/lib/github";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const repoParam = typeof params.repo === "string" ? params.repo : undefined;

  if (!repoParam || !repoParam.includes("/")) {
    return {
      title: "GitHub Dashboard",
      description: "Monitor and analyze your GitHub repositories.",
    };
  }

  const [owner, repo] = repoParam.split("/");
  const data = await getRepoMetadata({ owner, repo });

  if (!data) {
    return {
      title: "Repository Not Found | GitHub Dashboard",
      description: "Could not retrieve repository information.",
    };
  }

  return {
    title: `${data.full_name} | GitHub Dashboard`,
    description:
      data.description || `Analytics and insights for ${data.full_name}`,
    openGraph: {
      title: data.full_name,
      description:
        data.description || `GitHub repository overview for ${data.full_name}`,
      images: [data.owner.avatar_url],
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const repo = typeof params.repo === "string" ? params.repo : undefined;

  return (
    <main className="min-h-screen w-full">
      <DashboardLayout repo={repo} />
    </main>
  );
}
