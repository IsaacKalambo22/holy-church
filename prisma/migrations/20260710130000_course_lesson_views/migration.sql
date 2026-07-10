-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
