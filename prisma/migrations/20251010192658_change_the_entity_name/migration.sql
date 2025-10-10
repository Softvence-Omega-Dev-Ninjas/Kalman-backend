/*
  Warnings:

  - You are about to drop the column `maintaince_mode` on the `Admin_activity` table. All the data in the column will be lost.
  - You are about to drop the column `maximun_attampt` on the `Admin_activity` table. All the data in the column will be lost.
  - You are about to drop the column `season_timeout` on the `Admin_activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin_activity" DROP COLUMN "maintaince_mode",
DROP COLUMN "maximun_attampt",
DROP COLUMN "season_timeout",
ADD COLUMN     "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maximum_attempt" INTEGER,
ADD COLUMN     "session_timeout" INTEGER;
