import type { NextApiRequest, NextApiResponse } from 'next';
import { withAdminAuth } from '@/lib/api/middleware/adminApiMiddleware';
import { sendEmail } from '@/lib/api/email/sendAdminInvitationEmail';

// Define the request body type
interface InviteUserRequest {
  email: string;
  name: string;
  role: string;
  status: string;
  last_active: string;
}

// Response types
type SuccessResponse = {
  success: true;
};

type ErrorResponse = {
  error: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate content type
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({ error: 'Unsupported media type' });
  }

  try {
    const userData = req.body as InviteUserRequest;

    // Validate request body
    if (!userData.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Send invitation email
    await sendEmail({
      to: userData.email,
      subject: 'You have been invited',
      text: `Hello ${userData.name}, you have been invited as a ${userData.role}. Please login to accept your invitation.`,
      html: `
        <div>
          <h1>You've been invited!</h1>
          <p>Hello ${userData.name},</p>
          <p>You have been invited to join our platform as a <strong>${userData.role}</strong>.</p>
          <p>Please click the button below to accept your invitation:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/accept-invite?email=${encodeURIComponent(userData.email)}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Accept Invitation
          </a>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending invite email:', error);
    return res.status(500).json({ 
      error: 'Failed to send invitation email', 
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
}

// Export with admin auth middleware
export default withAdminAuth(handler);