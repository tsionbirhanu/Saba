-- DropIndex
DROP INDEX "public"."User_cardanoAddress_key";

-- AlterTable
ALTER TABLE "DesignerProfile" DROP COLUMN "walletAddress",
DROP COLUMN "walletVerified",
DROP COLUMN "walletVerifiedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cardanoAddress",
DROP COLUMN "walletConnectedAt",
DROP COLUMN "walletNonce",
DROP COLUMN "walletVerified";

-- DropEnum
DROP TYPE "public"."AuthMethod";

-- DropEnum
DROP TYPE "public"."WalletProvider";
