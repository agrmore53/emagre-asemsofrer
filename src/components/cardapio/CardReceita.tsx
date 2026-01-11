'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Clock,
  ChefHat,
  Flame,
  Droplets,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Utensils,
} from 'lucide-react'
import type { Receita } from '@/lib/data/receitas'

interface CardReceitaProps {
  receita: Receita
  porcoes: number
  nutrientes: {
    calorias: number
    proteinas: number
    carboidratos: number
    gorduras: number
    fibras: number
    agua: number
  }
  onTrocar?: () => void
  compact?: boolean
}

const TAG_LABELS: Record<string, string> = {
  low_carb: 'Low Carb',
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
  sem_gluten: 'Sem Gluten',
  sem_lactose: 'Sem Lactose',
  rapido: 'Rapido',
  economico: 'Economico',
  fitness: 'Fitness',
  comfort_food: 'Comfort',
  proteico: 'Proteico',
  leve: 'Leve',
  saciedade: 'Saciedade',
}

const TAG_COLORS: Record<string, string> = {
  low_carb: 'bg-orange-100 text-orange-700',
  vegetariano: 'bg-green-100 text-green-700',
  vegano: 'bg-emerald-100 text-emerald-700',
  sem_gluten: 'bg-amber-100 text-amber-700',
  sem_lactose: 'bg-blue-100 text-blue-700',
  rapido: 'bg-cyan-100 text-cyan-700',
  economico: 'bg-lime-100 text-lime-700',
  fitness: 'bg-purple-100 text-purple-700',
  proteico: 'bg-red-100 text-red-700',
  leve: 'bg-sky-100 text-sky-700',
  saciedade: 'bg-indigo-100 text-indigo-700',
}

export function CardReceita({
  receita,
  porcoes,
  nutrientes,
  onTrocar,
  compact = false,
}: CardReceitaProps) {
  const [expandido, setExpandido] = useState(false)

  const tempoTotal = receita.tempoPreparo + receita.tempoCozimento

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{receita.imagemPlaceholder || '🍽️'}</span>
          <div>
            <p className="font-medium text-sm">{receita.nome}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {nutrientes.calorias} kcal
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tempoTotal} min
              </span>
            </div>
          </div>
        </div>
        {onTrocar && (
          <Button variant="ghost" size="sm" onClick={onTrocar}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{receita.imagemPlaceholder || '🍽️'}</span>
            <div>
              <CardTitle className="text-lg">{receita.nome}</CardTitle>
              <p className="text-sm text-muted-foreground">{receita.descricao}</p>
            </div>
          </div>
          {onTrocar && (
            <Button variant="outline" size="sm" onClick={onTrocar}>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Trocar
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {receita.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={`text-xs ${TAG_COLORS[tag] || ''}`}
            >
              {TAG_LABELS[tag] || tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info basica */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-muted rounded-lg">
            <Flame className="h-4 w-4 mx-auto text-orange-500" />
            <p className="text-sm font-bold">{nutrientes.calorias}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <div className="h-4 w-4 mx-auto text-red-500 font-bold text-xs">P</div>
            <p className="text-sm font-bold">{nutrientes.proteinas}g</p>
            <p className="text-xs text-muted-foreground">prot</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <div className="h-4 w-4 mx-auto text-amber-500 font-bold text-xs">C</div>
            <p className="text-sm font-bold">{nutrientes.carboidratos}g</p>
            <p className="text-xs text-muted-foreground">carb</p>
          </div>
          <div className="p-2 bg-muted rounded-lg">
            <div className="h-4 w-4 mx-auto text-blue-500 font-bold text-xs">G</div>
            <p className="text-sm font-bold">{nutrientes.gorduras}g</p>
            <p className="text-xs text-muted-foreground">gord</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {tempoTotal} min
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              {receita.dificuldade}
            </span>
            <span className="flex items-center gap-1">
              <Utensils className="h-4 w-4" />
              {porcoes} {porcoes === 1 ? 'porção' : 'porções'}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Droplets className="h-4 w-4 text-blue-400" />
            {nutrientes.agua}ml
          </span>
        </div>

        {/* Expandir detalhes */}
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Esconder detalhes
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver receita completa
            </>
          )}
        </Button>

        {/* Detalhes expandidos */}
        {expandido && (
          <div className="space-y-4 pt-4 border-t">
            {/* Ingredientes */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span>Ingredientes</span>
                <Badge variant="outline" className="text-xs">
                  {porcoes} {porcoes === 1 ? 'porção' : 'porções'}
                </Badge>
              </h4>
              <ul className="space-y-1 text-sm">
                {receita.ingredientes.map((ing, i) => (
                  <li key={i} className="flex justify-between items-center py-1">
                    <span>{ing.nome}</span>
                    <span className="text-muted-foreground">
                      {Math.round(ing.quantidade * porcoes * 10) / 10} {ing.unidade}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modo de preparo */}
            <div>
              <h4 className="font-semibold mb-2">Modo de Preparo</h4>
              <ol className="space-y-2 text-sm">
                {receita.modoPreparo.map((passo, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <span>{passo}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Dicas */}
            {receita.dicas && receita.dicas.length > 0 && (
              <div className="bg-amber-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1 text-amber-800 text-sm">Dicas</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  {receita.dicas.map((dica, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>💡</span>
                      <span>{dica}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variações */}
            {receita.variacoes && receita.variacoes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Variações</h4>
                <div className="space-y-2">
                  {receita.variacoes.map((variacao, i) => (
                    <div key={i} className="bg-muted p-3 rounded-lg">
                      <p className="font-medium text-sm">{variacao.nome}</p>
                      <p className="text-xs text-muted-foreground mb-1">{variacao.descricao}</p>
                      <ul className="text-xs space-y-1">
                        {variacao.alteracoes.map((alt, j) => (
                          <li key={j} className="text-muted-foreground">• {alt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Dialog para ver receita em tela cheia
export function DialogReceita({
  receita,
  porcoes,
  nutrientes,
  trigger,
}: CardReceitaProps & { trigger: React.ReactNode }) {
  const tempoTotal = receita.tempoPreparo + receita.tempoCozimento

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{receita.imagemPlaceholder || '🍽️'}</span>
            <div>
              <DialogTitle className="text-xl">{receita.nome}</DialogTitle>
              <DialogDescription>{receita.descricao}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {receita.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={TAG_COLORS[tag] || ''}
              >
                {TAG_LABELS[tag] || tag}
              </Badge>
            ))}
          </div>

          {/* Nutrientes */}
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{nutrientes.calorias}</p>
              <p className="text-xs text-muted-foreground">calorias</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{nutrientes.proteinas}g</p>
              <p className="text-xs text-muted-foreground">proteinas</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{nutrientes.carboidratos}g</p>
              <p className="text-xs text-muted-foreground">carboidratos</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{nutrientes.gorduras}g</p>
              <p className="text-xs text-muted-foreground">gorduras</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{nutrientes.fibras}g</p>
              <p className="text-xs text-muted-foreground">fibras</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center justify-around py-3 bg-muted rounded-lg">
            <div className="text-center">
              <Clock className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="font-medium">{tempoTotal} min</p>
              <p className="text-xs text-muted-foreground">tempo total</p>
            </div>
            <div className="text-center">
              <ChefHat className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="font-medium capitalize">{receita.dificuldade}</p>
              <p className="text-xs text-muted-foreground">dificuldade</p>
            </div>
            <div className="text-center">
              <Utensils className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="font-medium">{porcoes}</p>
              <p className="text-xs text-muted-foreground">porções</p>
            </div>
            <div className="text-center">
              <Droplets className="h-5 w-5 mx-auto text-blue-400" />
              <p className="font-medium">{nutrientes.agua}ml</p>
              <p className="text-xs text-muted-foreground">água sugerida</p>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Ingredientes</h3>
            <div className="grid grid-cols-2 gap-2">
              {receita.ingredientes.map((ing, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 bg-muted/50 rounded"
                >
                  <span className="text-sm">{ing.nome}</span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {Math.round(ing.quantidade * porcoes * 10) / 10} {ing.unidade}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modo de preparo */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Modo de Preparo</h3>
            <ol className="space-y-3">
              {receita.modoPreparo.map((passo, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="pt-1">{passo}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Dicas */}
          {receita.dicas && receita.dicas.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Dicas do Chef</h3>
              <ul className="space-y-2">
                {receita.dicas.map((dica, i) => (
                  <li key={i} className="flex items-start gap-2 text-amber-700">
                    <span>💡</span>
                    <span>{dica}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
