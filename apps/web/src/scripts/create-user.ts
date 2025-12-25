import { z } from "zod";

import { prisma } from "@/server/db/prisma";
import { hashPassword } from "@/server/auth/password";

const argsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(12),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).default("ADMIN"),
  name: z.string().optional(),
  organization: z.string().default("AtlasCRM"),
});

type Args = z.infer<typeof argsSchema>;

function parseArgs(argv: string[]): Args {
  const raw: Record<string, string> = {};
  for (const part of argv.slice(2)) {
    const [key, ...rest] = part.split("=");
    if (!key.startsWith("--")) continue;
    raw[key.slice(2)] = rest.join("=");
  }

  const parsed = argsSchema.safeParse({
    email: raw.email,
    password: raw.password,
    role: raw.role,
    name: raw.name,
    organization: raw.organization,
  });

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error(
      "Invalid args. Usage: npm run create-user -- --email=... --password=... --role=ADMIN|MANAGER|USER --name=... --organization=...",
    );
    process.exit(1);
  }

  return parsed.data;
}

async function main() {
  const args = parseArgs(process.argv);

  const organization = await prisma.organization.upsert({
    where: { id: "atlascrm-default" },
    update: { name: args.organization },
    create: { id: "atlascrm-default", name: args.organization },
  });

  const passwordHash = await hashPassword(args.password);

  const user = await prisma.user.upsert({
    where: { email: args.email },
    update: {
      name: args.name ?? undefined,
      passwordHash,
    },
    create: {
      email: args.email,
      name: args.name,
      passwordHash,
    },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    update: { role: args.role },
    create: {
      organizationId: organization.id,
      userId: user.id,
      role: args.role,
    },
  });

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        ok: true,
        user: { id: user.id, email: user.email, isSuperAdmin: user.isSuperAdmin },
        membership: { organizationId: organization.id, role: args.role },
        organization: { id: organization.id, name: organization.name },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
