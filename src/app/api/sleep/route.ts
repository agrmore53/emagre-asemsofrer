import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calcularSleepScore, analisarImpactoMetabolismo, calcularDuracao } from '@/lib/sleep'

// GET - Buscar histórico de sono
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '14')

    const { data: registros, error } = await supabase
      .from('sleep_registros')
      .select('*')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Calcular scores e análises
    const registrosAnalisados = (registros || []).map((reg) => ({
      ...reg,
      score: calcularSleepScore(reg),
      analise: analisarImpactoMetabolismo(reg),
    }))

    // Calcular estatísticas
    const stats = registrosAnalisados.length > 0
      ? {
          media_duracao:
            registrosAnalisados.reduce(
              (sum, r) => sum + calcularDuracao(r.hora_dormir, r.hora_acordar),
              0
            ) / registrosAnalisados.length,
          media_qualidade:
            registrosAnalisados.reduce((sum, r) => sum + r.qualidade, 0) /
            registrosAnalisados.length,
          media_score:
            registrosAnalisados.reduce((sum, r) => sum + r.score, 0) /
            registrosAnalisados.length,
        }
      : null

    // Verificar se tem registro de hoje
    const hoje = new Date().toISOString().split('T')[0]
    const registroHoje = registrosAnalisados.find((r) => r.data === hoje)

    return NextResponse.json({
      registros: registrosAnalisados,
      registro_hoje: registroHoje || null,
      estatisticas: stats,
    })
  } catch (error) {
    console.error('Erro ao buscar sono:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar registros' },
      { status: 500 }
    )
  }
}

// POST - Registrar sono
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      data,
      hora_dormir,
      hora_acordar,
      qualidade,
      acordou_noite = 0,
      latencia_minutos = 15,
      usou_tela_antes = false,
      cafeina_tarde = false,
      exercicio_dia = false,
      notas,
    } = body

    if (!hora_dormir || !hora_acordar || !qualidade) {
      return NextResponse.json(
        { error: 'Horários e qualidade são obrigatórios' },
        { status: 400 }
      )
    }

    // Upsert (atualiza se já existe registro para a data)
    const dataRegistro = data || new Date().toISOString().split('T')[0]

    const { data: registro, error } = await supabase
      .from('sleep_registros')
      .upsert(
        {
          user_id: user.id,
          data: dataRegistro,
          hora_dormir,
          hora_acordar,
          qualidade,
          acordou_noite,
          latencia_minutos,
          usou_tela_antes,
          cafeina_tarde,
          exercicio_dia,
          notas,
        },
        { onConflict: 'user_id,data' }
      )
      .select()
      .single()

    if (error) throw error

    const analise = analisarImpactoMetabolismo(registro)
    const score = calcularSleepScore(registro)

    return NextResponse.json({
      success: true,
      registro: { ...registro, score, analise },
    })
  } catch (error) {
    console.error('Erro ao salvar sono:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar registro' },
      { status: 500 }
    )
  }
}
