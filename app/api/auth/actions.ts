"use server";

import { signIn, signOut } from "@/app/api/auth/auth";

export async function handleSignIn() {
  await signIn("github");
}

export async function handleSignOut() {
  await signOut();
}
