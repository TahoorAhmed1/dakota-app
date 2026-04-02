import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function getPrismaClientOptions(): Prisma.PrismaClientOptions {
  const options: Prisma.PrismaClientOptions = {
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  };

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return options;
  }

  try {
    const url = new URL(databaseUrl);

    if (url.hostname.includes("-pooler.")) {
      if (!url.searchParams.has("pgbouncer")) {
        url.searchParams.set("pgbouncer", "true");
      }

      if (!url.searchParams.has("connection_limit")) {
        url.searchParams.set("connection_limit", "1");
      }

      options.datasources = {
        db: {
          url: url.toString(),
        },
      };
    }
  } catch {
    return options;
  }

  return options;
}

export const prisma =
  global.prismaGlobal ??
  new PrismaClient(getPrismaClientOptions());

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
