-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "availability_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availability_end" INTEGER,
ADD COLUMN     "availability_start" INTEGER;
