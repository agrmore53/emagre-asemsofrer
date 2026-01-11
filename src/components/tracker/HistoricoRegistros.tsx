'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Trash2, TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react'
import type { TrackerRegistro } from '@/types'

interface HistoricoRegistrosProps {
  registros: TrackerRegistro[]
}

export function HistoricoRegistros({ registros }: HistoricoRegistrosProps) {
  const [deletando, setDeletando] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return

    setDeletando(id)

    try {
      const response = await fetch('/api/tracker', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) throw new Error('Erro ao excluir')

      toast.success('Registro excluído')
      router.refresh()
    } catch {
      toast.error('Erro ao excluir registro')
    } finally {
      setDeletando(null)
    }
  }

  // Calcula a variação em relação ao registro anterior
  const calcularVariacao = (index: number): { valor: number; tipo: 'up' | 'down' | 'same' } | null => {
    if (index >= registros.length - 1) return null

    const atual = registros[index].peso_kg
    const anterior = registros[index + 1].peso_kg
    const diferenca = atual - anterior

    if (Math.abs(diferenca) < 0.1) return { valor: 0, tipo: 'same' }
    return {
      valor: diferenca,
      tipo: diferenca > 0 ? 'up' : 'down',
    }
  }

  if (registros.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Seus registros aparecerão aqui</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhum registro encontrado
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Registros</CardTitle>
        <CardDescription>
          {registros.length} registro{registros.length !== 1 ? 's' : ''} encontrado{registros.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {registros.map((registro, index) => {
            const variacao = calcularVariacao(index)

            return (
              <div
                key={registro.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Data */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {format(parseISO(registro.data), "dd 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>

                  {/* Peso */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{registro.peso_kg}kg</span>

                    {variacao && (
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${
                          variacao.tipo === 'down'
                            ? 'text-green-600 border-green-200 bg-green-50'
                            : variacao.tipo === 'up'
                            ? 'text-red-600 border-red-200 bg-red-50'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {variacao.tipo === 'down' ? (
                          <TrendingDown className="h-3 w-3" />
                        ) : variacao.tipo === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {variacao.valor > 0 ? '+' : ''}
                        {variacao.valor.toFixed(1)}kg
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Medidas resumidas */}
                  {(registro.cintura_cm || registro.quadril_cm) && (
                    <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                      {registro.cintura_cm && <span>C: {registro.cintura_cm}cm</span>}
                      {registro.quadril_cm && <span>Q: {registro.quadril_cm}cm</span>}
                    </div>
                  )}

                  {/* Botão excluir */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(registro.id)}
                    disabled={deletando === registro.id}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
