// app/api/auth/seller/nonce/route.ts (Updated and Simplified)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// *** FIXED: Now correctly extracts and uses the X-User-Email header ***
async function getAuthUser(req: Request) {
    // 1. Check for the custom header sent by the client
    const email = req.headers.get('x-user-email'); 
    
    if (!email) {
        console.warn("Authentication failure: X-User-Email header missing.");
        return null;
    }
    
    // 2. Look up the user by email
    const user = await prisma.user.findUnique({ 
        where: { email },
        // Select necessary fields
        select: { id: true, role: true, email: true } 
    });
    
    if (!user) {
        console.warn(`Authentication failure: User with email ${email} not found.`);
    }

    return user;
}


export async function POST(req: Request) {
    try {
        // 1. AUTHENTICATION: Get user using the header
        const user = await getAuthUser(req);
        
        if (!user) {
            // FIX: This will catch if the email is missing or user is not found.
            return NextResponse.json(
                { error: "Authentication required (User not logged in or email missing)" },
                { status: 401 }
            );
        }

        if (user.role !== "DESIGNER") {
            return NextResponse.json(
                { error: "Only designers can authenticate with wallet" },
                { status: 403 }
            );
        }

        // 2. Generate and store nonce
        const nonce = crypto.randomBytes(32).toString("hex");

        await prisma.user.update({
            where: { id: user.id },
            data: {
                walletNonce: nonce,
                walletVerified: false,
            },
        });

        return NextResponse.json({
            nonce,
            message: "Nonce generated. Sign this with your Cardano wallet.",
        });
    } catch (error) {
        console.error("Nonce endpoint error:", error);
        return NextResponse.json(
            { error: "Failed to generate nonce due to a server configuration issue" },
            { status: 500 }
        );
    }
}