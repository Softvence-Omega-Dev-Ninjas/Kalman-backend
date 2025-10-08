-- DropForeignKey
ALTER TABLE "public"."Jobs" DROP CONSTRAINT "Jobs_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
