-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "keywords" TEXT NOT NULL DEFAULT '',
    "sessionData" JSONB,
    "botConfig" TEXT,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatSession_botConfig_idx" ON "ChatSession"("botConfig");

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_botConfig_fkey" FOREIGN KEY ("botConfig") REFERENCES "BotConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
