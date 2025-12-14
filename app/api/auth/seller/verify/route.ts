import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";
import bs58 from "bs58"; // for decoding Base58 wallet public keys

export async function POST(req: Request) {
  try {
    const { email, signature, walletAddress } = await req.json();

    // Validate input
    if (!email || !signature || !walletAddress) {
      return NextResponse.json(
        { error: "Email, signature, and wallet address are required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "DESIGNER") {
      return NextResponse.json(
        { error: "Only designers can verify wallet" },
        { status: 403 }
      );
    }

    if (!user.walletNonce) {
      return NextResponse.json(
        { error: "No nonce found. Please request a nonce first." },
        { status: 400 }
      );
    }

    // Convert nonce to bytes
    const nonceBytes = Buffer.from(user.walletNonce, "hex");

    // Convert walletAddress to PublicKey
    let publicKey: CardanoWasm.PublicKey;
    try {
      // Assuming frontend sends Base58-encoded public key
      const publicKeyBytes = bs58.decode(walletAddress);
      publicKey = CardanoWasm.PublicKey.from_bytes(publicKeyBytes);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Convert signature to Ed25519Signature
    let ed25519Sig: CardanoWasm.Ed25519Signature;
    try {
      const signatureBytes = Buffer.from(signature, "hex");
      ed25519Sig = CardanoWasm.Ed25519Signature.from_bytes(signatureBytes);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = publicKey.verify(nonceBytes, ed25519Sig);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        walletVerified: true,
        cardanoAddress: walletAddress,
        walletNonce: null, // clear nonce after successful verification
      },
    });

    return NextResponse.json({
      message: "Wallet successfully verified",
      walletVerified: true,
      cardanoAddress: walletAddress,
    });

  } catch (error) {
    console.error("Wallet verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify wallet" },
      { status: 500 }
    );
  }
}
