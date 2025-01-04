import "./globals.css";
import { montserrat } from './fonts';
import { Toast } from "@/components/ui/Toast";
import { AuthProvider } from '@/hooks/useAuth';
import { ClientLayout } from "@/components/layout/ClientLayout";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | SportVenue',
    default: 'SportVenue'
  },
  description: 'Plataforma de agendamento de quadras esportivas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toast />
        </AuthProvider>
      </body>
    </html>
  );
}
