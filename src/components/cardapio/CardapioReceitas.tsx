'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  RefreshCw,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  ChevronDown,
  ChevronUp,
  Eye,
  TrendingUp,
  Target,
  Utensils,
} from 'lucide-react'
import { CardReceita, DialogReceita } from './CardReceita'
import type {
  CardapioDiaReceitas,
  CardapioMensal,
  RefeicaoCardapio,
} from '@/lib/cardapio/motor-recomendacao'

// Componente para refeição individual
function RefeicaoReceitaCard({
  refeicao,
  onTrocar,
}: {
  refeicao: RefeicaoCardapio
  onTrocar?: () => void
}) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{refeicao.receita.imagemPlaceholder || '🍽️'}</span>
          <div>
            <h4 className="font-medium">{refeicao.nome}</h4>
            <p className="text-sm text-muted-foreground">{refeicao.receita.nome}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Flame className="h-3 w-3 mr-1" />
            {refeicao.nutrientes.calorias} kcal
          </Badge>

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {refeicao.receita.tempoPreparo + refeicao.receita.tempoCozimento}min
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {refeicao.receita.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag.replace('_', ' ')}
          </Badge>
        ))}
      </div>

      {/* Macros resumidos */}
      <div className="grid grid-cols-4 gap-2 text-xs text-center">
        <div className="p-1.5 bg-red-50 rounded">
          <p className="font-bold text-red-600">{refeicao.nutrientes.proteinas}g</p>
          <p className="text-muted-foreground">prot</p>
        </div>
        <div className="p-1.5 bg-amber-50 rounded">
          <p className="font-bold text-amber-600">{refeicao.nutrientes.carboidratos}g</p>
          <p className="text-muted-foreground">carb</p>
        </div>
        <div className="p-1.5 bg-blue-50 rounded">
          <p className="font-bold text-blue-600">{refeicao.nutrientes.gorduras}g</p>
          <p className="text-muted-foreground">gord</p>
        </div>
        <div className="p-1.5 bg-green-50 rounded">
          <p className="font-bold text-green-600">{refeicao.nutrientes.fibras}g</p>
          <p className="text-muted-foreground">fibra</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        <DialogReceita
          receita={refeicao.receita}
          porcoes={refeicao.porcoes}
          nutrientes={refeicao.nutrientes}
          trigger={
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-1" />
              Ver Receita
            </Button>
          }
        />
        {onTrocar && (
          <Button variant="ghost" size="sm" onClick={onTrocar}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Componente para um dia do cardápio
function DiaCardapioReceitas({
  dia,
  onTrocarRefeicao,
}: {
  dia: CardapioDiaReceitas
  onTrocarRefeicao?: (index: number) => void
}) {
  const progressoCalorias = Math.min(100, dia.percentualMeta)
  const diferenca = dia.totais.calorias - dia.metaCalorias

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
            <div className="text-2xl font-bold">{dia.totais.calorias}</div>
            <div className="text-xs text-muted-foreground">kcal total</div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-1 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Meta: {dia.metaCalorias} kcal
            </span>
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
        <div className="grid grid-cols-4 gap-2 pt-2 text-sm">
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <Dumbbell className="h-4 w-4 mx-auto text-red-500 mb-1" />
            <div className="font-bold text-red-600">{dia.totais.proteinas.toFixed(0)}g</div>
            <div className="text-xs text-muted-foreground">Proteina</div>
          </div>
          <div className="text-center p-2 bg-amber-50 rounded-lg">
            <Wheat className="h-4 w-4 mx-auto text-amber-500 mb-1" />
            <div className="font-bold text-amber-600">{dia.totais.carboidratos.toFixed(0)}g</div>
            <div className="text-xs text-muted-foreground">Carbs</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <Droplets className="h-4 w-4 mx-auto text-blue-500 mb-1" />
            <div className="font-bold text-blue-600">{dia.totais.gorduras.toFixed(0)}g</div>
            <div className="text-xs text-muted-foreground">Gordura</div>
          </div>
          <div className="text-center p-2 bg-cyan-50 rounded-lg">
            <Droplets className="h-4 w-4 mx-auto text-cyan-500 mb-1" />
            <div className="font-bold text-cyan-600">{dia.totais.agua}</div>
            <div className="text-xs text-muted-foreground">ml agua</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {dia.refeicoes.map((refeicao, index) => (
          <RefeicaoReceitaCard
            key={`${refeicao.tipo}-${index}`}
            refeicao={refeicao}
            onTrocar={onTrocarRefeicao ? () => onTrocarRefeicao(index) : undefined}
          />
        ))}
      </CardContent>
    </Card>
  )
}

// Componente principal para cardápio semanal com receitas
interface CardapioReceitasProps {
  dias: CardapioDiaReceitas[]
  estatisticas?: {
    mediaCaloriasDiaria: number
    mediaProteinasDiaria: number
    receitasUnicas: number
    variedade: number
  }
  onTrocarRefeicao?: (diaIndex: number, refeicaoIndex: number) => void
}

export function CardapioReceitas({
  dias,
  estatisticas,
  onTrocarRefeicao,
}: CardapioReceitasProps) {
  const [diaAtivo, setDiaAtivo] = useState('0')
  const diasAbreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

  // Calcula estatísticas se não fornecidas
  const stats = estatisticas || {
    mediaCaloriasDiaria: Math.round(
      dias.reduce((sum, d) => sum + d.totais.calorias, 0) / dias.length
    ),
    mediaProteinasDiaria: Math.round(
      dias.reduce((sum, d) => sum + d.totais.proteinas, 0) / dias.length
    ),
    receitasUnicas: new Set(dias.flatMap((d) => d.refeicoes.map((r) => r.receita.id))).size,
    variedade: 85,
  }

  return (
    <div className="space-y-4">
      {/* Header com resumo */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-600" />
                Seu Cardapio Personalizado
              </h3>
              <p className="text-sm text-muted-foreground">
                {dias.length} dias de refeicoes planejadas
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.mediaCaloriasDiaria}
                </div>
                <div className="text-xs text-muted-foreground">kcal/dia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.mediaProteinasDiaria}g
                </div>
                <div className="text-xs text-muted-foreground">prot/dia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.receitasUnicas}
                </div>
                <div className="text-xs text-muted-foreground">receitas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {stats.variedade}%
                </div>
                <div className="text-xs text-muted-foreground">variedade</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs dos dias */}
      <Tabs value={diaAtivo} onValueChange={setDiaAtivo}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(dias.length, 7)}, 1fr)` }}>
          {dias.slice(0, 7).map((dia, index) => {
            const dataObj = new Date(dia.data)
            return (
              <TabsTrigger
                key={dia.data}
                value={index.toString()}
                className="text-xs px-1"
              >
                <div className="flex flex-col items-center">
                  <span className="hidden sm:inline">
                    {diasAbreviados[dataObj.getDay()]}
                  </span>
                  <span className="sm:hidden">
                    {diasAbreviados[dataObj.getDay()].charAt(0)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {dataObj.getDate()}
                  </span>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {dias.slice(0, 7).map((dia, diaIndex) => (
          <TabsContent key={dia.data} value={diaIndex.toString()}>
            <DiaCardapioReceitas
              dia={dia}
              onTrocarRefeicao={
                onTrocarRefeicao
                  ? (refeicaoIndex) => onTrocarRefeicao(diaIndex, refeicaoIndex)
                  : undefined
              }
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Se for mensal, mostra navegação adicional */}
      {dias.length > 7 && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              <Calendar className="h-4 w-4 inline mr-2" />
              Este cardapio inclui {dias.length} dias de refeicoes.
              Use a navegacao acima para ver a primeira semana.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente para exibir cardápio mensal completo
export function CardapioMensalView({
  cardapio,
  onTrocarRefeicao,
}: {
  cardapio: CardapioMensal
  onTrocarRefeicao?: (diaIndex: number, refeicaoIndex: number) => void
}) {
  const [semanaAtiva, setSemanaAtiva] = useState(0)

  const semanas = [
    { inicio: 0, fim: 7 },
    { inicio: 7, fim: 14 },
    { inicio: 14, fim: 21 },
    { inicio: 21, fim: 30 },
  ]

  return (
    <div className="space-y-4">
      {/* Estatísticas do mês */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/5 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Cardapio Mensal
              </h3>
              <p className="text-sm text-muted-foreground">{cardapio.mes}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {cardapio.estatisticas.mediaCaloriasDiaria}
                </div>
                <div className="text-xs text-muted-foreground">kcal/dia</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {cardapio.estatisticas.mediaProteinasDiaria}g
                </div>
                <div className="text-xs text-muted-foreground">prot/dia</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {cardapio.estatisticas.receitasUnicas}
                </div>
                <div className="text-xs text-muted-foreground">receitas unicas</div>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="text-xl font-bold text-amber-600">
                  {cardapio.estatisticas.variedade}%
                </div>
                <div className="text-xs text-muted-foreground">variedade</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seletor de semana */}
      <div className="flex gap-2">
        {semanas.map((semana, index) => (
          <Button
            key={index}
            variant={semanaAtiva === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSemanaAtiva(index)}
            className="flex-1"
          >
            Semana {index + 1}
          </Button>
        ))}
      </div>

      {/* Cardápio da semana ativa */}
      <CardapioReceitas
        dias={cardapio.dias.slice(semanas[semanaAtiva].inicio, semanas[semanaAtiva].fim)}
        estatisticas={cardapio.estatisticas}
        onTrocarRefeicao={
          onTrocarRefeicao
            ? (diaIndex, refeicaoIndex) =>
                onTrocarRefeicao(semanas[semanaAtiva].inicio + diaIndex, refeicaoIndex)
            : undefined
        }
      />
    </div>
  )
}
