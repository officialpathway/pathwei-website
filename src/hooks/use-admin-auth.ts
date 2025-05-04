'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/utils/supabase/client';
import { getAdminUser, hasRole } from '@/lib/new/admin';
import { User } from '@supabase/supabase-js';

// Custom hook to handle admin authentication and data fetching
export function useAdminAuth(requiredRole = null) {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<{
    name: string;
    email: string;
    role: string;
    status: string;
    last_active: string;
    avatarUrl: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<{
    canManageUsers: boolean;
    canManageContent: boolean;
    canManageSettings: boolean;
  }>({
    canManageUsers: false,
    canManageContent: false,
    canManageSettings: false,
  });
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Use this flag to prevent state updates after unmount

    async function fetchUserData() {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.getUser();

        if (!isMounted) return;

        // Handle authentication errors
        if (authError) {
          console.error('[useAdminAuth] Auth Error:', authError);
          setError('Authentication failed. Please log in again.');
          setLoading(false);
          router.push('/admin/login');
          return;
        }

        // Handle no user found
        if (!data?.user) {
          console.error('[useAdminAuth] No user found');
          setLoading(false);
          router.push('/admin/login');
          return;
        }

        // User is authenticated
        console.log('[useAdminAuth] User:', data.user);
        setUser(data.user);

        try {
          // Get admin data
          const adminUserData = await getAdminUser(data.user.id);
          
          if (!isMounted) return;

          // Handle non-admin user
          if (!adminUserData) {
            console.error('[useAdminAuth] Not an admin user');
            setError('You do not have admin privileges');
            setLoading(false);
            return;
          }

          // Set admin data
          console.log('[useAdminAuth] Admin User Data:', adminUserData);
          setAdminData({
            ...adminUserData,
            avatarUrl: adminUserData.avatarUrl ?? null,
          });

          // Check for required role if specified
          if (requiredRole) {
            const roleArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            const hasRequiredRole = await hasRole(data.user.id, roleArray);
            
            if (!isMounted) return;
            
            if (!hasRequiredRole) {
              const roleText = roleArray.join(' or ');
              console.error(`[useAdminAuth] Missing required role: ${roleText}`);
              setError(`You need ${roleText} role to access this page`);
              setLoading(false);
              return;
            }
          }

          // Check permissions
          const canManageUsers = await hasRole(data.user.id, ['admin']);
          const canManageContent = await hasRole(data.user.id, ['admin', 'editor']);
          const canManageSettings = await hasRole(data.user.id, ['admin']);
          
          if (!isMounted) return;
          
          setPermissions({
            canManageUsers,
            canManageContent,
            canManageSettings,
          });

          // All done successfully
          setLoading(false);
        } catch (adminError) {
          // Handle admin data fetch errors
          console.error('[useAdminAuth] Admin data error:', adminError);
          if (!isMounted) return;
          setError('Error fetching admin data');
          setLoading(false);
        }
      } catch (err) {
        // Handle unexpected errors
        console.error('[useAdminAuth] Unexpected error:', err);
        if (!isMounted) return;
        setError('An unexpected error occurred');
        setLoading(false);
      }
    }

    fetchUserData();

    // Cleanup function to prevent memory leaks and race conditions
    return () => {
      isMounted = false;
    };
  }, [router, requiredRole]); // Include router and requiredRole as dependencies

  return { 
    user, 
    adminData, 
    loading, 
    error, 
    permissions,
    setError,
  };
}