import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import {
  METAS_PADRAO,
  calcularScoreAtividade,
  gerarInsights,
  DadosWearable,
} from '@/lib/wearables'

// GET - Buscar dispositivos e dados
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') // 'dispositivos' | 'dados' | 'resumo'
    const dias = parseInt(searchParams.get('dias') || '7')

    // Buscar dispositivos conectados
    const { data: dispositivos } = await supabase
      .from('wearable_devices')
      .select('*')
      .eq('user_id', user.id)

    if (tipo === 'dispositivos') {
      return NextResponse.json({ dispositivos: dispositivos || [] })
    }

    // Buscar dados dos últimos X dias
    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - dias)

    const { data: dados } = await supabase
      .from('wearable_data')
      .select('*')
      .eq('user_id', user.id)
      .gte('data', dataInicio.toISOString().split('T')[0])
      .order('data', { ascending: true })

    if (tipo === 'dados') {
      return NextResponse.json({ dados: dados || [] })
    }

    // Buscar metas do usuário
    const { data: metasUser } = await supabase
      .from('wearable_metas')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const metas = metasUser || METAS_PADRAO

    // Calcular resumo
    const dadosArray = (dados || []) as unknown as DadosWearable[]
    const hoje = new Date().toISOString().split('T')[0]
    const dadosHoje = dadosArray.find(d => d.data === hoje)

    let scoreHoje = 0
    let detalhesHoje: { categoria: string; percentual: number; icone: string }[] = []

    if (dadosHoje) {
      const resultado = calcularScoreAtividade(dadosHoje, metas)
      scoreHoje = resultado.score
      detalhesHoje = resultado.detalhes
    }

    // Calcular totais da semana
    const totalPassos = dadosArray.reduce((sum, d) => sum + d.passos, 0)
    const totalCalorias = dadosArray.reduce((sum, d) => sum + d.calorias_queimadas, 0)
    const totalMinutosAtivos = dadosArray.reduce((sum, d) => sum + d.minutos_ativos, 0)
    const mediaPassosDiarios = dadosArray.length > 0 ? Math.round(totalPassos / dadosArray.length) : 0

    // Gerar insights
    const insights = gerarInsights(dadosArray, metas)

    return NextResponse.json({
      dispositivos: dispositivos || [],
      dados: dadosArray,
      metas,
      resumo: {
        scoreHoje,
        detalhesHoje,
        dadosHoje,
        totalPassos,
        totalCalorias,
        totalMinutosAtivos,
        mediaPassosDiarios,
        diasRegistrados: dadosArray.length,
      },
      insights
    })

  } catch (error) {
    console.error('Erro ao buscar dados wearable:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Conectar dispositivo ou registrar dados
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { acao } = body

    if (acao === 'conectar') {
      const { tipo, nome, modelo } = body

      // Criar dispositivo
      const { data: dispositivo, error } = await supabase
        .from('wearable_devices')
        .insert({
          user_id: user.id,
          tipo,
          nome,
          modelo,
          conectado: true,
          ultima_sincronizacao: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ dispositivo })
    }

    if (acao === 'sincronizar') {
      const { device_id, dados: dadosNovos } = body

      // Verificar se dispositivo existe e pertence ao usuário
      const { data: dispositivo } = await supabase
        .from('wearable_devices')
        .select('id')
        .eq('id', device_id)
        .eq('user_id', user.id)
        .single()

      if (!dispositivo) {
        return NextResponse.json({ error: 'Dispositivo não encontrado' }, { status: 404 })
      }

      // Inserir ou atualizar dados (upsert por data)
      const dadosParaInserir = dadosNovos.map((d: Record<string, unknown>) => ({
        user_id: user.id,
        device_id,
        data: d.data,
        passos: d.passos || 0,
        calorias_queimadas: d.calorias_queimadas || 0,
        distancia_km: d.distancia_km || 0,
        minutos_ativos: d.minutos_ativos || 0,
        frequencia_cardiaca_media: d.frequencia_cardiaca_media,
        frequencia_cardiaca_max: d.frequencia_cardiaca_max,
        frequencia_cardiaca_repouso: d.frequencia_cardiaca_repouso,
        sono_horas: d.sono_horas,
        sono_qualidade: d.sono_qualidade,
        peso_kg: d.peso_kg,
      }))

      const { error: insertError } = await supabase
        .from('wearable_data')
        .upsert(dadosParaInserir, {
          onConflict: 'user_id,data',
          ignoreDuplicates: false
        })

      if (insertError) throw insertError

      // Atualizar última sincronização
      await supabase
        .from('wearable_devices')
        .update({ ultima_sincronizacao: new Date().toISOString() })
        .eq('id', device_id)

      return NextResponse.json({
        success: true,
        mensagem: `${dadosNovos.length} registro(s) sincronizado(s)`
      })
    }

    if (acao === 'registrar_manual') {
      const { data, passos, calorias_queimadas, minutos_ativos, sono_horas } = body

      const { error } = await supabase
        .from('wearable_data')
        .upsert({
          user_id: user.id,
          device_id: null, // Registro manual
          data: data || new Date().toISOString().split('T')[0],
          passos: passos || 0,
          calorias_queimadas: calorias_queimadas || 0,
          distancia_km: 0,
          minutos_ativos: minutos_ativos || 0,
          sono_horas,
        }, {
          onConflict: 'user_id,data'
        })

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    if (acao === 'atualizar_metas') {
      const { metas } = body

      const { error } = await supabase
        .from('wearable_metas')
        .upsert({
          user_id: user.id,
          ...metas
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })

  } catch (error) {
    console.error('Erro ao processar wearable:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// DELETE - Desconectar dispositivo
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('id')

    if (!deviceId) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('wearable_devices')
      .delete()
      .eq('id', deviceId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao desconectar:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
