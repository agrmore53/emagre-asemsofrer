'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  ChefHat,
  RefreshCw,
  CalendarDays,
  ShoppingCart,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  Utensils,
  Target,
  TrendingDown,
  TrendingUp,
  Scale,
} from 'lucide-react'
import { CardapioReceitas, CardapioMensalView } from '@/components/cardapio/CardapioReceitas'
import { ListaComprasReceitas } from '@/components/cardapio/ListaComprasReceitas'
import type { CardapioDiaReceitas, CardapioMensal, ListaComprasInteligente } from '@/lib/cardapio/motor-recomendacao'

type Periodo = 'semanal' | 'mensal'
type Objetivo = 'perder_rapido' | 'perder_moderado' | 'manter' | 'ganhar_peso'

const OBJETIVOS: { value: Objetivo; label: string; icon: React.ReactNode; descricao: string }[] = [
  { value: 'perder_rapido', label: 'Perder Peso Rapido', icon: <TrendingDown className="h-4 w-4" />, descricao: 'Deficit agressivo (-500kcal)' },
  { value: 'perder_moderado', label: 'Perder Peso Moderado', icon: <Scale className="h-4 w-4" />, descricao: 'Deficit moderado (-300kcal)' },
  { value: 'manter', label: 'Manter Peso', icon: <Target className="h-4 w-4" />, descricao: 'Equilibrio calorico' },
  { value: 'ganhar_peso', label: 'Ganhar Massa', icon: <TrendingUp className="h-4 w-4" />, descricao: 'Superavit (+300kcal)' },
]

export default function CardapioPage() {
  const [cardapioDias, setCardapioDias] = useState<CardapioDiaReceitas[] | null>(null)
  const [cardapioMensal, setCardapioMensal] = useState<CardapioMensal | null>(null)
  const [listaCompras, setListaCompras] = useState<ListaComprasInteligente | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [caloriasCalculadas, setCaloriasCalculadas] = useState<number | null>(null)
  const [tabAtiva, setTabAtiva] = useState('cardapio')
  const [periodo, setPeriodo] = useState<Periodo>('semanal')
  const [objetivo, setObjetivo] = useState<Objetivo>('perder_moderado')
  const router = useRouter()

  const gerarNovoCardapio = async () => {
    setLoading(true)
    setErro(null)

    try {
      const response = await fetch('/api/cardapio/receitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo,
          objetivo,
          dataInicio: new Date().toISOString().split('T')[0],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao gerar cardapio')
      }

      const data = await response.json()

      if (periodo === 'mensal') {
        setCardapioMensal(data.cardapio)
        setCardapioDias(null)
      } else {
        setCardapioDias(data.cardapio.dias)
        setCardapioMensal(null)
      }

      setListaCompras(data.listaCompras)
      setCaloriasCalculadas(data.caloriasCalculadas)
      toast.success(`Cardapio ${periodo} gerado com sucesso!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar cardapio'
      setErro(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const temCardapio = cardapioDias || cardapioMensal

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            Cardapio com Receitas
          </h1>
          <p className="text-muted-foreground mt-2">
            Receitas completas personalizadas para seu objetivo
          </p>
        </div>
      </div>

      {/* Configuracoes */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Periodo */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Periodo
              </label>
              <Select value={periodo} onValueChange={(v) => setPeriodo(v as Periodo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Semanal (7 dias)
                    </div>
                  </SelectItem>
                  <SelectItem value="mensal">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Mensal (30 dias)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Objetivo
              </label>
              <Select value={objetivo} onValueChange={(v) => setObjetivo(v as Objetivo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OBJETIVOS.map((obj) => (
                    <SelectItem key={obj.value} value={obj.value}>
                      <div className="flex items-center gap-2">
                        {obj.icon}
                        <div>
                          <div>{obj.label}</div>
                          <div className="text-xs text-muted-foreground">{obj.descricao}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botao */}
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-0">Acao</label>
              <Button
                onClick={gerarNovoCardapio}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : temCardapio ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerar Cardapio
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar Meu Cardapio
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erro */}
      {erro && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">{erro}</p>
                {erro.includes('perfil') && (
                  <Button
                    variant="link"
                    className="text-red-600 p-0 h-auto mt-1"
                    onClick={() => router.push('/perfil')}
                  >
                    Ir para o perfil
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sem cardapio */}
      {!temCardapio && !loading && !erro && (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <Utensils className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Sistema de Cardapio Inteligente</h3>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                  Gere cardapios completos com receitas detalhadas, ingredientes com
                  quantidades exatas, modo de preparo e lista de compras automatica.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>🍳</span> 99+ receitas
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>📅</span> 30 dias sem repeticao
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>🛒</span> Lista de compras
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>🎯</span> Personalizado
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <span>📊</span> Macros calculados
                </Badge>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto text-left">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="font-semibold text-green-800 mb-1">Receitas Completas</h4>
                  <p className="text-sm text-green-600">
                    Ingredientes, modo de preparo, dicas e variacoes para cada receita
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-1">Nutricao Detalhada</h4>
                  <p className="text-sm text-blue-600">
                    Calorias, proteinas, carboidratos, gorduras e fibras por porcao
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <h4 className="font-semibold text-amber-800 mb-1">Lista Inteligente</h4>
                  <p className="text-sm text-amber-600">
                    Compras organizadas por categoria com quantidades exatas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <Utensils className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Preparando seu cardapio...</h3>
                <p className="text-muted-foreground mt-1">
                  Selecionando as melhores receitas para seu objetivo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cardapio gerado */}
      {temCardapio && !loading && (
        <>
          {/* Info de calorias */}
          {caloriasCalculadas && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        Cardapio personalizado para voce
                      </p>
                      <p className="text-sm text-green-600">
                        Meta diaria: <strong>{caloriasCalculadas} kcal/dia</strong> •{' '}
                        {OBJETIVOS.find((o) => o.value === objetivo)?.label}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    {periodo === 'mensal' ? '30 dias' : '7 dias'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="cardapio" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Cardapio
              </TabsTrigger>
              <TabsTrigger value="compras" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Lista de Compras
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cardapio" className="mt-6">
              {cardapioMensal ? (
                <CardapioMensalView cardapio={cardapioMensal} />
              ) : cardapioDias ? (
                <CardapioReceitas dias={cardapioDias} />
              ) : null}
            </TabsContent>

            <TabsContent value="compras" className="mt-6">
              {listaCompras && <ListaComprasReceitas lista={listaCompras} />}
            </TabsContent>
          </Tabs>

          {/* Dicas */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>💡</span> Dicas para aproveitar ao maximo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Troque se nao gostar:</strong> Clique em "Ver Receita" e use o botao
                de trocar para obter uma alternativa similar.
              </p>
              <p>
                <strong>Prepare com antecedencia:</strong> Separe um dia para preparar
                as bases das refeicoes da semana (meal prep).
              </p>
              <p>
                <strong>Use a lista de compras:</strong> Ela esta organizada por categoria
                para facilitar suas compras no mercado.
              </p>
              <p>
                <strong>Ajuste as porcoes:</strong> As quantidades sao sugestoes baseadas
                no seu perfil. Ajuste conforme sua fome real.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
