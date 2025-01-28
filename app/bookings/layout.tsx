import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservas | SportMap'
}

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 