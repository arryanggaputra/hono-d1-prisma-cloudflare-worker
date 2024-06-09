import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Bindings } from "~/types";

const db = (env: Bindings) => {
  const adapter = new PrismaD1(env.DB);
  const prisma = new PrismaClient({ adapter, errorFormat: "minimal" });
  return prisma;
};

export default db;
