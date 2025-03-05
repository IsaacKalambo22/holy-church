/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `teacherName` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgressChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgressSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCourseProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'TEACHER';

-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressChapter" DROP CONSTRAINT "ProgressChapter_progressSectionId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressSection" DROP CONSTRAINT "ProgressSection_userCourseProgressId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourseProgress" DROP CONSTRAINT "UserCourseProgress_courseId_fkey";

-- DropForeignKey
ALTER TABLE "UserCourseProgress" DROP CONSTRAINT "UserCourseProgress_userId_fkey";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "sectionId",
DROP COLUMN "type",
DROP COLUMN "video",
ADD COLUMN     "courseId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "category",
DROP COLUMN "image",
DROP COLUMN "level",
DROP COLUMN "status",
DROP COLUMN "teacherId",
DROP COLUMN "teacherName",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "ProgressChapter";

-- DropTable
DROP TABLE "ProgressSection";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "UserCourseProgress";

-- DropEnum
DROP TYPE "Level";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attachment_courseId_idx" ON "Attachment"("courseId");

-- CreateIndex
CREATE INDEX "UserProgress_chapterId_idx" ON "UserProgress"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_chapterId_key" ON "UserProgress"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "Chapter_courseId_idx" ON "Chapter"("courseId");

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
