'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, CheckCircle, Trophy } from 'lucide-react'
import type { Conquista, UsuarioConquista, CategoriaConquista } from '@/types'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ListaConquistasProps {
  conquistasUsuario: UsuarioConquista[]
  todasConquistas: Conquista[]
  compacto?: boolean
}

const CATEGORIAS: { id: CategoriaConquista; nome: string; icone: string }[] = [
  { id: 'streak', nome: 'Sequência', icone: '🔥' },
  { id: 'peso', nome: 'Peso', icone: '⚖️' },
  { id: 'conteudo', nome: 'Conteúdo', icone: '📖' },
  { id: 'engajamento', nome: 'Engajamento', icone: '⭐' },
  { id: 'especial', nome: 'Especiais', icone: '💎' },
]

export function ListaConquistas({
  conquistasUsuario,
  todasConquistas,
  compacto = false,
}: ListaConquistasProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todas')

  const conquistasDesbloqueadasIds = new Set(conquistasUsuario.map((c) => c.conquista_id))

  // Filtra conquistas por categoria
  const conquistasFiltradas = todasConquistas.filter(
    (c) => categoriaAtiva === 'todas' || c.categoria === categoriaAtiva
  )

  // Stats
  const totalDesbloqueadas = conquistasUsuario.length
  const totalConquistas = todasConquistas.length
  const percentualCompleto = Math.round((totalDesbloqueadas / totalConquistas) * 100)

  // Modo compacto - mostra apenas as últimas desbloqueadas
  if (compacto) {
    const ultimasConquistas = [...conquistasUsuario]
      .sort((a, b) =>
        new Date(b.desbloqueada_em).getTime() - new Date(a.desbloqueada_em).getTime()
      )
      .slice(0, 4)

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Conquistas
            </CardTitle>
            <Badge variant="secondary">
              {totalDesbloqueadas}/{totalConquistas}
            </Badge>
          </div>
          <Progress value={percentualCompleto} className="h-2" />
        </CardHeader>

        <CardContent>
          {ultimasConquistas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {ultimasConquistas.map((uc) => {
                const conquista = todasConquistas.find((c) => c.id === uc.conquista_id)
                if (!conquista) return null
                return (
                  <div
                    key={uc.id}
                    className="flex items-center gap-2 bg-muted rounded-full px-3 py-1"
                    title={conquista.descricao}
                  >
                    <span className="text-lg">{conquista.icone}</span>
                    <span className="text-sm font-medium">{conquista.titulo}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-4">
              Nenhuma conquista desbloqueada ainda.
              <br />
              Continue usando a plataforma!
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Modo completo
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Conquistas
            </CardTitle>
            <CardDescription>
              {totalDesbloqueadas} de {totalConquistas} conquistas desbloqueadas ({percentualCompleto}%)
            </CardDescription>
          </div>
        </div>
        <Progress value={percentualCompleto} className="h-3 mt-2" />
      </CardHeader>

      <CardContent>
        <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="todas" className="text-xs">
              Todas
            </TabsTrigger>
            {CATEGORIAS.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                <span className="mr-1">{cat.icone}</span>
                {cat.nome}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={categoriaAtiva} className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {conquistasFiltradas.map((conquista) => {
                const desbloqueada = conquistasDesbloqueadasIds.has(conquista.id)
                const usuarioConquista = conquistasUsuario.find(
                  (uc) => uc.conquista_id === conquista.id
                )

                return (
                  <div
                    key={conquista.id}
                    className={`relative border rounded-lg p-4 transition-all ${
                      desbloqueada
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                        : 'bg-muted/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`text-3xl ${
                          desbloqueada ? '' : 'grayscale opacity-50'
                        }`}
                      >
                        {conquista.icone}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{conquista.titulo}</h4>
                          {desbloqueada ? (
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {conquista.descricao}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            +{conquista.pontos} pts
                          </Badge>
                          {desbloqueada && usuarioConquista && (
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(usuarioConquista.desbloqueada_em), "dd/MM/yy", {
                                locale: ptBR,
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
