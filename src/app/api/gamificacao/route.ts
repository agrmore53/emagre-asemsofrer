import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Conquista, UsuarioConquista, UsuarioStreak, UsuarioPontos } from '@/types'

// GET - Busca dados de gamificação do usuário
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca streak do usuário
    const { data: streak } = await supabase
      .from('usuario_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Busca pontos do usuário
    const { data: pontos } = await supabase
      .from('usuario_pontos')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Busca conquistas desbloqueadas
    const { data: conquistasUsuario } = await supabase
      .from('usuario_conquistas')
      .select(`
        *,
        conquista:conquistas(*)
      `)
      .eq('user_id', user.id)
      .order('desbloqueada_em', { ascending: false })

    // Busca todas as conquistas
    const { data: todasConquistas } = await supabase
      .from('conquistas')
      .select('*')
      .order('ordem', { ascending: true })

    return NextResponse.json({
      streak: streak as UsuarioStreak | null,
      pontos: pontos as UsuarioPontos | null,
      conquistas: (conquistasUsuario || []) as UsuarioConquista[],
      todasConquistas: (todasConquistas || []) as Conquista[],
    })
  } catch (error) {
    console.error('Erro ao buscar gamificação:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}

// POST - Verifica e desbloqueia novas conquistas
export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca dados necessários para verificar conquistas
    const [
      { data: profile },
      { data: streak },
      { data: registros },
      { data: progresso },
      { data: cardapios },
      { data: conquistasAtuais },
      { data: todasConquistas },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('usuario_streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('tracker_registros').select('*').eq('user_id', user.id),
      supabase.from('conteudo_progresso').select('*').eq('user_id', user.id).eq('concluido', true),
      supabase.from('cardapios').select('*').eq('user_id', user.id),
      supabase.from('usuario_conquistas').select('conquista_id').eq('user_id', user.id),
      supabase.from('conquistas').select('*'),
    ])

    const conquistasIds = new Set((conquistasAtuais || []).map((c) => c.conquista_id))
    const novasConquistas: string[] = []

    // Calcula métricas
    const totalRegistros = registros?.length || 0
    const streakAtual = streak?.streak_atual || 0
    const capitulosConcluidos = progresso?.length || 0
    const totalCardapios = cardapios?.length || 0

    // Calcula peso perdido
    let pesoPerdido = 0
    if (registros && registros.length > 0 && profile?.peso_inicial) {
      const registrosOrdenados = [...registros].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      )
      const pesoAtual = registrosOrdenados[0].peso_kg
      pesoPerdido = profile.peso_inicial - pesoAtual
    }

    // Verifica meta alcançada
    let metaAlcancada = false
    if (registros && registros.length > 0 && profile?.peso_meta) {
      const registrosOrdenados = [...registros].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      )
      metaAlcancada = registrosOrdenados[0].peso_kg <= profile.peso_meta
    }

    // Verifica perfil completo
    const perfilCompleto = !!(
      profile?.nome &&
      profile?.data_nascimento &&
      profile?.sexo &&
      profile?.altura_cm &&
      profile?.peso_inicial &&
      profile?.peso_meta
    )

    // Verifica cada conquista
    for (const conquista of todasConquistas || []) {
      if (conquistasIds.has(conquista.id)) continue // Já tem

      const req = conquista.requisito as Record<string, unknown>
      let desbloqueada = false

      switch (req.tipo) {
        case 'registros':
          desbloqueada = totalRegistros >= (req.valor as number)
          break
        case 'streak':
          desbloqueada = streakAtual >= (req.valor as number)
          break
        case 'peso_perdido':
          desbloqueada = pesoPerdido >= (req.valor as number)
          break
        case 'meta_alcancada':
          desbloqueada = metaAlcancada
          break
        case 'capitulos':
          desbloqueada = capitulosConcluidos >= (req.valor as number)
          break
        case 'cardapios':
          desbloqueada = totalCardapios >= (req.valor as number)
          break
        case 'perfil_completo':
          desbloqueada = perfilCompleto
          break
        case 'assinatura':
          desbloqueada = profile?.plano !== 'free'
          break
      }

      if (desbloqueada) {
        novasConquistas.push(conquista.id)
      }
    }

    // Insere novas conquistas
    if (novasConquistas.length > 0) {
      const inserts = novasConquistas.map((conquistaId) => ({
        user_id: user.id,
        conquista_id: conquistaId,
      }))

      await supabase.from('usuario_conquistas').insert(inserts)

      // Atualiza pontos
      const pontosGanhos = (todasConquistas || [])
        .filter((c) => novasConquistas.includes(c.id))
        .reduce((sum, c) => sum + c.pontos, 0)

      if (pontosGanhos > 0) {
        // Busca pontos atuais
        const { data: pontosAtuais } = await supabase
          .from('usuario_pontos')
          .select('pontos_totais')
          .eq('user_id', user.id)
          .single()

        const novoTotal = (pontosAtuais?.pontos_totais || 0) + pontosGanhos
        const novoNivel = Math.floor(novoTotal / 500) + 1

        await supabase
          .from('usuario_pontos')
          .upsert({
            user_id: user.id,
            pontos_totais: novoTotal,
            nivel: novoNivel,
            updated_at: new Date().toISOString(),
          })
      }
    }

    // Busca dados das novas conquistas para retornar
    const { data: conquistasDesbloqueadas } = await supabase
      .from('conquistas')
      .select('*')
      .in('id', novasConquistas)

    return NextResponse.json({
      novasConquistas: conquistasDesbloqueadas || [],
      total: novasConquistas.length,
    })
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error)
    return NextResponse.json({ error: 'Erro ao verificar conquistas' }, { status: 500 })
  }
}
