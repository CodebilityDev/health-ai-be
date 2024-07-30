-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "agent_firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "agent_lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "check_dndNotice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enable_checkDnd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enable_checkProfanity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enable_stopNotice" BOOLEAN NOT NULL DEFAULT false;
