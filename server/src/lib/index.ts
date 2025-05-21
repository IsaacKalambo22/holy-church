import { PrismaClient, Role } from "../../prisma/generated/prisma";

export const prisma = new PrismaClient();
export { Role };
