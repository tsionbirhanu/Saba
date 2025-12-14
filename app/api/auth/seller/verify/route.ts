import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


let CardanoWasm: any = null;
let CSL_Module: any = null;


try {
    
    CSL_Module = require("@emurgo/cardano-serialization-lib-nodejs");
} catch (e) {
    console.error("CRITICAL: Failed to synchronously require CSL JS wrapper:", e);
  
}


async function loadCardanoWasm() {
    if (CardanoWasm) return CardanoWasm;
    if (!CSL_Module) {
        throw new Error("CSL Module wrapper failed to load synchronously.");
    }
    
    try {
        const loadFunction = CSL_Module.load;

        if (typeof loadFunction !== 'function') {
            throw new Error("CSL Node module loaded, but the 'load' function is missing.");
        }
        
        // CRITICAL: Call the load function asynchronously to initialize internal dependencies
        CardanoWasm = await loadFunction();

        if (typeof CardanoWasm.CoseSign1 === 'undefined') {
             throw new Error("WASM Initialization Failed: CoseSign1 object is missing after load().");
        }
        
        console.log("CardanoWasm (Node package) loaded successfully via async load().");
        return CardanoWasm;
        
    } catch (e: any) {
        console.error("Critical CSL Load Error during async initialization:", e);
        throw new Error(`Failed to initialize Cardano Serialization Library: ${e.message}`);
    }
}


export async function POST(req: Request) {
    
  
    try {
        await loadCardanoWasm(); 
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message || "Internal server misconfiguration: Failed to load Cardano Serialization Library." },
            { status: 500 }
        );
    }
    
  
    try {
        const { email, signature, walletAddress } = await req.json();

      
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== "DESIGNER" || !user.walletNonce) {
             return NextResponse.json( { error: "Validation failed (User not found, not a designer, or no nonce)." }, { status: 403 });
        }
        
        const NONCE = user!.walletNonce;

        const coseSign1 = CardanoWasm.CoseSign1.from_bytes(Buffer.from(signature, 'hex'));
        
        const payload = coseSign1.payload();
        const expectedPayloadHex = Buffer.from(NONCE, 'utf8').toString('hex'); 
        const actualPayloadHex = Buffer.from(payload).toString('hex');

        if (expectedPayloadHex !== actualPayloadHex || !coseSign1.verify_signature()) {
            return NextResponse.json({ error: "Verification failed: Invalid signature or nonce." }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user!.id },
            data: { walletVerified: true, cardanoAddress: walletAddress, walletNonce: null, },
        });

        return NextResponse.json({ message: "Wallet successfully verified", walletVerified: true, cardanoAddress: walletAddress });

    } catch (error) {
        console.error("Wallet verification error (CIP-8 processing):", error);
        return NextResponse.json(
            { error: "Failed to verify wallet (Signature processing failed or invalid data structure)." },
            { status: 500 }
        );
    }
}