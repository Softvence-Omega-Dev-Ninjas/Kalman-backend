-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVE');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER', 'TRADESMAN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETE');

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT[],
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "preferred_date" TIMESTAMP(3),
    "preferred_time" TIMESTAMP(3),
    "image" TEXT[],
    "contact_method" TEXT NOT NULL,
    "shortlist_fee" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "skills_needed" TEXT[],
    "price" DOUBLE PRECISION,
    "customerStatus" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "isComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job_Activity" (
    "id" TEXT NOT NULL,
    "total_interested" INTEGER NOT NULL DEFAULT 0,
    "shortlisted" INTEGER NOT NULL DEFAULT 0,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobShortlist" (
    "customerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "tradesmanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobShortlist_pkey" PRIMARY KEY ("customerId","tradesmanId","jobId")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradesMan" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "dateOfBirth" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" INTEGER,
    "professionalQualifications" TEXT,
    "stripeCustomerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradesMan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docs" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "yearsOfExperience" DOUBLE PRECISION NOT NULL,
    "businessType" TEXT,
    "hourlyRate" TEXT,
    "services" TEXT[],
    "professionalDescription" TEXT,

    CONSTRAINT "BusinessDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceArea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION,

    CONSTRAINT "ServiceArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "methodType" TEXT NOT NULL,
    "provider" TEXT,
    "cardHolderName" TEXT,
    "cardNumber" TEXT,
    "expiryDate" TEXT,
    "cvv" TEXT,
    "saveCard" BOOLEAN NOT NULL DEFAULT false,
    "streetAddress" TEXT,
    "city" TEXT,
    "postCode" TEXT,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT,
    "profession" TEXT,
    "bio" TEXT,
    "street_address" TEXT,
    "city" TEXT,
    "otp" INTEGER,
    "state" TEXT,
    "zip_code" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "verification" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_Activity_jobId_key" ON "Job_Activity"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "TradesMan_email_key" ON "TradesMan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TradesMan_userId_key" ON "TradesMan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Docs_userId_key" ON "Docs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetail_userId_key" ON "BusinessDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceArea_userId_key" ON "ServiceArea"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_userId_key" ON "PaymentMethod"("userId");

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Activity" ADD CONSTRAINT "Job_Activity_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobShortlist" ADD CONSTRAINT "JobShortlist_tradesmanId_fkey" FOREIGN KEY ("tradesmanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradesMan" ADD CONSTRAINT "TradesMan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docs" ADD CONSTRAINT "Docs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessDetail" ADD CONSTRAINT "BusinessDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceArea" ADD CONSTRAINT "ServiceArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
