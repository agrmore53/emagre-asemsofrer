import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  gerarCardapioSemanal,
  gerarListaCompras,
  type CardapioSemanal,
} from '@/lib/utils/gerador-cardapio'
import {
  calcularCaloriasObjetivo,
  type Sexo,
  type NivelAtividade,
  type ObjetivoEmagrecimento,
} from '@/lib/utils/calculadora-calorias'
import type { RestricaoAlimentar } from '@/lib/data/alimentos'

// GET - Busca cardápios salvos do usuário
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca cardápios salvos
    const { data: cardapios, error } = await supabase
      .from('cardapios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    return NextResponse.json({ cardapios })
  } catch (error) {
    console.error('Erro ao buscar cardápios:', error)
    return NextResponse.json({ error: 'Erro ao buscar cardápios' }, { status: 500 })
  }
}

// POST - Gera um novo cardápio semanal
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Complete seu perfil antes de gerar um cardápio' },
        { status: 400 }
      )
    }

    // Valida dados necessários
    if (!profile.peso_inicial || !profile.altura_cm) {
      return NextResponse.json(
        { error: 'Informe peso e altura no seu perfil para gerar o cardápio' },
        { status: 400 }
      )
    }

    // Pega parâmetros opcionais do body
    const body = await request.json().catch(() => ({}))
    const {
      objetivo = 'perder_moderado' as ObjetivoEmagrecimento,
      dataInicio = new Date().toISOString().split('T')[0],
    } = body

    // Calcula idade a partir da data de nascimento
    let idade = 30 // default
    if (profile.data_nascimento) {
      const nascimento = new Date(profile.data_nascimento)
      const hoje = new Date()
      idade = hoje.getFullYear() - nascimento.getFullYear()
      const m = hoje.getMonth() - nascimento.getMonth()
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
    }

    // Busca peso mais recente do tracker, se houver
    const { data: ultimoRegistro } = await supabase
      .from('tracker_registros')
      .select('peso_kg')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(1)
      .single()

    const pesoAtual = ultimoRegistro?.peso_kg || profile.peso_inicial

    // Calcula calorias baseado no perfil
    const calorias = calcularCaloriasObjetivo(
      {
        peso: pesoAtual,
        altura: profile.altura_cm,
        idade,
        sexo: (profile.sexo as Sexo) || 'feminino',
        nivelAtividade: (profile.nivel_atividade as NivelAtividade) || 'leve',
      },
      objetivo
    )

    // Pega restrições do perfil
    const restricoes: RestricaoAlimentar[] = profile.restricoes_alimentares || []

    // Gera o cardápio
    const cardapio = gerarCardapioSemanal(new Date(dataInicio), calorias, restricoes)

    // Gera lista de compras
    const listaCompras = gerarListaCompras(cardapio)

    // Salva no banco
    const { data: cardapioSalvo, error } = await supabase
      .from('cardapios')
      .insert({
        user_id: user.id,
        data: dataInicio,
        refeicoes: cardapio,
        calorias_total: cardapio.mediaCaloriasDiaria,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      cardapio,
      listaCompras,
      id: cardapioSalvo?.id,
      caloriasCalculadas: calorias,
      message: 'Cardápio gerado com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao gerar cardápio:', error)
    return NextResponse.json({ error: 'Erro ao gerar cardápio' }, { status: 500 })
  }
}

// DELETE - Remove um cardápio salvo
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID do cardápio é obrigatório' }, { status: 400 })
    }

    const { error } = await supabase
      .from('cardapios')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ message: 'Cardápio excluído' })
  } catch (error) {
    console.error('Erro ao excluir cardápio:', error)
    return NextResponse.json({ error: 'Erro ao excluir cardápio' }, { status: 500 })
  }
}
