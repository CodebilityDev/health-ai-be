/*
  Warnings:

  - You are about to drop the column `openAPIKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "openAPIKey";

-- CreateTable
CREATE TABLE "AIKey" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "openapiKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AIKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIKey_user_key" ON "AIKey"("user");

-- AddForeignKey
ALTER TABLE "AIKey" ADD CONSTRAINT "AIKey_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
