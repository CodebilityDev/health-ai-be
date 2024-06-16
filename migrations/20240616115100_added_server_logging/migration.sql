-- CreateTable
CREATE TABLE "ServerLog" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "elapsed" TEXT NOT NULL DEFAULT '',
    "graphql" TEXT NOT NULL DEFAULT '',
    "userID" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerLog_pkey" PRIMARY KEY ("id")
);
