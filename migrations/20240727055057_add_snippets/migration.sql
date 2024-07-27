-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "comment" TEXT NOT NULL DEFAULT '',
    "group" TEXT,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Snippet_group_idx" ON "Snippet"("group");

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
