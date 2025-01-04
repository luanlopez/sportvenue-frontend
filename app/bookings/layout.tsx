import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservas | SportVenue'
}

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 