'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FaseCiclo,
  FASES_CICLO,
  RECOMENDACOES_POR_FASE,
  SINTOMAS_POR_FASE,
  RecomendacaoNutricional,
} from '@/lib/ciclo-menstrual'

interface CicloData {
  configurado: boolean
  config?: {
    duracao_ciclo: number
    duracao_menstruacao: number
    ultima_menstruacao: string
  }
  fase_atual?: {
    fase: FaseCiclo
    nome: string
    descricao: string
    emoji: string
    cor: string
    dia_atual: number
    dias_para_proxima_fase: number
    proxima_fase: FaseCiclo
    energia: string
    metabolismo: string
  }
  recomendacoes?: RecomendacaoNutricional
  proxima_menstruacao?: string
  dias_para_menstruacao?: number
}

export function CicloTracker() {
  const [data, setData] = useState<CicloData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfig, setShowConfig] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showRecomendacoes, setShowRecomendacoes] = useState(false)

  // Form
  const [ultimaMenstruacao, setUltimaMenstruacao] = useState('')
  const [duracaoCiclo, setDuracaoCiclo] = useState(28)
  const [duracaoMenstruacao, setDuracaoMenstruacao] = useState(5)
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([])

  useEffect(() => {
    fetchCiclo()
  }, [])

  const fetchCiclo = async () => {
    try {
      const response = await fetch('/api/ciclo-menstrual')
      const result = await response.json()
      setData(result)

      if (result.config) {
        setUltimaMenstruacao(result.config.ultima_menstruacao)
        setDuracaoCiclo(result.config.duracao_ciclo)
        setDuracaoMenstruacao(result.config.duracao_menstruacao)
      }
    } catch (error) {
      console.error('Erro ao buscar ciclo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/ciclo-menstrual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ultima_menstruacao: ultimaMenstruacao,
          duracao_ciclo: duracaoCiclo,
          duracao_menstruacao: duracaoMenstruacao,
          sintomas: sintomasSelecionados,
        }),
      })

      if (response.ok) {
        setShowConfig(false)
        fetchCiclo()
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
    } finally {
      setSaving(false)
    }
  }

  const getEnergiaIcon = (energia: string) => {
    switch (energia) {
      case 'baixa':
        return '🔋'
      case 'media':
        return '⚡'
      case 'alta':
        return '💪'
      case 'variavel':
        return '🔄'
      default:
        return '❓'
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

  // Não configurado
  if (!data?.configurado) {
    return (
      <>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-4xl mb-4">🌸</p>
            <h3 className="text-lg font-semibold mb-2">
              Sincronize seu Ciclo Menstrual
            </h3>
            <p className="text-muted-foreground mb-4">
              Receba recomendações nutricionais personalizadas para cada fase do seu ciclo
            </p>
            <Button onClick={() => setShowConfig(true)}>Configurar Ciclo</Button>
          </CardContent>
        </Card>

        <ConfigModal
          open={showConfig}
          onOpenChange={setShowConfig}
          ultimaMenstruacao={ultimaMenstruacao}
          setUltimaMenstruacao={setUltimaMenstruacao}
          duracaoCiclo={duracaoCiclo}
          setDuracaoCiclo={setDuracaoCiclo}
          duracaoMenstruacao={duracaoMenstruacao}
          setDuracaoMenstruacao={setDuracaoMenstruacao}
          sintomasSelecionados={sintomasSelecionados}
          setSintomasSelecionados={setSintomasSelecionados}
          onSave={handleSave}
          saving={saving}
        />
      </>
    )
  }

  const fase = data.fase_atual!
  const faseInfo = FASES_CICLO[fase.fase]
  const recomendacoes = data.recomendacoes!

  return (
    <>
      <div className="space-y-4">
        {/* Card principal da fase */}
        <Card className={`border-2 ${fase.cor.replace('text-', 'border-')}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{fase.emoji}</span>
                {fase.nome}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowConfig(true)}>
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{fase.descricao}</p>

            {/* Status do ciclo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">Dia {fase.dia_atual}</p>
                <p className="text-xs text-muted-foreground">do ciclo</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold">{data.dias_para_menstruacao}</p>
                <p className="text-xs text-muted-foreground">dias para próxima menstruação</p>
              </div>
            </div>

            {/* Energia e metabolismo */}
            <div className="flex gap-2">
              <Badge variant="secondary">
                {getEnergiaIcon(fase.energia)} Energia {fase.energia}
              </Badge>
              <Badge variant="outline">{fase.metabolismo}</Badge>
            </div>

            {/* Próxima fase */}
            <div className="text-sm text-muted-foreground">
              Em {fase.dias_para_proxima_fase} dias:{' '}
              <span className="font-medium">
                {FASES_CICLO[fase.proxima_fase].emoji}{' '}
                {FASES_CICLO[fase.proxima_fase].nome}
              </span>
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowRecomendacoes(true)}
            >
              Ver Recomendações Nutricionais
            </Button>
          </CardContent>
        </Card>

        {/* Quick tips */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dicas para Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recomendacoes.dicas.slice(0, 3).map((dica, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <span>💡</span>
                  <span>{dica}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Alimentos recomendados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Priorize Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recomendacoes.alimentos_recomendados.slice(0, 6).map((alimento) => (
                <Badge key={alimento} variant="secondary">
                  {alimento}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de configuração */}
      <ConfigModal
        open={showConfig}
        onOpenChange={setShowConfig}
        ultimaMenstruacao={ultimaMenstruacao}
        setUltimaMenstruacao={setUltimaMenstruacao}
        duracaoCiclo={duracaoCiclo}
        setDuracaoCiclo={setDuracaoCiclo}
        duracaoMenstruacao={duracaoMenstruacao}
        setDuracaoMenstruacao={setDuracaoMenstruacao}
        sintomasSelecionados={sintomasSelecionados}
        setSintomasSelecionados={setSintomasSelecionados}
        onSave={handleSave}
        saving={saving}
      />

      {/* Modal de recomendações completas */}
      <Dialog open={showRecomendacoes} onOpenChange={setShowRecomendacoes}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{fase.emoji}</span>
              Nutrição para {fase.nome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Calorias */}
            {recomendacoes.calorias_ajuste !== 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Ajuste de Calorias</p>
                <p className="text-sm text-muted-foreground">
                  {recomendacoes.calorias_ajuste > 0
                    ? `+${recomendacoes.calorias_ajuste}% - seu metabolismo está mais acelerado`
                    : `${recomendacoes.calorias_ajuste}% - metabolismo mais lento`}
                </p>
              </div>
            )}

            {/* Nutrientes foco */}
            <div>
              <p className="font-medium mb-2">Nutrientes em Foco</p>
              <div className="flex flex-wrap gap-2">
                {recomendacoes.nutrientes_foco.map((n) => (
                  <Badge key={n} className="bg-green-100 text-green-800">
                    {n}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Alimentos recomendados */}
            <div>
              <p className="font-medium mb-2">Alimentos Recomendados</p>
              <ul className="grid grid-cols-2 gap-1 text-sm">
                {recomendacoes.alimentos_recomendados.map((a) => (
                  <li key={a} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Evitar */}
            <div>
              <p className="font-medium mb-2">Evitar/Moderar</p>
              <ul className="grid grid-cols-2 gap-1 text-sm">
                {recomendacoes.alimentos_evitar.map((a) => (
                  <li key={a} className="flex items-center gap-1">
                    <span className="text-red-500">✗</span> {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Treino */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Treino Recomendado</p>
              <p className="text-sm text-muted-foreground">
                {recomendacoes.treino_recomendado}
              </p>
            </div>

            {/* Todas as dicas */}
            <div>
              <p className="font-medium mb-2">Todas as Dicas</p>
              <ul className="space-y-2">
                {recomendacoes.dicas.map((dica, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span>💡</span>
                    <span>{dica}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Modal de configuração (componente separado para clareza)
function ConfigModal({
  open,
  onOpenChange,
  ultimaMenstruacao,
  setUltimaMenstruacao,
  duracaoCiclo,
  setDuracaoCiclo,
  duracaoMenstruacao,
  setDuracaoMenstruacao,
  sintomasSelecionados,
  setSintomasSelecionados,
  onSave,
  saving,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  ultimaMenstruacao: string
  setUltimaMenstruacao: (v: string) => void
  duracaoCiclo: number
  setDuracaoCiclo: (v: number) => void
  duracaoMenstruacao: number
  setDuracaoMenstruacao: (v: number) => void
  sintomasSelecionados: string[]
  setSintomasSelecionados: (v: string[]) => void
  onSave: () => void
  saving: boolean
}) {
  const todosSintomas = [
    'Cólicas',
    'Dor de cabeça',
    'Inchaço',
    'Fadiga',
    'Alterações de humor',
    'Sensibilidade nos seios',
    'Desejos alimentares',
    'Insônia',
  ]

  const toggleSintoma = (sintoma: string) => {
    if (sintomasSelecionados.includes(sintoma)) {
      setSintomasSelecionados(sintomasSelecionados.filter((s) => s !== sintoma))
    } else {
      setSintomasSelecionados([...sintomasSelecionados, sintoma])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar Ciclo Menstrual</DialogTitle>
          <DialogDescription>
            Informe os dados do seu ciclo para recomendações personalizadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ultima">Primeiro dia da última menstruação</Label>
            <Input
              id="ultima"
              type="date"
              value={ultimaMenstruacao}
              onChange={(e) => setUltimaMenstruacao(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duracao">Duração do ciclo (dias)</Label>
              <Input
                id="duracao"
                type="number"
                min={21}
                max={35}
                value={duracaoCiclo}
                onChange={(e) => setDuracaoCiclo(parseInt(e.target.value) || 28)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Normal: 21-35 dias
              </p>
            </div>
            <div>
              <Label htmlFor="menstruacao">Dias de menstruação</Label>
              <Input
                id="menstruacao"
                type="number"
                min={2}
                max={10}
                value={duracaoMenstruacao}
                onChange={(e) => setDuracaoMenstruacao(parseInt(e.target.value) || 5)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Normal: 2-7 dias
              </p>
            </div>
          </div>

          <div>
            <Label>Sintomas comuns (opcional)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {todosSintomas.map((sintoma) => (
                <div key={sintoma} className="flex items-center gap-2">
                  <Checkbox
                    id={sintoma}
                    checked={sintomasSelecionados.includes(sintoma)}
                    onCheckedChange={() => toggleSintoma(sintoma)}
                  />
                  <label
                    htmlFor={sintoma}
                    className="text-sm cursor-pointer"
                  >
                    {sintoma}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving || !ultimaMenstruacao}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CicloTracker
