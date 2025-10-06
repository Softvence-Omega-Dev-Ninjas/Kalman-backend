/*
  Warnings:

  - Added the required column `updatedAt` to the `Job_Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job_Activity" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "JobShortlist" (
    "customerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "tradesmanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobShortlist_pkey" PRIMARY KEY ("customerId","tradesmanId","jobId")
);

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_tradesmanId_fkey" FOREIGN KEY ("tradesmanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
