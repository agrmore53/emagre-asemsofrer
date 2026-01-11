import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calcularProximaDose, MEDICAMENTOS_INFO } from '@/lib/glp1'

// GET - Buscar dados de GLP-1 do usuário
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar perfil com config de GLP-1
    const { data: profile } = await supabase
      .from('profiles')
      .select('usa_glp1, medicamento_glp1, dose_glp1, dia_aplicacao_glp1, hora_aplicacao_glp1')
      .eq('id', user.id)
      .single()

    if (!profile?.usa_glp1) {
      return NextResponse.json({ configurado: false })
    }

    // Buscar histórico de registros
    const { data: registros } = await supabase
      .from('glp1_registros')
      .select('*')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(30)

    // Calcular próxima dose
    const medicamento = profile.medicamento_glp1 as keyof typeof MEDICAMENTOS_INFO
    const medInfo = MEDICAMENTOS_INFO[medicamento] || MEDICAMENTOS_INFO.outro
    const proximaDose = calcularProximaDose({
      medicamento,
      dose_atual: profile.dose_glp1,
      frequencia: medInfo.frequencia,
      dia_aplicacao: profile.dia_aplicacao_glp1,
      hora_aplicacao: profile.hora_aplicacao_glp1,
    })

    // Estatísticas
    const ultimoRegistro = registros?.[0]
    const mediaNausea = registros?.length
      ? registros.reduce((sum, r) => sum + (r.nivel_nausea || 0), 0) / registros.length
      : 0
    const mediaApetite = registros?.length
      ? registros.reduce((sum, r) => sum + (r.nivel_apetite || 5), 0) / registros.length
      : 5

    // Efeitos mais comuns
    const efeitosContagem = new Map<string, number>()
    registros?.forEach((r) => {
      (r.efeitos_colaterais || []).forEach((e: string) => {
        efeitosContagem.set(e, (efeitosContagem.get(e) || 0) + 1)
      })
    })
    const efeitosComuns = Array.from(efeitosContagem.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([efeito, count]) => ({ efeito, count }))

    return NextResponse.json({
      configurado: true,
      config: {
        medicamento: profile.medicamento_glp1,
        dose: profile.dose_glp1,
        dia_aplicacao: profile.dia_aplicacao_glp1,
        hora_aplicacao: profile.hora_aplicacao_glp1,
        info_medicamento: medInfo,
      },
      proxima_dose: proximaDose.toISOString(),
      dias_para_proxima: Math.ceil(
        (proximaDose.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
      registros: registros || [],
      estatisticas: {
        total_aplicacoes: registros?.length || 0,
        media_nausea: Math.round(mediaNausea * 10) / 10,
        media_apetite: Math.round(mediaApetite * 10) / 10,
        efeitos_comuns: efeitosComuns,
        ultimo_registro: ultimoRegistro?.data,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar GLP-1:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    )
  }
}

// POST - Registrar aplicação
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      data,
      medicamento,
      dose,
      local_aplicacao,
      efeitos_colaterais = [],
      nivel_nausea = 0,
      nivel_apetite = 5,
      notas,
    } = body

    // Inserir registro
    const { data: registro, error } = await supabase
      .from('glp1_registros')
      .insert({
        user_id: user.id,
        data: data || new Date().toISOString().split('T')[0],
        medicamento,
        dose,
        local_aplicacao,
        efeitos_colaterais,
        nivel_nausea,
        nivel_apetite,
        notas,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, registro })
  } catch (error) {
    console.error('Erro ao registrar GLP-1:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar aplicação' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar configuração
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const {
      usa_glp1,
      medicamento,
      dose,
      dia_aplicacao,
      hora_aplicacao,
    } = body

    const { error } = await supabase
      .from('profiles')
      .update({
        usa_glp1,
        medicamento_glp1: medicamento,
        dose_glp1: dose,
        dia_aplicacao_glp1: dia_aplicacao,
        hora_aplicacao_glp1: hora_aplicacao,
      })
      .eq('id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar config GLP-1:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configuração' },
      { status: 500 }
    )
  }
}
