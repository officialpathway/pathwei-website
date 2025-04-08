import { put, list } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      // Fetch the existing content of the blob (if it exists)
      let existingContent = "";
      try {
        const { blobs } = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
        const emailsBlob = blobs.find(b => b.pathname === 'emails.txt');
        if (emailsBlob) {
          const response = await fetch(emailsBlob.url);
          existingContent = await response.text();
        }
      } catch (error: unknown) {
        // If the blob doesn't exist, ignore the error
        if (typeof error === 'object' && error && 'status' in error && error.status !== 404) throw error;
      }

      // Append the new email to the existing content
      const updatedContent = `${existingContent}${email}\n`;

      // Upload the updated content to the blob
      const blob = await put("emails.txt", updatedContent, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false, // Ensure the same file is updated
      });

      console.log("Email saved to blob:", blob.url);

      return res.status(200).json({ message: "Subscription successful!" });
    } catch (error) {
      console.error("Error saving email to blob:", error);
      return res.status(500).json({ error: "Failed to subscribe. Please try again." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}