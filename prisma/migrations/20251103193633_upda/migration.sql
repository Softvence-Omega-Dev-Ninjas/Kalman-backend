-- DropForeignKey
ALTER TABLE "public"."BusinessDetail" DROP CONSTRAINT "BusinessDetail_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentMethod" DROP CONSTRAINT "PaymentMethod_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ServiceArea" DROP CONSTRAINT "ServiceArea_userId_fkey";

-- AddForeignKey
ALTER TABLE "BusinessDetail" ADD CONSTRAINT "BusinessDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceArea" ADD CONSTRAINT "ServiceArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
