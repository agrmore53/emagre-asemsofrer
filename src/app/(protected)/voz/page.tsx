'use client'

import { VoiceLogger } from '@/components/voice'

export default function VozPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Comando de Voz</h1>
        <p className="text-muted-foreground mt-1">
          Registre peso, água e mais usando apenas sua voz
        </p>
      </div>

      <VoiceLogger />
    </div>
  )
}
