/*
  Warnings:

  - You are about to drop the column `ProfessionalQualifications` on the `TradesMan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TradesMan" DROP COLUMN "ProfessionalQualifications",
ADD COLUMN     "professionalQualifications" TEXT;
