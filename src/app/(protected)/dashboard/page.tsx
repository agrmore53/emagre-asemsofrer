import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CAPITULOS } from '@/types'
import { CardStreak } from '@/components/gamificacao/CardStreak'
import { ListaConquistas } from '@/components/gamificacao/ListaConquistas'
import type { UsuarioStreak, Conquista, UsuarioConquista } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Busca o perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Busca o progresso nos capítulos
  const { data: progresso } = await supabase
    .from('conteudo_progresso')
    .select('*')
    .eq('user_id', user?.id)

  // Busca o último registro do tracker
  const { data: ultimoRegistro } = await supabase
    .from('tracker_registros')
    .select('*')
    .eq('user_id', user?.id)
    .order('data', { ascending: false })
    .limit(1)
    .single()

  // Busca dados de gamificação
  const { data: streak } = await supabase
    .from('usuario_streaks')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  const { data: conquistasUsuario } = await supabase
    .from('usuario_conquistas')
    .select('*, conquista:conquistas(*)')
    .eq('user_id', user?.id)
    .order('desbloqueada_em', { ascending: false })

  const { data: todasConquistas } = await supabase
    .from('conquistas')
    .select('*')
    .order('ordem', { ascending: true })

  // Calcula o progresso
  const capitulosConcluidos = progresso?.filter((p: { concluido: boolean }) => p.concluido).length || 0
  const progressoPercentual = Math.round((capitulosConcluidos / CAPITULOS.length) * 100)

  // Calcula dias desde o início
  const diasDesdeInicio = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Calcula peso perdido
  const pesoPerdido = profile?.peso_inicial && ultimoRegistro?.peso_kg
    ? (profile.peso_inicial - ultimoRegistro.peso_kg).toFixed(1)
    : null

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <div>
        <h1 className="text-3xl font-bold">
          Olá, {profile?.nome?.split(' ')[0] || 'você'}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Continue sua jornada rumo a uma vida mais saudável.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Progresso do conteúdo */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progresso no conteúdo</CardDescription>
            <CardTitle className="text-4xl">{progressoPercentual}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressoPercentual} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {capitulosConcluidos} de {CAPITULOS.length} capítulos
            </p>
          </CardContent>
        </Card>

        {/* Dias na jornada */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dias na jornada</CardDescription>
            <CardTitle className="text-4xl">{diasDesdeInicio}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {diasDesdeInicio === 0 ? 'Você começou hoje!' : 'Continue firme!'}
            </p>
          </CardContent>
        </Card>

        {/* Peso perdido */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Peso perdido</CardDescription>
            <CardTitle className="text-4xl">
              {pesoPerdido ? `${pesoPerdido}kg` : '--'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {pesoPerdido
                ? Number(pesoPerdido) > 0
                  ? 'Excelente progresso!'
                  : 'Continue focado!'
                : 'Registre seu peso no Tracker'}
            </p>
          </CardContent>
        </Card>

        {/* Plano atual */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Seu plano</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Badge variant={profile?.plano === 'premium' ? 'default' : 'secondary'}>
                {profile?.plano === 'premium' ? '⭐ Premium' : profile?.plano === 'basico' ? 'Básico' : 'Grátis'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.plano === 'free' && (
              <Link href="/planos">
                <Button variant="link" className="p-0 h-auto text-xs">
                  Fazer upgrade →
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Continuar leitura */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📖 Continuar Leitura
            </CardTitle>
            <CardDescription>
              {capitulosConcluidos < CAPITULOS.length
                ? `Próximo: Capítulo ${capitulosConcluidos + 1}`
                : 'Você concluiu todo o conteúdo!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/conteudo">
              <Button className="w-full">
                {capitulosConcluidos < CAPITULOS.length ? 'Continuar' : 'Revisar'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Registrar peso */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📈 Registrar Progresso
            </CardTitle>
            <CardDescription>
              {ultimoRegistro
                ? `Último registro: ${new Date(ultimoRegistro.data).toLocaleDateString('pt-BR')}`
                : 'Nenhum registro ainda'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tracker">
              <Button variant="outline" className="w-full">
                Registrar peso
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Ver cardápio */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🍽️ Cardápio do Dia
            </CardTitle>
            <CardDescription>
              Veja suas refeições planejadas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cardapio">
              <Button variant="outline" className="w-full">
                Ver cardápio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Gamificação: Streak e Conquistas */}
      <div className="grid gap-4 md:grid-cols-2">
        <CardStreak streak={streak as UsuarioStreak | null} />
        <ListaConquistas
          conquistasUsuario={(conquistasUsuario || []) as UsuarioConquista[]}
          todasConquistas={(todasConquistas || []) as Conquista[]}
          compacto
        />
      </div>

      {/* Dica do dia */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            💡 Dica do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lembre-se: <strong>pequenos ajustes consistentes</strong> geram grandes resultados ao longo do tempo.
            Não tente mudar tudo de uma vez. Escolha uma coisa para melhorar hoje.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
