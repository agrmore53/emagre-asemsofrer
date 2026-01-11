'use client'

import { VideoProgressTracker } from '@/components/video-progress'

export default function VideoPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Progresso em Vídeo</h1>
        <p className="text-muted-foreground mt-1">
          Grave seu antes e depois para acompanhar sua transformação
        </p>
      </div>

      <VideoProgressTracker />
    </div>
  )
}
