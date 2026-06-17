-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'EVENT', 'SERMON', 'PRAYER', 'DONATION', 'BLOG', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- AlterTable
ALTER TABLE "member_preferences" ADD COLUMN     "notifyAnnouncements" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyBlogs" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyDonations" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyEvents" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyPrayers" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifySermons" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "variables" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notification_templates_type_idx" ON "notification_templates"("type");

-- CreateIndex
CREATE INDEX "notification_templates_active_idx" ON "notification_templates"("active");

-- CreateIndex
CREATE INDEX "blogs_authorId_idx" ON "blogs"("authorId");

-- CreateIndex
CREATE INDEX "blogs_published_publishedAt_idx" ON "blogs"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "donations_donorId_createdAt_idx" ON "donations"("donorId", "createdAt");

-- CreateIndex
CREATE INDEX "events_status_date_idx" ON "events"("status", "date");

-- CreateIndex
CREATE INDEX "ministries_leaderId_idx" ON "ministries"("leaderId");

-- CreateIndex
CREATE INDEX "ministries_status_category_idx" ON "ministries"("status", "category");

-- CreateIndex
CREATE INDEX "prayer_requests_isPublic_status_idx" ON "prayer_requests"("isPublic", "status");

-- CreateIndex
CREATE INDEX "sermons_preacherId_idx" ON "sermons"("preacherId");

-- CreateIndex
CREATE INDEX "sermons_published_date_idx" ON "sermons"("published", "date");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
