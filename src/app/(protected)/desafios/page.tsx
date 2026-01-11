'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChallengeCard,
  CreateChallengeModal,
  JoinChallengeModal,
  ShareChallengeModal,
} from '@/components/challenges'
import { Challenge } from '@/lib/challenges'

interface ChallengeWithMeta extends Challenge {
  participantes_count?: number
  minha_participacao?: {
    percentual_perdido: number
    posicao_ranking: number
  }
}

export default function DesafiosPage() {
  const router = useRouter()
  const [challenges, setChallenges] = useState<ChallengeWithMeta[]>([])
  const [meusChallenges, setMeusChallenges] = useState<ChallengeWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('meus')

  // Modais
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [newChallengeData, setNewChallengeData] = useState<{
    nome: string
    codigo: string
  } | null>(null)

  useEffect(() => {
    fetchChallenges()
  }, [activeTab])

  const fetchChallenges = async () => {
    setLoading(true)
    try {
      // Buscar meus desafios
      const meusRes = await fetch('/api/challenges?tipo=meus')
      const meusData = await meusRes.json()
      if (meusRes.ok) {
        setMeusChallenges(
          meusData.challenges.map((c: ChallengeWithMeta & { challenge_participantes?: Array<{ percentual_perdido: number; posicao_ranking: number }> }) => ({
            ...c,
            minha_participacao: c.challenge_participantes?.[0],
          }))
        )
      }

      // Buscar públicos
      const publicosRes = await fetch('/api/challenges?tipo=publicos')
      const publicosData = await publicosRes.json()
      if (publicosRes.ok) {
        setChallenges(publicosData.challenges)
      }
    } catch (error) {
      console.error('Erro ao buscar desafios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChallengeClick = (id: string) => {
    router.push(`/desafios/${id}`)
  }

  const handleCreateSuccess = (data: { id: string; codigo_convite: string }) => {
    // Mostrar modal de compartilhamento
    setNewChallengeData({ nome: 'Novo Desafio', codigo: data.codigo_convite })
    setShowShareModal(true)
    fetchChallenges()
  }

  const handleJoinSuccess = () => {
    fetchChallenges()
    setActiveTab('meus')
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Desafios em Grupo</h1>
          <p className="text-muted-foreground mt-1">
            Compita com amigos e alcance suas metas juntos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoinModal(true)}>
            Entrar com Código
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            Criar Desafio
          </Button>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{meusChallenges.length}</p>
            <p className="text-sm text-muted-foreground">Meus Desafios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {meusChallenges.filter((c) => {
                const hoje = new Date()
                return new Date(c.data_inicio) <= hoje && new Date(c.data_fim) >= hoje
              }).length}
            </p>
            <p className="text-sm text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {meusChallenges.filter((c) => c.minha_participacao?.posicao_ranking === 1).length}
            </p>
            <p className="text-sm text-muted-foreground">Vitórias</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="meus">Meus Desafios</TabsTrigger>
          <TabsTrigger value="descobrir">Descobrir</TabsTrigger>
        </TabsList>

        <TabsContent value="meus">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando...
            </div>
          ) : meusChallenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-4xl mb-4">🏆</p>
                <h3 className="text-lg font-semibold mb-2">
                  Você ainda não participa de nenhum desafio
                </h3>
                <p className="text-muted-foreground mb-4">
                  Crie um desafio ou entre com um código de convite
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setShowJoinModal(true)}>
                    Entrar com Código
                  </Button>
                  <Button onClick={() => setShowCreateModal(true)}>
                    Criar Desafio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {meusChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onClick={() => handleChallengeClick(challenge.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="descobrir">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando...
            </div>
          ) : challenges.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum desafio público disponível
                </h3>
                <p className="text-muted-foreground">
                  Crie o seu próprio ou entre com um código de convite
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onClick={() => handleChallengeClick(challenge.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <CreateChallengeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />

      <JoinChallengeModal
        open={showJoinModal}
        onOpenChange={setShowJoinModal}
        onSuccess={handleJoinSuccess}
      />

      {newChallengeData && (
        <ShareChallengeModal
          open={showShareModal}
          onOpenChange={setShowShareModal}
          challengeName={newChallengeData.nome}
          codigoConvite={newChallengeData.codigo}
        />
      )}
    </div>
  )
}
