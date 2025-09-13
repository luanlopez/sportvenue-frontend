import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Detalhes de Assinatura'
}

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 