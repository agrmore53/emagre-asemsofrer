'use client'

import { CicloTracker } from '@/components/ciclo-menstrual'

export default function CicloPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ciclo Menstrual</h1>
        <p className="text-muted-foreground mt-1">
          Nutrição sincronizada com seu ciclo hormonal
        </p>
      </div>

      <CicloTracker />
    </div>
  )
}
