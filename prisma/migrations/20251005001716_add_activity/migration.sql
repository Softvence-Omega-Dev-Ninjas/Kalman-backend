/*
  Warnings:

  - You are about to drop the column `skils_needed` on the `Jobs` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "skils_needed",
DROP COLUMN "updateAt",
ADD COLUMN     "skills_needed" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Job_Activity" (
    "id" TEXT NOT NULL,
    "total_interested" INTEGER NOT NULL DEFAULT 0,
    "shortlisted" INTEGER NOT NULL DEFAULT 0,
    "jobId" TEXT NOT NULL,

    CONSTRAINT "Job_Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_Activity_jobId_key" ON "Job_Activity"("jobId");

-- AddForeignKey
ALTER TABLE "Job_Activity" ADD CONSTRAINT "Job_Activity_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
