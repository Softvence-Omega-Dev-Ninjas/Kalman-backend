/*
  Warnings:

  - You are about to drop the column `Date` on the `Invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "Date",
ADD COLUMN     "date" TIMESTAMP(3);
