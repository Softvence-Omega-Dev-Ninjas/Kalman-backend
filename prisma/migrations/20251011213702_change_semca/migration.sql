-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "file" TEXT,
ALTER COLUMN "message" DROP NOT NULL;
