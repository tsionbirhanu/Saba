/*
  Warnings:

  - You are about to drop the column `authMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nonce` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletProvider` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cardanoAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."User_walletAddress_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authMethod",
DROP COLUMN "nonce",
DROP COLUMN "walletAddress",
DROP COLUMN "walletProvider",
ADD COLUMN     "cardanoAddress" TEXT,
ADD COLUMN     "walletNonce" TEXT,
ADD COLUMN     "walletVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_cardanoAddress_key" ON "User"("cardanoAddress");
