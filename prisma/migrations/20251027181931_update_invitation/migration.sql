/*
  Warnings:

  - You are about to drop the column `jobId` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `location` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_jobId_fkey";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "jobId",
ADD COLUMN     "location" TEXT NOT NULL;
