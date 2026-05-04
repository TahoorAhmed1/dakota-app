import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";

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
    }

    const pool = new Pool({ connectionString: url.toString() });
    options.adapter = new PrismaPg(pool);
  } catch {
    return options;
  }

  return options;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient(getPrismaClientOptions());

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
