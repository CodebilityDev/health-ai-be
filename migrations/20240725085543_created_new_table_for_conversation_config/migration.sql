-- CreateTable
CREATE TABLE "ConversationBotConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "companyStatement" TEXT NOT NULL DEFAULT '',
    "tonestyle" TEXT NOT NULL DEFAULT '',
    "priorityPlan" TEXT NOT NULL DEFAULT '',
    "healthInsuranceCarriers" TEXT NOT NULL DEFAULT '',
    "presentationStrategy" TEXT NOT NULL DEFAULT '',
    "specificQuestions" TEXT NOT NULL DEFAULT '',
    "summaryPrompt" TEXT NOT NULL DEFAULT '',
    "welcomeMessage" TEXT NOT NULL DEFAULT '',
    "welcomeMessageFormat" TEXT NOT NULL DEFAULT '',
    "noZipCodeMessage" TEXT NOT NULL DEFAULT '',
    "group" TEXT,

    CONSTRAINT "ConversationBotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConversationSession" (
    "id" TEXT NOT NULL,
    "keywords" TEXT NOT NULL DEFAULT '',
    "sessionData" JSONB,
    "botConfig" TEXT,

    CONSTRAINT "ChatConversationSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationBotConfig_group_key" ON "ConversationBotConfig"("group");

-- CreateIndex
CREATE INDEX "ChatConversationSession_botConfig_idx" ON "ChatConversationSession"("botConfig");

-- AddForeignKey
ALTER TABLE "ConversationBotConfig" ADD CONSTRAINT "ConversationBotConfig_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversationSession" ADD CONSTRAINT "ChatConversationSession_botConfig_fkey" FOREIGN KEY ("botConfig") REFERENCES "ConversationBotConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
