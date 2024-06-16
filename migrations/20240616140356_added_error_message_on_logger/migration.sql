/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Post_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Post_tags" DROP CONSTRAINT "_Post_tags_A_fkey";

-- DropForeignKey
ALTER TABLE "_Post_tags" DROP CONSTRAINT "_Post_tags_B_fkey";

-- AlterTable
ALTER TABLE "ServerLog" ADD COLUMN     "errorMessage" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostTag";

-- DropTable
DROP TABLE "_Post_tags";
