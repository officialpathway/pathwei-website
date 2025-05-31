// src/app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/newsletter";

export async function GET() {
  try {
    // Test the connection
    await prisma.$connect();
    
    // Try a simple query
    const count = await prisma.newsletterSubscriber.count();
    
    return NextResponse.json({ 
      status: "connected",
      subscriberCount: count,
      message: "Database connection successful" 
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    
    return NextResponse.json({ 
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}