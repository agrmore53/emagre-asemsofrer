'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  SleepAnalysis,
  QUALIDADE_LABELS,
  getScoreColor,
  getScoreBg,
  getScoreEmoji,
} from '@/lib/sleep'

interface SleepData {
  registros: Array<{
    id: string
    data: string
    hora_dormir: string
    hora_acordar: string
    qualidade: number
    score: number
    analise: SleepAnalysis
  }>
  registro_hoje: {
    score: number
    analise: SleepAnalysis
  } | null
  estatisticas: {
    media_duracao: number
    media_qualidade: number
    media_score: number
  } | null
}

export function SleepTracker() {
  const [data, setData] = useState<SleepData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form
  const [horaDormir, setHoraDormir] = useState('23:00')
  const [horaAcordar, setHoraAcordar] = useState('07:00')
  const [qualidade, setQualidade] = useState(3)
  const [acordouNoite, setAcordouNoite] = useState(0)
  const [latencia, setLatencia] = useState(15)
  const [usouTela, setUsouTela] = useState(false)
  const [cafeinaTarde, setCafeinaTarde] = useState(false)
  const [exercicioDia, setExercicioDia] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sleep')
      const result = await response.json()
      if (response.ok) {
        setData(result)
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hora_dormir: horaDormir,
          hora_acordar: horaAcordar,
          qualidade,
          acordou_noite: acordouNoite,
          latencia_minutos: latencia,
          usou_tela_antes: usouTela,
          cafeina_tarde: cafeinaTarde,
          exercicio_dia: exercicioDia,
        }),
      })

      if (response.ok) {
        setShowForm(false)
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Registro de hoje */}
        {data?.registro_hoje ? (
          <Card className={getScoreBg(data.registro_hoje.score)}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Sono de Ontem à Noite</span>
                <span className="text-3xl">{getScoreEmoji(data.registro_hoje.score)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className={`text-5xl font-bold ${getScoreColor(data.registro_hoje.score)}`}>
                  {data.registro_hoje.score}
                </p>
                <p className="text-sm text-muted-foreground">Sleep Score</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-background rounded-lg">
                  <p className="text-xl font-bold">
                    {data.registro_hoje.analise.duracao_horas}h
                  </p>
                  <p className="text-xs text-muted-foreground">Duração</p>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <Badge
                    className={
                      data.registro_hoje.analise.impacto_metabolismo === 'positivo'
                        ? 'bg-green-100 text-green-800'
                        : data.registro_hoje.analise.impacto_metabolismo === 'negativo'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {data.registro_hoje.analise.impacto_metabolismo === 'positivo'
                      ? '📈 Positivo'
                      : data.registro_hoje.analise.impacto_metabolismo === 'negativo'
                      ? '📉 Negativo'
                      : '➡️ Neutro'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Impacto no metabolismo
                  </p>
                </div>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <p className="font-medium text-sm mb-1">Impacto na Fome</p>
                <p className="text-sm text-muted-foreground">
                  {data.registro_hoje.analise.fator_fome}
                </p>
              </div>

              {data.registro_hoje.analise.dicas.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2">Dicas para Hoje</p>
                  <ul className="space-y-1">
                    {data.registro_hoje.analise.dicas.map((dica, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span>💡</span>
                        <span>{dica}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <span className="text-4xl">😴</span>
              <h3 className="text-lg font-semibold mt-2">Registre seu sono</h3>
              <p className="text-muted-foreground mt-1">
                Como foi sua noite de sono?
              </p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                Registrar Sono
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas */}
        {data?.estatisticas && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Últimas 2 Semanas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">
                    {data.estatisticas.media_duracao.toFixed(1)}h
                  </p>
                  <p className="text-xs text-muted-foreground">Média duração</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {data.estatisticas.media_qualidade.toFixed(1)}/5
                  </p>
                  <p className="text-xs text-muted-foreground">Qualidade média</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${getScoreColor(data.estatisticas.media_score)}`}>
                    {Math.round(data.estatisticas.media_score)}
                  </p>
                  <p className="text-xs text-muted-foreground">Score médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        {data?.registros && data.registros.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Histórico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.registros.slice(0, 7).map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(reg.data).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reg.hora_dormir} - {reg.hora_acordar}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getScoreColor(reg.score)}`}>
                        {reg.score}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reg.analise.duracao_horas}h
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {data?.registro_hoje && (
          <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
            Editar registro de hoje
          </Button>
        )}
      </div>

      {/* Modal de registro */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Sono</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hora que dormiu</Label>
                <Input
                  type="time"
                  value={horaDormir}
                  onChange={(e) => setHoraDormir(e.target.value)}
                />
              </div>
              <div>
                <Label>Hora que acordou</Label>
                <Input
                  type="time"
                  value={horaAcordar}
                  onChange={(e) => setHoraAcordar(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Qualidade do sono</Label>
              <div className="flex gap-2 mt-2">
                {QUALIDADE_LABELS.map((q) => (
                  <Button
                    key={q.value}
                    variant={qualidade === q.value ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setQualidade(q.value)}
                  >
                    {q.emoji}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {QUALIDADE_LABELS.find((q) => q.value === qualidade)?.label}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Acordou quantas vezes?</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={acordouNoite}
                  onChange={(e) => setAcordouNoite(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Min p/ pegar no sono</Label>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  value={latencia}
                  onChange={(e) => setLatencia(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="tela"
                  checked={usouTela}
                  onCheckedChange={(c) => setUsouTela(c as boolean)}
                />
                <label htmlFor="tela" className="text-sm cursor-pointer">
                  Usou tela antes de dormir
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="cafeina"
                  checked={cafeinaTarde}
                  onCheckedChange={(c) => setCafeinaTarde(c as boolean)}
                />
                <label htmlFor="cafeina" className="text-sm cursor-pointer">
                  Tomou café/energético à tarde
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="exercicio"
                  checked={exercicioDia}
                  onCheckedChange={(c) => setExercicioDia(c as boolean)}
                />
                <label htmlFor="exercicio" className="text-sm cursor-pointer">
                  Fez exercício físico ontem
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SleepTracker
