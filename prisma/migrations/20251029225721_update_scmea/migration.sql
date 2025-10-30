/*
  Warnings:

  - The values [NEGOTIATABLE] on the enum `BudgeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BudgeType_new" AS ENUM ('FIXED', 'NEGOTIABLE');
ALTER TABLE "public"."Jobs" ALTER COLUMN "budge_type" DROP DEFAULT;
ALTER TABLE "Jobs" ALTER COLUMN "budge_type" TYPE "BudgeType_new" USING ("budge_type"::text::"BudgeType_new");
ALTER TYPE "BudgeType" RENAME TO "BudgeType_old";
ALTER TYPE "BudgeType_new" RENAME TO "BudgeType";
DROP TYPE "public"."BudgeType_old";
ALTER TABLE "Jobs" ALTER COLUMN "budge_type" SET DEFAULT 'FIXED';
COMMIT;
