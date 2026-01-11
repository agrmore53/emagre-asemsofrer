'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Aposta,
  PLANOS_APOSTA,
  PERIODOS_APOSTA,
  TERMOS_APOSTA,
  STATUS_APOSTA_CONFIG,
  calcularGanhoPotencial,
  verificarMetaRealista,
  calcularProgressoAposta,
  getDicaMotivacional,
} from '@/lib/betting'

interface ApostaComGanho extends Aposta {
  ganho_potencial?: number
}

export function BettingSystem() {
  const [apostas, setApostas] = useState<ApostaComGanho[]>([])
  const [stats, setStats] = useState({
    total_apostas: 0,
    apostas_ganhas: 0,
    apostas_perdidas: 0,
    valor_total_ganho: 0,
    valor_total_perdido: 0
  })
  const [loading, setLoading] = useState(true)
  const [criando, setCriando] = useState(false)
  const [salvando, setSalvando] = useState(false)

  // Form
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null)
  const [periodoSelecionado, setPeriodoSelecionado] = useState<number | null>(null)
  const [pesoInicial, setPesoInicial] = useState('')
  const [pesoMeta, setPesoMeta] = useState('')
  const [pesoVerificacao, setPesoVerificacao] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)

  useEffect(() => {
    carregarApostas()
  }, [])

  const carregarApostas = async () => {
    try {
      const res = await fetch('/api/betting')
      const data = await res.json()
      setApostas(data.apostas || [])
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Erro ao carregar apostas:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarAposta = async () => {
    if (!planoSelecionado || !periodoSelecionado || !pesoInicial || !pesoMeta || !aceitouTermos) {
      alert('Preencha todos os campos e aceite os termos')
      return
    }

    const peso = parseFloat(pesoInicial)
    const meta = parseFloat(pesoMeta)

    if (meta >= peso) {
      alert('O peso meta deve ser menor que o peso inicial')
      return
    }

    const verificacao = verificarMetaRealista(peso, meta, periodoSelecionado)
    if (!verificacao.realista) {
      if (!confirm(`${verificacao.mensagem}\n\nDeseja continuar mesmo assim?`)) {
        return
      }
    }

    setSalvando(true)
    try {
      const res = await fetch('/api/betting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plano_id: planoSelecionado,
          periodo_semanas: periodoSelecionado,
          peso_inicial: peso,
          peso_meta: meta
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.mensagem)
        await carregarApostas()
        setCriando(false)
        resetForm()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Erro ao criar aposta:', error)
      alert('Erro ao criar aposta')
    } finally {
      setSalvando(false)
    }
  }

  const verificarAposta = async (apostaId: string) => {
    if (!pesoVerificacao) {
      alert('Informe seu peso atual')
      return
    }

    setSalvando(true)
    try {
      const res = await fetch('/api/betting', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: apostaId,
          acao: 'verificar',
          peso_final: parseFloat(pesoVerificacao)
        })
      })

      const data = await res.json()
      alert(data.mensagem)
      await carregarApostas()
      setPesoVerificacao('')
    } catch (error) {
      console.error('Erro ao verificar:', error)
    } finally {
      setSalvando(false)
    }
  }

  const cancelarAposta = async (apostaId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta aposta?')) return

    try {
      const res = await fetch('/api/betting', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: apostaId,
          acao: 'cancelar'
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.mensagem)
        await carregarApostas()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Erro ao cancelar:', error)
    }
  }

  const resetForm = () => {
    setPlanoSelecionado(null)
    setPeriodoSelecionado(null)
    setPesoInicial('')
    setPesoMeta('')
    setAceitouTermos(false)
  }

  // Calcular preview do ganho
  const plano = PLANOS_APOSTA.find(p => p.id === planoSelecionado)
  const periodo = PERIODOS_APOSTA.find(p => p.semanas === periodoSelecionado)
  const ganhoPotencial = plano && periodo
    ? calcularGanhoPotencial(plano.valor, plano.multiplicador, periodo.multiplicadorBonus)
    : 0

  // Verificação de meta
  const verificacaoMeta = pesoInicial && pesoMeta && periodoSelecionado
    ? verificarMetaRealista(parseFloat(pesoInicial), parseFloat(pesoMeta), periodoSelecionado)
    : null

  const apostasAtivas = apostas.filter(a => ['ativa', 'verificando'].includes(a.status))

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-green-700">
              R${stats.valor_total_ganho.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              Ganhos ({stats.apostas_ganhas} apostas)
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-100">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-amber-700">
              {stats.apostas_ganhas + stats.apostas_perdidas > 0
                ? Math.round((stats.apostas_ganhas / (stats.apostas_ganhas + stats.apostas_perdidas)) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Taxa de sucesso</p>
          </CardContent>
        </Card>
      </div>

      {/* Apostas ativas */}
      {apostasAtivas.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Apostas Ativas ({apostasAtivas.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {apostasAtivas.map((aposta) => {
              const progresso = calcularProgressoAposta(aposta, aposta.peso_inicial - 1) // Simulação
              const statusConfig = STATUS_APOSTA_CONFIG[aposta.status]

              return (
                <div key={aposta.id} className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">R${aposta.valor_apostado}</p>
                      <p className="text-sm text-muted-foreground">
                        Meta: {aposta.peso_meta}kg
                      </p>
                    </div>
                    <Badge className={statusConfig.cor}>
                      {statusConfig.icone} {statusConfig.texto}
                    </Badge>
                  </div>

                  {/* Progresso */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Tempo: {progresso.percentualTempo}%</span>
                      <span>{progresso.diasRestantes} dias restantes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progresso.percentualTempo}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Peso: {progresso.percentualPeso}%</span>
                      <span>{progresso.kgRestantes}kg restantes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progresso.noTrack ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${progresso.percentualPeso}%` }}
                      />
                    </div>
                  </div>

                  <p className={`text-sm ${progresso.noTrack ? 'text-green-600' : 'text-amber-600'}`}>
                    {getDicaMotivacional(progresso)}
                  </p>

                  {/* Verificar peso final */}
                  {aposta.status === 'verificando' && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Peso atual"
                        value={pesoVerificacao}
                        onChange={(e) => setPesoVerificacao(e.target.value)}
                      />
                      <Button
                        onClick={() => verificarAposta(aposta.id)}
                        disabled={salvando}
                      >
                        Verificar
                      </Button>
                    </div>
                  )}

                  {/* Ganho potencial */}
                  <div className="flex justify-between items-center text-sm">
                    <span>Ganho se atingir meta:</span>
                    <span className="font-bold text-green-600">
                      R${aposta.ganho_potencial?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  {/* Cancelar */}
                  {aposta.status === 'ativa' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive"
                      onClick={() => cancelarAposta(aposta.id)}
                    >
                      Cancelar aposta
                    </Button>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Nova Aposta */}
      {!criando ? (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-4xl mb-4">💰</p>
            <h3 className="font-bold text-lg">Aposte em Você!</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Coloque dinheiro na sua meta e ganhe ainda mais ao atingir!
            </p>
            <Button
              className="w-full"
              onClick={() => setCriando(true)}
              disabled={apostasAtivas.length >= 3}
            >
              {apostasAtivas.length >= 3 ? 'Máximo de apostas ativas' : '🎯 Criar Nova Aposta'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Nova Aposta</span>
              <Button variant="ghost" size="sm" onClick={() => setCriando(false)}>
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passo 1: Valor */}
            <div>
              <label className="text-sm font-medium">1. Quanto quer apostar?</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {PLANOS_APOSTA.map((plano) => (
                  <button
                    key={plano.id}
                    onClick={() => setPlanoSelecionado(plano.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      planoSelecionado === plano.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{plano.icone}</span>
                      <div>
                        <p className="font-bold">R${plano.valor}</p>
                        <p className="text-xs text-muted-foreground">{plano.nome}</p>
                      </div>
                    </div>
                    <p className="text-xs mt-1 text-green-600">
                      {plano.multiplicador}x de ganho
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Passo 2: Período */}
            <div>
              <label className="text-sm font-medium">2. Em quanto tempo?</label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {PERIODOS_APOSTA.map((periodo) => (
                  <button
                    key={periodo.semanas}
                    onClick={() => setPeriodoSelecionado(periodo.semanas)}
                    className={`p-2 rounded-lg border-2 text-center transition-all ${
                      periodoSelecionado === periodo.semanas
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <p className="font-bold text-sm">{periodo.descricao}</p>
                    <p className="text-xs text-green-600">
                      +{Math.round((periodo.multiplicadorBonus - 1) * 100)}%
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Passo 3: Pesos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">3. Peso atual</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 85.0"
                  value={pesoInicial}
                  onChange={(e) => setPesoInicial(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Peso meta</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 80.0"
                  value={pesoMeta}
                  onChange={(e) => setPesoMeta(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Verificação da meta */}
            {verificacaoMeta && (
              <div className={`p-3 rounded-lg ${
                verificacaoMeta.realista ? 'bg-green-50' : 'bg-amber-50'
              }`}>
                <p className={`text-sm ${
                  verificacaoMeta.realista ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {verificacaoMeta.realista ? '✓' : '⚠️'} {verificacaoMeta.mensagem}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Perda semanal estimada: {verificacaoMeta.perdaSemanal}kg/semana
                </p>
              </div>
            )}

            {/* Preview do ganho */}
            {plano && periodo && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Se você atingir a meta:</p>
                  <p className="text-3xl font-bold text-green-700">
                    R${ganhoPotencial.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600">
                    Investimento: R${plano.valor} → Retorno: {((ganhoPotencial / plano.valor) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            )}

            {/* Termos */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Termos e Condições:</p>
              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                {TERMOS_APOSTA.map((termo, i) => (
                  <p key={i}>• {termo}</p>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Li e aceito os termos</span>
              </label>
            </div>

            {/* Botão criar */}
            <Button
              className="w-full"
              onClick={criarAposta}
              disabled={!planoSelecionado || !periodoSelecionado || !pesoInicial || !pesoMeta || !aceitouTermos || salvando}
            >
              {salvando ? 'Criando...' : `💰 Apostar R$${plano?.valor || 0}`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {apostas.filter(a => !['ativa', 'verificando'].includes(a.status)).length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma aposta finalizada ainda
            </p>
          ) : (
            <div className="space-y-2">
              {apostas
                .filter(a => !['ativa', 'verificando'].includes(a.status))
                .map((aposta) => {
                  const statusConfig = STATUS_APOSTA_CONFIG[aposta.status]
                  return (
                    <div
                      key={aposta.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{statusConfig.icone}</span>
                          <span className="font-medium">R${aposta.valor_apostado}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(aposta.data_inicio).toLocaleDateString('pt-BR')} - {' '}
                          {new Date(aposta.data_limite).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={statusConfig.cor}>
                          {statusConfig.texto}
                        </Badge>
                        {aposta.ganho && aposta.ganho > 0 && (
                          <p className="text-sm text-green-600 font-medium mt-1">
                            +R${aposta.ganho.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BettingSystem
