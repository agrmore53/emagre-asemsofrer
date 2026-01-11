import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardStreak } from '@/components/gamificacao/CardStreak'
import { ListaConquistas } from '@/components/gamificacao/ListaConquistas'
import { Trophy, Star, Zap } from 'lucide-react'
import type { UsuarioStreak, Conquista, UsuarioConquista, UsuarioPontos } from '@/types'

export default async function ConquistasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Busca dados de gamificação
  const [
    { data: streak },
    { data: pontos },
    { data: conquistasUsuario },
    { data: todasConquistas },
  ] = await Promise.all([
    supabase.from('usuario_streaks').select('*').eq('user_id', user?.id).single(),
    supabase.from('usuario_pontos').select('*').eq('user_id', user?.id).single(),
    supabase
      .from('usuario_conquistas')
      .select('*, conquista:conquistas(*)')
      .eq('user_id', user?.id)
      .order('desbloqueada_em', { ascending: false }),
    supabase.from('conquistas').select('*').order('ordem', { ascending: true }),
  ])

  const pontosData = pontos as UsuarioPontos | null
  const nivel = pontosData?.nivel || 1
  const pontosAtuais = pontosData?.pontos_totais || 0

  // Calcula pontos para próximo nível (cada nível = 500 pontos)
  const pontosProximoNivel = nivel * 500
  const progressoNivel = Math.min(100, (pontosAtuais / pontosProximoNivel) * 100)

  // Calcula ranking (simplificado)
  const conquistasDesbloqueadas = conquistasUsuario?.length || 0
  const totalConquistas = todasConquistas?.length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Conquistas
        </h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe seu progresso e desbloqueie conquistas
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Nível */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Nível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">{nivel}</div>
            <div className="mt-2 bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${progressoNivel}%` }}
              />
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {pontosAtuais}/{pontosProximoNivel} pontos
            </p>
          </CardContent>
        </Card>

        {/* Pontos totais */}
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Pontos Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600">{pontosAtuais}</div>
            <p className="text-xs text-amber-600 mt-1">
              Continue desbloqueando conquistas!
            </p>
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {conquistasDesbloqueadas}
              <span className="text-lg font-normal text-green-400">/{totalConquistas}</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              {Math.round((conquistasDesbloqueadas / totalConquistas) * 100)}% completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Streak */}
      <div className="max-w-md">
        <CardStreak streak={streak as UsuarioStreak | null} />
      </div>

      {/* Lista completa de conquistas */}
      <ListaConquistas
        conquistasUsuario={(conquistasUsuario || []) as UsuarioConquista[]}
        todasConquistas={(todasConquistas || []) as Conquista[]}
      />
    </div>
  )
}
