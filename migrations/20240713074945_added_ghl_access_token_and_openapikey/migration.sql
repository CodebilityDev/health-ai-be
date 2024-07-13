-- AlterTable
ALTER TABLE "User" ADD COLUMN     "openAPIKey" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "GHLAccess" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "scope" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "GHLAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GHLAccess_user_key" ON "GHLAccess"("user");

-- AddForeignKey
ALTER TABLE "GHLAccess" ADD CONSTRAINT "GHLAccess_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
