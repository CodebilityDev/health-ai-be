-- CreateTable
CREATE TABLE "BotConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "welcomeMessage" TEXT NOT NULL DEFAULT '',
    "prompt" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);
