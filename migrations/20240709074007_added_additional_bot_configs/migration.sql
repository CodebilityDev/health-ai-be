/*
  Warnings:

  - You are about to drop the column `prompt` on the `BotConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BotConfig" DROP COLUMN "prompt",
ADD COLUMN     "companyStatement" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "healthInsuranceCarriers" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "presentationStrategy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "priorityPlan" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "specificQuestions" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "summaryPrompt" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "tonestyle" TEXT NOT NULL DEFAULT '';
