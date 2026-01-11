import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  gerarCardapioSemanal,
  gerarCardapioMensal,
  gerarListaComprasInteligente,
  criarPerfilCardapio,
  type CardapioMensal,
} from '@/lib/cardapio/motor-recomendacao'
import {
  calcularCaloriasObjetivo,
  type Sexo,
  type NivelAtividade,
  type ObjetivoEmagrecimento,
} from '@/lib/utils/calculadora-calorias'

// GET - Busca cardápios salvos com receitas
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
      .from('cardapios_receitas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      // Se tabela não existe, retorna array vazio
      if (error.code === '42P01') {
        return NextResponse.json({ cardapios: [] })
      }
      throw error
    }

    return NextResponse.json({ cardapios: cardapios || [] })
  } catch (error) {
    console.error('Erro ao buscar cardápios:', error)
    return NextResponse.json({ error: 'Erro ao buscar cardápios' }, { status: 500 })
  }
}

// POST - Gera novo cardápio com receitas
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

    // Pega parâmetros do body
    const body = await request.json().catch(() => ({}))
    const {
      periodo = 'semanal', // 'semanal' ou 'mensal'
      objetivo = 'perder_moderado' as ObjetivoEmagrecimento,
      dataInicio = new Date().toISOString().split('T')[0],
    } = body

    // Calcula idade
    let idade = 30
    if (profile.data_nascimento) {
      const nascimento = new Date(profile.data_nascimento)
      const hoje = new Date()
      idade = hoje.getFullYear() - nascimento.getFullYear()
      const m = hoje.getMonth() - nascimento.getMonth()
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
    }

    // Busca peso mais recente
    const { data: ultimoRegistro } = await supabase
      .from('tracker_registros')
      .select('peso_kg')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(1)
      .single()

    const pesoAtual = ultimoRegistro?.peso_kg || profile.peso_inicial

    // Calcula calorias
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

    // Mapeia objetivo
    const objetivoCardapio =
      objetivo === 'ganhar_peso'
        ? 'ganhar_massa'
        : objetivo === 'manter'
          ? 'manter_peso'
          : 'perder_peso'

    // Cria perfil de cardápio
    const perfilCardapio = criarPerfilCardapio(
      calorias,
      profile.restricoes_alimentares || [],
      objetivoCardapio
    )

    // Gera cardápio
    const dataInicioDate = new Date(dataInicio)

    let resultado
    if (periodo === 'mensal') {
      resultado = gerarCardapioMensal(dataInicioDate, perfilCardapio)
    } else {
      const dias = gerarCardapioSemanal(dataInicioDate, perfilCardapio)
      resultado = {
        dias,
        perfil: perfilCardapio,
      }
    }

    // Gera lista de compras
    const diasParaCompras = periodo === 'mensal'
      ? (resultado as CardapioMensal).dias.slice(0, 7) // Primeira semana
      : resultado.dias

    const listaCompras = gerarListaComprasInteligente(diasParaCompras)

    // Salva no banco (se tabela existir)
    try {
      await supabase.from('cardapios_receitas').insert({
        user_id: user.id,
        data_inicio: dataInicio,
        periodo,
        cardapio: resultado,
        calorias_alvo: calorias,
      })
    } catch {
      // Ignora erro se tabela não existir
      console.log('Tabela cardapios_receitas não existe, pulando salvamento')
    }

    return NextResponse.json({
      cardapio: resultado,
      listaCompras,
      caloriasCalculadas: calorias,
      periodo,
      message: `Cardápio ${periodo} gerado com sucesso!`,
    })
  } catch (error) {
    console.error('Erro ao gerar cardápio:', error)
    return NextResponse.json({ error: 'Erro ao gerar cardápio' }, { status: 500 })
  }
}
