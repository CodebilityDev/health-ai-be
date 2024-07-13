-- AlterTable
ALTER TABLE "BotConfig" ADD COLUMN     "user" TEXT;

-- CreateIndex
CREATE INDEX "BotConfig_user_idx" ON "BotConfig"("user");

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
