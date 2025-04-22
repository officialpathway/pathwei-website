import { NextApiRequest, NextApiResponse } from 'next';

interface Cookies {
  [key: string]: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // The cookie is automatically included in `req.headers.cookie`
  const cookies = parseCookies(req.headers.cookie);
  const isAuthenticated = cookies.adminAuth === 'true';

  res.status(200).json({ authenticated: isAuthenticated });
}

// Helper function to parse cookies
function parseCookies(cookieHeader: string | undefined): Cookies {
  const cookies: Cookies = {};
  
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.trim().split('=');
    if (parts.length >= 2) {
      const [name, ...valueParts] = parts;
      const value = valueParts.join('='); // Handles cases where cookie value contains '='
      cookies[name] = value;
    }
  });

  return cookies;
}