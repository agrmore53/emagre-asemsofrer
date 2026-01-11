'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChallengeParticipante, BADGES_POSICAO, formatarPercentual } from '@/lib/challenges'

interface ChallengeLeaderboardProps {
  participantes: (ChallengeParticipante & { posicao: number })[]
  userId?: string
  tipo?: 'peso' | 'streak' | 'passos' | 'agua' | 'refeicoes'
}

export function ChallengeLeaderboard({
  participantes,
  userId,
  tipo = 'peso',
}: ChallengeLeaderboardProps) {
  const getMetricLabel = () => {
    switch (tipo) {
      case 'peso':
        return '% Perdido'
      case 'streak':
        return 'Dias'
      case 'passos':
        return 'Passos'
      case 'agua':
        return 'Litros'
      case 'refeicoes':
        return 'Refeições'
      default:
        return 'Pontos'
    }
  }

  const getMetricValue = (p: ChallengeParticipante) => {
    if (tipo === 'peso') {
      return formatarPercentual(p.percentual_perdido)
    }
    return p.percentual_perdido?.toFixed(0) || '0'
  }

  const getInitials = (nome?: string) => {
    if (!nome) return '?'
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getPodiumStyle = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300'
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 border-gray-300'
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300'
      default:
        return ''
    }
  }

  if (participantes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum participante ainda
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Ranking</span>
          <Badge variant="outline">{participantes.length} participantes</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {participantes.map((p) => {
          const isCurrentUser = p.user_id === userId
          const badge = p.posicao <= 3 ? BADGES_POSICAO[p.posicao as 1 | 2 | 3] : null

          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                getPodiumStyle(p.posicao)
              } ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Posição */}
              <div className="w-10 text-center">
                {badge ? (
                  <span className="text-2xl">{badge.emoji}</span>
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">
                    #{p.posicao}
                  </span>
                )}
              </div>

              {/* Avatar e Nome */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className={badge ? badge.cor : ''}>
                  {getInitials(p.user_nome)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                  {p.user_nome || 'Anônimo'}
                  {isCurrentUser && (
                    <span className="text-xs ml-1 text-muted-foreground">(você)</span>
                  )}
                </p>
                {tipo === 'peso' && p.peso_inicial && p.peso_atual && (
                  <p className="text-xs text-muted-foreground">
                    {p.peso_inicial.toFixed(1)}kg ➜ {p.peso_atual.toFixed(1)}kg
                  </p>
                )}
              </div>

              {/* Métrica */}
              <div className="text-right">
                <p className="font-bold text-lg">
                  {getMetricValue(p)}
                </p>
                <p className="text-xs text-muted-foreground">{getMetricLabel()}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default ChallengeLeaderboard
