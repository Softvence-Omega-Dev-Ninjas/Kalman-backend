-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SHORTLISTED_FEE', 'TASK_COMPLETE');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "tradesManId" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL DEFAULT 'SHORTLISTED_FEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
