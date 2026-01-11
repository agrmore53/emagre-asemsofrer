'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Scale, Ruler, Calendar } from 'lucide-react'

interface FormularioRegistroProps {
  onSuccess?: () => void
}

export function FormularioRegistro({ onSuccess }: FormularioRegistroProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [pesoKg, setPesoKg] = useState('')
  const [cinturaCm, setCinturaCm] = useState('')
  const [quadrilCm, setQuadrilCm] = useState('')
  const [bracoCm, setBracoCm] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [mostrarMedidas, setMostrarMedidas] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pesoKg) {
      toast.error('Informe o peso')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data,
          peso_kg: parseFloat(pesoKg),
          cintura_cm: cinturaCm ? parseFloat(cinturaCm) : null,
          quadril_cm: quadrilCm ? parseFloat(quadrilCm) : null,
          braco_cm: bracoCm ? parseFloat(bracoCm) : null,
          observacoes: observacoes || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar')
      }

      toast.success('Registro salvo com sucesso!')

      // Limpa o formulário
      setPesoKg('')
      setCinturaCm('')
      setQuadrilCm('')
      setBracoCm('')
      setObservacoes('')
      setMostrarMedidas(false)

      router.refresh()
      onSuccess?.()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar registro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Novo Registro
        </CardTitle>
        <CardDescription>
          Registre seu peso e medidas para acompanhar sua evolução
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            {/* Peso */}
            <div className="space-y-2">
              <Label htmlFor="peso" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Peso (kg) *
              </Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="30"
                max="300"
                placeholder="Ex: 75.5"
                value={pesoKg}
                onChange={(e) => setPesoKg(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Toggle medidas */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMostrarMedidas(!mostrarMedidas)}
            className="text-muted-foreground"
          >
            <Ruler className="h-4 w-4 mr-2" />
            {mostrarMedidas ? 'Ocultar medidas' : 'Adicionar medidas (opcional)'}
          </Button>

          {/* Medidas opcionais */}
          {mostrarMedidas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="cintura">Cintura (cm)</Label>
                <Input
                  id="cintura"
                  type="number"
                  step="0.5"
                  min="40"
                  max="200"
                  placeholder="Ex: 80"
                  value={cinturaCm}
                  onChange={(e) => setCinturaCm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quadril">Quadril (cm)</Label>
                <Input
                  id="quadril"
                  type="number"
                  step="0.5"
                  min="50"
                  max="200"
                  placeholder="Ex: 95"
                  value={quadrilCm}
                  onChange={(e) => setQuadrilCm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="braco">Braço (cm)</Label>
                <Input
                  id="braco"
                  type="number"
                  step="0.5"
                  min="15"
                  max="60"
                  placeholder="Ex: 30"
                  value={bracoCm}
                  onChange={(e) => setBracoCm(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Input
              id="observacoes"
              type="text"
              placeholder="Ex: Dia de churrasco ontem, normal reter líquido"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              maxLength={200}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
