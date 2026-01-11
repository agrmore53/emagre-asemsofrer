'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Challenge,
  calcularDiasRestantes,
  calcularProgressoDesafio,
  getStatusDesafio,
  formatarPercentual,
  BADGES_POSICAO,
} from '@/lib/challenges'

interface ChallengeCardProps {
  challenge: Challenge & {
    participantes_count?: number
    minha_participacao?: {
      percentual_perdido: number
      posicao_ranking: number
    }
  }
  onClick?: () => void
  showActions?: boolean
}

export function ChallengeCard({
  challenge,
  onClick,
  showActions = true,
}: ChallengeCardProps) {
  const status = getStatusDesafio(challenge.data_inicio, challenge.data_fim)
  const diasRestantes = calcularDiasRestantes(challenge.data_fim)
  const progresso = calcularProgressoDesafio(challenge.data_inicio, challenge.data_fim)

  const statusConfig = {
    pendente: { label: 'Em breve', color: 'bg-yellow-500' },
    ativo: { label: 'Ativo', color: 'bg-green-500' },
    encerrado: { label: 'Encerrado', color: 'bg-gray-500' },
  }

  const tipoIcons = {
    peso: '⚖️',
    streak: '🔥',
    passos: '👣',
    agua: '💧',
    refeicoes: '🍽️',
  }

  const posicao = challenge.minha_participacao?.posicao_ranking
  const badge = posicao && posicao <= 3 ? BADGES_POSICAO[posicao as 1 | 2 | 3] : null

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        onClick ? 'hover:border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {tipoIcons[challenge.tipo as keyof typeof tipoIcons] || '🏆'}
            </span>
            <div>
              <CardTitle className="text-lg">{challenge.nome}</CardTitle>
              {challenge.descricao && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {challenge.descricao}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className={`text-xl ${badge.cor}`} title={badge.label}>
                {badge.emoji}
              </span>
            )}
            <Badge
              variant="secondary"
              className={`${statusConfig[status].color} text-white`}
            >
              {statusConfig[status].label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Barra de progresso */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progresso do desafio</span>
            <span>{progresso}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">
              {challenge.participantes_count || 0}
            </p>
            <p className="text-xs text-muted-foreground">Participantes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{diasRestantes}</p>
            <p className="text-xs text-muted-foreground">Dias restantes</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {challenge.minha_participacao
                ? formatarPercentual(challenge.minha_participacao.percentual_perdido)
                : '-'}
            </p>
            <p className="text-xs text-muted-foreground">Meu progresso</p>
          </div>
        </div>

        {/* Minha posição */}
        {challenge.minha_participacao && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">Sua posição no ranking</span>
            <span className="font-bold">
              {badge?.emoji} #{challenge.minha_participacao.posicao_ranking || '-'}
            </span>
          </div>
        )}

        {/* Prêmio */}
        {challenge.premio_descricao && (
          <div className="flex items-center gap-2 text-sm">
            <span>🎁</span>
            <span className="text-muted-foreground">
              Prêmio: {challenge.premio_descricao}
            </span>
          </div>
        )}

        {/* Ações */}
        {showActions && (
          <div className="flex gap-2">
            {challenge.minha_participacao ? (
              <Button variant="outline" className="flex-1" onClick={onClick}>
                Ver Detalhes
              </Button>
            ) : (
              <Button className="flex-1" onClick={onClick}>
                Participar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChallengeCard
