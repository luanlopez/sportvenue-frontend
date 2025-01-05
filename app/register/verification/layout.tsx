import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verificação de Email | SportVenue'
}

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 