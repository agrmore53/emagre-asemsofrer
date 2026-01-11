import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calcularFaseAtual, preverProximaMenstruacao, FASES_CICLO, RECOMENDACOES_POR_FASE } from '@/lib/ciclo-menstrual'

// GET - Buscar dados do ciclo
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar configuração do ciclo
    const { data: ciclo } = await supabase
      .from('ciclo_menstrual')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!ciclo) {
      return NextResponse.json({
        configurado: false,
        message: 'Ciclo não configurado',
      })
    }

    // Calcular fase atual
    const config = {
      duracao_ciclo: ciclo.duracao_ciclo || 28,
      duracao_menstruacao: ciclo.duracao_menstruacao || 5,
      ultima_menstruacao: ciclo.ultima_menstruacao,
    }

    const faseAtual = calcularFaseAtual(config)
    const proximaMenstruacao = preverProximaMenstruacao(config)
    const faseInfo = FASES_CICLO[faseAtual.fase]
    const recomendacoes = RECOMENDACOES_POR_FASE[faseAtual.fase]

    // Buscar histórico de menstruações (últimas 6)
    const { data: historico } = await supabase
      .from('ciclo_menstrual')
      .select('ultima_menstruacao, duracao_menstruacao, sintomas')
      .eq('user_id', user.id)
      .order('ultima_menstruacao', { ascending: false })
      .limit(6)

    return NextResponse.json({
      configurado: true,
      config,
      fase_atual: {
        ...faseInfo,
        dia_atual: faseAtual.diaAtual,
        dias_para_proxima_fase: faseAtual.diasParaProximaFase,
        proxima_fase: faseAtual.proximaFase,
      },
      recomendacoes,
      proxima_menstruacao: proximaMenstruacao.toISOString(),
      dias_para_menstruacao: Math.ceil(
        (proximaMenstruacao.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
      historico: historico || [],
    })
  } catch (error) {
    console.error('Erro ao buscar ciclo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados do ciclo' },
      { status: 500 }
    )
  }
}

// POST - Registrar/atualizar ciclo
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      ultima_menstruacao,
      duracao_ciclo = 28,
      duracao_menstruacao = 5,
      sintomas = [],
      notas,
    } = body

    if (!ultima_menstruacao) {
      return NextResponse.json(
        { error: 'Data da última menstruação é obrigatória' },
        { status: 400 }
      )
    }

    // Inserir novo registro
    const { data, error } = await supabase
      .from('ciclo_menstrual')
      .insert({
        user_id: user.id,
        ultima_menstruacao,
        duracao_ciclo,
        duracao_menstruacao,
        sintomas,
        notas,
      })
      .select()
      .single()

    if (error) throw error

    // Atualizar fase no perfil
    const config = { duracao_ciclo, duracao_menstruacao, ultima_menstruacao }
    const faseAtual = calcularFaseAtual(config)

    await supabase
      .from('profiles')
      .update({ fase_ciclo: faseAtual.fase })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      ciclo: data,
      fase_atual: faseAtual.fase,
    })
  } catch (error) {
    console.error('Erro ao salvar ciclo:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar dados do ciclo' },
      { status: 500 }
    )
  }
}
