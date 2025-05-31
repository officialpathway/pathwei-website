// src/app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { NewsletterService } from "@/lib/db/newsletter";

export async function POST(request: NextRequest) {
  console.log(`[POST /api/newsletter/subscribe] Request received`);
  
  try {
    const body = await request.json();
    const { email, termsAgreed } = body;
    
    // Validate email
    if (!email || !email.includes("@")) {
      console.error(`[POST /api/newsletter/subscribe] Invalid email address`);
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    
    // Validate terms agreement
    if (!termsAgreed) {
      console.error(`[POST /api/newsletter/subscribe] Terms not agreed`);
      return NextResponse.json({ error: "You must agree to the terms and conditions" }, { status: 400 });
    }
    
    // Subscribe the email
    const subscriber = await NewsletterService.subscribe(email);
    
    console.log(`[POST /api/newsletter/subscribe] Email subscription successful for: ${email}`);
    
    return NextResponse.json({
      message: "Subscription successful!",
      subscribedAt: subscriber.subscribedAt
    });
    
  } catch (error) {
    console.error(`[POST /api/newsletter/subscribe] Error:`, error);
    
    // Handle duplicate email error
    if (error instanceof Error && error.message.includes('already subscribed')) {
      return NextResponse.json({
        error: "This email is already subscribed to our newsletter"
      }, { status: 409 });
    }
    
    return NextResponse.json({
      error: "Subscription failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}