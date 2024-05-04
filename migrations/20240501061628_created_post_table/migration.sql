-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "coverImage_filesize" INTEGER,
    "coverImage_extension" TEXT,
    "coverImage_width" INTEGER,
    "coverImage_height" INTEGER,
    "coverImage_id" TEXT,
    "author" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Post_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Post_author_idx" ON "Post"("author");

-- CreateIndex
CREATE UNIQUE INDEX "_Post_tags_AB_unique" ON "_Post_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_Post_tags_B_index" ON "_Post_tags"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_fkey" FOREIGN KEY ("author") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Post_tags" ADD CONSTRAINT "_Post_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Post_tags" ADD CONSTRAINT "_Post_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "PostTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
