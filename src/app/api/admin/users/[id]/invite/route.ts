// app/api/admin/users/[id]/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { supabase } from '@/lib/new/supabase';
import { getServerSession } from '@/lib/new/getServerSession';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  
  // Check if user is authenticated and has admin permissions
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated or not authorized' }, { status: 401 });
  }

  // Parse request body
  const { customMessage } = await request.json();

  try {
    // Get the user data
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Generate a password reset token
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: targetUser.email,
    });

    if (resetError) {
      throw new Error(resetError.message);
    }

    // Send the invitation email with the reset link
    const resetLink = resetData.properties.action_link;
    
    await sendEmail({
      to: targetUser.email,
      subject: 'Invitation to Our Platform',
      text: customMessage + `\n\nUse this link to set up your account: ${resetLink}\n\nThis link will expire in 24 hours.`,
      html: `
        <p>${customMessage.replace(/\n/g, '<br>')}</p>
        <p>Use this link to set up your account: <a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    // Update the user status to invited
    await supabase
      .from('users')
      .update({ status: 'invited' })
      .eq('id', userId);

    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}