-- DropForeignKey
ALTER TABLE "public"."Docs" DROP CONSTRAINT "Docs_userId_fkey";

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
