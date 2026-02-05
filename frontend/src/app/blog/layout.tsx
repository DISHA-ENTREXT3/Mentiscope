import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learning Hub | Mentiscope',
  description: 'Research-based parenting tips, neuroscience-backed learning strategies, and educational insights to help your child succeed.',
  openGraph: {
    title: 'Mentiscope Learning Hub',
    description: 'Expert articles on child development and learning growth.',
    type: 'website',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
