import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/auth";
import { unsaveRepository } from "@/lib/db/service";

export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { full_name } = body as { full_name?: string };

  if (!full_name) {
    return NextResponse.json(
      { error: "Missing required field: full_name" },
      { status: 400 }
    );
  }

  await unsaveRepository(full_name);
  return NextResponse.json({ success: true });
}
