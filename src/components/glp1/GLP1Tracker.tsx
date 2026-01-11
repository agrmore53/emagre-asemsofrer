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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MedicamentoGLP1,
  MEDICAMENTOS_INFO,
  EFEITOS_COLATERAIS,
  LOCAIS_APLICACAO,
  DICAS_NUTRICAO_GLP1,
  DIAS_SEMANA,
} from '@/lib/glp1'

interface GLP1Data {
  configurado: boolean
  config?: {
    medicamento: MedicamentoGLP1
    dose: string
    dia_aplicacao: number
    hora_aplicacao: string
    info_medicamento: {
      nome: string
      emoji: string
      frequencia: 'semanal' | 'diaria'
      doses_disponiveis: string[]
    }
  }
  proxima_dose?: string
  dias_para_proxima?: number
  estatisticas?: {
    total_aplicacoes: number
    media_nausea: number
    media_apetite: number
    efeitos_comuns: { efeito: string; count: number }[]
    ultimo_registro?: string
  }
}

export function GLP1Tracker() {
  const [data, setData] = useState<GLP1Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfig, setShowConfig] = useState(false)
  const [showRegistro, setShowRegistro] = useState(false)
  const [saving, setSaving] = useState(false)

  // Config form
  const [medicamento, setMedicamento] = useState<MedicamentoGLP1>('ozempic')
  const [dose, setDose] = useState('')
  const [diaAplicacao, setDiaAplicacao] = useState(0)
  const [horaAplicacao, setHoraAplicacao] = useState('08:00')

  // Registro form
  const [localAplicacao, setLocalAplicacao] = useState('')
  const [efeitosSelecionados, setEfeitosSelecionados] = useState<string[]>([])
  const [nivelNausea, setNivelNausea] = useState(0)
  const [nivelApetite, setNivelApetite] = useState(5)
  const [notas, setNotas] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/glp1')
      const result = await response.json()
      setData(result)

      if (result.config) {
        setMedicamento(result.config.medicamento)
        setDose(result.config.dose)
        setDiaAplicacao(result.config.dia_aplicacao || 0)
        setHoraAplicacao(result.config.hora_aplicacao || '08:00')
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/glp1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usa_glp1: true,
          medicamento,
          dose,
          dia_aplicacao: diaAplicacao,
          hora_aplicacao: horaAplicacao,
        }),
      })

      if (response.ok) {
        setShowConfig(false)
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleRegistrarAplicacao = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/glp1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicamento: data?.config?.medicamento,
          dose: data?.config?.dose,
          local_aplicacao: localAplicacao,
          efeitos_colaterais: efeitosSelecionados,
          nivel_nausea: nivelNausea,
          nivel_apetite: nivelApetite,
          notas,
        }),
      })

      if (response.ok) {
        setShowRegistro(false)
        setLocalAplicacao('')
        setEfeitosSelecionados([])
        setNivelNausea(0)
        setNivelApetite(5)
        setNotas('')
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleEfeito = (efeito: string) => {
    if (efeitosSelecionados.includes(efeito)) {
      setEfeitosSelecionados(efeitosSelecionados.filter((e) => e !== efeito))
    } else {
      setEfeitosSelecionados([...efeitosSelecionados, efeito])
    }
  }

  const medInfo = MEDICAMENTOS_INFO[medicamento]

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
            <p className="text-4xl mb-4">💉</p>
            <h3 className="text-lg font-semibold mb-2">
              Acompanhamento GLP-1
            </h3>
            <p className="text-muted-foreground mb-4">
              Usa Ozempic, Wegovy, Mounjaro ou similar? <br />
              Acompanhe suas aplicações e efeitos colaterais
            </p>
            <Button onClick={() => setShowConfig(true)}>Configurar</Button>
          </CardContent>
        </Card>

        <ConfigModal
          open={showConfig}
          onOpenChange={setShowConfig}
          medicamento={medicamento}
          setMedicamento={setMedicamento}
          dose={dose}
          setDose={setDose}
          diaAplicacao={diaAplicacao}
          setDiaAplicacao={setDiaAplicacao}
          horaAplicacao={horaAplicacao}
          setHoraAplicacao={setHoraAplicacao}
          onSave={handleSaveConfig}
          saving={saving}
        />
      </>
    )
  }

  const config = data.config!
  const stats = data.estatisticas!

  return (
    <>
      <div className="space-y-4">
        {/* Card principal */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{config.info_medicamento.emoji}</span>
                {config.info_medicamento.nome}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowConfig(true)}>
                Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dose atual</span>
              <Badge variant="secondary">{config.dose}</Badge>
            </div>

            {/* Próxima dose */}
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Próxima aplicação</p>
              <p className="text-2xl font-bold">
                {data.dias_para_proxima === 0
                  ? 'Hoje!'
                  : data.dias_para_proxima === 1
                  ? 'Amanhã'
                  : `Em ${data.dias_para_proxima} dias`}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(data.proxima_dose!).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}
                {config.hora_aplicacao && ` às ${config.hora_aplicacao}`}
              </p>
            </div>

            <Button className="w-full" onClick={() => setShowRegistro(true)}>
              Registrar Aplicação
            </Button>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        {stats.total_aplicacoes > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{stats.total_aplicacoes}</p>
                  <p className="text-xs text-muted-foreground">Aplicações</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.media_nausea}/10</p>
                  <p className="text-xs text-muted-foreground">Náusea média</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.media_apetite}/10</p>
                  <p className="text-xs text-muted-foreground">Apetite médio</p>
                </div>
              </div>

              {stats.efeitos_comuns.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Efeitos mais comuns:</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.efeitos_comuns.map(({ efeito, count }) => (
                      <Badge key={efeito} variant="outline">
                        {efeito} ({count}x)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dicas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dicas Nutricionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {DICAS_NUTRICAO_GLP1.slice(0, 4).map((dica) => (
                <div key={dica.titulo} className="flex gap-3">
                  <span className="text-xl">{dica.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{dica.titulo}</p>
                    <p className="text-xs text-muted-foreground">{dica.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de configuração */}
      <ConfigModal
        open={showConfig}
        onOpenChange={setShowConfig}
        medicamento={medicamento}
        setMedicamento={setMedicamento}
        dose={dose}
        setDose={setDose}
        diaAplicacao={diaAplicacao}
        setDiaAplicacao={setDiaAplicacao}
        horaAplicacao={horaAplicacao}
        setHoraAplicacao={setHoraAplicacao}
        onSave={handleSaveConfig}
        saving={saving}
      />

      {/* Modal de registro */}
      <Dialog open={showRegistro} onOpenChange={setShowRegistro}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Aplicação</DialogTitle>
            <DialogDescription>
              {config.info_medicamento.nome} {config.dose}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Local de aplicação */}
            <div>
              <Label>Local de aplicação</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {LOCAIS_APLICACAO.map((local) => (
                  <Button
                    key={local.id}
                    variant={localAplicacao === local.id ? 'default' : 'outline'}
                    className="h-auto py-3 flex-col"
                    onClick={() => setLocalAplicacao(local.id)}
                  >
                    <span className="text-xl">{local.emoji}</span>
                    <span className="text-xs">{local.nome}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Nível de náusea */}
            <div>
              <Label>Nível de náusea (0 = nenhuma, 10 = forte)</Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">0</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={nivelNausea}
                  onChange={(e) => setNivelNausea(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-bold">{nivelNausea}</span>
              </div>
            </div>

            {/* Nível de apetite */}
            <div>
              <Label>Nível de apetite (0 = nenhum, 10 = muito)</Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">0</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={nivelApetite}
                  onChange={(e) => setNivelApetite(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-bold">{nivelApetite}</span>
              </div>
            </div>

            {/* Efeitos colaterais */}
            <div>
              <Label>Efeitos colaterais</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {EFEITOS_COLATERAIS.slice(0, 8).map((efeito) => (
                  <div key={efeito.nome} className="flex items-center gap-2">
                    <Checkbox
                      id={efeito.nome}
                      checked={efeitosSelecionados.includes(efeito.nome)}
                      onCheckedChange={() => toggleEfeito(efeito.nome)}
                    />
                    <label
                      htmlFor={efeito.nome}
                      className="text-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>{efeito.emoji}</span>
                      {efeito.nome}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div>
              <Label htmlFor="notas">Notas (opcional)</Label>
              <Input
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Observações sobre a aplicação..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegistro(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegistrarAplicacao} disabled={saving}>
              {saving ? 'Salvando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Modal de configuração
function ConfigModal({
  open,
  onOpenChange,
  medicamento,
  setMedicamento,
  dose,
  setDose,
  diaAplicacao,
  setDiaAplicacao,
  horaAplicacao,
  setHoraAplicacao,
  onSave,
  saving,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicamento: MedicamentoGLP1
  setMedicamento: (v: MedicamentoGLP1) => void
  dose: string
  setDose: (v: string) => void
  diaAplicacao: number
  setDiaAplicacao: (v: number) => void
  horaAplicacao: string
  setHoraAplicacao: (v: string) => void
  onSave: () => void
  saving: boolean
}) {
  const medInfo = MEDICAMENTOS_INFO[medicamento]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Medicamento GLP-1</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Medicamento */}
          <div>
            <Label>Medicamento</Label>
            <Select
              value={medicamento}
              onValueChange={(v) => {
                setMedicamento(v as MedicamentoGLP1)
                setDose('')
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MEDICAMENTOS_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.emoji} {info.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dose */}
          <div>
            <Label>Dose atual</Label>
            <Select value={dose} onValueChange={setDose}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a dose" />
              </SelectTrigger>
              <SelectContent>
                {medInfo.doses_disponiveis.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dia da aplicação (para semanal) */}
          {medInfo.frequencia === 'semanal' && (
            <div>
              <Label>Dia da aplicação</Label>
              <Select
                value={String(diaAplicacao)}
                onValueChange={(v) => setDiaAplicacao(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIAS_SEMANA.map((dia) => (
                    <SelectItem key={dia.value} value={String(dia.value)}>
                      {dia.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Hora */}
          <div>
            <Label>Horário preferido</Label>
            <Input
              type="time"
              value={horaAplicacao}
              onChange={(e) => setHoraAplicacao(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={saving || !dose}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GLP1Tracker
