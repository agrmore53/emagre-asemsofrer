import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Detalhes de um desafio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar desafio
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'Desafio não encontrado' }, { status: 404 })
    }

    // Buscar participantes com ranking
    const { data: participantes } = await supabase
      .from('challenge_participantes')
      .select(`
        *,
        profile:profiles(nome)
      `)
      .eq('challenge_id', id)
      .eq('ativo', true)
      .order('percentual_perdido', { ascending: false })

    // Verificar se usuário participa
    const minhaParticipacao = participantes?.find(p => p.user_id === user.id)

    return NextResponse.json({
      challenge,
      participantes: participantes?.map((p, index) => ({
        ...p,
        posicao: index + 1,
        user_nome: p.profile?.nome || 'Anônimo',
      })) || [],
      minha_participacao: minhaParticipacao ? {
        ...minhaParticipacao,
        posicao: (participantes?.findIndex(p => p.user_id === user.id) || 0) + 1,
      } : null,
      total_participantes: participantes?.length || 0,
    })
  } catch (error) {
    console.error('Erro ao buscar desafio:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar desafio' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar peso no desafio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { peso_atual } = await request.json()

    if (!peso_atual) {
      return NextResponse.json(
        { error: 'Peso atual é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar peso do participante
    const { data, error } = await supabase
      .from('challenge_participantes')
      .update({ peso_atual })
      .eq('challenge_id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // Atualizar ranking do desafio
    await supabase.rpc('atualizar_ranking_challenge', { p_challenge_id: id })

    return NextResponse.json({ participante: data })
  } catch (error) {
    console.error('Erro ao atualizar peso:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar peso' },
      { status: 500 }
    )
  }
}

// DELETE - Sair do desafio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Marcar como inativo (não deletar para histórico)
    const { error } = await supabase
      .from('challenge_participantes')
      .update({ ativo: false })
      .eq('challenge_id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao sair do desafio:', error)
    return NextResponse.json(
      { error: 'Erro ao sair do desafio' },
      { status: 500 }
    )
  }
}
