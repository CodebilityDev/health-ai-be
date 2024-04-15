-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('dev', 'admin', 'user');

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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_localAuth_key" ON "User"("localAuth");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_localAuth_fkey" FOREIGN KEY ("localAuth") REFERENCES "UserLocalAuth"("id") ON DELETE SET NULL ON UPDATE CASCADE;
