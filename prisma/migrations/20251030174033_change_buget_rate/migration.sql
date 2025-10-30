/*
  Warnings:

  - The values [NEGOTIABLE] on the enum `BudgeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BudgeType_new" AS ENUM ('FIXED', 'HOURLY');
ALTER TABLE "Jobs" ALTER COLUMN "budge_type" TYPE "BudgeType_new" USING ("budge_type"::text::"BudgeType_new");
ALTER TYPE "BudgeType" RENAME TO "BudgeType_old";
ALTER TYPE "BudgeType_new" RENAME TO "BudgeType";
DROP TYPE "public"."BudgeType_old";
COMMIT;
