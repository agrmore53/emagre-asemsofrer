import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gerarCodigoConvite } from '@/lib/challenges'

// GET - Listar desafios
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') // 'meus', 'publicos', 'todos'
    const status = searchParams.get('status') // 'ativo', 'encerrado', 'pendente'

    let query = supabase
      .from('challenges')
      .select(`
        *,
        challenge_participantes(count),
        minha_participacao:challenge_participantes!inner(
          peso_inicial,
          peso_atual,
          percentual_perdido,
          posicao_ranking
        )
      `)
      .order('created_at', { ascending: false })

    // Filtrar por tipo
    if (tipo === 'meus') {
      // Desafios onde o usuário participa
      query = supabase
        .from('challenges')
        .select(`
          *,
          challenge_participantes!inner(
            peso_inicial,
            peso_atual,
            percentual_perdido,
            posicao_ranking
          )
        `)
        .eq('challenge_participantes.user_id', user.id)
        .order('created_at', { ascending: false })
    } else if (tipo === 'publicos') {
      query = query.eq('privado', false)
    }

    // Filtrar por status (baseado em data)
    const hoje = new Date().toISOString().split('T')[0]
    if (status === 'ativo') {
      query = query.lte('data_inicio', hoje).gte('data_fim', hoje)
    } else if (status === 'encerrado') {
      query = query.lt('data_fim', hoje)
    } else if (status === 'pendente') {
      query = query.gt('data_inicio', hoje)
    }

    const { data: challenges, error } = await query.limit(50)

    if (error) throw error

    return NextResponse.json({ challenges: challenges || [] })
  } catch (error) {
    console.error('Erro ao buscar desafios:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar desafios' },
      { status: 500 }
    )
  }
}

// POST - Criar novo desafio
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      nome,
      descricao,
      tipo = 'peso',
      meta_valor,
      data_inicio,
      data_fim,
      premio_descricao,
      premio_valor,
      max_participantes = 50,
      privado = false,
    } = body

    if (!nome || !data_inicio || !data_fim) {
      return NextResponse.json(
        { error: 'Nome, data de início e fim são obrigatórios' },
        { status: 400 }
      )
    }

    // Gerar código de convite único
    let codigoConvite = gerarCodigoConvite()
    let tentativas = 0
    while (tentativas < 5) {
      const { data: existe } = await supabase
        .from('challenges')
        .select('id')
        .eq('codigo_convite', codigoConvite)
        .single()

      if (!existe) break
      codigoConvite = gerarCodigoConvite()
      tentativas++
    }

    // Criar desafio
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .insert({
        nome,
        descricao,
        tipo,
        meta_valor,
        data_inicio,
        data_fim,
        criador_id: user.id,
        codigo_convite: codigoConvite,
        premio_descricao,
        premio_valor,
        max_participantes,
        privado,
      })
      .select()
      .single()

    if (challengeError) throw challengeError

    // Buscar peso atual do criador
    const { data: ultimoPeso } = await supabase
      .from('tracker_registros')
      .select('peso_kg')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(1)
      .single()

    // Adicionar criador como participante
    const { error: participanteError } = await supabase
      .from('challenge_participantes')
      .insert({
        challenge_id: challenge.id,
        user_id: user.id,
        peso_inicial: ultimoPeso?.peso_kg,
        peso_atual: ultimoPeso?.peso_kg,
      })

    if (participanteError) throw participanteError

    return NextResponse.json({ challenge, codigo_convite: codigoConvite })
  } catch (error) {
    console.error('Erro ao criar desafio:', error)
    return NextResponse.json(
      { error: 'Erro ao criar desafio' },
      { status: 500 }
    )
  }
}
