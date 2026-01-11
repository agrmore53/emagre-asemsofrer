'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Flame, Trophy, Calendar, Target } from 'lucide-react'
import type { UsuarioStreak } from '@/types'

interface CardStreakProps {
  streak: UsuarioStreak | null
}

export function CardStreak({ streak }: CardStreakProps) {
  const streakAtual = streak?.streak_atual || 0
  const maiorStreak = streak?.maior_streak || 0
  const totalDias = streak?.total_dias_ativos || 0

  // Próximo milestone de streak
  const milestones = [3, 7, 14, 30, 60, 100]
  const proximoMilestone = milestones.find((m) => m > streakAtual) || 100
  const progressoMilestone = Math.min(100, (streakAtual / proximoMilestone) * 100)

  // Cor baseada no streak
  const getCorStreak = () => {
    if (streakAtual >= 30) return 'text-yellow-500'
    if (streakAtual >= 14) return 'text-orange-500'
    if (streakAtual >= 7) return 'text-red-500'
    if (streakAtual >= 3) return 'text-amber-500'
    return 'text-muted-foreground'
  }

  // Mensagem motivacional
  const getMensagem = () => {
    if (streakAtual === 0) return 'Registre seu peso hoje para começar!'
    if (streakAtual === 1) return 'Ótimo começo! Continue amanhã!'
    if (streakAtual < 7) return `Faltam ${7 - streakAtual} dias para 1 semana!`
    if (streakAtual < 14) return 'Você está pegando o ritmo!'
    if (streakAtual < 30) return 'Impressionante! Continue assim!'
    if (streakAtual < 60) return 'Você é um exemplo de consistência!'
    return 'Lendário! Você é imparável!'
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className={`h-5 w-5 ${getCorStreak()}`} />
            Sequência
          </CardTitle>
          {streakAtual >= 7 && (
            <span className="text-2xl">{streakAtual >= 30 ? '🔥' : '⚡'}</span>
          )}
        </div>
        <CardDescription>{getMensagem()}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Streak atual */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className={`text-5xl font-bold ${getCorStreak()}`}>
              {streakAtual}
            </div>
            <div className="text-sm text-muted-foreground">
              dia{streakAtual !== 1 ? 's' : ''} seguidos
            </div>
          </div>
        </div>

        {/* Progresso para próximo milestone */}
        {streakAtual > 0 && streakAtual < 100 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Próxima conquista: {proximoMilestone} dias</span>
              <span>{streakAtual}/{proximoMilestone}</span>
            </div>
            <Progress value={progressoMilestone} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span className="text-xs">Recorde</span>
            </div>
            <div className="text-xl font-bold">{maiorStreak}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <div className="text-xl font-bold">{totalDias}</div>
          </div>
        </div>

        {/* Call to action se streak quebrado */}
        {streakAtual === 0 && totalDias > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <Target className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <p className="text-sm text-amber-800">
              Seu recorde é <strong>{maiorStreak} dias</strong>.
              <br />
              Hora de começar uma nova sequência!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
