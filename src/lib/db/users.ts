import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client with proper error checking
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Supabase credentials missing: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`);
}

// Create the client with the confirmed values
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create the admin client with service role key (server-side only)
// This should never be exposed to the client
export const adminSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  last_active: string;
  status: 'active' | 'invited' | 'suspended';
  avatar?: string;
};

// Check if user is admin either via Supabase Auth or custom cookie
export async function isAdmin(): Promise<boolean> {
  try {
    // First try to get user from Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Check if user has admin role in app_metadata
      if (user.app_metadata?.role === 'admin') {
        return true;
      }
      
      // If not in app_metadata, check in the users table
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (userData?.role === 'admin') {
        return true;
      }
    }
    
    // If Supabase auth doesn't confirm admin, fallback to your custom cookie method
    // This is handled by your useAdminAuthGuard hook, so we'll return false here
    // and let the hook handle the cookie check
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    // Disable row level security temporarily to avoid infinite recursion
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
  try {
    // For client-side: Use regular Supabase client but be aware it may fail due to RLS
    // For server-side: Use adminSupabase if available
    const client = typeof window === 'undefined' && adminSupabase ? adminSupabase : supabase;
    
    // Log which client we're using (for debugging)
    console.log(`Using ${typeof window === 'undefined' && adminSupabase ? 'admin' : 'regular'} Supabase client for addUser`);
    
    const { data, error } = await client
      .from('users')
      .insert([{
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || 'invited',
        last_active: user.last_active || new Date().toISOString(),
      }])
      .select();
    
    if (error) {
      console.error('Error adding user:', error);
      throw error;
    }
    
    return data[0] as User;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return data[0] as User;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// For resending invites (would typically involve email)
export async function resendInvite(email: string): Promise<void> {
  try {
    // Get the user
    const { /*data,*/ error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    
    // In a production app, you would send an invitation email here
    // This is a placeholder for that functionality
    
    console.log(`Invite resent to ${email}`);
  } catch (error) {
    console.error('Error resending invite:', error);
    throw error;
  }
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    console.log(`Starting avatar upload for user: ${userId}`);
    
    // Try to get the authenticated user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('You must be logged in to upload an avatar');
    }
        
    // Check if user is updating their own avatar or is an admin
    const needsAdminCheck = user.id !== userId;
    
    // For admin uploading others' avatars, use the API route
    if (needsAdminCheck) {
      console.log('Admin needs to upload avatar for another user, using API endpoint');
      
      // Create form data
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', file);
      
      // Call the API endpoint
      const response = await fetch('/api/admin/user-management/upload-avatar', {
        method: 'POST',
        body: formData,
        // No need to set content-type, it will be set automatically for FormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API upload error:', errorData);
        throw new Error(errorData.error || 'Failed to upload avatar via API');
      }
      
      const result = await response.json();
      console.log('Avatar uploaded via API:', result.publicUrl);
      
      // Return the public URL
      return result.publicUrl;
    }
    
    // If user is uploading their own avatar, use the direct approach
    console.log('User uploading their own avatar');
    
    // Generate a clean file path ensuring it's in the correct user folder
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    console.log(`Uploading to path: ${filePath}`);

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    console.log('Upload successful:', uploadData.path);

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    console.log('Public URL generated:', publicUrl);

    // Get the old avatar path if it exists
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('avatar')
      .eq('id', userId)
      .single();
    
    if (userDataError) {
      console.error('Error fetching user data:', userDataError);
      // Continue even if we can't get the old avatar
    }
    
    // Extract the old avatar path from the URL if it exists
    let oldAvatarPath = null;
    if (userData?.avatar) {
      try {
        const avatarUrl = new URL(userData.avatar);
        const pathParts = avatarUrl.pathname.split('/');
        if (pathParts.length >= 5) {
          // Extract the path after /storage/v1/object/public/avatars/
          oldAvatarPath = pathParts.slice(5).join('/');
          console.log('Old avatar path identified:', oldAvatarPath);
        }
      } catch (error) {
        console.warn('Error parsing avatar URL:', error);
      }
    }

    // Update user record with the new avatar URL
    console.log(`Updating user record for ${userId} with new avatar URL`);
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('User record update error:', updateError);
      throw updateError;
    }

    // Delete the old avatar if it exists
    if (oldAvatarPath) {
      console.log(`Attempting to delete old avatar: ${oldAvatarPath}`);
      const { error: deleteError } = await supabase
        .storage
        .from('avatars')
        .remove([oldAvatarPath]);
        
      if (deleteError) {
        console.warn('Failed to delete old avatar:', deleteError);
        // Don't throw error here, just log warning
      }
    }

    console.log('Avatar update completed successfully');
    return publicUrl;
  } catch (error) {
    console.error('Avatar upload failed:', error);
    throw error;
  }
}

export async function deleteAvatar(userId: string) {
  try {
    // Try to get the authenticated user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if we need to verify admin permission
    const needsAdminCheck = user?.id !== userId;
    let isAdminUser = false;

    if (needsAdminCheck) {
      // If user is not deleting their own avatar, check if they're an admin
      isAdminUser = await isAdmin();
      if (!isAdminUser) {
        throw new Error('Unauthorized to delete this avatar');
      }
    }

    // Get the current avatar URL
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('avatar')
      .eq('id', userId)
      .single();

    if (userError) throw userError;
    
    // If there's no avatar, nothing to delete
    if (!userData?.avatar) {
      return null;
    }
    
    // Extract path from the avatar URL
    try {
      const avatarUrl = new URL(userData.avatar);
      const pathParts = avatarUrl.pathname.split('/');
      if (pathParts.length >= 3) {
        // Extract the path after /storage/v1/object/public/avatars/
        const avatarPath = pathParts.slice(5).join('/');
        
        // Delete the file from storage
        const { error: deleteError } = await supabase
          .storage
          .from('avatars')
          .remove([avatarPath]);
          
        if (deleteError) throw deleteError;
      }
    } catch (error) {
      console.warn('Error parsing avatar URL:', error);
    }

    // Update user record to remove avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar: null })
      .eq('id', userId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Avatar deletion failed:', error);
    throw error;
  }
}

// Authentication helpers
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}