/*
  Warnings:

  - The values [TASK_COMPLETE] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('SHORTLISTED_FEE', 'TASK_COMPLETE_FEE');
ALTER TABLE "public"."Payment" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
ALTER TABLE "Payment" ALTER COLUMN "type" SET DEFAULT 'SHORTLISTED_FEE';
COMMIT;
