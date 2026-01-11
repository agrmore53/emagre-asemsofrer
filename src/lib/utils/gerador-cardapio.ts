// Gerador de Cardápio Personalizado

import {
  ALIMENTOS,
  type Alimento,
  type TipoRefeicao,
  type RestricaoAlimentar,
  getAlimentosPorRefeicao,
  getAlimentosCompativeis,
} from '@/lib/data/alimentos'
import { calcularCaloriasPorRefeicao } from './calculadora-calorias'

export interface ItemRefeicao {
  alimento: Alimento
  quantidade: number // multiplicador da porção
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
}

export interface Refeicao {
  tipo: TipoRefeicao
  nome: string
  horarioSugerido: string
  itens: ItemRefeicao[]
  totalCalorias: number
  totalProteinas: number
  totalCarboidratos: number
  totalGorduras: number
}

export interface CardapioDia {
  data: string // YYYY-MM-DD
  diaSemana: string
  refeicoes: Refeicao[]
  totalCalorias: number
  totalProteinas: number
  totalCarboidratos: number
  totalGorduras: number
  metaCalorias: number
}

export interface CardapioSemanal {
  semana: string
  dias: CardapioDia[]
  mediaCaloriasDiaria: number
  restricoes: RestricaoAlimentar[]
  geradoEm: string
}

// Nomes e horários das refeições
const REFEICOES_CONFIG: Record<TipoRefeicao, { nome: string; horario: string }> = {
  cafe_manha: { nome: 'Café da Manhã', horario: '07:00' },
  lanche_manha: { nome: 'Lanche da Manhã', horario: '10:00' },
  almoco: { nome: 'Almoço', horario: '12:30' },
  lanche_tarde: { nome: 'Lanche da Tarde', horario: '16:00' },
  jantar: { nome: 'Jantar', horario: '19:30' },
  ceia: { nome: 'Ceia', horario: '21:30' },
}

// Dias da semana
const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

/**
 * Embaralha um array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Seleciona alimentos para uma refeição tentando atingir a meta calórica
 */
function selecionarItensRefeicao(
  tipoRefeicao: TipoRefeicao,
  metaCalorias: number,
  restricoes: RestricaoAlimentar[],
  alimentosUsadosRecentemente: Set<string> = new Set()
): ItemRefeicao[] {
  const itens: ItemRefeicao[] = []
  let caloriasAtuais = 0
  const margemTolerancia = 50 // +/- 50 calorias

  // Pega alimentos disponíveis para esta refeição
  let alimentosDisponiveis = getAlimentosPorRefeicao(tipoRefeicao)

  // Filtra por restrições
  if (restricoes.length > 0) {
    const alimentosCompativeis = getAlimentosCompativeis(restricoes)
    alimentosDisponiveis = alimentosDisponiveis.filter((a) =>
      alimentosCompativeis.some((c) => c.id === a.id)
    )
  }

  // Prioriza alimentos não usados recentemente
  const alimentosFrescos = alimentosDisponiveis.filter(
    (a) => !alimentosUsadosRecentemente.has(a.id)
  )

  // Usa alimentos frescos se disponíveis, senão usa todos
  const alimentosParaUsar =
    alimentosFrescos.length > 3 ? alimentosFrescos : alimentosDisponiveis

  // Ordena por popularidade e embaralha para variedade
  const alimentosOrdenados = shuffleArray(
    alimentosParaUsar.sort((a, b) => b.popularidade - a.popularidade)
  )

  // Lógica de seleção baseada no tipo de refeição
  const tiposRefeicaoPrincipal: TipoRefeicao[] = ['almoco', 'jantar']
  const isPrincipal = tiposRefeicaoPrincipal.includes(tipoRefeicao)

  if (isPrincipal) {
    // Refeições principais: proteína + carboidrato + vegetal
    const proteina = alimentosOrdenados.find((a) => a.categoria === 'proteina')
    const carboidrato = alimentosOrdenados.find((a) => a.categoria === 'carboidrato')
    const vegetais = alimentosOrdenados.filter((a) => a.categoria === 'vegetal').slice(0, 2)

    if (proteina) {
      const qty = Math.min(1.5, Math.max(0.8, metaCalorias / 400))
      itens.push(criarItem(proteina, qty))
      caloriasAtuais += proteina.calorias * qty
    }

    if (carboidrato) {
      const caloriasRestantes = metaCalorias - caloriasAtuais
      const qty = Math.min(1.5, Math.max(0.5, caloriasRestantes / carboidrato.calorias * 0.6))
      itens.push(criarItem(carboidrato, qty))
      caloriasAtuais += carboidrato.calorias * qty
    }

    for (const vegetal of vegetais) {
      if (caloriasAtuais < metaCalorias - 20) {
        itens.push(criarItem(vegetal, 1))
        caloriasAtuais += vegetal.calorias
      }
    }

    // Adiciona azeite para completar
    const azeite = ALIMENTOS.find((a) => a.id === 'azeite')
    if (azeite && caloriasAtuais < metaCalorias - 50) {
      itens.push(criarItem(azeite, 1))
    }
  } else if (tipoRefeicao === 'cafe_manha') {
    // Café da manhã: carboidrato + proteína + fruta
    const carboidrato = alimentosOrdenados.find(
      (a) => a.categoria === 'carboidrato' && a.refeicoes.includes('cafe_manha')
    )
    const proteina = alimentosOrdenados.find(
      (a) =>
        (a.categoria === 'proteina' || a.categoria === 'laticinio') &&
        a.refeicoes.includes('cafe_manha')
    )
    const fruta = alimentosOrdenados.find(
      (a) => a.categoria === 'fruta' && a.refeicoes.includes('cafe_manha')
    )
    const bebida = alimentosOrdenados.find(
      (a) => a.categoria === 'bebida' && a.refeicoes.includes('cafe_manha')
    )

    if (carboidrato) {
      const qty = Math.max(0.5, Math.min(2, metaCalorias / carboidrato.calorias * 0.4))
      itens.push(criarItem(carboidrato, qty))
      caloriasAtuais += carboidrato.calorias * qty
    }

    if (proteina && caloriasAtuais < metaCalorias * 0.8) {
      itens.push(criarItem(proteina, 1))
      caloriasAtuais += proteina.calorias
    }

    if (fruta && caloriasAtuais < metaCalorias - 30) {
      itens.push(criarItem(fruta, 1))
      caloriasAtuais += fruta.calorias
    }

    if (bebida) {
      itens.push(criarItem(bebida, 1))
    }
  } else if (tipoRefeicao === 'lanche_manha' || tipoRefeicao === 'lanche_tarde') {
    // Lanches: fruta + gordura boa OU laticínio
    const opcao = Math.random() > 0.5 ? 'fruta' : 'laticinio'

    if (opcao === 'fruta') {
      const fruta = alimentosOrdenados.find((a) => a.categoria === 'fruta')
      const gorduraBoa = alimentosOrdenados.find((a) => a.categoria === 'gordura_boa')

      if (fruta) {
        itens.push(criarItem(fruta, 1))
        caloriasAtuais += fruta.calorias
      }

      if (gorduraBoa && caloriasAtuais < metaCalorias - 30) {
        itens.push(criarItem(gorduraBoa, 1))
      }
    } else {
      const laticinio = alimentosOrdenados.find((a) => a.categoria === 'laticinio')
      const gorduraBoa = alimentosOrdenados.find((a) => a.categoria === 'gordura_boa')

      if (laticinio) {
        itens.push(criarItem(laticinio, 1))
        caloriasAtuais += laticinio.calorias
      }

      if (gorduraBoa && caloriasAtuais < metaCalorias) {
        const qty = Math.min(1, (metaCalorias - caloriasAtuais) / gorduraBoa.calorias)
        if (qty > 0.3) {
          itens.push(criarItem(gorduraBoa, qty))
        }
      }
    }
  } else if (tipoRefeicao === 'ceia') {
    // Ceia: leve, proteína ou laticínio
    const opcoes = alimentosOrdenados.filter(
      (a) =>
        (a.categoria === 'laticinio' || a.categoria === 'fruta') &&
        a.calorias <= metaCalorias + 20
    )

    if (opcoes.length > 0) {
      const escolhido = opcoes[0]
      itens.push(criarItem(escolhido, 1))
    }
  }

  return itens
}

/**
 * Cria um item de refeição com cálculos de nutrientes
 */
function criarItem(alimento: Alimento, quantidade: number): ItemRefeicao {
  return {
    alimento,
    quantidade: Math.round(quantidade * 10) / 10,
    calorias: Math.round(alimento.calorias * quantidade),
    proteinas: Math.round(alimento.proteinas * quantidade * 10) / 10,
    carboidratos: Math.round(alimento.carboidratos * quantidade * 10) / 10,
    gorduras: Math.round(alimento.gorduras * quantidade * 10) / 10,
  }
}

/**
 * Gera o cardápio de um dia
 */
export function gerarCardapioDia(
  data: Date,
  caloriasDiarias: number,
  restricoes: RestricaoAlimentar[] = [],
  alimentosUsadosRecentemente: Set<string> = new Set()
): CardapioDia {
  const distribuicao = calcularCaloriasPorRefeicao(caloriasDiarias)
  const refeicoes: Refeicao[] = []

  const tiposRefeicao: TipoRefeicao[] = [
    'cafe_manha',
    'lanche_manha',
    'almoco',
    'lanche_tarde',
    'jantar',
    'ceia',
  ]

  for (const tipo of tiposRefeicao) {
    const metaCalorias = distribuicao[tipo]
    const itens = selecionarItensRefeicao(tipo, metaCalorias, restricoes, alimentosUsadosRecentemente)

    // Adiciona alimentos usados ao set
    itens.forEach((item) => alimentosUsadosRecentemente.add(item.alimento.id))

    const refeicao: Refeicao = {
      tipo,
      nome: REFEICOES_CONFIG[tipo].nome,
      horarioSugerido: REFEICOES_CONFIG[tipo].horario,
      itens,
      totalCalorias: itens.reduce((sum, i) => sum + i.calorias, 0),
      totalProteinas: itens.reduce((sum, i) => sum + i.proteinas, 0),
      totalCarboidratos: itens.reduce((sum, i) => sum + i.carboidratos, 0),
      totalGorduras: itens.reduce((sum, i) => sum + i.gorduras, 0),
    }

    refeicoes.push(refeicao)
  }

  const diaSemana = DIAS_SEMANA[data.getDay()]
  const dataStr = data.toISOString().split('T')[0]

  return {
    data: dataStr,
    diaSemana,
    refeicoes,
    totalCalorias: refeicoes.reduce((sum, r) => sum + r.totalCalorias, 0),
    totalProteinas: refeicoes.reduce((sum, r) => sum + r.totalProteinas, 0),
    totalCarboidratos: refeicoes.reduce((sum, r) => sum + r.totalCarboidratos, 0),
    totalGorduras: refeicoes.reduce((sum, r) => sum + r.totalGorduras, 0),
    metaCalorias: caloriasDiarias,
  }
}

/**
 * Gera cardápio semanal completo
 */
export function gerarCardapioSemanal(
  dataInicio: Date,
  caloriasDiarias: number,
  restricoes: RestricaoAlimentar[] = []
): CardapioSemanal {
  const dias: CardapioDia[] = []
  const alimentosUsadosRecentemente = new Set<string>()

  for (let i = 0; i < 7; i++) {
    const data = new Date(dataInicio)
    data.setDate(data.getDate() + i)

    // Limpa alimentos usados a cada 3 dias para variedade
    if (i % 3 === 0) {
      alimentosUsadosRecentemente.clear()
    }

    const cardapioDia = gerarCardapioDia(data, caloriasDiarias, restricoes, alimentosUsadosRecentemente)
    dias.push(cardapioDia)
  }

  const mediaCaloriasDiaria = Math.round(
    dias.reduce((sum, d) => sum + d.totalCalorias, 0) / 7
  )

  const semanaStr = `${dataInicio.toLocaleDateString('pt-BR')} - ${new Date(
    dataInicio.getTime() + 6 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('pt-BR')}`

  return {
    semana: semanaStr,
    dias,
    mediaCaloriasDiaria,
    restricoes,
    geradoEm: new Date().toISOString(),
  }
}

/**
 * Regenera uma refeição específica
 */
export function regenerarRefeicao(
  refeicaoAtual: Refeicao,
  metaCalorias: number,
  restricoes: RestricaoAlimentar[] = []
): Refeicao {
  // Marca alimentos atuais como usados para evitar repetição
  const alimentosAtuais = new Set(refeicaoAtual.itens.map((i) => i.alimento.id))

  const novosItens = selecionarItensRefeicao(
    refeicaoAtual.tipo,
    metaCalorias,
    restricoes,
    alimentosAtuais
  )

  return {
    ...refeicaoAtual,
    itens: novosItens,
    totalCalorias: novosItens.reduce((sum, i) => sum + i.calorias, 0),
    totalProteinas: novosItens.reduce((sum, i) => sum + i.proteinas, 0),
    totalCarboidratos: novosItens.reduce((sum, i) => sum + i.carboidratos, 0),
    totalGorduras: novosItens.reduce((sum, i) => sum + i.gorduras, 0),
  }
}

/**
 * Gera lista de compras a partir de um cardápio semanal
 */
export function gerarListaCompras(
  cardapio: CardapioSemanal
): { alimento: Alimento; quantidadeTotal: number; unidade: string }[] {
  const contagemAlimentos = new Map<string, { alimento: Alimento; quantidade: number }>()

  for (const dia of cardapio.dias) {
    for (const refeicao of dia.refeicoes) {
      for (const item of refeicao.itens) {
        const atual = contagemAlimentos.get(item.alimento.id)
        if (atual) {
          atual.quantidade += item.quantidade
        } else {
          contagemAlimentos.set(item.alimento.id, {
            alimento: item.alimento,
            quantidade: item.quantidade,
          })
        }
      }
    }
  }

  return Array.from(contagemAlimentos.values())
    .map(({ alimento, quantidade }) => ({
      alimento,
      quantidadeTotal: Math.ceil(quantidade * alimento.porcaoGramas),
      unidade: quantidade > 1 ? 'g' : alimento.porcao.split('(')[0].trim(),
    }))
    .sort((a, b) => a.alimento.categoria.localeCompare(b.alimento.categoria))
}
