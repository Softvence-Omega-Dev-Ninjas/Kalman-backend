-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "price" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "TradesMan" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradesMan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "yearsOfExperience" INTEGER,
    "businessType" TEXT,
    "services" TEXT[],
    "professionalDescription" TEXT,

    CONSTRAINT "ProfessionalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "businessEmail" TEXT,
    "businessLicense" TEXT,
    "verifyIdentity" TEXT,

    CONSTRAINT "BusinessDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceArea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION,

    CONSTRAINT "ServiceArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradesMan_email_key" ON "TradesMan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TradesMan_userId_key" ON "TradesMan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInfo_userId_key" ON "ProfessionalInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetail_userId_key" ON "BusinessDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceArea_userId_key" ON "ServiceArea"("userId");

-- AddForeignKey
ALTER TABLE "TradesMan" ADD CONSTRAINT "TradesMan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInfo" ADD CONSTRAINT "ProfessionalInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessDetail" ADD CONSTRAINT "BusinessDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceArea" ADD CONSTRAINT "ServiceArea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TradesMan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
