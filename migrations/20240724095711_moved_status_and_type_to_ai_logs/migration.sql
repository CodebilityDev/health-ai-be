/*
  Warnings:

  - You are about to drop the column `status` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Group` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" DROP COLUMN "status",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "GroupAILog" ADD COLUMN     "status" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';
