/*
  Warnings:

  - You are about to drop the column `subCategory` on the `Jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "subCategory",
ADD COLUMN     "subCategories" TEXT[];
