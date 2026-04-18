import { prisma } from "./client";
import { mapAdminUserRecord } from "./mappers";

export const ADMIN_PASSWORD_PLACEHOLDER = "seed-placeholder-password-hash";

export async function findAdminUserAuthRecordByUsername(username: string) {
  return prisma.adminUser.findUnique({
    where: {
      username
    }
  });
}

export async function findAdminUserById(id: string) {
  const user = await prisma.adminUser.findUnique({
    where: {
      id
    }
  });

  return user ? mapAdminUserRecord(user) : null;
}

export async function updateAdminUserPasswordHash(id: string, passwordHash: string) {
  const user = await prisma.adminUser.update({
    where: {
      id
    },
    data: {
      passwordHash
    }
  });

  return mapAdminUserRecord(user);
}
