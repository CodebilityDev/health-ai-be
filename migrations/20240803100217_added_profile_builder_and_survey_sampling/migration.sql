-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "activeSurveySample" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "enable_activeSurvey" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enable_profileBuilder" BOOLEAN NOT NULL DEFAULT false;
