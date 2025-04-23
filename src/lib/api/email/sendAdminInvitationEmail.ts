import nodemailer from 'nodemailer';
import { adminSupabase } from '@/lib/db/users';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Sends an email using the configured mail provider
 * @param options Email sending options
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Verify adminSupabase is available (service role key is set)
  if (!adminSupabase) {
    console.error('Admin Supabase client not available. Check SUPABASE_SERVICE_ROLE_KEY.');
    throw new Error('Server not properly configured for sending emails');
  }

  // Configure the email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configure the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    // Optionally log the invitation in a Supabase table using adminSupabase
    // This bypasses RLS and ensures it works properly
    try {
      await adminSupabase
        .from('email_logs')
        .insert([
          { 
            recipient: options.to,
            subject: options.subject,
            sent_at: new Date().toISOString(),
          }
        ]);
    } catch (logError) {
      // Just log and continue if there's an error with the logging
      // Don't fail the email send if logging fails
      console.warn('Failed to log email:', logError);
    }

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}