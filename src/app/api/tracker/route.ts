import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Busca todos os registros do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    const { data, error, count } = await supabase
      .from('tracker_registros')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({ data, count })
  } catch (error) {
    console.error('Erro ao buscar registros:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Cria um novo registro
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { data: dataRegistro, peso_kg, cintura_cm, quadril_cm, braco_cm, observacoes } = body

    if (!peso_kg || !dataRegistro) {
      return NextResponse.json(
        { error: 'Data e peso são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se já existe registro para essa data
    const { data: existente } = await supabase
      .from('tracker_registros')
      .select('id')
      .eq('user_id', user.id)
      .eq('data', dataRegistro)
      .single()

    if (existente) {
      // Atualiza o registro existente
      const { data, error } = await supabase
        .from('tracker_registros')
        .update({
          peso_kg,
          cintura_cm: cintura_cm || null,
          quadril_cm: quadril_cm || null,
          braco_cm: braco_cm || null,
          observacoes: observacoes || null,
        })
        .eq('id', existente.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // Cria novo registro
    const { data, error } = await supabase
      .from('tracker_registros')
      .insert({
        user_id: user.id,
        data: dataRegistro,
        peso_kg,
        cintura_cm: cintura_cm || null,
        quadril_cm: quadril_cm || null,
        braco_cm: braco_cm || null,
        observacoes: observacoes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar registro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// DELETE - Remove um registro
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tracker_registros')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar registro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
