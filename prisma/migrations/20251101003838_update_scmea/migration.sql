-- DropForeignKey
ALTER TABLE "public"."Blog" DROP CONSTRAINT "Blog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invitation" DROP CONSTRAINT "Invitation_tradesManId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobShortlist" DROP CONSTRAINT "JobShortlist_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobShortlist" DROP CONSTRAINT "JobShortlist_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JobShortlist" DROP CONSTRAINT "JobShortlist_tradesmanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Job_Activity" DROP CONSTRAINT "Job_Activity_jobId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Jobs" DROP CONSTRAINT "Jobs_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_tradesManId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proposal" DROP CONSTRAINT "Proposal_tradesManId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Proposal" DROP CONSTRAINT "Proposal_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_tradesManId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TradesMan" DROP CONSTRAINT "TradesMan_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TradesMan" DROP CONSTRAINT "TradesMan_userId_fkey";

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Activity" ADD CONSTRAINT "Job_Activity_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_tradesmanId_fkey" FOREIGN KEY ("tradesmanId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tradesManId_fkey" FOREIGN KEY ("tradesManId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradesMan" ADD CONSTRAINT "TradesMan_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradesMan" ADD CONSTRAINT "TradesMan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
