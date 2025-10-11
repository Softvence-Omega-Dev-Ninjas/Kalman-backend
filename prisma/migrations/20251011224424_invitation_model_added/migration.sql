-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "tradesManId" TEXT NOT NULL,
    "messgae" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
