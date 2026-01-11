'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ChallengeLeaderboard, ShareChallengeModal } from '@/components/challenges'
import {
  Challenge,
  ChallengeParticipante,
  calcularDiasRestantes,
  calcularProgressoDesafio,
  getStatusDesafio,
  BADGES_POSICAO,
} from '@/lib/challenges'

interface ChallengeDetailData {
  challenge: Challenge
  participantes: (ChallengeParticipante & { posicao: number })[]
  minha_participacao: (ChallengeParticipante & { posicao: number }) | null
  total_participantes: number
}

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [data, setData] = useState<ChallengeDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newPeso, setNewPeso] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChallenge()
  }, [id])

  const fetchChallenge = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setData(result)
    } catch (err) {
      console.error('Erro ao buscar desafio:', err)
      router.push('/desafios')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePeso = async () => {
    if (!newPeso) return
    setUpdating(true)
    setError('')

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peso_atual: parseFloat(newPeso) }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error)
      }

      setNewPeso('')
      fetchChallenge()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar peso')
    } finally {
      setUpdating(false)
    }
  }

  const handleLeave = async () => {
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error)
      }

      router.push('/desafios')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sair do desafio')
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12 text-muted-foreground">
          Carregando desafio...
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { challenge, participantes, minha_participacao, total_participantes } = data
  const status = getStatusDesafio(challenge.data_inicio, challenge.data_fim)
  const diasRestantes = calcularDiasRestantes(challenge.data_fim)
  const progresso = calcularProgressoDesafio(challenge.data_inicio, challenge.data_fim)

  const statusConfig = {
    pendente: { label: 'Em breve', color: 'bg-yellow-500' },
    ativo: { label: 'Ativo', color: 'bg-green-500' },
    encerrado: { label: 'Encerrado', color: 'bg-gray-500' },
  }

  const tipoIcons: Record<string, string> = {
    peso: '⚖️',
    streak: '🔥',
    passos: '👣',
    agua: '💧',
    refeicoes: '🍽️',
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          ←
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {tipoIcons[challenge.tipo] || '🏆'}
            </span>
            <h1 className="text-2xl font-bold">{challenge.nome}</h1>
            <Badge
              variant="secondary"
              className={`${statusConfig[status].color} text-white`}
            >
              {statusConfig[status].label}
            </Badge>
          </div>
          {challenge.descricao && (
            <p className="text-muted-foreground mt-1">{challenge.descricao}</p>
          )}
        </div>
        <Button variant="outline" onClick={() => setShowShareModal(true)}>
          Convidar
        </Button>
      </div>

      {/* Progresso */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso do desafio</span>
            <span>{diasRestantes} dias restantes</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{new Date(challenge.data_inicio).toLocaleDateString('pt-BR')}</span>
            <span>{new Date(challenge.data_fim).toLocaleDateString('pt-BR')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Minha posição (se participante) */}
      {minha_participacao && (
        <Card className="mb-6 border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Sua Participação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-2xl font-bold">
                  {minha_participacao.posicao <= 3 ? (
                    <span>
                      {BADGES_POSICAO[minha_participacao.posicao as 1 | 2 | 3]?.emoji}{' '}
                      #{minha_participacao.posicao}
                    </span>
                  ) : (
                    `#${minha_participacao.posicao}`
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Sua Posição</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {minha_participacao.peso_inicial?.toFixed(1) || '-'}kg
                </p>
                <p className="text-xs text-muted-foreground">Peso Inicial</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {minha_participacao.peso_atual?.toFixed(1) || '-'}kg
                </p>
                <p className="text-xs text-muted-foreground">Peso Atual</p>
              </div>
            </div>

            {status === 'ativo' && (
              <div className="border-t pt-4">
                <Label>Atualizar seu peso</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 75.5"
                    value={newPeso}
                    onChange={(e) => setNewPeso(e.target.value)}
                  />
                  <Button onClick={handleUpdatePeso} disabled={updating || !newPeso}>
                    {updating ? 'Salvando...' : 'Atualizar'}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prêmio */}
      {challenge.premio_descricao && (
        <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              <div>
                <p className="font-semibold">Prêmio</p>
                <p className="text-muted-foreground">{challenge.premio_descricao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      <ChallengeLeaderboard
        participantes={participantes}
        userId={minha_participacao?.user_id}
        tipo={challenge.tipo as 'peso' | 'streak' | 'passos' | 'agua' | 'refeicoes'}
      />

      {/* Info */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Participantes</p>
              <p className="font-semibold">
                {total_participantes} / {challenge.max_participantes}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Código do desafio</p>
              <p className="font-mono font-semibold">{challenge.codigo_convite}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tipo</p>
              <p className="font-semibold capitalize">{challenge.tipo}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Visibilidade</p>
              <p className="font-semibold">
                {challenge.privado ? 'Privado' : 'Público'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sair do desafio */}
      {minha_participacao && status !== 'encerrado' && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowLeaveDialog(true)}
          >
            Sair do Desafio
          </Button>
        </div>
      )}

      {/* Modais */}
      <ShareChallengeModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        challengeName={challenge.nome}
        codigoConvite={challenge.codigo_convite || ''}
      />

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair do Desafio?</AlertDialogTitle>
            <AlertDialogDescription>
              Você perderá sua posição no ranking. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeave}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
