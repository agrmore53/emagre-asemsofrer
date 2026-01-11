'use client'

import { DailyLesson } from '@/components/cbt'

export default function LicoesPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Lições Diárias</h1>
        <p className="text-muted-foreground mt-1">
          Psicologia do emagrecimento - uma lição por dia
        </p>
      </div>

      <DailyLesson />
    </div>
  )
}
