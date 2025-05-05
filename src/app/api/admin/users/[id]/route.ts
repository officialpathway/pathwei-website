// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params Promise to get the actual ID
  const { id: userId } = await context.params;
  console.log(`[GET /api/admin/users/${userId}] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(`[GET /api/admin/users/${userId}] Admin authentication successful. User ID:`, data.user.id);
  
  const adminClient = createAdminClient();

  // Get a specific user
  const { data: userData, error: userError } = await adminClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error(`[GET /api/admin/users/${userId}] Error fetching user:`, userError);
    return NextResponse.json({ error: userError.message }, { status: 400 });
  }

  return NextResponse.json(userData);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params Promise to get the actual ID
  const { id: userId } = await context.params;
  console.log(`[PUT /api/admin/users/${userId}] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(`[PUT /api/admin/users/${userId}] Admin authentication successful. User ID:`, data.user.id);
  
  const adminClient = createAdminClient();

  // Parse request body
  const body = await request.json();
  const { name, role, status } = body;
  console.log(`[PUT /api/admin/users/${userId}] Request data:`, { name, role, status });

  if (!name) {
    console.error(`[PUT /api/admin/users/${userId}] Validation failed: Name is required`);
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    // Prevent updating own role to non-admin
    if (userId === data.user.id && role !== 'admin') {
      console.error(`[PUT /api/admin/users/${userId}] Attempt to downgrade own admin role`);
      return NextResponse.json({ error: 'You cannot downgrade your own admin role' }, { status: 400 });
    }

    // Update the user record
    console.log(`[PUT /api/admin/users/${userId}] Updating user record`);
    const { error: updateError } = await adminClient
      .from('users')
      .update({
        name,
        role,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error(`[PUT /api/admin/users/${userId}] Error updating user record:`, updateError);
      throw new Error(updateError.message);
    }

    console.log(`[PUT /api/admin/users/${userId}] User updated successfully`);
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[PUT /api/admin/users/${userId}] Error updating user:`, error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params Promise to get the actual ID
  const { id: userId } = await context.params;
  console.log(`[DELETE /api/admin/users/${userId}] Request received`);
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  console.log(`[DELETE /api/admin/users/${userId}] Admin authentication successful. User ID:`, data.user.id);
  
  const adminClient = createAdminClient();

  try {
    // Prevent deleting own account
    if (userId === data.user.id) {
      console.error(`[DELETE /api/admin/users/${userId}] Attempt to delete own account`);
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    // First delete the user from the users table
    console.log(`[DELETE /api/admin/users/${userId}] Deleting user from users table`);
    const { error: userDeleteError } = await adminClient
      .from('users')
      .delete()
      .eq('id', userId);

    if (userDeleteError) {
      console.error(`[DELETE /api/admin/users/${userId}] Error deleting from users table:`, userDeleteError);
      throw new Error(userDeleteError.message);
    }
    
    // Then delete the user from auth
    console.log(`[DELETE /api/admin/users/${userId}] Deleting user from auth`);
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
    
    if (authDeleteError) {
      console.error(`[DELETE /api/admin/users/${userId}] Error deleting auth user:`, authDeleteError);
      // Continue anyway as the user record in the users table is already deleted
    }

    console.log(`[DELETE /api/admin/users/${userId}] User deleted successfully`);
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`[DELETE /api/admin/users/${userId}] Error deleting user:`, error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}