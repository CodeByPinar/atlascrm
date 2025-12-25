import { redirect } from "next/navigation";

import { getCurrentSessionUser } from "@/server/auth/session";

export async function requireUser() {
  const session = await getCurrentSessionUser();
  if (!session) redirect("/login");
  return session.user;
}
