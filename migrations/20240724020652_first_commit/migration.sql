-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('dev', 'admin', 'user');

-- CreateTable
CREATE TABLE "ServerLog" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "graphql" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "elapsed" TEXT NOT NULL DEFAULT '',
    "userID" TEXT NOT NULL DEFAULT '',
    "errorMessage" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerError" (
    "id" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "graphql" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT '',
    "method" TEXT NOT NULL DEFAULT '',
    "userID" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ServerError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "adminPassword" TEXT,
    "localAuth" TEXT,
    "avatar_filesize" INTEGER,
    "avatar_extension" TEXT,
    "avatar_width" INTEGER,
    "avatar_height" INTEGER,
    "avatar_id" TEXT,
    "role" "UserRoleType" DEFAULT 'user',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLocalAuth" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "twoFaEmail" TEXT NOT NULL DEFAULT '',
    "twoFaEmailSecret" TEXT NOT NULL DEFAULT '',
    "twoFaEmailLastSent" TIMESTAMP(3),

    CONSTRAINT "UserLocalAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "user" TEXT,
    "access" INTEGER DEFAULT 1,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotConfig" (
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

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GHLAccess" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "ghsUserId" TEXT NOT NULL DEFAULT '',
    "planId" TEXT NOT NULL DEFAULT '',
    "locationId" TEXT NOT NULL DEFAULT '',
    "companyId" TEXT NOT NULL DEFAULT '',
    "scope" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GHLAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIKey" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "openapiKey" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AIKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "keywords" TEXT NOT NULL DEFAULT '',
    "sessionData" JSONB,
    "botConfig" TEXT,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_localAuth_key" ON "User"("localAuth");

-- CreateIndex
CREATE INDEX "GroupMember_group_idx" ON "GroupMember"("group");

-- CreateIndex
CREATE INDEX "GroupMember_user_idx" ON "GroupMember"("user");

-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_group_key" ON "BotConfig"("group");

-- CreateIndex
CREATE UNIQUE INDEX "GHLAccess_group_key" ON "GHLAccess"("group");

-- CreateIndex
CREATE UNIQUE INDEX "AIKey_group_key" ON "AIKey"("group");

-- CreateIndex
CREATE INDEX "ChatSession_botConfig_idx" ON "ChatSession"("botConfig");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_localAuth_fkey" FOREIGN KEY ("localAuth") REFERENCES "UserLocalAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GHLAccess" ADD CONSTRAINT "GHLAccess_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIKey" ADD CONSTRAINT "AIKey_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_botConfig_fkey" FOREIGN KEY ("botConfig") REFERENCES "BotConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
