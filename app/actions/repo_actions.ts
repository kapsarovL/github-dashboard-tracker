"use server";

import { auth } from "@/app/api/auth/auth";
import {
  ensureUser,
  saveRepository,
  unsaveRepository,
} from "@/lib/db/service";
import { revalidatePath } from "next/cache";

export async function toggleSaveRepo(
  owner: string,
  name: string,
  isSaved: boolean,
) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("You must be signed in to save repositories");
  }

  const user = await ensureUser({
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  });

  if (!user) throw new Error("Could not sync user with database");

  const full_name = `${owner}/${name}`;

  if (isSaved) {
    await unsaveRepository(full_name);
  } else {
    await saveRepository(user.id, owner, name);
  }

  revalidatePath("/");
  revalidatePath(`/dashboard/${full_name}`);
}
