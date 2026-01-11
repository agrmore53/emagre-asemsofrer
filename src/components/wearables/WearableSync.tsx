'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  WearableDevice,
  DadosWearable,
  MetasWearable,
  TipoWearable,
  WEARABLES_SUPORTADOS,
  METAS_PADRAO,
  calcularScoreAtividade,
  classificarSono,
  verificarSuporteBluetooth,
} from '@/lib/wearables'

interface ResumoData {
  scoreHoje: number
  detalhesHoje: { categoria: string; percentual: number; icone: string }[]
  dadosHoje: DadosWearable | null
  totalPassos: number
  totalCalorias: number
  totalMinutosAtivos: number
  mediaPassosDiarios: number
  diasRegistrados: number
}

export function WearableSync() {
  const [dispositivos, setDispositivos] = useState<WearableDevice[]>([])
  const [dados, setDados] = useState<DadosWearable[]>([])
  const [metas, setMetas] = useState<MetasWearable>(METAS_PADRAO)
  const [resumo, setResumo] = useState<ResumoData | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [conectando, setConectando] = useState(false)
  const [tipoConectar, setTipoConectar] = useState<TipoWearable | null>(null)
  const [registroManual, setRegistroManual] = useState(false)

  // Form manual
  const [passosManual, setPassosManual] = useState('')
  const [caloriasManual, setCaloriasManual] = useState('')
  const [minutosManual, setMinutosManual] = useState('')
  const [sonoManual, setSonoManual] = useState('')

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const res = await fetch('/api/wearables?dias=7')
      const data = await res.json()

      setDispositivos(data.dispositivos || [])
      setDados(data.dados || [])
      setMetas(data.metas || METAS_PADRAO)
      setResumo(data.resumo || null)
      setInsights(data.insights || [])
    } catch (error) {
      console.error('Erro ao carregar:', error)
    } finally {
      setLoading(false)
    }
  }

  const conectarDispositivo = async (tipo: TipoWearable) => {
    setConectando(true)
    try {
      const config = WEARABLES_SUPORTADOS[tipo]

      // Em produção, aqui faria OAuth ou conexão Bluetooth real
      // Por agora, simula a conexão
      const res = await fetch('/api/wearables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'conectar',
          tipo,
          nome: config.nome,
          modelo: 'Modelo genérico'
        })
      })

      if (res.ok) {
        alert(`${config.nome} conectado com sucesso!`)
        await carregarDados()
        setTipoConectar(null)
      }
    } catch (error) {
      console.error('Erro ao conectar:', error)
      alert('Erro ao conectar dispositivo')
    } finally {
      setConectando(false)
    }
  }

  const desconectarDispositivo = async (id: string) => {
    if (!confirm('Desconectar este dispositivo?')) return

    try {
      await fetch(`/api/wearables?id=${id}`, { method: 'DELETE' })
      await carregarDados()
    } catch (error) {
      console.error('Erro ao desconectar:', error)
    }
  }

  const registrarDadosManual = async () => {
    try {
      const res = await fetch('/api/wearables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'registrar_manual',
          passos: parseInt(passosManual) || 0,
          calorias_queimadas: parseInt(caloriasManual) || 0,
          minutos_ativos: parseInt(minutosManual) || 0,
          sono_horas: parseFloat(sonoManual) || null,
        })
      })

      if (res.ok) {
        alert('Dados registrados!')
        await carregarDados()
        setRegistroManual(false)
        setPassosManual('')
        setCaloriasManual('')
        setMinutosManual('')
        setSonoManual('')
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const sincronizarDispositivo = async (deviceId: string) => {
    // Em produção, buscaria dados reais do dispositivo via API
    // Por agora, simula dados
    const dadosSimulados = [{
      data: new Date().toISOString().split('T')[0],
      passos: Math.floor(Math.random() * 5000) + 5000,
      calorias_queimadas: Math.floor(Math.random() * 300) + 200,
      distancia_km: Math.random() * 5 + 2,
      minutos_ativos: Math.floor(Math.random() * 30) + 15,
      frequencia_cardiaca_media: Math.floor(Math.random() * 20) + 70,
      sono_horas: Math.random() * 2 + 6,
    }]

    try {
      const res = await fetch('/api/wearables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao: 'sincronizar',
          device_id: deviceId,
          dados: dadosSimulados
        })
      })

      if (res.ok) {
        alert('Sincronizado!')
        await carregarDados()
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }

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
      {/* Score de hoje */}
      {resumo && resumo.scoreHoje > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="py-6">
            <div className="text-center mb-4">
              <p className="text-5xl font-bold text-blue-600">{resumo.scoreHoje}</p>
              <p className="text-sm text-muted-foreground">Score de Atividade Hoje</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {resumo.detalhesHoje.map((d, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl mb-1">{d.icone}</div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${d.percentual}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1">{Math.round(d.percentual)}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo da semana */}
      {resumo && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {resumo.totalPassos.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">👣 Passos (7 dias)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {resumo.totalCalorias.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">🔥 Calorias queimadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {resumo.mediaPassosDiarios.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">📊 Média diária</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {resumo.totalMinutosAtivos}
              </p>
              <p className="text-xs text-muted-foreground">⏱️ Minutos ativos</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">💡 Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <p key={i} className="text-sm p-2 bg-muted rounded-lg">
                  {insight}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispositivos conectados */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Dispositivos</span>
            {dispositivos.length > 0 && (
              <Badge variant="secondary">{dispositivos.length} conectado(s)</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dispositivos.map((device) => {
            const config = WEARABLES_SUPORTADOS[device.tipo]
            return (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${config.cor} flex items-center justify-center text-white`}>
                    {config.icone}
                  </div>
                  <div>
                    <p className="font-medium">{device.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Última sync: {device.ultima_sincronizacao
                        ? new Date(device.ultima_sincronizacao).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sincronizarDispositivo(device.id)}
                  >
                    🔄
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => desconectarDispositivo(device.id)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Adicionar dispositivo */}
          {!tipoConectar ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setTipoConectar('apple_watch')}
            >
              ➕ Conectar Dispositivo
            </Button>
          ) : (
            <div className="space-y-3 p-4 border rounded-lg">
              <p className="font-medium">Selecione seu dispositivo:</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(WEARABLES_SUPORTADOS) as TipoWearable[]).map((tipo) => {
                  const config = WEARABLES_SUPORTADOS[tipo]
                  return (
                    <button
                      key={tipo}
                      onClick={() => conectarDispositivo(tipo)}
                      disabled={conectando}
                      className="p-3 rounded-lg border hover:border-primary text-left transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{config.icone}</span>
                        <span className="font-medium text-sm">{config.nome}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setTipoConectar(null)}
              >
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registro Manual */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">✍️ Registro Manual</CardTitle>
        </CardHeader>
        <CardContent>
          {!registroManual ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setRegistroManual(true)}
            >
              Registrar dados manualmente
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Passos</label>
                  <Input
                    type="number"
                    placeholder="Ex: 8000"
                    value={passosManual}
                    onChange={(e) => setPassosManual(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Calorias</label>
                  <Input
                    type="number"
                    placeholder="Ex: 350"
                    value={caloriasManual}
                    onChange={(e) => setCaloriasManual(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Min. ativos</label>
                  <Input
                    type="number"
                    placeholder="Ex: 45"
                    value={minutosManual}
                    onChange={(e) => setMinutosManual(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Horas sono</label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 7.5"
                    value={sonoManual}
                    onChange={(e) => setSonoManual(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setRegistroManual(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={registrarDadosManual}
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">📊 Últimos 7 dias</CardTitle>
        </CardHeader>
        <CardContent>
          {dados.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum dado registrado ainda
            </p>
          ) : (
            <div className="space-y-2">
              {dados.slice().reverse().map((d, i) => {
                const score = calcularScoreAtividade(d, metas)
                const dataBR = new Date(d.data).toLocaleDateString('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: '2-digit'
                })

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{dataBR}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.passos.toLocaleString()} passos • {d.calorias_queimadas} kcal
                        {d.sono_horas && ` • ${d.sono_horas}h sono`}
                      </p>
                    </div>
                    <Badge
                      variant={score.score >= 80 ? 'default' : score.score >= 50 ? 'secondary' : 'outline'}
                    >
                      {score.score}%
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">🎯 Suas Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{metas.passos_diarios.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">👣 Passos/dia</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{metas.calorias_diarias}</p>
              <p className="text-xs text-muted-foreground">🔥 Calorias/dia</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{metas.minutos_ativos}</p>
              <p className="text-xs text-muted-foreground">⏱️ Min. ativos</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{metas.sono_horas}h</p>
              <p className="text-xs text-muted-foreground">😴 Sono</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WearableSync
