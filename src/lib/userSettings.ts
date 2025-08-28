import { prisma } from "./db";

export async function getUserSettings(email: string) {
  try {
    return await prisma.userSettings.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export async function saveUserSettings(email: string, country: string, language: string) {
  return prisma.userSettings.upsert({
    where: { email },
    create: { email, country, language },
    update: { country, language },
  });
}

