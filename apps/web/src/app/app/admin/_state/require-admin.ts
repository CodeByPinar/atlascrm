import { redirect } from "next/navigation";

import { getCurrentSessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export async function requireAdmin() {
  const session = await getCurrentSessionUser();
  if (!session) redirect("/login");

  const adminMembership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      role: { in: ["ADMIN", "MANAGER"] },
    },
    include: { organization: true },
  });

  const isAdmin = session.user.isSuperAdmin || Boolean(adminMembership);
  if (!isAdmin) redirect("/app/dashboard");

  return { session, adminMembership };
}
