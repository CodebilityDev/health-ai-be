-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "status" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "GroupAILog" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "contactID" TEXT NOT NULL DEFAULT '',
    "contactName" TEXT NOT NULL DEFAULT '',
    "locationID" TEXT NOT NULL DEFAULT '',
    "locationName" TEXT NOT NULL DEFAULT '',
    "modelID" TEXT NOT NULL DEFAULT '',
    "log" JSONB,

    CONSTRAINT "GroupAILog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupAILog_group_idx" ON "GroupAILog"("group");

-- AddForeignKey
ALTER TABLE "GroupAILog" ADD CONSTRAINT "GroupAILog_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
