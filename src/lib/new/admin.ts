/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from './supabase';

/**
 * Interface for user data from the users table
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'suspended';
  last_active: string;
  avatar?: string;
  avatar_id?: string;
  avatarUrl?: string; // Generated signed URL
  created_at: string;
  updated_at: string;
}

/**
 * Check if a user has admin dashboard access privileges
 * Works with the existing users table structure
 * 
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} True if the user has access
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    // Check against the users table
    const { data, error } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    // Only active users have access
    if (data.status !== 'active') {
      return false;
    }
    
    // Any role (admin, editor, viewer) has access to the dashboard
    return true;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
}

/**
 * Check if a user has a specific role level
 * 
 * @param {string} userId - The user ID to check
 * @param {string[]} allowedRoles - The roles that have access
 * @returns {Promise<boolean>} True if the user has the required role
 */
export async function hasRole(userId: string, allowedRoles: string[]): Promise<boolean> {
  try {
    // Check against the users table
    const { data, error } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    // Only active users have access
    if (data.status !== 'active') {
      return false;
    }
    
    // Check if user's role is in the allowed roles list
    return allowedRoles.includes(data.role);
  } catch (error) {
    console.error('Error verifying role status:', error);
    return false;
  }
}

/**
 * Get detailed information about a user with admin dashboard access
 * 
 * @param {string} userId - The user ID to retrieve
 * @returns {Promise<AdminUser | null>} User data or null if not found
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  try {
    // Get user information from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    // Update last active timestamp
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', userId);
    
    // Get avatar URL if available
    let avatarUrl = null;
    if (data.avatar_id) {
      const { data: signedURL } = await supabase
        .storage
        .from('avatars') // Assuming 'avatars' is your bucket name
        .createSignedUrl(data.avatar_id, 3600); // 1 hour expiry
        
      avatarUrl = signedURL?.signedUrl;
    }
    
    return {
      ...data,
      avatarUrl: avatarUrl || data.avatar // Use signed URL or fallback to avatar string
    };
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
}

/**
 * Create a new user with admin dashboard access
 * 
 * @param {Object} userData - User data
 * @returns {Promise<{success: boolean, error?: any, userId?: string}>} Result
 */
export async function createAdminUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}): Promise<{success: boolean, error?: any, userId?: string}> {
  try {
    // Step 1: Create the user in auth system
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true // Auto-confirm email for admin-created accounts
    });
    
    if (authError || !authData.user) {
      return { success: false, error: authError };
    }
    
    const userId = authData.user.id;
    
    // Step 2: Add user to the users table
    const { error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: 'active' // Start as active since email is confirmed
        }
      ]);
      
    if (userError) {
      return { success: false, error: userError };
    }
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
}

/**
 * Create an invitation for a new admin user
 * 
 * @param {Object} userData - User data
 * @returns {Promise<{success: boolean, error?: any, userId?: string, inviteLink?: string}>} Result
 */
export async function inviteAdminUser(userData: {
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}): Promise<{success: boolean, error?: any, userId?: string, inviteLink?: string}> {
  try {
    // Generate a secure random password (user will reset it)
    const temporaryPassword = Math.random().toString(36).slice(-10) + 
                             Math.random().toString(36).toUpperCase().slice(-2) + 
                             Math.floor(Math.random() * 10) + 
                             '!';
    
    // Create user with temporary password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: temporaryPassword,
      email_confirm: false
    });
    
    if (authError || !authData.user) {
      return { success: false, error: authError };
    }
    
    const userId = authData.user.id;
    
    // Add user to the users table with invited status
    const { error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: userId,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: 'invited'
        }
      ]);
      
    if (userError) {
      return { success: false, error: userError };
    }
    
    // Generate password recovery link
    const { data: recoveryData, error: recoveryError } = await supabase.auth.admin
      .generateLink({
        type: 'recovery',
        email: userData.email
      });
    
    if (recoveryError || !recoveryData) {
      return { 
        success: true, 
        userId,
        error: { message: 'User created but failed to generate invite link' }
      };
    }
    
    return { 
      success: true, 
      userId,
      inviteLink: recoveryData.properties.action_link
    };
  } catch (error) {
    console.error('Error inviting user:', error);
    return { success: false, error };
  }
}

/**
 * Update an existing admin user
 * 
 * @param {string} userId - The user ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<{success: boolean, error?: any}>} Result
 */
export async function updateAdminUser(
  userId: string,
  userData: Partial<{
    name: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'suspended';
    avatar_id: string | null;
  }>
): Promise<{success: boolean, error?: any}> {
  try {
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId);
      
    if (error) {
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
}

/**
 * Upload an avatar image for a user
 * 
 * @param {string} userId - The user ID
 * @param {File} file - The image file to upload
 * @returns {Promise<{success: boolean, error?: any, avatarUrl?: string}>} Result
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{success: boolean, error?: any, avatarUrl?: string}> {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });
      
    if (uploadError || !uploadData) {
      return { success: false, error: uploadError };
    }
    
    // Get the uploaded file ID
    const { data: fileData } = await supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const avatar_path = fileData?.publicUrl;
    
    // Get the file's ID
    const { data: objectData, error: objectError } = await supabase
      .from('storage')
      .select('id')
      .eq('name', filePath)
      .single();
      
    if (objectError || !objectData) {
      return { 
        success: true, 
        avatarUrl: avatar_path,
        error: { message: 'Avatar uploaded but failed to update user record' }
      };
    }
    
    // Update the user record with the new avatar
    const { error: updateError } = await supabase
      .from('users')
      .update({
        avatar: avatar_path,
        avatar_id: objectData.id
      })
      .eq('id', userId);
      
    if (updateError) {
      return { 
        success: true, 
        avatarUrl: avatar_path,
        error: { message: 'Avatar uploaded but failed to update user record' }
      };
    }
    
    return { 
      success: true,
      avatarUrl: avatar_path
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error };
  }
}

/**
 * Delete a user from the admin system
 * 
 * @param {string} userId - The user ID to delete
 * @returns {Promise<{success: boolean, error?: any}>} Result
 */
export async function deleteAdminUser(userId: string): Promise<{success: boolean, error?: any}> {
  try {
    // Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin
      .deleteUser(userId);
      
    if (authError) {
      return { success: false, error: authError };
    }
    
    // The user will be automatically removed from the users table due to CASCADE
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error };
  }
}

/**
 * Get a list of all users with admin dashboard access
 * 
 * @param {Object} options - Query options
 * @returns {Promise<{data: AdminUser[], count: number, error?: any}>} Result
 */
export async function getAdminUsers(options: {
  page?: number;
  perPage?: number;
  role?: 'admin' | 'editor' | 'viewer';
  status?: 'active' | 'invited' | 'suspended';
  search?: string;
} = {}): Promise<{data: AdminUser[], count: number, error?: any}> {
  try {
    const {
      page = 1,
      perPage = 10,
      role,
      status,
      search
    } = options;
    
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });
      
    // Apply filters
    if (role) {
      query = query.eq('role', role);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) {
      return { data: [], count: 0, error };
    }
    
    return { 
      data: data || [], 
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { data: [], count: 0, error };
  }
}