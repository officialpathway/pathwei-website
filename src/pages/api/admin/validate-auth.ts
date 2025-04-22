// pages/api/admin/validate-auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { setAdminAuthCookie } from '@/lib/auth'; // O mueve esto a un util común

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization || '';
  const credentials = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString();
  const [username, password] = credentials.split(':');

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    setAdminAuthCookie(res);
    return res.status(200).end(); // Cookie ya seteada
  }

  return res.status(401).json({ error: 'Unauthorized' });
}
