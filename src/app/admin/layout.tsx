import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from '@/lib/new/getServerSession';
import AdminSidebar from '@/components/server/admin/AdminSidebar';
import AdminHeader from '@/components/server/admin/AdminHeader';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Secure administration dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const session = await getServerSession();
  
  // Handle login page separately to avoid redirecting when visiting login page
  // Was raising redirect error when trying to access login page directly
  
  // Simple layout for login page
  if (!session) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <main>{children}</main>
        </body>
      </html>
    );
  }
  
  // Full admin layout for authenticated users
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}