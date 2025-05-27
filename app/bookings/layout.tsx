import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservas'
}

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 