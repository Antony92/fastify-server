-- CreateTable
CREATE TABLE "ServerEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerEvent_pkey" PRIMARY KEY ("id")
);
