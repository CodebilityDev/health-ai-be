-- CreateEnum
CREATE TYPE "ContactConfigTypeType" AS ENUM ('whitelist', 'blacklist', 'none');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "enable_globalAutoReply" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enable_globalWelcome" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ContactConfig" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "group" TEXT,
    "contact" TEXT NOT NULL DEFAULT '',
    "type" "ContactConfigTypeType",

    CONSTRAINT "ContactConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactConfig_group_idx" ON "ContactConfig"("group");

-- AddForeignKey
ALTER TABLE "ContactConfig" ADD CONSTRAINT "ContactConfig_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
