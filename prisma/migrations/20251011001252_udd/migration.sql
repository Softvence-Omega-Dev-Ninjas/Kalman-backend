/*
  Warnings:

  - You are about to drop the column `fileType` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.
  - Made the column `message` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "fileType",
DROP COLUMN "fileUrl",
DROP COLUMN "type",
ALTER COLUMN "message" SET NOT NULL;
