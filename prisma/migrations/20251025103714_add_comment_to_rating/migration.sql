/*
  Warnings:

  - Added the required column `comment` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "comment" TEXT NOT NULL;
