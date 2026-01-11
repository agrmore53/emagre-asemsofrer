'use client'

import { GLP1Tracker } from '@/components/glp1'

export default function GLP1Page() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">GLP-1 Companion</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe sua medicação Ozempic, Wegovy ou similar
        </p>
      </div>

      <GLP1Tracker />
    </div>
  )
}
