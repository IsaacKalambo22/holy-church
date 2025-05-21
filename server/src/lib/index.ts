/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@/prisma/generated/prisma"
export * from "@/prisma/generated/prisma"

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const prisma = new PrismaClient()
