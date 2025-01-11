import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos para Proprietários | SportVenue'
}

export default function OwnerPlansLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 