// src/app/api/newsletter/subscribe/route.ts
import { put, list } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log(`[POST /api/newsletter/subscribe] Request received`);
  
  try {
    const body = await request.json();
    const { email } = body;
    
    // Validate email
    if (!email || !email.includes("@")) {
      console.error(`[POST /api/newsletter/subscribe] Invalid email address`);
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
  
    let existingContent = "";
    try {
      const { blobs } = await list({
        prefix: "emails.txt",
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        existingContent = await response.text();
      }
    } catch (error) {
      console.error(`[POST /api/newsletter/subscribe] Error fetching existing blob:`, error);
    }
  
    const updatedContent = `${existingContent}${email}\n`;
  
    await put("emails.txt", updatedContent, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      allowOverwrite: true
    });
  
    console.log(`[POST /api/newsletter/subscribe] Email subscription successful`);
    return NextResponse.json({ message: "Subscription successful!" });
  } catch (error) {
    console.error(`[POST /api/newsletter/subscribe] Error saving email:`, error);
    return NextResponse.json({ 
      error: "Subscription failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}