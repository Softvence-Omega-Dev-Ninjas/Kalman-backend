/*
  Warnings:

  - You are about to drop the column `professtion` on the `TradesMan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TradesMan" DROP COLUMN "professtion",
ADD COLUMN     "profession" TEXT;
