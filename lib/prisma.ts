import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

let _prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
  if (_prismaInstance) return _prismaInstance;

  // Check if we are running in the Cloudflare Worker environment (OpenNext/Pages)
  if (process.env.CF_PAGES === "1" || process.env.NODE_ENV === "production") {
    try {
      const { getCloudflareContext } = require("@opennextjs/cloudflare");
      const { env } = getCloudflareContext();
      if (env && env.DB) {
        const adapter = new PrismaD1(env.DB);
        _prismaInstance = new PrismaClient({ adapter });
        return _prismaInstance;
      }
    } catch (err) {
      console.warn("Failed to initialize Prisma D1 adapter, falling back to SQLite client", err);
    }
  }

  // Local development SQLite fallback
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  _prismaInstance = globalForPrisma.prisma;
  return _prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = getPrismaInstance();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  }
});

export default prisma;
