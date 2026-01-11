import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLicaoDoDia, LICOES_CBT } from '@/lib/cbt'

// GET - Buscar lição do dia e progresso
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const hoje = new Date().toISOString().split('T')[0]
    const licaoDoDia = getLicaoDoDia()

    // Buscar progresso do usuário
    const { data: progresso } = await supabase
      .from('cbt_progresso')
      .select('*')
      .eq('user_id', user.id)
      .order('data_conclusao', { ascending: false })

    // Verificar se já completou hoje
    const completouHoje = progresso?.some(
      (p) => p.data_conclusao === hoje && p.lesson_id === licaoDoDia.id
    )

    // Contar lições completadas por categoria
    const progressoPorCategoria = LICOES_CBT.reduce(
      (acc, licao) => {
        const completou = progresso?.some((p) => p.lesson_id === licao.id)
        if (completou) {
          acc[licao.categoria] = (acc[licao.categoria] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>
    )

    // Streak de dias consecutivos
    let streak = 0
    const datas = [...new Set(progresso?.map((p) => p.data_conclusao) || [])]
      .sort()
      .reverse()

    if (datas.length > 0) {
      const ontem = new Date()
      ontem.setDate(ontem.getDate() - 1)
      const ontemStr = ontem.toISOString().split('T')[0]

      if (datas[0] === hoje || datas[0] === ontemStr) {
        streak = 1
        for (let i = 1; i < datas.length; i++) {
          const dataAtual = new Date(datas[i - 1])
          const dataAnterior = new Date(datas[i])
          const diff = Math.floor(
            (dataAtual.getTime() - dataAnterior.getTime()) / (1000 * 60 * 60 * 24)
          )
          if (diff === 1) {
            streak++
          } else {
            break
          }
        }
      }
    }

    return NextResponse.json({
      licao_do_dia: licaoDoDia,
      completou_hoje: completouHoje,
      estatisticas: {
        total_completadas: progresso?.length || 0,
        streak_dias: streak,
        progresso_por_categoria: progressoPorCategoria,
        total_licoes: LICOES_CBT.length,
      },
      historico: progresso?.slice(0, 10) || [],
    })
  } catch (error) {
    console.error('Erro ao buscar CBT:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    )
  }
}

// POST - Marcar lição como completa
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { lesson_id, notas, respostas_exercicio } = body

    const hoje = new Date().toISOString().split('T')[0]

    // Verificar se já completou esta lição hoje
    const { data: existente } = await supabase
      .from('cbt_progresso')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
      .eq('data_conclusao', hoje)
      .single()

    if (existente) {
      return NextResponse.json(
        { error: 'Lição já completada hoje' },
        { status: 400 }
      )
    }

    // Registrar conclusão
    const { data, error } = await supabase
      .from('cbt_progresso')
      .insert({
        user_id: user.id,
        lesson_id,
        data_conclusao: hoje,
        notas,
        respostas_exercicio,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, progresso: data })
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    )
  }
}
