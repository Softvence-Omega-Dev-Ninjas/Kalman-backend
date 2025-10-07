-- CreateTable
CREATE TABLE "Commision" (
    "id" TEXT NOT NULL,
    "commision_rate" DOUBLE PRECISION,
    "minimum_hourly_rate" DOUBLE PRECISION,
    "maximum_hourly_rate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commision_pkey" PRIMARY KEY ("id")
);
