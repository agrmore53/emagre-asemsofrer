import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Busca o progresso do usuário
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('conteudo_progresso')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar progresso:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Marca/desmarca capítulo como lido
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { capitulo_id, concluido } = await request.json()

    if (!capitulo_id) {
      return NextResponse.json({ error: 'capitulo_id é obrigatório' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('conteudo_progresso')
      .upsert({
        user_id: user.id,
        capitulo_id,
        concluido: concluido ?? true,
        data_conclusao: concluido ? new Date().toISOString() : null,
      }, {
        onConflict: 'user_id,capitulo_id'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
