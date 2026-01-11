'use client'

import { SleepTracker } from '@/components/sleep'

export default function SonoPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sono & Metabolismo</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe como seu sono impacta seu emagrecimento
        </p>
      </div>

      <SleepTracker />
    </div>
  )
}
