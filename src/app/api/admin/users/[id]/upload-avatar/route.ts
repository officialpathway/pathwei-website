// app/api/admin/users/[id]/upload-avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  console.log('[POST /api/admin/user-management/upload-avatar] Request received');
  
  const supabase = await createClient();

  // Check if the user is authenticated
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/admin/login');
  }
  
  console.log('[POST /api/admin/user-management/upload-avatar] Authentication successful.');
  
  // Create the admin client for administrative operations
  const adminClient = createAdminClient();
  
  try {
    // Process form data (multipart/form-data)
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File;
    
    if (!userId || !file) {
      console.error('[POST /api/admin/user-management/upload-avatar] Missing userId or file');
      return NextResponse.json({ error: 'Missing userId or file' }, { status: 400 });
    }
    
    console.log('[POST /api/admin/user-management/upload-avatar] Processing avatar upload for user:', userId);
    
    // Write the file to a temporary location
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const tempFilePath = join(tmpdir(), `${uuidv4()}-${file.name}`);
    await writeFile(tempFilePath, buffer);
    
    // Determine file extension and create the storage path
    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
    
    console.log('[POST /api/admin/user-management/upload-avatar] Uploading to storage path:', filePath);
    
    // Upload to storage with admin client
    const { data: uploadData, error: uploadError } = await adminClient
      .storage
      .from('avatars')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'image/png',
      });

    if (uploadError) {
      console.error('[POST /api/admin/user-management/upload-avatar] Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient
      .storage
      .from('avatars')
      .getPublicUrl(uploadData.path);
    
    console.log('[POST /api/admin/user-management/upload-avatar] File uploaded successfully. Public URL:', publicUrl);

    // Get the old avatar path if it exists
    const { data: oldUserData, error: userDataError } = await adminClient
      .from('users')
      .select('avatar')
      .eq('id', userId)
      .single();
    
    if (!userDataError && oldUserData?.avatar) {
      try {
        console.log('[POST /api/admin/user-management/upload-avatar] Found existing avatar, attempting to remove');
        const avatarUrl = new URL(oldUserData.avatar);
        const pathParts = avatarUrl.pathname.split('/');
        if (pathParts.length >= 5) {
          // Extract the path after /storage/v1/object/public/avatars/
          const oldAvatarPath = pathParts.slice(5).join('/');
          
          // Delete the old avatar file
          await adminClient
            .storage
            .from('avatars')
            .remove([oldAvatarPath]);
          
          console.log('[POST /api/admin/user-management/upload-avatar] Old avatar removed successfully');
        }
      } catch (error) {
        console.warn('[POST /api/admin/user-management/upload-avatar] Error parsing or deleting old avatar URL:', error);
      }
    }

    // Update user record with the new avatar URL
    const { error: updateError } = await adminClient
      .from('users')
      .update({ 
        avatar: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[POST /api/admin/user-management/upload-avatar] User update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    console.log('[POST /api/admin/user-management/upload-avatar] Avatar upload and user update completed successfully');
    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('[POST /api/admin/user-management/upload-avatar] Server error during avatar upload:', error);
    return NextResponse.json({ error: 'Server error during avatar upload' }, { status: 500 });
  }
}