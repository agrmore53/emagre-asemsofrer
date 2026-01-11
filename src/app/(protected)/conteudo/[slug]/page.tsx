import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getCapituloBySlug, CAPITULOS_CONTEUDO } from '@/content/capitulos'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, BookOpen } from 'lucide-react'
import { MarcarConcluidoButton } from '@/components/conteudo/MarcarConcluidoButton'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CapituloPage({ params }: PageProps) {
  const { slug } = await params
  const capitulo = getCapituloBySlug(slug)

  if (!capitulo) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Busca o perfil para verificar o plano
  const { data: profile } = await supabase
    .from('profiles')
    .select('plano')
    .eq('id', user?.id)
    .single()

  // Verifica se o usuário tem acesso
  const temAcessoCompleto = profile?.plano === 'basico' || profile?.plano === 'premium'
  const ehPrimeiroCapitulo = capitulo.numero === 1

  if (!temAcessoCompleto && !ehPrimeiroCapitulo) {
    redirect('/conteudo')
  }

  // Busca o progresso deste capítulo
  const { data: progresso } = await supabase
    .from('conteudo_progresso')
    .select('*')
    .eq('user_id', user?.id)
    .eq('capitulo_id', capitulo.id)
    .single()

  // Busca todo o progresso para a barra
  const { data: todoProgresso } = await supabase
    .from('conteudo_progresso')
    .select('capitulo_id, concluido')
    .eq('user_id', user?.id)

  const capitulosConcluidos = todoProgresso?.filter(p => p.concluido).length || 0
  const progressoGeral = Math.round((capitulosConcluidos / CAPITULOS_CONTEUDO.length) * 100)

  // Encontra capítulos anterior e próximo
  const capituloAnterior = capitulo.capituloAnterior
    ? getCapituloBySlug(capitulo.capituloAnterior)
    : null
  const proximoCapitulo = capitulo.proximoCapitulo
    ? getCapituloBySlug(capitulo.proximoCapitulo)
    : null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Barra de progresso fixa no topo */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur py-3 border-b mb-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/conteudo" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Índice
          </Link>

          <div className="flex-1 max-w-xs">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Progresso geral: {progressoGeral}%</span>
            </div>
            <Progress value={progressoGeral} className="h-2" />
          </div>

          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {capitulo.tempoLeitura} min
          </Badge>
        </div>
      </div>

      {/* Header do capítulo */}
      <header className="mb-12">
        <Badge variant="secondary" className="mb-4">
          Capítulo {capitulo.numero} de {CAPITULOS_CONTEUDO.length}
        </Badge>
        <h1 className="text-4xl font-bold mb-4">{capitulo.titulo}</h1>
        <p className="text-xl text-muted-foreground">{capitulo.subtitulo}</p>

        {progresso?.concluido && (
          <div className="flex items-center gap-2 mt-4 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Você já leu este capítulo</span>
          </div>
        )}
      </header>

      {/* Conteúdo do capítulo */}
      <article className="prose prose-lg max-w-none mb-12">
        {capitulo.secoes.map((secao, index) => (
          <section key={index} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-foreground">{secao.titulo}</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {secao.conteudo.split('\n\n').map((paragrafo, i) => {
                // Verifica se é uma tabela markdown
                if (paragrafo.includes('|') && paragrafo.includes('---')) {
                  return (
                    <div key={i} className="my-4 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <tbody>
                          {paragrafo.split('\n').filter(row => !row.includes('---')).map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex === 0 ? 'font-bold bg-muted' : 'border-b'}>
                              {row.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2">{cell.trim()}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                }

                // Verifica se é uma lista
                if (paragrafo.startsWith('•') || paragrafo.startsWith('-') || paragrafo.match(/^\d\./)) {
                  return (
                    <ul key={i} className="list-disc list-inside my-4 space-y-2">
                      {paragrafo.split('\n').map((item, itemIndex) => (
                        <li key={itemIndex}>{item.replace(/^[•\-\d.]\s*/, '')}</li>
                      ))}
                    </ul>
                  )
                }

                // Parágrafo normal
                return (
                  <p
                    key={i}
                    className="mb-4"
                    dangerouslySetInnerHTML={{
                      __html: paragrafo
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }}
                  />
                )
              })}
            </div>
          </section>
        ))}
      </article>

      {/* Resumo do capítulo */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Resumo do Capítulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {capitulo.resumo.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Botão de marcar como concluído */}
      <div className="flex justify-center mb-8">
        <MarcarConcluidoButton
          capituloId={capitulo.id}
          jaConcluido={progresso?.concluido || false}
        />
      </div>

      {/* Navegação entre capítulos */}
      <nav className="flex items-center justify-between border-t pt-8">
        {capituloAnterior ? (
          <Link href={`/conteudo/${capituloAnterior.slug}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Anterior</div>
                <div className="text-sm font-medium">Cap. {capituloAnterior.numero}</div>
              </div>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {proximoCapitulo ? (
          temAcessoCompleto || proximoCapitulo.numero === 1 ? (
            <Link href={`/conteudo/${proximoCapitulo.slug}`}>
              <Button className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs opacity-80">Próximo</div>
                  <div className="text-sm font-medium">Cap. {proximoCapitulo.numero}</div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/planos">
              <Button className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs opacity-80">Desbloquear</div>
                  <div className="text-sm font-medium">Próximo capítulo</div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )
        ) : (
          <Link href="/conteudo">
            <Button className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs opacity-80">Parabéns!</div>
                <div className="text-sm font-medium">Você concluiu tudo</div>
              </div>
              <CheckCircle className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </nav>
    </div>
  )
}

// Gera as rotas estáticas para os capítulos
export async function generateStaticParams() {
  return CAPITULOS_CONTEUDO.map((capitulo) => ({
    slug: capitulo.slug,
  }))
}
