-- CreateEnum
CREATE TYPE "BudgeType" AS ENUM ('FIXED', 'NEGOTIATABLE');

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "budge_type" "BudgeType" NOT NULL DEFAULT 'FIXED';
