/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('PASSWORD', 'CARDANO');

-- CreateEnum
CREATE TYPE "WalletProvider" AS ENUM ('NAMI', 'ETERNL', 'LACE', 'FLINT', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authMethod" "AuthMethod" NOT NULL DEFAULT 'PASSWORD',
ADD COLUMN     "nonce" TEXT,
ADD COLUMN     "walletAddress" TEXT,
ADD COLUMN     "walletProvider" "WalletProvider",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Rating";

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");
