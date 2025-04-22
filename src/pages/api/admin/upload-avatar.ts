/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/admin/upload-avatar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import formidable from 'formidable';
import fs from 'fs';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create authenticated Supabase client using server-side auth with updated method
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookies = req.headers.cookie || '';
          const cookie = cookies.split(';').find(c => c.trim().startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set: (name, value, options) => {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=${options?.path || '/'}`);
        },
        remove: (name, options) => {
          res.setHeader('Set-Cookie', `${name}=; Path=${options?.path || '/'}; Max-Age=0`);
        },
      },
    }
  );

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Check if the user is an admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!userData || userData.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    // Parse the form data
    const form = formidable({ multiples: false });
    
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the userId and file
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      throw new Error('File is required');
    }

    if (!userId || !uploadedFile) {
      return res.status(400).json({ error: 'Missing userId or file' });
    }

    // Read the file
    const fileContent = fs.readFileSync(uploadedFile.filepath);
    const fileExt = uploadedFile.originalFilename?.split('.').pop() || 'png';
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Upload to storage with server-side client
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, fileContent, {
        cacheControl: '3600',
        upsert: true,
        contentType: uploadedFile.mimetype || 'image/png',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(400).json({ error: uploadError.message });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    // Get the old avatar path if it exists
    const { data: oldUserData, error: userDataError } = await supabase
      .from('users')
      .select('avatar')
      .eq('id', userId)
      .single();
    
    if (!userDataError && oldUserData?.avatar) {
      try {
        const avatarUrl = new URL(oldUserData.avatar);
        const pathParts = avatarUrl.pathname.split('/');
        if (pathParts.length >= 5) {
          // Extract the path after /storage/v1/object/public/avatars/
          const oldAvatarPath = pathParts.slice(5).join('/');
          
          // Delete the old avatar file
          await supabase
            .storage
            .from('avatars')
            .remove([oldAvatarPath]);
        }
      } catch (error) {
        console.warn('Error parsing or deleting old avatar URL:', error);
      }
    }

    // Update user record with the new avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('User update error:', updateError);
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({ publicUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return res.status(500).json({ error: 'Server error during avatar upload' });
  }
}