import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Listar grupos e posts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') // 'grupos', 'meus_grupos', 'posts', 'feed'
    const groupId = searchParams.get('group_id')
    const categoria = searchParams.get('categoria')

    if (tipo === 'grupos' || !tipo) {
      // Listar todos os grupos
      let query = supabase
        .from('community_groups')
        .select('*')
        .order('membros_count', { ascending: false })

      if (categoria) {
        query = query.eq('categoria', categoria)
      }

      const { data: grupos, error } = await query.limit(50)
      if (error) throw error

      // Verificar quais grupos o usuário participa
      const { data: minhasParticipacoes } = await supabase
        .from('community_membros')
        .select('group_id')
        .eq('user_id', user.id)

      const meusGruposIds = new Set(minhasParticipacoes?.map(p => p.group_id) || [])

      return NextResponse.json({
        grupos: (grupos || []).map(g => ({
          ...g,
          sou_membro: meusGruposIds.has(g.id)
        }))
      })
    }

    if (tipo === 'meus_grupos') {
      const { data: participacoes } = await supabase
        .from('community_membros')
        .select('group_id, community_groups(*)')
        .eq('user_id', user.id)

      return NextResponse.json({
        grupos: participacoes?.map(p => ({ ...p.community_groups, sou_membro: true })) || []
      })
    }

    if (tipo === 'posts' && groupId) {
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profile:profiles(nome),
          likes:community_likes(user_id),
          comments:community_comments(count)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return NextResponse.json({
        posts: (posts || []).map(p => ({
          ...p,
          user_nome: p.profile?.nome || 'Anônimo',
          likes_count: p.likes?.length || 0,
          comments_count: p.comments?.[0]?.count || 0,
          liked_by_me: p.likes?.some((l: { user_id: string }) => l.user_id === user.id) || false
        }))
      })
    }

    if (tipo === 'feed') {
      // Feed de todos os grupos que participo
      const { data: meusGrupos } = await supabase
        .from('community_membros')
        .select('group_id')
        .eq('user_id', user.id)

      const gruposIds = meusGrupos?.map(g => g.group_id) || []

      if (gruposIds.length === 0) {
        return NextResponse.json({ posts: [] })
      }

      const { data: posts, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profile:profiles(nome),
          group:community_groups(nome, icone),
          likes:community_likes(user_id)
        `)
        .in('group_id', gruposIds)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) throw error

      return NextResponse.json({
        posts: (posts || []).map(p => ({
          ...p,
          user_nome: p.profile?.nome || 'Anônimo',
          group_nome: p.group?.nome,
          group_icone: p.group?.icone,
          likes_count: p.likes?.length || 0,
          liked_by_me: p.likes?.some((l: { user_id: string }) => l.user_id === user.id) || false
        }))
      })
    }

    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}

// POST - Criar grupo, entrar em grupo, criar post, comentar, curtir
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { acao } = body

    if (acao === 'criar_grupo') {
      const { nome, descricao, categoria, icone, privado } = body

      const { data, error } = await supabase
        .from('community_groups')
        .insert({
          nome,
          descricao,
          categoria,
          icone: icone || '💬',
          cor: 'bg-blue-500',
          privado: privado || false,
          criador_id: user.id,
          membros_count: 1,
          posts_count: 0
        })
        .select()
        .single()

      if (error) throw error

      // Adicionar criador como membro
      await supabase.from('community_membros').insert({
        group_id: data.id,
        user_id: user.id,
        role: 'admin'
      })

      return NextResponse.json({ success: true, grupo: data })
    }

    if (acao === 'entrar_grupo') {
      const { group_id } = body

      const { error } = await supabase
        .from('community_membros')
        .insert({ group_id, user_id: user.id, role: 'membro' })

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Você já é membro deste grupo' }, { status: 400 })
        }
        throw error
      }

      // Incrementar contador
      await supabase.rpc('increment_membros_count', { gid: group_id })

      return NextResponse.json({ success: true })
    }

    if (acao === 'sair_grupo') {
      const { group_id } = body

      const { error } = await supabase
        .from('community_membros')
        .delete()
        .eq('group_id', group_id)
        .eq('user_id', user.id)

      if (error) throw error

      // Decrementar contador
      await supabase.rpc('decrement_membros_count', { gid: group_id })

      return NextResponse.json({ success: true })
    }

    if (acao === 'criar_post') {
      const { group_id, conteudo, tipo } = body

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          group_id,
          user_id: user.id,
          conteudo,
          tipo: tipo || 'texto'
        })
        .select()
        .single()

      if (error) throw error

      // Incrementar contador de posts
      await supabase
        .from('community_groups')
        .update({ posts_count: supabase.rpc('increment', { x: 1 }) })
        .eq('id', group_id)

      return NextResponse.json({ success: true, post: data })
    }

    if (acao === 'comentar') {
      const { post_id, conteudo } = body

      const { data, error } = await supabase
        .from('community_comments')
        .insert({ post_id, user_id: user.id, conteudo })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, comment: data })
    }

    if (acao === 'curtir') {
      const { post_id } = body

      // Toggle like
      const { data: existente } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', post_id)
        .eq('user_id', user.id)
        .single()

      if (existente) {
        await supabase
          .from('community_likes')
          .delete()
          .eq('id', existente.id)
        return NextResponse.json({ liked: false })
      } else {
        await supabase
          .from('community_likes')
          .insert({ post_id, user_id: user.id })
        return NextResponse.json({ liked: true })
      }
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    console.error('Erro:', error)
    return NextResponse.json({ error: 'Erro ao processar ação' }, { status: 500 })
  }
}
