/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `TradesMan` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `TradesMan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ServiceArea" ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TradesMan" DROP COLUMN "stripeCustomerId",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "subCategories" TEXT[];

-- AddForeignKey
ALTER TABLE "TradesMan" ADD CONSTRAINT "TradesMan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
