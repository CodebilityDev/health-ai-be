-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "noZipCodeMessage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "welcomeMessageFormat" TEXT NOT NULL DEFAULT '';
