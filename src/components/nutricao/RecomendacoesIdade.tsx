'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  User,
  Dumbbell,
  Apple,
  Pill,
  Brain,
  Heart,
  Flame,
  Droplets,
  Target,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import {
  type FaixaEtaria,
  type FaseHormonal,
  type PerfilNutricionalIdade,
  PERFIS_IDADE,
  AJUSTES_HORMONAIS,
  gerarPerfilNutricionalCompleto,
} from '@/lib/nutricao/faixas-etarias'
import { getArtigosPersonalizados, type ArtigoEducativo } from '@/lib/nutricao/conteudo-educativo'

interface RecomendacoesIdadeProps {
  idade: number
  sexo: 'masculino' | 'feminino'
  peso: number
  altura: number
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'intenso'
  objetivo?: 'perder_peso' | 'manter_peso' | 'ganhar_massa' | 'longevidade' | 'energia' | 'saude_hormonal'
  faseHormonal?: FaseHormonal
  onVerArtigo?: (artigo: ArtigoEducativo) => void
}

export function RecomendacoesIdade({
  idade,
  sexo,
  peso,
  altura,
  nivelAtividade,
  objetivo = 'perder_peso',
  faseHormonal,
  onVerArtigo,
}: RecomendacoesIdadeProps) {
  const [tabAtiva, setTabAtiva] = useState('resumo')

  // Gera perfil completo
  const perfil = gerarPerfilNutricionalCompleto(
    idade,
    sexo,
    peso,
    altura,
    nivelAtividade,
    objetivo,
    faseHormonal
  )

  // Busca artigos personalizados
  const artigos = getArtigosPersonalizados(perfil.faixaEtaria, sexo, perfil.faseHormonal)

  // Ajustes hormonais
  const ajusteHormonal = AJUSTES_HORMONAIS[perfil.faseHormonal]

  return (
    <div className="space-y-6">
      {/* Card Principal - Resumo */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Seu Plano Nutricional Personalizado
              </CardTitle>
              <CardDescription>
                Baseado na sua idade ({idade} anos) e objetivos
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {perfil.faixaEtaria} anos
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {/* Calorias */}
            <div className="bg-white/50 p-4 rounded-lg text-center">
              <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
              <p className="text-2xl font-bold text-orange-600">{perfil.caloriasDiarias}</p>
              <p className="text-xs text-muted-foreground">kcal/dia</p>
              <p className="text-xs text-orange-600 mt-1">
                TMB: {perfil.tmb} ({perfil.ajusteMetabolico}%)
              </p>
            </div>

            {/* Proteina */}
            <div className="bg-white/50 p-4 rounded-lg text-center">
              <Dumbbell className="h-6 w-6 mx-auto text-red-500 mb-2" />
              <p className="text-2xl font-bold text-red-600">{perfil.proteinas.ideal}g</p>
              <p className="text-xs text-muted-foreground">proteina/dia</p>
              <p className="text-xs text-red-600 mt-1">
                {perfil.proteinaIdeal}g/kg
              </p>
            </div>

            {/* Agua */}
            <div className="bg-white/50 p-4 rounded-lg text-center">
              <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(peso * perfil.aguaMinima / 1000 * 10) / 10}L
              </p>
              <p className="text-xs text-muted-foreground">agua/dia</p>
              <p className="text-xs text-blue-600 mt-1">
                {perfil.aguaMinima}ml/kg
              </p>
            </div>

            {/* Fibras */}
            <div className="bg-white/50 p-4 rounded-lg text-center">
              <Apple className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold text-green-600">{perfil.fibrasMinimas}g</p>
              <p className="text-xs text-muted-foreground">fibras/dia</p>
            </div>
          </div>

          {/* Macros */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Distribuicao de Macros</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Proteinas</span>
                  <span>{perfil.macros.proteinas}%</span>
                </div>
                <Progress value={perfil.macros.proteinas} className="h-2 bg-red-100" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Carboidratos</span>
                  <span>{perfil.macros.carboidratos}%</span>
                </div>
                <Progress value={perfil.macros.carboidratos} className="h-2 bg-amber-100" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Gorduras</span>
                  <span>{perfil.macros.gorduras}%</span>
                </div>
                <Progress value={perfil.macros.gorduras} className="h-2 bg-blue-100" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fase Hormonal (se aplicavel) */}
      {ajusteHormonal.nome !== 'Ciclo Regular' && (
        <Card className={sexo === 'feminino' ? 'border-pink-200 bg-pink-50/50' : 'border-blue-200 bg-blue-50/50'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className={`h-5 w-5 ${sexo === 'feminino' ? 'text-pink-500' : 'text-blue-500'}`} />
              {ajusteHormonal.nome}
            </CardTitle>
            <CardDescription>{ajusteHormonal.descricao}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ajusteHormonal.sintomasComuns.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Sintomas Comuns</p>
                <div className="flex flex-wrap gap-2">
                  {ajusteHormonal.sintomasComuns.map((sintoma, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {sintoma}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-green-700 mb-2">Alimentos Indicados</p>
                <ul className="text-sm space-y-1">
                  {ajusteHormonal.alimentosIndicados.slice(0, 5).map((alimento, i) => (
                    <li key={i} className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      {alimento}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 mb-2">Evitar</p>
                <ul className="text-sm space-y-1">
                  {ajusteHormonal.alimentosEvitar.map((alimento, i) => (
                    <li key={i} className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {alimento}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs de Detalhes */}
      <Tabs value={tabAtiva} onValueChange={setTabAtiva}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resumo" className="text-xs">Nutrientes</TabsTrigger>
          <TabsTrigger value="suplementos" className="text-xs">Suplementos</TabsTrigger>
          <TabsTrigger value="exercicio" className="text-xs">Exercicio</TabsTrigger>
          <TabsTrigger value="dicas" className="text-xs">Dicas</TabsTrigger>
        </TabsList>

        {/* Nutrientes Chave */}
        <TabsContent value="resumo">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutrientes Essenciais para sua Idade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {perfil.nutrientesChave.map((nutriente, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{nutriente.nome}</span>
                      <Badge variant="secondary">
                        {nutriente.quantidade} {nutriente.unidade}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{nutriente.importancia}</p>
                    <div className="flex flex-wrap gap-1">
                      {nutriente.fontes.map((fonte, j) => (
                        <Badge key={j} variant="outline" className="text-xs">
                          {fonte}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suplementos */}
        <TabsContent value="suplementos">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Suplementacao Sugerida
              </CardTitle>
              <CardDescription>
                Consulte seu medico antes de iniciar qualquer suplementacao
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {perfil.suplementosSugeridos.map((suplemento, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Pill className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{suplemento.nome}</span>
                        <Badge>{suplemento.dosagem}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{suplemento.motivo}</p>
                      {suplemento.observacao && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {suplemento.observacao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercicio */}
        <TabsContent value="exercicio">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Recomendacoes de Exercicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Aerobico */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">Aerobico</span>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    {perfil.exercicioRecomendado.aerobico.minutos} min • {perfil.exercicioRecomendado.aerobico.frequencia}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {perfil.exercicioRecomendado.aerobico.exemplos.map((ex, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{ex}</Badge>
                  ))}
                </div>
              </div>

              {/* Forca */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-800">Treino de Forca</span>
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    {perfil.exercicioRecomendado.forca.minutos} min • {perfil.exercicioRecomendado.forca.frequencia}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {perfil.exercicioRecomendado.forca.exemplos.map((ex, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{ex}</Badge>
                  ))}
                </div>
              </div>

              {/* Flexibilidade */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-purple-800">Flexibilidade</span>
                  <Badge variant="outline" className="bg-purple-100 text-purple-700">
                    {perfil.exercicioRecomendado.flexibilidade.minutos} min • {perfil.exercicioRecomendado.flexibilidade.frequencia}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {perfil.exercicioRecomendado.flexibilidade.exemplos.map((ex, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{ex}</Badge>
                  ))}
                </div>
              </div>

              {/* Observacoes */}
              {perfil.exercicioRecomendado.observacoes.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-amber-800 mb-2">Observacoes Importantes</p>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {perfil.exercicioRecomendado.observacoes.map((obs, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dicas */}
        <TabsContent value="dicas">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Dicas Especificas para sua Idade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {perfil.dicasEspecificas.map((dica, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{dica}</span>
                  </li>
                ))}
              </ul>

              {/* Alimentos Prioritarios e a Evitar */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800 mb-2">Priorize</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    {perfil.alimentosPrioritarios.map((alimento, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" />
                        {alimento}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="font-medium text-red-800 mb-2">Evite</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {perfil.alimentosEvitar.map((alimento, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        {alimento}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Artigos Recomendados */}
      {artigos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leitura Recomendada para Voce</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {artigos.slice(0, 3).map((artigo) => (
                <div
                  key={artigo.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => onVerArtigo?.(artigo)}
                >
                  <div>
                    <p className="font-medium">{artigo.titulo}</p>
                    <p className="text-sm text-muted-foreground">{artigo.subtitulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{artigo.categoria}</Badge>
                      <span className="text-xs text-muted-foreground">{artigo.tempoLeitura} min</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
