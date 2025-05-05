// app/api/admin/users/[id]/invite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params Promise to get the actual ID
  const { id: userId } = await context.params;
  
  console.log('[POST /api/admin/users/[id]/invite] Request received for user ID:', userId);
  
  // Create the Supabase client and verify authentication
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log('[POST /api/admin/users/[id]/invite] Admin authentication successful. Admin ID:', data.user.id);
  
  // Create the admin client for administrative operations
  const adminClient = createAdminClient();

  // Parse request body
  const { customMessage } = await request.json();
  console.log('[POST /api/admin/users/[id]/invite] Request data:', { customMessage });

  try {
    // Get the user data
    console.log('[POST /api/admin/users/[id]/invite] Fetching target user data for ID:', userId);
    const { data: targetUser, error: userError } = await adminClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !targetUser) {
      console.error('[POST /api/admin/users/[id]/invite] User not found:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Generate a password reset token using admin client
    console.log('[POST /api/admin/users/[id]/invite] Generating password reset link for user:', targetUser.email);
    const { data: resetData, error: resetError } = await adminClient.auth.admin.generateLink({
      type: 'recovery',
      email: targetUser.email,
    });

    if (resetError) {
      console.error('[POST /api/admin/users/[id]/invite] Error generating reset link:', resetError);
      throw new Error(resetError.message);
    }

    // Send the invitation email with the reset link
    console.log('[POST /api/admin/users/[id]/invite] Reset link generated successfully');
    const resetLink = resetData.properties.action_link;
    
    console.log('[POST /api/admin/users/[id]/invite] Sending invitation email to:', targetUser.email);
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
    console.log('[POST /api/admin/users/[id]/invite] Invitation email sent successfully');

    // Update the user status to invited
    console.log('[POST /api/admin/users/[id]/invite] Updating user status to invited');
    const { error: updateError } = await adminClient
      .from('users')
      .update({ status: 'invited', updated_at: new Date().toISOString() })
      .eq('id', userId);
      
    if (updateError) {
      console.error('[POST /api/admin/users/[id]/invite] Error updating user status:', updateError);
      throw new Error(updateError.message);
    }

    console.log('[POST /api/admin/users/[id]/invite] Invitation process completed successfully');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[POST /api/admin/users/[id]/invite] Error sending invitation:', error.message);
    } else {
      console.error('[POST /api/admin/users/[id]/invite] Error sending invitation:', error);
    }
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 });
  }
}