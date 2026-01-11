'use client'

import { WearableSync } from '@/components/wearables'

export default function WearablesPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Wearables</h1>
        <p className="text-muted-foreground mt-1">
          Conecte seu smartwatch e monitore sua atividade
        </p>
      </div>

      <WearableSync />
    </div>
  )
}
