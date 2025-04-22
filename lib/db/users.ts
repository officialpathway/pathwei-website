import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase client with proper error checking
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`Supabase credentials missing: URL=${!!supabaseUrl}, Key=${!!supabaseAnonKey}`);
}

// Create the client with the confirmed values
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  lastActive: string;
  status: 'active' | 'invited' | 'suspended';
  avatar?: string;
};

export async function getUsers(): Promise<User[]> {
  try {
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
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: user.name,
        email: user.email,
        role: user.role,
        status: 'invited',
        lastActive: new Date().toISOString(),
        // Excluding id as Supabase will generate it
      }])
      .select();
    
    if (error) throw error;
    
    // In a production app, you would send an invitation email here
    // This could be done via Supabase Edge Functions or your own API
    
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

// Add this new function to upload avatar images
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  try {
    // Create a unique file path for this user's avatar
    const filePath = `${userId}/avatar-${Date.now()}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Overwrite if exists
      });
    
    if (error) throw error;
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(data.path);
    
    // Update the user record with the new avatar URL
    await updateUser(userId, { avatar: urlData.publicUrl });
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}

// Add this function to remove an avatar
export async function removeAvatar(userId: string): Promise<void> {
  try {
    // First get the user to find the avatar path
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('avatar')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    if (userData.avatar) {
      // Extract file path from the URL
      const url = new URL(userData.avatar);
      const pathMatch = url.pathname.match(/\/avatars\/(.+)$/);
      
      if (pathMatch && pathMatch[1]) {
        // Remove the file from storage
        const { error: deleteError } = await supabase
          .storage
          .from('avatars')
          .remove([pathMatch[1]]);
        
        if (deleteError) throw deleteError;
      }
    }
    
    // Update user to remove avatar reference
    await updateUser(userId, { avatar: null });
  } catch (error) {
    console.error('Error removing avatar:', error);
    throw error;
  }
}