import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Em Construção'
}

export default function ConstructionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 