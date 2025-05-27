import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboards | SportMap'
}

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 