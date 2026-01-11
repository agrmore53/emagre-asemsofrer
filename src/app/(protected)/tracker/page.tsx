import { createClient } from '@/lib/supabase/server'
import { FormularioRegistro } from '@/components/tracker/FormularioRegistro'
import { GraficoEvolucao } from '@/components/tracker/GraficoEvolucao'
import { HistoricoRegistros } from '@/components/tracker/HistoricoRegistros'
import { EstatisticasTracker } from '@/components/tracker/EstatisticasTracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { TrackerRegistro, Profile } from '@/types'

export default async function TrackerPage() {
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

  // Busca os registros do tracker
  const { data: registros } = await supabase
    .from('tracker_registros')
    .select('*')
    .eq('user_id', user?.id)
    .order('data', { ascending: false })
    .limit(100)

  const registrosTyped = (registros || []) as TrackerRegistro[]
  const profileTyped = profile as Profile | null

  // Verifica se o perfil está completo
  const perfilCompleto = profileTyped?.altura_cm && profileTyped?.peso_inicial && profileTyped?.peso_meta

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tracker de Progresso</h1>
          <p className="text-muted-foreground mt-2">
            Registre seu peso e medidas para acompanhar sua evolução
          </p>
        </div>

        {!perfilCompleto && (
          <Link href="/perfil">
            <Button variant="outline">
              Completar perfil para melhor acompanhamento
            </Button>
          </Link>
        )}
      </div>

      {/* Alerta se perfil incompleto */}
      {!perfilCompleto && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 flex items-center gap-2">
              <Badge variant="outline" className="border-amber-300 text-amber-700">Dica</Badge>
              Complete seu perfil para ter estatísticas mais precisas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">
              Preencha sua altura, peso inicial e meta no{' '}
              <Link href="/perfil" className="underline font-medium">
                seu perfil
              </Link>{' '}
              para calcular seu IMC e acompanhar o progresso em direção à sua meta.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <EstatisticasTracker registros={registrosTyped} profile={profileTyped} />

      {/* Grid principal */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Coluna esquerda: Formulário */}
        <div className="space-y-8">
          <FormularioRegistro />

          {/* Dicas */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">💡 Dicas para acompanhar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Pese-se sempre no mesmo horário:</strong> De preferência pela manhã,
                após ir ao banheiro e antes de comer.
              </p>
              <p>
                <strong>Não se pese todo dia:</strong> O peso flutua naturalmente.
                1-2x por semana é suficiente.
              </p>
              <p>
                <strong>Olhe a tendência:</strong> Uma semana específica pode não refletir
                seu progresso real. Olhe o gráfico ao longo do tempo.
              </p>
              <p>
                <strong>Medidas também importam:</strong> Às vezes o peso não muda, mas
                você está perdendo centímetros!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita: Gráfico */}
        <div>
          <GraficoEvolucao
            registros={registrosTyped}
            pesoMeta={profileTyped?.peso_meta}
          />
        </div>
      </div>

      {/* Histórico */}
      <HistoricoRegistros registros={registrosTyped} />
    </div>
  )
}
