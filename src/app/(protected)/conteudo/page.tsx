import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CAPITULOS_CONTEUDO } from '@/content/capitulos'
import { CheckCircle, Clock, Lock, BookOpen } from 'lucide-react'

export default async function ConteudoPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Busca o perfil para verificar o plano
  const { data: profile } = await supabase
    .from('profiles')
    .select('plano')
    .eq('id', user?.id)
    .single()

  // Busca o progresso nos capítulos
  const { data: progresso } = await supabase
    .from('conteudo_progresso')
    .select('*')
    .eq('user_id', user?.id)

  const progressoMap = new Map(
    progresso?.map((p) => [p.capitulo_id, p]) || []
  )

  // Calcula estatísticas
  const capitulosConcluidos = progresso?.filter((p) => p.concluido).length || 0
  const progressoPercentual = Math.round((capitulosConcluidos / CAPITULOS_CONTEUDO.length) * 100)
  const tempoTotalLeitura = CAPITULOS_CONTEUDO.reduce((acc, cap) => acc + cap.tempoLeitura, 0)
  const tempoRestante = CAPITULOS_CONTEUDO
    .filter((cap) => !progressoMap.get(cap.id)?.concluido)
    .reduce((acc, cap) => acc + cap.tempoLeitura, 0)

  // Verifica se o usuário tem acesso ao conteúdo
  const temAcessoCompleto = profile?.plano === 'basico' || profile?.plano === 'premium'

  // Encontra o próximo capítulo a ler
  const proximoCapitulo = CAPITULOS_CONTEUDO.find(
    (cap) => !progressoMap.get(cap.id)?.concluido
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Conteúdo do Método</h1>
          <p className="text-muted-foreground mt-2">
            8 capítulos para transformar sua relação com a comida
          </p>
        </div>

        {proximoCapitulo && (
          <Link href={`/conteudo/${proximoCapitulo.slug}`}>
            <Button size="lg">
              <BookOpen className="mr-2 h-5 w-5" />
              {capitulosConcluidos === 0 ? 'Começar a ler' : 'Continuar leitura'}
            </Button>
          </Link>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progresso</CardDescription>
            <CardTitle className="text-3xl">{progressoPercentual}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressoPercentual} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Capítulos lidos</CardDescription>
            <CardTitle className="text-3xl">{capitulosConcluidos}/{CAPITULOS_CONTEUDO.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {CAPITULOS_CONTEUDO.length - capitulosConcluidos} restantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tempo total</CardDescription>
            <CardTitle className="text-3xl">{tempoTotalLeitura} min</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              ~{Math.ceil(tempoTotalLeitura / 60)}h de leitura
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tempo restante</CardDescription>
            <CardTitle className="text-3xl">{tempoRestante} min</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Para completar tudo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Capítulos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Capítulos</h2>

        <div className="grid gap-4">
          {CAPITULOS_CONTEUDO.map((capitulo, index) => {
            const capProgresso = progressoMap.get(capitulo.id)
            const concluido = capProgresso?.concluido
            const bloqueado = !temAcessoCompleto && index > 0

            return (
              <Card
                key={capitulo.id}
                className={`transition-all ${
                  bloqueado
                    ? 'opacity-60'
                    : concluido
                    ? 'border-green-200 bg-green-50/50'
                    : 'hover:shadow-md hover:border-primary/50'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          concluido
                            ? 'bg-green-500 text-white'
                            : bloqueado
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {concluido ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : bloqueado ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          capitulo.numero
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {capitulo.titulo}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {capitulo.subtitulo}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {concluido && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Concluído
                        </Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {capitulo.tempoLeitura} min
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {capitulo.descricao}
                  </p>

                  {bloqueado ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        🔒 Disponível nos planos Básico e Premium
                      </p>
                      <Link href="/planos">
                        <Button variant="outline" size="sm">
                          Fazer upgrade
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/conteudo/${capitulo.slug}`}>
                      <Button
                        variant={concluido ? 'outline' : 'default'}
                        className="w-full sm:w-auto"
                      >
                        {concluido ? 'Ler novamente' : 'Ler capítulo'}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* CTA para upgrade se for plano free */}
      {!temAcessoCompleto && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Desbloqueie todo o conteúdo</CardTitle>
            <CardDescription>
              Faça upgrade para ter acesso a todos os 8 capítulos e transformar sua vida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/planos">
              <Button>Ver planos →</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
