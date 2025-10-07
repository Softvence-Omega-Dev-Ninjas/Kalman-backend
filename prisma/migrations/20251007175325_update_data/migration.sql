-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVE');

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "customerStatus" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE';
