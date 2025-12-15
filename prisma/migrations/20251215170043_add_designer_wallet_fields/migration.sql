-- AlterTable
ALTER TABLE "DesignerProfile" ADD COLUMN     "walletAddress" TEXT,
ADD COLUMN     "walletVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "walletVerifiedAt" TIMESTAMP(3);
