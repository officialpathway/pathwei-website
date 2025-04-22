import type { NextApiRequest } from "next";

export function isAdmin(req: NextApiRequest): boolean {
  const token = req.cookies.adminAuth;
  return token === process.env.ADMIN_TOKEN;
}
