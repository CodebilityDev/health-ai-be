-- CreateTable
CREATE TABLE "Branding" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "companyName" TEXT NOT NULL DEFAULT '',
    "companyMotto" TEXT NOT NULL DEFAULT '',
    "companyPhone" TEXT NOT NULL DEFAULT '',
    "companyEmail" TEXT NOT NULL DEFAULT '',
    "companyAddress" TEXT NOT NULL DEFAULT '',
    "companyWebsite" TEXT NOT NULL DEFAULT '',
    "companyDescription" TEXT NOT NULL DEFAULT '',
    "bannerLogoPhotoUrl" TEXT NOT NULL DEFAULT '',
    "lifestylePhotoUrl" TEXT NOT NULL DEFAULT '',
    "logoPhotoUrl" TEXT NOT NULL DEFAULT '',
    "colorPalette1" TEXT NOT NULL DEFAULT '',
    "colorPalette1Contrast" TEXT NOT NULL DEFAULT '',
    "colorPalette2" TEXT NOT NULL DEFAULT '',
    "colorPalette2Contrast" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Branding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Branding_group_key" ON "Branding"("group");

-- AddForeignKey
ALTER TABLE "Branding" ADD CONSTRAINT "Branding_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
