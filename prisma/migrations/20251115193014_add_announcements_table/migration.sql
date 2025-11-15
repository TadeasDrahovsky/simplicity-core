-- CreateEnum
CREATE TYPE "announcement_category" AS ENUM ('NEW_FEATURES', 'TIPS', 'MONTHLY_DIGEST', 'SECURITY_UPDATES', 'PROMOTIONS', 'OTHER');

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "announcement_category" NOT NULL,
    "searchVector" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "announcements_category_createdAt_idx" ON "announcements"("category", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "announcements_createdAt_idx" ON "announcements"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "announcements_searchVector_idx" ON "announcements" USING GIN ("searchVector");
