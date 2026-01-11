'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  LeaderboardEntry,
  LEADERBOARD_BADGES,
  CATEGORIAS_LEADERBOARD,
  formatarPercentualLeaderboard,
  formatarDataCurta,
  getMensagemMotivacional,
  getStreakBadge,
} from '@/lib/leaderboard'

interface LeaderboardData {
  entries: LeaderboardEntry[]
  minha_posicao: LeaderboardEntry | null
  total_participantes: number
  semana_atual: {
    inicio: string
    fim: string
    numero: number
  }
  meu_streak: number
}

export function WeeklyLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('geral')
  const [semanaOffset, setSemanaOffset] = useState(0)

  useEffect(() => {
    fetchLeaderboard()
  }, [categoria, semanaOffset])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/leaderboard?categoria=${categoria}&semana=${semanaOffset}`
      )
      const result = await response.json()
      if (response.ok) {
        setData(result)
      }
    } catch (error) {
      console.error('Erro ao buscar leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getPodiumStyle = (posicao: number) => {
    const badge = LEADERBOARD_BADGES[posicao as 1 | 2 | 3]
    if (badge) {
      return `${badge.bg} border-2`
    }
    return ''
  }

  if (loading && !data) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando ranking...
        </CardContent>
      </Card>
    )
  }

  const streakBadge = data?.meu_streak ? getStreakBadge(data.meu_streak) : null

  return (
    <div className="space-y-6">
      {/* Header com navegação de semana */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Ranking Semanal
              </CardTitle>
              {data && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatarDataCurta(data.semana_atual.inicio)} -{' '}
                  {formatarDataCurta(data.semana_atual.fim)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSemanaOffset(semanaOffset - 7)}
              >
                ←
              </Button>
              <span className="text-sm px-2">
                {semanaOffset === 0
                  ? 'Esta semana'
                  : `${Math.abs(semanaOffset / 7)} semana(s) atrás`}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSemanaOffset(Math.min(0, semanaOffset + 7))}
                disabled={semanaOffset >= 0}
              >
                →
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <div className="flex gap-2 mb-4">
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_LEADERBOARD.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Minha posição destacada */}
          {data?.minha_posicao && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-primary">
                    #{data.minha_posicao.posicao}
                  </div>
                  <div>
                    <p className="font-semibold">Sua posição</p>
                    <p className="text-sm text-muted-foreground">
                      {getMensagemMotivacional(
                        data.minha_posicao.posicao,
                        data.total_participantes
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {formatarPercentualLeaderboard(data.minha_posicao.percentual_perdido)}
                  </p>
                  <p className="text-xs text-muted-foreground">esta semana</p>
                </div>
              </div>

              {/* Streak */}
              {data.meu_streak > 0 && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{streakBadge?.emoji || '🔥'}</span>
                    <span className="font-semibold">{data.meu_streak} dias de streak</span>
                  </div>
                  {streakBadge && (
                    <Badge variant="secondary">{streakBadge.label}</Badge>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Lista do ranking */}
          {data?.entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-4xl mb-2">📊</p>
              <p>Nenhum registro esta semana</p>
              <p className="text-sm">Registre seu peso para aparecer no ranking!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data?.entries.map((entry) => {
                const isMe = data.minha_posicao?.user_id === entry.user_id
                const badge = LEADERBOARD_BADGES[entry.posicao as 1 | 2 | 3]

                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      getPodiumStyle(entry.posicao)
                    } ${isMe ? 'ring-2 ring-primary' : ''}`}
                  >
                    {/* Posição */}
                    <div className="w-10 text-center">
                      {badge ? (
                        <span className="text-2xl">{badge.emoji}</span>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{entry.posicao}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={badge?.cor}>
                        {getInitials(entry.user_nome)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Nome */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isMe ? 'text-primary' : ''}`}>
                        {entry.user_nome}
                        {isMe && (
                          <span className="text-xs ml-1 text-muted-foreground">(você)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.peso_inicial_semana.toFixed(1)}kg →{' '}
                        {entry.peso_final_semana.toFixed(1)}kg
                      </p>
                    </div>

                    {/* Percentual */}
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          entry.percentual_perdido > 0
                            ? 'text-green-600'
                            : entry.percentual_perdido < 0
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {formatarPercentualLeaderboard(entry.percentual_perdido)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Total */}
          {data && data.total_participantes > 0 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {data.total_participantes} participantes esta semana
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WeeklyLeaderboard
