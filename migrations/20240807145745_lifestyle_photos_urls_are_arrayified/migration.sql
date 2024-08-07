/*
  Warnings:

  - You are about to drop the column `lifestylePhotoUrl` on the `Branding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branding" DROP COLUMN "lifestylePhotoUrl",
ADD COLUMN     "lifestylePhotoUrls" JSONB;
