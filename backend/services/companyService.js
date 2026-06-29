import { prisma } from "../lib/prisma.js";

export async function ensureCompany(context) {
  return prisma.company.upsert({
    where: { id: context.companyId },
    create: {
      id: context.companyId,
      name: context.companyName,
      slug: context.companyId
    },
    update: {
      name: context.companyName
    }
  });
}
