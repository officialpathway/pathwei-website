// src/lib/auth/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

export const validateBasicAuth = (req: NextApiRequest): boolean => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  return (
    username === process.env.STATS_USERNAME && 
    password === process.env.STATS_PASSWORD
  );
};

export const setAdminAuthCookie = (res: NextApiResponse) => {
  res.setHeader('Set-Cookie', `adminAuth=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`);
};

export const verifyAdminCookie = (req: NextApiRequest): boolean => {
  return req.cookies.adminAuth === 'true';
};

// For API routes (pages/api)
export const isAdminApi = (req: NextApiRequest): boolean => {
  const authCookie = req.cookies.adminAuth;
  return authCookie === process.env.ADMIN_AUTH_TOKEN;
};

// For middleware
export const isAdminMiddleware = (req: NextRequest): boolean => {
  return req.cookies.get('adminAuth')?.value === process.env.ADMIN_AUTH_TOKEN;
};

// For server components (if needed)
export const verifyAdminToken = (token?: string): boolean => {
  if (!token) return false;
  return token === process.env.ADMIN_AUTH_TOKEN;
};