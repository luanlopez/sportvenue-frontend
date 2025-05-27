import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Histórico de Pagamentos'
}

export default function BillingHistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 