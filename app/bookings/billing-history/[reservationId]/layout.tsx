import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Histórico de Pagamentos | SportMap'
}

export default function BillingHistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 