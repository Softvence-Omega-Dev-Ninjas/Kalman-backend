/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradesManId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_senderId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "tradesManId" TEXT NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
