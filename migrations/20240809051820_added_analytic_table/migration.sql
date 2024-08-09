-- CreateTable
CREATE TABLE "Analytic" (
    "id" TEXT NOT NULL,
    "group" TEXT,
    "utm_baseurl" TEXT NOT NULL DEFAULT '',
    "utm_source" TEXT NOT NULL DEFAULT '',
    "utm_medium" TEXT NOT NULL DEFAULT '',
    "utm_campaign" TEXT NOT NULL DEFAULT '',
    "utm_language" TEXT NOT NULL DEFAULT '',
    "generated_marketing_url" TEXT NOT NULL DEFAULT '',
    "direct_link" TEXT NOT NULL DEFAULT '',
    "google_analytics_id" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Analytic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analytic_group_key" ON "Analytic"("group");

-- AddForeignKey
ALTER TABLE "Analytic" ADD CONSTRAINT "Analytic_group_fkey" FOREIGN KEY ("group") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
