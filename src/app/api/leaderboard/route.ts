import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSemanaAtual, calcularPercentualPerda } from '@/lib/leaderboard'

// GET - Buscar leaderboard semanal
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria') || 'geral'
    const semanaOffset = parseInt(searchParams.get('semana') || '0')

    // Calcular semana
    const semanaAtual = getSemanaAtual()
    const inicio = new Date(semanaAtual.inicio)
    const fim = new Date(semanaAtual.fim)

    // Aplicar offset de semana (negativo = semanas anteriores)
    inicio.setDate(inicio.getDate() + semanaOffset * 7)
    fim.setDate(fim.getDate() + semanaOffset * 7)

    const semanaInicio = inicio.toISOString().split('T')[0]
    const semanaFim = fim.toISOString().split('T')[0]

    // Buscar registros da semana
    // Primeiro, buscar o primeiro e último peso de cada usuário na semana
    const { data: registros, error: registrosError } = await supabase
      .from('tracker_registros')
      .select(`
        user_id,
        peso_kg,
        data,
        profiles:user_id(nome, sexo, data_nascimento)
      `)
      .gte('data', semanaInicio)
      .lte('data', semanaFim)
      .order('data', { ascending: true })

    if (registrosError) throw registrosError

    // Agrupar por usuário
    interface RegistroData {
      user_id: string
      peso_kg: number
      data: string
      profiles: { nome: string; sexo?: string; data_nascimento?: string } | null
    }

    type UserMapEntry = {
      primeiro_peso: number
      ultimo_peso: number
      nome: string
      sexo?: string
      idade?: number
      total_registros: number
    }

    const userMap: Record<string, UserMapEntry> = {}

    ;((registros as unknown as RegistroData[]) || []).forEach((reg) => {
      const existing = userMap[reg.user_id]

      if (!existing) {
        let idade: number | undefined
        if (reg.profiles?.data_nascimento) {
          const nascimento = new Date(reg.profiles.data_nascimento)
          idade = Math.floor((Date.now() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        }

        userMap[reg.user_id] = {
          primeiro_peso: reg.peso_kg,
          ultimo_peso: reg.peso_kg,
          nome: reg.profiles?.nome || 'Anônimo',
          sexo: reg.profiles?.sexo,
          idade,
          total_registros: 1,
        }
      } else {
        existing.ultimo_peso = reg.peso_kg // Último registro (ordenado por data asc)
        existing.total_registros++
      }
    })

    // Converter para array e calcular percentual
    let entries = Object.entries(userMap).map(([userId, data]) => ({
      user_id: userId,
      user_nome: data.nome,
      peso_inicial_semana: data.primeiro_peso,
      peso_final_semana: data.ultimo_peso,
      percentual_perdido: calcularPercentualPerda(data.primeiro_peso, data.ultimo_peso),
      sexo: data.sexo,
      idade: data.idade,
      total_registros: data.total_registros,
    }))

    // Aplicar filtro de categoria
    if (categoria === 'masculino') {
      entries = entries.filter((e) => e.sexo === 'masculino')
    } else if (categoria === 'feminino') {
      entries = entries.filter((e) => e.sexo === 'feminino')
    } else if (categoria === 'minha_idade') {
      // Buscar idade do usuário
      const { data: meuPerfil } = await supabase
        .from('profiles')
        .select('data_nascimento')
        .eq('id', user.id)
        .single()

      if (meuPerfil?.data_nascimento) {
        const minhaIdade = Math.floor(
          (Date.now() - new Date(meuPerfil.data_nascimento).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
        // Faixa de 10 anos
        const idadeMin = Math.floor(minhaIdade / 10) * 10
        const idadeMax = idadeMin + 10
        entries = entries.filter((e) => e.idade && e.idade >= idadeMin && e.idade < idadeMax)
      }
    }

    // Ordenar por percentual perdido (maior perda primeiro)
    entries.sort((a, b) => b.percentual_perdido - a.percentual_perdido)

    // Adicionar posição
    const entriesWithPosition = entries.map((entry, index) => ({
      ...entry,
      posicao: index + 1,
      semana_inicio: semanaInicio,
      semana_fim: semanaFim,
    }))

    // Encontrar minha posição
    const minhaEntrada = entriesWithPosition.find((e) => e.user_id === user.id)

    // Buscar streak do usuário
    const { data: streakData } = await supabase
      .from('profiles')
      .select('streak_atual')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      entries: entriesWithPosition.slice(0, 50), // Top 50
      minha_posicao: minhaEntrada || null,
      total_participantes: entriesWithPosition.length,
      semana_atual: {
        inicio: semanaInicio,
        fim: semanaFim,
        numero: semanaAtual.numero + semanaOffset,
      },
      meu_streak: streakData?.streak_atual || 0,
    })
  } catch (error) {
    console.error('Erro ao buscar leaderboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar leaderboard' },
      { status: 500 }
    )
  }
}
