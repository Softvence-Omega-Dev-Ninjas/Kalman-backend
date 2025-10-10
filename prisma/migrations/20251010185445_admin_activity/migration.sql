-- CreateTable
CREATE TABLE "Admin_activity" (
    "id" TEXT NOT NULL,
    "maximun_attampt" INTEGER,
    "season_timeout" INTEGER,
    "maintaince_mode" BOOLEAN NOT NULL DEFAULT false,
    "new_registration" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_activity_pkey" PRIMARY KEY ("id")
);
