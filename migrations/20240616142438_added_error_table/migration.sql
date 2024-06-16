-- CreateTable
CREATE TABLE "ServerError" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "graphql" TEXT NOT NULL DEFAULT '',
    "userID" TEXT NOT NULL DEFAULT '',
    "errorMessage" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerError_pkey" PRIMARY KEY ("id")
);
