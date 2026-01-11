import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  CONFIG_APOSTAS,
  verificarMetaRealista,
  calcularGanhoPotencial,
  PLANOS_APOSTA,
  PERIODOS_APOSTA,
} from '@/lib/betting'

// GET - Buscar apostas do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const ativas = searchParams.get('ativas') === 'true'

    let query = supabase
      .from('apostas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (ativas) {
      query = query.in('status', ['ativa', 'verificando'])
    }

    const { data: apostas, error } = await query

    if (error) throw error

    // Calcular estatísticas
    const stats = {
      total_apostas: apostas?.length || 0,
      apostas_ganhas: apostas?.filter(a => a.status === 'ganhou').length || 0,
      apostas_perdidas: apostas?.filter(a => a.status === 'perdeu').length || 0,
      valor_total_ganho: apostas?.filter(a => a.status === 'ganhou').reduce((sum, a) => sum + (a.ganho || 0), 0) || 0,
      valor_total_perdido: apostas?.filter(a => a.status === 'perdeu').reduce((sum, a) => sum + a.valor_apostado, 0) || 0,
    }

    return NextResponse.json({
      apostas: apostas || [],
      stats
    })

  } catch (error) {
    console.error('Erro ao buscar apostas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Criar nova aposta
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { plano_id, periodo_semanas, peso_inicial, peso_meta } = body

    // Validações
    if (!plano_id || !periodo_semanas || !peso_inicial || !peso_meta) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Verificar plano válido
    const plano = PLANOS_APOSTA.find(p => p.id === plano_id)
    if (!plano) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Verificar período válido
    const periodo = PERIODOS_APOSTA.find(p => p.semanas === periodo_semanas)
    if (!periodo) {
      return NextResponse.json({ error: 'Período inválido' }, { status: 400 })
    }

    // Verificar se meta é realista
    const verificacao = verificarMetaRealista(peso_inicial, peso_meta, periodo_semanas)
    if (!verificacao.realista) {
      return NextResponse.json({
        error: verificacao.mensagem,
        perdaSemanal: verificacao.perdaSemanal
      }, { status: 400 })
    }

    // Verificar apostas ativas
    const { data: apostasAtivas } = await supabase
      .from('apostas')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['ativa', 'verificando'])

    if (apostasAtivas && apostasAtivas.length >= 3) {
      return NextResponse.json({ error: 'Máximo de 3 apostas simultâneas' }, { status: 400 })
    }

    // Calcular datas
    const dataInicio = new Date()
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() + periodo.dias)

    // Calcular ganho potencial
    const ganhoPotencial = calcularGanhoPotencial(
      plano.valor,
      plano.multiplicador,
      periodo.multiplicadorBonus
    )

    // Criar aposta
    const { data: aposta, error } = await supabase
      .from('apostas')
      .insert({
        user_id: user.id,
        tipo: 'solo',
        valor_apostado: plano.valor,
        peso_inicial,
        peso_meta,
        data_inicio: dataInicio.toISOString().split('T')[0],
        data_limite: dataLimite.toISOString().split('T')[0],
        status: 'ativa',
        ganho_potencial: ganhoPotencial
      })
      .select()
      .single()

    if (error) throw error

    // Em produção, aqui processaria o pagamento via Mercado Pago

    return NextResponse.json({
      aposta,
      ganhoPotencial,
      mensagem: `Aposta criada! Se atingir ${peso_meta}kg até ${dataLimite.toLocaleDateString('pt-BR')}, você ganha R$${ganhoPotencial.toFixed(2)}!`
    })

  } catch (error) {
    console.error('Erro ao criar aposta:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PATCH - Atualizar aposta (verificar peso, cancelar)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, acao, peso_final } = body

    if (!id || !acao) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Buscar aposta
    const { data: aposta } = await supabase
      .from('apostas')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!aposta) {
      return NextResponse.json({ error: 'Aposta não encontrada' }, { status: 404 })
    }

    if (acao === 'cancelar') {
      // Verificar se pode cancelar (primeiros 3 dias)
      const diasDesdeInicio = Math.floor(
        (Date.now() - new Date(aposta.data_inicio).getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diasDesdeInicio > 3) {
        return NextResponse.json({
          error: 'Cancelamento permitido apenas nos primeiros 3 dias'
        }, { status: 400 })
      }

      const { error } = await supabase
        .from('apostas')
        .update({ status: 'reembolsada' })
        .eq('id', id)

      if (error) throw error

      return NextResponse.json({
        success: true,
        mensagem: 'Aposta cancelada. Reembolso será processado.'
      })
    }

    if (acao === 'verificar' && peso_final) {
      // Verificar se atingiu meta
      const atingiuMeta = peso_final <= aposta.peso_meta
      const status = atingiuMeta ? 'ganhou' : 'perdeu'

      const { data: apostaAtualizada, error } = await supabase
        .from('apostas')
        .update({
          status,
          peso_final,
          ganho: atingiuMeta ? aposta.ganho_potencial : 0
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        aposta: apostaAtualizada,
        atingiuMeta,
        mensagem: atingiuMeta
          ? `Parabéns! Você atingiu a meta e ganhou R$${aposta.ganho_potencial?.toFixed(2)}!`
          : 'Infelizmente a meta não foi atingida. Não desista!'
      })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })

  } catch (error) {
    console.error('Erro ao atualizar aposta:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
