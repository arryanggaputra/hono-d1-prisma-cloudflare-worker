import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export interface Env {
  DB: D1Database;
}

// use `prisma` in your application to read and write data in your DB

const db = (env: any) => {
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter, errorFormat: "minimal" });
  return prisma;
};

export default db;
