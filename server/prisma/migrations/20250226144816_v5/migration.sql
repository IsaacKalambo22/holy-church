/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Transaction_courseId_idx" ON "Transaction"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_userId_courseId_key" ON "Transaction"("userId", "courseId");
