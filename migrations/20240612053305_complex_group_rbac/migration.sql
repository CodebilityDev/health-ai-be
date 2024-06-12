/*
  Warnings:

  - You are about to drop the column `author` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `_Group_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_author_fkey";

-- DropForeignKey
ALTER TABLE "_Group_members" DROP CONSTRAINT "_Group_members_A_fkey";

-- DropForeignKey
ALTER TABLE "_Group_members" DROP CONSTRAINT "_Group_members_B_fkey";

-- DropIndex
DROP INDEX "Post_author_idx";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "author";

-- DropTable
DROP TABLE "_Group_members";

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "user" TEXT,
    "access" INTEGER DEFAULT 1,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupMember_group_idx" ON "GroupMember"("group");

-- CreateIndex
CREATE INDEX "GroupMember_user_idx" ON "GroupMember"("user");

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
