import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Entrar em um desafio por código
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { codigo } = await request.json()

    if (!codigo) {
      return NextResponse.json(
        { error: 'Código de convite é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar desafio pelo código
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('codigo_convite', codigo.toUpperCase())
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json(
        { error: 'Código de convite inválido' },
        { status: 404 }
      )
    }

    // Verificar se já está no desafio
    const { data: jaParticipa } = await supabase
      .from('challenge_participantes')
      .select('id')
      .eq('challenge_id', challenge.id)
      .eq('user_id', user.id)
      .single()

    if (jaParticipa) {
      return NextResponse.json(
        { error: 'Você já participa deste desafio' },
        { status: 400 }
      )
    }

    // Verificar limite de participantes
    const { count } = await supabase
      .from('challenge_participantes')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challenge.id)
      .eq('ativo', true)

    if (count && count >= challenge.max_participantes) {
      return NextResponse.json(
        { error: 'Este desafio já atingiu o limite de participantes' },
        { status: 400 }
      )
    }

    // Verificar se desafio já encerrou
    if (new Date(challenge.data_fim) < new Date()) {
      return NextResponse.json(
        { error: 'Este desafio já foi encerrado' },
        { status: 400 }
      )
    }

    // Buscar peso atual do usuário
    const { data: ultimoPeso } = await supabase
      .from('tracker_registros')
      .select('peso_kg')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(1)
      .single()

    // Adicionar participante
    const { data: participante, error: participanteError } = await supabase
      .from('challenge_participantes')
      .insert({
        challenge_id: challenge.id,
        user_id: user.id,
        peso_inicial: ultimoPeso?.peso_kg,
        peso_atual: ultimoPeso?.peso_kg,
      })
      .select()
      .single()

    if (participanteError) throw participanteError

    return NextResponse.json({
      success: true,
      challenge,
      participante,
    })
  } catch (error) {
    console.error('Erro ao entrar no desafio:', error)
    return NextResponse.json(
      { error: 'Erro ao entrar no desafio' },
      { status: 500 }
    )
  }
}
