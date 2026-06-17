/*
  Warnings:

  - You are about to drop the column `fund` on the `donations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ministries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `sermons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `donations` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `donations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `request` on table `prayer_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'PASTOR';
ALTER TYPE "Role" ADD VALUE 'MINISTRY_LEADER';
ALTER TYPE "Role" ADD VALUE 'CONTENT_MANAGER';
ALTER TYPE "Role" ADD VALUE 'FINANCE_MANAGER';

-- DropIndex
DROP INDEX "donations_fund_idx";

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "donations" DROP COLUMN "fund",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'MWK',
ADD COLUMN     "donorEmail" TEXT,
ADD COLUMN     "donorName" TEXT,
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "registrationDeadline" TIMESTAMPTZ,
ADD COLUMN     "registrationRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "venue" TEXT;

-- AlterTable
ALTER TABLE "ministries" ADD COLUMN     "category" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "meetingSchedule" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "volunteerRequired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "prayer_requests" ADD COLUMN     "category" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ,
ALTER COLUMN "request" SET NOT NULL;

-- AlterTable
ALTER TABLE "sermons" ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "media_items" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "albumId" TEXT,
    "categoryId" TEXT,
    "uploadedBy" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "media_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_albums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "deletedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gallery_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "media_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "donation_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation_receipts" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "newsletterSubscription" BOOLEAN NOT NULL DEFAULT true,
    "showProfile" BOOLEAN NOT NULL DEFAULT true,
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "showPhone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "member_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_items_albumId_idx" ON "media_items"("albumId");

-- CreateIndex
CREATE INDEX "media_items_categoryId_idx" ON "media_items"("categoryId");

-- CreateIndex
CREATE INDEX "media_items_type_idx" ON "media_items"("type");

-- CreateIndex
CREATE INDEX "media_items_deletedAt_idx" ON "media_items"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_albums_slug_key" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "gallery_albums_slug_idx" ON "gallery_albums"("slug");

-- CreateIndex
CREATE INDEX "gallery_albums_deletedAt_idx" ON "gallery_albums"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "media_categories_name_key" ON "media_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "media_categories_slug_key" ON "media_categories"("slug");

-- CreateIndex
CREATE INDEX "media_categories_slug_idx" ON "media_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "donation_categories_name_key" ON "donation_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "donation_categories_slug_key" ON "donation_categories"("slug");

-- CreateIndex
CREATE INDEX "donation_categories_slug_idx" ON "donation_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "donation_receipts_receiptNumber_key" ON "donation_receipts"("receiptNumber");

-- CreateIndex
CREATE INDEX "donation_receipts_donationId_idx" ON "donation_receipts"("donationId");

-- CreateIndex
CREATE INDEX "donation_receipts_receiptNumber_idx" ON "donation_receipts"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_name_key" ON "blog_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- CreateIndex
CREATE INDEX "blog_categories_slug_idx" ON "blog_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_name_key" ON "blog_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "blog_tags"("slug");

-- CreateIndex
CREATE INDEX "blog_tags_slug_idx" ON "blog_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "member_preferences_userId_key" ON "member_preferences"("userId");

-- CreateIndex
CREATE INDEX "member_preferences_userId_idx" ON "member_preferences"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "blogs_status_idx" ON "blogs"("status");

-- CreateIndex
CREATE INDEX "blogs_categoryId_idx" ON "blogs"("categoryId");

-- CreateIndex
CREATE INDEX "donations_category_idx" ON "donations"("category");

-- CreateIndex
CREATE INDEX "donations_paymentStatus_idx" ON "donations"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ministries_slug_key" ON "ministries"("slug");

-- CreateIndex
CREATE INDEX "ministries_slug_idx" ON "ministries"("slug");

-- CreateIndex
CREATE INDEX "ministries_category_idx" ON "ministries"("category");

-- CreateIndex
CREATE INDEX "ministries_status_idx" ON "ministries"("status");

-- CreateIndex
CREATE INDEX "prayer_requests_category_idx" ON "prayer_requests"("category");

-- CreateIndex
CREATE INDEX "prayer_requests_isPublic_idx" ON "prayer_requests"("isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "sermons_slug_key" ON "sermons"("slug");

-- CreateIndex
CREATE INDEX "sermons_slug_idx" ON "sermons"("slug");

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "gallery_albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "media_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_preferences" ADD CONSTRAINT "member_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
