'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TEMPLATES_DESAFIOS, TipoDesafio } from '@/lib/challenges'

interface CreateChallengeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (challenge: { id: string; codigo_convite: string }) => void
}

export function CreateChallengeModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateChallengeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tipo: 'peso' as TipoDesafio,
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    premio_descricao: '',
    max_participantes: 50,
    privado: true,
  })

  const handleTemplateSelect = (index: number) => {
    const template = TEMPLATES_DESAFIOS[index]
    const dataFim = new Date()
    dataFim.setDate(dataFim.getDate() + template.duracao_dias)

    setFormData({
      ...formData,
      nome: template.nome,
      descricao: template.descricao,
      tipo: template.tipo,
      data_fim: dataFim.toISOString().split('T')[0],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar desafio')
      }

      onSuccess?.({
        id: data.challenge.id,
        codigo_convite: data.codigo_convite,
      })
      onOpenChange(false)

      // Reset form
      setFormData({
        nome: '',
        descricao: '',
        tipo: 'peso',
        data_inicio: new Date().toISOString().split('T')[0],
        data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        premio_descricao: '',
        max_participantes: 50,
        privado: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar desafio')
    } finally {
      setLoading(false)
    }
  }

  const tipoOptions = [
    { value: 'peso', label: '⚖️ Perda de Peso', desc: 'Quem perder mais % ganha' },
    { value: 'streak', label: '🔥 Streak', desc: 'Maior sequência de dias' },
    { value: 'passos', label: '👣 Passos', desc: 'Quem andar mais ganha' },
    { value: 'agua', label: '💧 Hidratação', desc: 'Beber água diariamente' },
    { value: 'refeicoes', label: '🍽️ Refeições', desc: 'Registrar todas refeições' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Desafio</DialogTitle>
          <DialogDescription>
            Crie um desafio e convide amigos para competir
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Templates rápidos */}
          <div>
            <Label className="text-sm text-muted-foreground">
              Usar template:
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TEMPLATES_DESAFIOS.map((template, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(index)}
                >
                  {template.nome}
                </Button>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome do Desafio *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              placeholder="Ex: Desafio de Verão 2025"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descreva o desafio..."
              rows={2}
            />
          </div>

          {/* Tipo */}
          <div>
            <Label>Tipo de Desafio</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) =>
                setFormData({ ...formData, tipo: value as TipoDesafio })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tipoOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {opt.desc}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio">Data de Início *</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, data_inicio: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="data_fim">Data de Término *</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) =>
                  setFormData({ ...formData, data_fim: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Prêmio */}
          <div>
            <Label htmlFor="premio">Prêmio (opcional)</Label>
            <Input
              id="premio"
              value={formData.premio_descricao}
              onChange={(e) =>
                setFormData({ ...formData, premio_descricao: e.target.value })
              }
              placeholder="Ex: Jantar pago pelo perdedor"
            />
          </div>

          {/* Max participantes */}
          <div>
            <Label htmlFor="max">Máximo de Participantes</Label>
            <Input
              id="max"
              type="number"
              min={2}
              max={100}
              value={formData.max_participantes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_participantes: parseInt(e.target.value) || 50,
                })
              }
            />
          </div>

          {/* Privado */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Desafio Privado</Label>
              <p className="text-sm text-muted-foreground">
                Apenas pessoas com código podem entrar
              </p>
            </div>
            <Switch
              checked={formData.privado}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, privado: checked })
              }
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Desafio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChallengeModal
