-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('SILVER', 'GOLD', 'DIAMOND', 'PRO');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STUDENT';

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "contactInfo" TEXT,
    "backgroundSummary" TEXT,
    "initialAssessment" TEXT,
    "aptitudesAndStrengths" TEXT,
    "shortTermGoals" TEXT,
    "longTermObjectives" TEXT,
    "workshopsAttended" TEXT,
    "resourcesUtilized" TEXT,
    "skillsDevelopment" TEXT,
    "behavioralChanges" TEXT,
    "feedbackAndSelfReflection" TEXT,
    "obstaclesEncountered" TEXT,
    "interventionsProvided" TEXT,
    "accountType" "AccountType" NOT NULL DEFAULT 'SILVER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
