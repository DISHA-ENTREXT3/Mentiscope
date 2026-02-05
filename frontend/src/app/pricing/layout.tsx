import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Mentiscope - Invest in Your Child\'s Future',
  description: 'Choose the right plan to unlock your child\'s learning potential. Transparent pricing for research-based developmental tracking.',
  openGraph: {
    title: 'Mentiscope Pricing',
    description: 'Strategic investment in holistic child development monitoring.',
    type: 'website',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
