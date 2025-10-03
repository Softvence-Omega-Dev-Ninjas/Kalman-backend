/*
  Warnings:

  - Added the required column `Phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'TRADER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Bio" TEXT,
ADD COLUMN     "Phone" TEXT NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street_address" TEXT,
ADD COLUMN     "verification" "Status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "zip_code" TEXT;
