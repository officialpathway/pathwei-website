// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function POST(request: NextRequest) {
  console.log('[POST /api/admin/users] Request received');
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log('[POST /api/admin/users] Admin authentication successful.');
  
  const adminClient = createAdminClient();
  
  const body = await request.json();
  const { name, email, role, status, sendWelcomeEmail, customMessage } = body;
  console.log('[POST /api/admin/users] Request data:', { name, email, role, status, sendWelcomeEmail });

  if (!name || !email) {
    console.error('[POST /api/admin/users] Validation failed: Missing required fields');
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  try {
    // Check if email already exists using admin client
    const { data: existingUserByEmail, error: existingUserError } = await adminClient
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (existingUserError && existingUserError.code !== 'PGRST116') {
      console.error('[POST /api/admin/users] Error checking existing user:', existingUserError);
    }

    if (existingUserByEmail) {
      console.error('[POST /api/admin/users] Email already exists:', email);
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }
    
    // Generate a secure random password
    console.log('[POST /api/admin/users] Generating temporary password');
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-10);
    
    // Create the auth user using admin client
    console.log('[POST /api/admin/users] Creating auth user with email:', email);
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    
    if (authError) {
      console.error('[POST /api/admin/users] Error creating auth user:', authError);
      throw new Error(authError.message);
    }
    
    console.log('[POST /api/admin/users] Auth user created successfully.');
    
    // Check if user with this ID already exists in users table
    const { data: existingUserById, error: checkIdError } = await adminClient
      .from('users')
      .select('id')
      .eq('id', authData.user.id)
      .single();
      
    if (checkIdError && checkIdError.code !== 'PGRST116') {
      console.error('[POST /api/admin/users] Error checking user by ID:', checkIdError);
    }
    
    let userActionResult;
    
    if (existingUserById) {
      // Update the existing user record
      console.log('[POST /api/admin/users] User ID already exists, updating record');
      userActionResult = await adminClient
        .from('users')
        .update({
          name,
          email,
          role,
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);
    } else {
      // Insert new user record
      console.log('[POST /api/admin/users] Inserting new user record');
      userActionResult = await adminClient
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
            email,
            role,
            status,
          },
        ]);
    }
    
    if (userActionResult.error) {
      console.error('[POST /api/admin/users] Error updating/inserting user record:', userActionResult.error);
      throw new Error(userActionResult.error.message);
    }
    
    console.log('[POST /api/admin/users] User record created/updated successfully');

    // For reset link generation, use the admin client
    if (sendWelcomeEmail) {
      console.log('[POST /api/admin/users] Generating password reset link for welcome email');
      const { data: resetData, error: resetError } = await adminClient.auth.admin.generateLink({
        type: 'recovery',
        email,
      });

      if (resetError) {
        console.error('[POST /api/admin/users] Error generating reset link:', resetError);
        // Continue anyway, as the user has been created successfully
      } else {
        // Send the welcome email with the reset link
        console.log('[POST /api/admin/users] Reset link generated successfully');
        const resetLink = resetData.properties.action_link;
        
        console.log('[POST /api/admin/users] Sending welcome email to:', email);
        await sendEmail({
          to: email,
          subject: 'Welcome to Our Platform',
          text: customMessage + `\n\nUse this link to set up your account: ${resetLink}\n\nThis link will expire in 24 hours.`,
          html: `
            <p>${customMessage.replace(/\n/g, '<br>')}</p>
            <p>Use this link to set up your account: <a href="${resetLink}">${resetLink}</a></p>
            <p>This link will expire in 24 hours.</p>
          `,
        });
        console.log('[POST /api/admin/users] Welcome email sent successfully');
      }
    }

    console.log('[POST /api/admin/users] User creation completed successfully');
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[POST /api/admin/users] Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}