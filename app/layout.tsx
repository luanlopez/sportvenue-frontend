import "./globals.css";
import { montserrat } from './fonts';
import { Toast } from "@/components/ui/Toast";
import { AuthProvider } from '@/hooks/useAuth';
import { ClientLayout } from "@/components/layout/ClientLayout";
import type { Metadata } from 'next'
import { QueryProvider } from "@/components/providers/QueryProvider";
import { UserTypeModalProvider } from "@/contexts/UserTypeModalContext";

export const metadata: Metadata = {
  title: {
    template: '%s | SportMap',
    default: 'SportMap - Agendamento de quadras esportivas'
  },
  description: 'Plataforma de agendamento de quadras esportivas',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased font-sans">
        <UserTypeModalProvider>
          <QueryProvider>
            <AuthProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
              <Toast />
            </AuthProvider>
          </QueryProvider>
        </UserTypeModalProvider>
      </body>
    </html>
  );
}
