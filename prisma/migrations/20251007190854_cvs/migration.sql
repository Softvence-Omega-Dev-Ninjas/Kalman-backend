/*
  Warnings:

  - The `zipCode` column on the `TradesMan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TradesMan" DROP COLUMN "zipCode",
ADD COLUMN     "zipCode" INTEGER;
