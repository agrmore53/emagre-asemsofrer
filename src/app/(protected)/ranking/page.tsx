'use client'

import { WeeklyLeaderboard } from '@/components/leaderboard'

export default function RankingPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ranking</h1>
        <p className="text-muted-foreground mt-1">
          Veja quem mais perdeu peso esta semana
        </p>
      </div>

      <WeeklyLeaderboard />
    </div>
  )
}
