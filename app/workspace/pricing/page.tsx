import { Suspense } from 'react'

import PricingContent from './pricing-content'

const page = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PricingContent />
    </Suspense>
  )
}

export default page