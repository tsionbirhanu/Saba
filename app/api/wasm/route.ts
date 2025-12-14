// app/api/wasm/route.ts

import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs'; // Use synchronous file system access

// Use a static path to the WASM file within node_modules
const WASM_FILE_PATH = path.join(
    process.cwd(), 
    'node_modules', 
    '@emurgo', 
    'cardano-serialization-lib-browser', 
    'cardano_serialization_lib_bg.wasm' // The actual WASM file
);

// We cache the buffer to read the file only once
let wasmCache: Buffer | null = null;

export function GET() {
    try {
        if (!wasmCache) {
            // CRITICAL FIX: Use synchronous readFileSync to get the raw buffer
            // This bypasses Node's automatic module resolution checks for the file type.
            wasmCache = fs.readFileSync(WASM_FILE_PATH);
            console.log("WASM file successfully read into cache.");
        }

        // Return the binary data with the correct WASM MIME type
        return new NextResponse(wasmCache, {
            status: 200,
            headers: {
                'Content-Type': 'application/wasm',
                'Cache-Control': 'public, max-age=31536000, immutable',
                // Important for preventing CORS issues when fetching the file
                'Access-Control-Allow-Origin': '*', 
            },
        });
    } catch (error) {
        // Log the error detail
        console.error("Error serving WASM file (Final Attempt):", error);
        return NextResponse.json(
            { error: "Could not find or serve the required WASM file." },
            { status: 500 }
        );
    }
}