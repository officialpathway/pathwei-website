import { put, list } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
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
      console.error("Error fetching existing blob:", error);
    }

    const updatedContent = `${existingContent}${email}\n`;

    await put("emails.txt", updatedContent, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      allowOverwrite: true
    });

    return res.status(200).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("Error saving email:", error);
    return res.status(500).json({ 
      error: "Subscription failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}