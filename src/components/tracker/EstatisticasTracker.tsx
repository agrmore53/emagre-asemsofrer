'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingDown, TrendingUp, Target, Scale, Activity, Calendar } from 'lucide-react'
import type { TrackerRegistro, Profile } from '@/types'

interface EstatisticasTrackerProps {
  registros: TrackerRegistro[]
  profile: Profile | null
}

export function EstatisticasTracker({ registros, profile }: EstatisticasTrackerProps) {
  const stats = useMemo(() => {
    if (registros.length === 0) {
      return {
        pesoAtual: null,
        pesoInicial: profile?.peso_inicial || null,
        pesoMeta: profile?.peso_meta || null,
        pesoPerdido: null,
        progressoMeta: 0,
        imc: null,
        classificacaoIMC: '',
        variacaoSemana: null,
        diasRegistrados: 0,
      }
    }

    const pesoAtual = registros[0].peso_kg // Mais recente (ordenado desc)
    const pesoInicial = profile?.peso_inicial || registros[registros.length - 1].peso_kg
    const pesoMeta = profile?.peso_meta || null

    const pesoPerdido = pesoInicial - pesoAtual

    // Progresso em direção à meta
    let progressoMeta = 0
    if (pesoMeta && pesoInicial > pesoMeta) {
      const totalAPerder = pesoInicial - pesoMeta
      progressoMeta = Math.min(100, Math.max(0, (pesoPerdido / totalAPerder) * 100))
    }

    // IMC
    let imc = null
    let classificacaoIMC = ''
    if (profile?.altura_cm) {
      const alturaM = profile.altura_cm / 100
      imc = pesoAtual / (alturaM * alturaM)

      if (imc < 18.5) classificacaoIMC = 'Abaixo do peso'
      else if (imc < 25) classificacaoIMC = 'Peso normal'
      else if (imc < 30) classificacaoIMC = 'Sobrepeso'
      else if (imc < 35) classificacaoIMC = 'Obesidade grau I'
      else if (imc < 40) classificacaoIMC = 'Obesidade grau II'
      else classificacaoIMC = 'Obesidade grau III'
    }

    // Variação última semana (7 dias)
    let variacaoSemana = null
    if (registros.length >= 2) {
      const hoje = new Date()
      const semanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000)

      const registrosSemana = registros.filter(
        (r) => new Date(r.data) >= semanaAtras
      )

      if (registrosSemana.length >= 2) {
        const maisRecente = registrosSemana[0].peso_kg
        const maisAntigo = registrosSemana[registrosSemana.length - 1].peso_kg
        variacaoSemana = maisRecente - maisAntigo
      }
    }

    return {
      pesoAtual,
      pesoInicial,
      pesoMeta,
      pesoPerdido,
      progressoMeta,
      imc,
      classificacaoIMC,
      variacaoSemana,
      diasRegistrados: registros.length,
    }
  }, [registros, profile])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Peso Atual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.pesoAtual ? `${stats.pesoAtual}kg` : '--'}
          </div>
          {stats.variacaoSemana !== null && (
            <p className={`text-xs flex items-center gap-1 mt-1 ${
              stats.variacaoSemana < 0 ? 'text-green-600' : stats.variacaoSemana > 0 ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {stats.variacaoSemana < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : stats.variacaoSemana > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : null}
              {stats.variacaoSemana > 0 ? '+' : ''}{stats.variacaoSemana.toFixed(1)}kg esta semana
            </p>
          )}
        </CardContent>
      </Card>

      {/* Peso Perdido */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Perdido</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${
            stats.pesoPerdido && stats.pesoPerdido > 0 ? 'text-green-600' : ''
          }`}>
            {stats.pesoPerdido !== null
              ? `${stats.pesoPerdido > 0 ? '-' : '+'}${Math.abs(stats.pesoPerdido).toFixed(1)}kg`
              : '--'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Desde {stats.pesoInicial ? `${stats.pesoInicial}kg` : 'o início'}
          </p>
        </CardContent>
      </Card>

      {/* Progresso Meta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meta</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.pesoMeta ? (
            <>
              <div className="text-3xl font-bold">{stats.pesoMeta}kg</div>
              <Progress value={stats.progressoMeta} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.progressoMeta.toFixed(0)}% alcançado
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground mt-1">
                Defina sua meta no perfil
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* IMC */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">IMC</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.imc ? (
            <>
              <div className="text-3xl font-bold">{stats.imc.toFixed(1)}</div>
              <p className={`text-xs mt-1 ${
                stats.classificacaoIMC === 'Peso normal' ? 'text-green-600' : 'text-muted-foreground'
              }`}>
                {stats.classificacaoIMC}
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground mt-1">
                Informe sua altura no perfil
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Card adicional: Dias registrados */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Consistência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold">{stats.diasRegistrados}</span>
              <span className="text-muted-foreground ml-2">
                registro{stats.diasRegistrados !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.diasRegistrados >= 7
                ? '🔥 Você está mantendo a consistência!'
                : stats.diasRegistrados >= 3
                ? '💪 Continue registrando!'
                : '📝 Registre seu peso regularmente para acompanhar sua evolução'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
