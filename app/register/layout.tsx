import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastro | SportMap'
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
} 