import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

async function getPrismaInstance(): Promise<PrismaClient> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    if ((ctx?.env as any)?.DB) {
      const adapter = new PrismaD1((ctx.env as any).DB);
      return new PrismaClient({ adapter });
    }
  } catch (err) {
    // Async context not available
  }

  try {
    const ctx = getCloudflareContext() as any;
    if (ctx?.env?.DB) {
      const adapter = new PrismaD1(ctx.env.DB);
      return new PrismaClient({ adapter });
    }
  } catch (err) {
    // Sync context not available
  }

  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, modelProp: string) {
    // Handle special Prisma methods (like $connect, $disconnect, $transaction)
    if (modelProp.startsWith("$")) {
      return async (...args: any[]) => {
        const client = await getPrismaInstance();
        const fn = (client as any)[modelProp];
        if (typeof fn === "function") {
          return fn.apply(client, args);
        }
        return fn;
      };
    }

    // Return model proxy for actions like findMany, findUnique, create, etc.
    return new Proxy({}, {
      get(modelTarget, actionProp: string) {
        return async (...args: any[]) => {
          const client = await getPrismaInstance();
          const model = (client as any)[modelProp];
          if (!model) {
            throw new Error(`Prisma model "${modelProp}" not found`);
          }
          const action = model[actionProp];
          if (typeof action !== "function") {
            return action;
          }
          return action.apply(model, args);
        };
      }
    });
  }
});

export default prisma;
