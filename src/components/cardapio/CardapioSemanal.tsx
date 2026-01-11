'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Utensils,
  RefreshCw,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { CardapioSemanal as CardapioSemanalType, CardapioDia, Refeicao } from '@/lib/utils/gerador-cardapio'

interface CardapioSemanalProps {
  cardapio: CardapioSemanalType
  onRegenerarRefeicao?: (diaIndex: number, refeicaoIndex: number) => void
}

function RefeicaoCard({
  refeicao,
  onRegenerar,
  regenerando,
}: {
  refeicao: Refeicao
  onRegenerar?: () => void
  regenerando?: boolean
}) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Utensils className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">{refeicao.nome}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {refeicao.horarioSugerido}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Flame className="h-3 w-3 mr-1" />
            {refeicao.totalCalorias} kcal
          </Badge>

          {onRegenerar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRegenerar}
              disabled={regenerando}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${regenerando ? 'animate-spin' : ''}`} />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpandido(!expandido)}
            className="h-8 w-8"
          >
            {expandido ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Lista resumida de alimentos */}
      <div className="text-sm text-muted-foreground">
        {refeicao.itens.map((item, i) => (
          <span key={item.alimento.id}>
            {item.quantidade !== 1 && `${item.quantidade}x `}
            {item.alimento.nome}
            {i < refeicao.itens.length - 1 && ', '}
          </span>
        ))}
      </div>

      {/* Detalhes expandidos */}
      {expandido && (
        <div className="pt-3 border-t space-y-3">
          {/* Macros */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 text-blue-600">
              <Dumbbell className="h-3 w-3" />
              <span>Proteína: {refeicao.totalProteinas.toFixed(1)}g</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600">
              <Wheat className="h-3 w-3" />
              <span>Carbs: {refeicao.totalCarboidratos.toFixed(1)}g</span>
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <Droplets className="h-3 w-3" />
              <span>Gordura: {refeicao.totalGorduras.toFixed(1)}g</span>
            </div>
          </div>

          {/* Lista detalhada */}
          <div className="space-y-2">
            {refeicao.itens.map((item) => (
              <div
                key={item.alimento.id}
                className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
              >
                <div>
                  <span className="font-medium">{item.alimento.nome}</span>
                  <span className="text-muted-foreground ml-2">
                    ({item.quantidade}x {item.alimento.porcao})
                  </span>
                </div>
                <span className="text-muted-foreground">{item.calorias} kcal</span>
              </div>
            ))}
          </div>

          {/* Dicas */}
          {refeicao.itens.some((i) => i.alimento.dica) && (
            <div className="text-xs text-muted-foreground bg-primary/5 p-2 rounded">
              <strong>Dicas:</strong>
              <ul className="mt-1 space-y-1">
                {refeicao.itens
                  .filter((i) => i.alimento.dica)
                  .map((i) => (
                    <li key={i.alimento.id}>
                      • <strong>{i.alimento.nome}:</strong> {i.alimento.dica}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DiaCard({
  dia,
  onRegenerarRefeicao,
}: {
  dia: CardapioDia
  onRegenerarRefeicao?: (refeicaoIndex: number) => void
}) {
  const progressoCalorias = Math.min(100, (dia.totalCalorias / dia.metaCalorias) * 100)
  const diferenca = dia.totalCalorias - dia.metaCalorias

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{dia.diaSemana}</CardTitle>
            <CardDescription>
              {new Date(dia.data).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
              })}
            </CardDescription>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">{dia.totalCalorias}</div>
            <div className="text-xs text-muted-foreground">kcal</div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Meta: {dia.metaCalorias} kcal</span>
            <span
              className={
                Math.abs(diferenca) < 100
                  ? 'text-green-600'
                  : diferenca > 0
                  ? 'text-red-600'
                  : 'text-amber-600'
              }
            >
              {diferenca > 0 ? '+' : ''}
              {diferenca} kcal
            </span>
          </div>
          <Progress value={progressoCalorias} className="h-2" />
        </div>

        {/* Macros do dia */}
        <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-bold text-blue-600">{dia.totalProteinas.toFixed(0)}g</div>
            <div className="text-xs text-muted-foreground">Proteína</div>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded">
            <div className="font-bold text-amber-600">{dia.totalCarboidratos.toFixed(0)}g</div>
            <div className="text-xs text-muted-foreground">Carbs</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="font-bold text-purple-600">{dia.totalGorduras.toFixed(0)}g</div>
            <div className="text-xs text-muted-foreground">Gordura</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {dia.refeicoes.map((refeicao, index) => (
          <RefeicaoCard
            key={refeicao.tipo}
            refeicao={refeicao}
            onRegenerar={
              onRegenerarRefeicao ? () => onRegenerarRefeicao(index) : undefined
            }
          />
        ))}
      </CardContent>
    </Card>
  )
}

export function CardapioSemanal({ cardapio, onRegenerarRefeicao }: CardapioSemanalProps) {
  const [diaAtivo, setDiaAtivo] = useState('0')

  const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="space-y-4">
      {/* Header com resumo */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Cardápio Semanal</h3>
              <p className="text-sm text-muted-foreground">{cardapio.semana}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {cardapio.mediaCaloriasDiaria}
                </div>
                <div className="text-xs text-muted-foreground">kcal/dia (média)</div>
              </div>
              {cardapio.restricoes.length > 0 && (
                <div className="flex gap-1">
                  {cardapio.restricoes.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs">
                      {r}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs dos dias */}
      <Tabs value={diaAtivo} onValueChange={setDiaAtivo}>
        <TabsList className="grid w-full grid-cols-7">
          {cardapio.dias.map((dia, index) => {
            const dataObj = new Date(dia.data)
            return (
              <TabsTrigger key={dia.data} value={index.toString()} className="text-xs px-1">
                <div className="flex flex-col items-center">
                  <span className="hidden sm:inline">{diasAbreviados[dataObj.getDay()]}</span>
                  <span className="sm:hidden">{diasAbreviados[dataObj.getDay()].charAt(0)}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {dataObj.getDate()}
                  </span>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {cardapio.dias.map((dia, diaIndex) => (
          <TabsContent key={dia.data} value={diaIndex.toString()}>
            <DiaCard
              dia={dia}
              onRegenerarRefeicao={
                onRegenerarRefeicao
                  ? (refeicaoIndex) => onRegenerarRefeicao(diaIndex, refeicaoIndex)
                  : undefined
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
