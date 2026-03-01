import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma_v2: PrismaClient | undefined;
};

// Ensure database URL is provided
const connectionString = process.env.DATABASE_URL;

// Instantiate the Postgres pool
const pool = new Pool({ connectionString });

// Instantiate the Prisma PG Adapter
const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma_v2 ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v2 = db;
