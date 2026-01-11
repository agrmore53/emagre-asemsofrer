import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - Buscar vídeos do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') // 'antes', 'durante', 'depois'
    const publicOnly = searchParams.get('public') === 'true'

    let query = supabase
      .from('video_progress')
      .select('*')
      .order('data', { ascending: true })

    // Se busca pública, mostra de todos; se não, só do usuário
    if (publicOnly) {
      query = query.eq('is_public', true)
    } else {
      query = query.eq('user_id', user.id)
    }

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    const { data: videos, error } = await query

    if (error) throw error

    // Buscar perfis dos usuários se for público
    if (publicOnly && videos && videos.length > 0) {
      const userIds = [...new Set(videos.map(v => v.user_id))]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome')
        .in('id', userIds)

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
      const videosComPerfil = videos.map(v => ({
        ...v,
        user_nome: profileMap.get(v.user_id)?.nome || 'Usuário'
      }))

      return NextResponse.json({ videos: videosComPerfil })
    }

    return NextResponse.json({ videos: videos || [] })

  } catch (error) {
    console.error('Erro ao buscar vídeos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Registrar novo vídeo
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, data, peso_kg, video_url, thumbnail_url, descricao, is_public } = body

    if (!tipo || !data || !video_url) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Verificar tipo válido
    if (!['antes', 'durante', 'depois'].includes(tipo)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }

    const { data: video, error } = await supabase
      .from('video_progress')
      .insert({
        user_id: user.id,
        tipo,
        data,
        peso_kg,
        video_url,
        thumbnail_url,
        descricao,
        is_public: is_public || false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ video })

  } catch (error) {
    console.error('Erro ao salvar vídeo:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// DELETE - Remover vídeo
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    // Verificar se o vídeo pertence ao usuário
    const { data: video } = await supabase
      .from('video_progress')
      .select('id, user_id, video_url')
      .eq('id', videoId)
      .single()

    if (!video || video.user_id !== user.id) {
      return NextResponse.json({ error: 'Vídeo não encontrado' }, { status: 404 })
    }

    // Deletar do storage se necessário
    // Em produção, deletaria também do Supabase Storage ou CDN

    const { error } = await supabase
      .from('video_progress')
      .delete()
      .eq('id', videoId)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao deletar vídeo:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PATCH - Atualizar vídeo (visibilidade, descrição)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, descricao, is_public } = body

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}
    if (typeof descricao === 'string') updateData.descricao = descricao
    if (typeof is_public === 'boolean') updateData.is_public = is_public

    const { data: video, error } = await supabase
      .from('video_progress')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ video })

  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
