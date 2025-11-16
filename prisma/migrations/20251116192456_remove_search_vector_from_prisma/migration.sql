/*
  Warnings:

  - You are about to drop the column `searchVector` on the `announcements` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "announcements_searchVector_idx";

-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "searchVector";
