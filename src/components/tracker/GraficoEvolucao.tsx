'use client'

import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TrackerRegistro } from '@/types'

interface GraficoEvolucaoProps {
  registros: TrackerRegistro[]
  pesoMeta?: number | null
}

export function GraficoEvolucao({ registros, pesoMeta }: GraficoEvolucaoProps) {
  // Ordena por data crescente para o gráfico
  const dadosOrdenados = useMemo(() => {
    return [...registros]
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .map((reg) => ({
        ...reg,
        dataFormatada: format(parseISO(reg.data), 'dd/MM', { locale: ptBR }),
        dataCompleta: format(parseISO(reg.data), "dd 'de' MMMM", { locale: ptBR }),
      }))
  }, [registros])

  // Calcula min/max para o eixo Y
  const { minPeso, maxPeso } = useMemo(() => {
    if (dadosOrdenados.length === 0) return { minPeso: 50, maxPeso: 100 }

    const pesos = dadosOrdenados.map((d) => d.peso_kg)
    const min = Math.min(...pesos)
    const max = Math.max(...pesos)

    // Adiciona margem
    return {
      minPeso: Math.floor(min - 2),
      maxPeso: Math.ceil(max + 2),
    }
  }, [dadosOrdenados])

  // Calcula estatísticas de medidas
  const temMedidas = dadosOrdenados.some(
    (d) => d.cintura_cm || d.quadril_cm || d.braco_cm
  )

  if (registros.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Evolução</CardTitle>
          <CardDescription>
            Registre seu primeiro peso para ver o gráfico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Nenhum registro ainda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof dadosOrdenados[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.dataCompleta}</p>
          <p className="text-primary font-bold">{data.peso_kg} kg</p>
          {data.cintura_cm && <p className="text-sm text-muted-foreground">Cintura: {data.cintura_cm} cm</p>}
          {data.quadril_cm && <p className="text-sm text-muted-foreground">Quadril: {data.quadril_cm} cm</p>}
          {data.braco_cm && <p className="text-sm text-muted-foreground">Braço: {data.braco_cm} cm</p>}
          {data.observacoes && (
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
              {data.observacoes}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Evolução</CardTitle>
        <CardDescription>
          Acompanhe sua jornada ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="peso">
          <TabsList className="mb-4">
            <TabsTrigger value="peso">Peso</TabsTrigger>
            {temMedidas && <TabsTrigger value="medidas">Medidas</TabsTrigger>}
          </TabsList>

          <TabsContent value="peso">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dadosOrdenados}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="dataFormatada"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[minPeso, maxPeso]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}kg`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Linha de meta */}
                  {pesoMeta && (
                    <ReferenceLine
                      y={pesoMeta}
                      stroke="#22c55e"
                      strokeDasharray="5 5"
                      label={{
                        value: `Meta: ${pesoMeta}kg`,
                        position: 'right',
                        fill: '#22c55e',
                        fontSize: 12,
                      }}
                    />
                  )}

                  <Line
                    type="monotone"
                    dataKey="peso_kg"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {temMedidas && (
            <TabsContent value="medidas">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dadosOrdenados}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="dataFormatada"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}cm`}
                    />
                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="cintura_cm"
                      name="Cintura"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 3 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="quadril_cm"
                      name="Quadril"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 3 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="braco_cm"
                      name="Braço"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', r: 3 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Cintura</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span>Quadril</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span>Braço</span>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
