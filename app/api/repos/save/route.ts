import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/auth";
import { ensureUser, saveRepository } from "@/lib/db/service";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { owner, repo } = body as { owner?: string; repo?: string };

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Missing required fields: owner, repo" },
      { status: 400 }
    );
  }

  const dbUser = await ensureUser({
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const saved = await saveRepository(dbUser.id, owner, repo);
  return NextResponse.json({ success: true, data: saved });
}