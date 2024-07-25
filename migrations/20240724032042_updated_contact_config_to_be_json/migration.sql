/*
  Warnings:

  - You are about to drop the `ContactConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContactConfig" DROP CONSTRAINT "ContactConfig_group_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "contactConfigs" JSONB;

-- DropTable
DROP TABLE "ContactConfig";

-- DropEnum
DROP TYPE "ContactConfigTypeType";
