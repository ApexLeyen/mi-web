import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { cache } from "react";

const getDb = cache(() => {
  try {
    const { env } = getCloudflareContext();
    if (env && (env as any).DB) {
      const adapter = new PrismaD1((env as any).DB);
      return new PrismaClient({ adapter });
    }
  } catch (err) {
    // Fallback for local development or if context is unavailable
  }

  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
});

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  }
});

export default prisma;
