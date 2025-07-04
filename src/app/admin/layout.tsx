// src/app/admin/layout.tsx
import { Metadata } from "next";
import { myCustomFont } from "@/lib/styles/fonts";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "../globals.css"; // Import global styles

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard - Pathweg",
    template: "%s | Admin Dashboard - Pathweg",
  },
  description: "Administrative dashboard for Pathweg learning platform",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={myCustomFont.variable}>
      <head>
        <link rel="icon" href="/icons/Pathweg/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#5E42D3" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50 flex">
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex-1 lg:ml-0 ml-16">{children}</div>

          {/* Admin-specific scripts */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Admin-specific JavaScript
                console.log('Admin Dashboard Loaded');
                
                // Prevent accidental navigation away
                window.addEventListener('beforeunload', function(e) {
                  if (document.querySelector('[data-unsaved-changes]')) {
                    e.preventDefault();
                    e.returnValue = '';
                  }
                });
              `,
            }}
          />
        </div>
      </body>
    </html>
  );
}
