/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `BotConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BotConfig_user_idx";

-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_user_key" ON "BotConfig"("user");
