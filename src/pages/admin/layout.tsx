import { CogIcon, ChartBarIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '@/src/pages/globals.css';
import AuthWrapper from '@/components/auth-wrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'General', href: '/admin/settings/general', icon: CogIcon },
    { name: 'SEO', href: '/admin/settings/seo', icon: StarIcon },
    { name: 'Users', href: '/admin/settings/users', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon }
  ];

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg ${router.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="pl-64">
          <div className="p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}