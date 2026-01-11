'use client'

import { BettingSystem } from '@/components/betting'

export default function ApostasPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Apostas na Meta</h1>
        <p className="text-muted-foreground mt-1">
          Coloque dinheiro na sua meta e ganhe ainda mais ao atingir!
        </p>
      </div>

      <BettingSystem />
    </div>
  )
}
