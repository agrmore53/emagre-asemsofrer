'use client'

import { CommunityFeed } from '@/components/community'

export default function ComunidadePage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Comunidade</h1>
        <p className="text-muted-foreground mt-1">
          Conecte-se com pessoas na mesma jornada
        </p>
      </div>

      <CommunityFeed />
    </div>
  )
}
