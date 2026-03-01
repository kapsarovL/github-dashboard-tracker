import { db } from "@/lib/db/client";

export async function ensureUser(sessionUser: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  if (!sessionUser.email) return null;

  return await db.user.upsert({
    where: { email: sessionUser.email },
    update: {
      name: sessionUser.name,
      image: sessionUser.image,
    },
    create: {
      email: sessionUser.email,
      name: sessionUser.name,
      image: sessionUser.image,
    },
  });
}

export async function saveRepository(
  userId: string,
  owner: string,
  name: string,
) {
  const full_name = `${owner}/${name}`;
  return await db.savedRepository.upsert({
    where: { full_name },
    update: { userId },
    create: {
      owner,
      name,
      full_name,
      userId,
    },
  });
}

export async function unsaveRepository(full_name: string) {
  try {
    return await db.savedRepository.delete({
      where: { full_name },
    });
  } catch (error) {
    // Already deleted or doesn't exist, or other error.
    // Log the error for debugging, but return null as per original intent.
    console.error("Error unsaving repository %s:", full_name, error);
    return null;
  }
}

export async function getSavedRepositories(userId: string) {
  return await db.savedRepository.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function isRepositorySaved(full_name: string, userId?: string) {
  if (!userId) return false;
  const count = await db.savedRepository.count({
    where: {
      full_name,
      userId,
    },
  });
  return count > 0;
}
