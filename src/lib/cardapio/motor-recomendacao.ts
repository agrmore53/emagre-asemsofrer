// Motor de Recomendação Inteligente de Receitas
// Gera cardápios personalizados com base no perfil do usuário
// Inclui personalização por faixa etária e fase hormonal

import {
  RECEITAS,
  getReceitasPorTipo,
  type Receita,
  type TipoRefeicao,
  type TagReceita,
  type Dificuldade,
} from '@/lib/data/receitas'

import {
  getFaixaEtaria,
  sugerirFaseHormonal,
  calcularTMBAjustada,
  calcularProteinaIdade,
  PERFIS_IDADE,
  AJUSTES_HORMONAIS,
  type FaixaEtaria,
  type FaseHormonal,
} from '@/lib/nutricao/faixas-etarias'

// ========================================
// TIPOS DO SISTEMA
// ========================================

export interface PerfilCardapio {
  caloriasAlvo: number
  restricoes: TagReceita[] // vegetariano, vegano, sem_gluten, sem_lactose
  preferencias: TagReceita[] // low_carb, proteico, fitness, etc
  tempoMaximo?: number // minutos disponíveis para cozinhar
  dificuldadeMaxima?: Dificuldade
  objetivos: ObjetivoNutricional[]
  // Novos campos para personalização por idade
  idade?: number
  sexo?: 'masculino' | 'feminino'
  faixaEtaria?: FaixaEtaria
  faseHormonal?: FaseHormonal
  proteinaAlvo?: number // g/dia baseado na idade
}

export type ObjetivoNutricional =
  | 'perder_peso'
  | 'ganhar_massa'
  | 'manter_peso'
  | 'mais_proteina'
  | 'low_carb'
  | 'equilibrado'

export interface RefeicaoCardapio {
  tipo: TipoRefeicao
  nome: string
  horarioSugerido: string
  receita: Receita
  porcoes: number
  nutrientes: {
    calorias: number
    proteinas: number
    carboidratos: number
    gorduras: number
    fibras: number
    agua: number
  }
}

export interface CardapioDiaReceitas {
  data: string
  diaSemana: string
  refeicoes: RefeicaoCardapio[]
  totais: {
    calorias: number
    proteinas: number
    carboidratos: number
    gorduras: number
    fibras: number
    agua: number
  }
  metaCalorias: number
  percentualMeta: number
}

export interface CardapioMensal {
  mes: string
  dataInicio: string
  dataFim: string
  dias: CardapioDiaReceitas[]
  estatisticas: EstatisticasCardapio
  perfil: PerfilCardapio
  geradoEm: string
}

export interface EstatisticasCardapio {
  mediaCaloriasDiaria: number
  mediaProteinasDiaria: number
  mediaCarbosDiaria: number
  mediaGordurasDiaria: number
  receitasUnicas: number
  totalReceitas: number
  distribuicaoTags: Record<string, number>
  variedade: number // 0-100%
}

export interface ItemListaCompras {
  ingrediente: string
  quantidadeTotal: number
  unidade: string
  categoria: string
  receitas: string[] // nomes das receitas que usam
  estimativaPreco?: number
}

export interface ListaComprasInteligente {
  semana: string
  itens: ItemListaCompras[]
  totalItens: number
  porCategoria: Record<string, ItemListaCompras[]>
  dicasCompra: string[]
  estimativaTotal?: number
}

// ========================================
// CONFIGURAÇÕES
// ========================================

const HORARIOS_REFEICOES: Record<TipoRefeicao, string> = {
  cafe_manha: '07:00',
  lanche: '10:00 / 16:00',
  almoco: '12:30',
  jantar: '19:30',
  ceia: '21:30',
}

const NOMES_REFEICOES: Record<TipoRefeicao, string> = {
  cafe_manha: 'Café da Manhã',
  lanche: 'Lanche',
  almoco: 'Almoço',
  jantar: 'Jantar',
  ceia: 'Ceia',
}

const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
]

// Distribuição de calorias por refeição
const DISTRIBUICAO_CALORIAS: Record<TipoRefeicao, number> = {
  cafe_manha: 0.25, // 25%
  lanche: 0.10, // 10% cada (2 lanches = 20%)
  almoco: 0.30, // 30%
  jantar: 0.25, // 25%
  ceia: 0.10, // 10%
}

// ========================================
// FUNÇÕES DE SCORING (PONTUAÇÃO)
// ========================================

/**
 * Calcula pontuação de uma receita para um perfil específico
 */
function calcularScoreReceita(
  receita: Receita,
  perfil: PerfilCardapio,
  metaCalorias: number,
  receitasUsadas: Set<string>
): number {
  let score = 100

  // Penaliza receitas já usadas (variedade)
  if (receitasUsadas.has(receita.id)) {
    score -= 80 // Penalização severa para repetições
  }

  // Verifica restrições alimentares (elimina se não compatível)
  for (const restricao of perfil.restricoes) {
    // Mapeia restrições para tags de receita
    const tagRestricao = mapearRestricaoParaTag(restricao)
    if (tagRestricao && !receita.tags.includes(tagRestricao)) {
      // Se a restrição exige algo que a receita não tem, penaliza muito
      if (restricao === 'vegetariano' && !receita.tags.includes('vegetariano') && !receita.tags.includes('vegano')) {
        return -1000 // Elimina
      }
      if (restricao === 'vegano' && !receita.tags.includes('vegano')) {
        return -1000
      }
      if (restricao === 'sem_gluten' && !receita.tags.includes('sem_gluten')) {
        return -1000
      }
      if (restricao === 'sem_lactose' && !receita.tags.includes('sem_lactose')) {
        return -1000
      }
    }
  }

  // Bônus para preferências
  for (const pref of perfil.preferencias) {
    if (receita.tags.includes(pref)) {
      score += 15
    }
  }

  // Ajuste por calorias (quanto mais próximo da meta, melhor)
  const diferencaCalorias = Math.abs(receita.nutrientes.calorias - metaCalorias)
  const percentualDiferenca = (diferencaCalorias / metaCalorias) * 100

  if (percentualDiferenca <= 10) score += 20 // Muito próximo
  else if (percentualDiferenca <= 20) score += 10
  else if (percentualDiferenca <= 30) score += 0
  else score -= 10 // Muito diferente

  // Ajuste por objetivo
  for (const objetivo of perfil.objetivos) {
    switch (objetivo) {
      case 'perder_peso':
        if (receita.tags.includes('leve')) score += 10
        if (receita.tags.includes('saciedade')) score += 10
        if (receita.nutrientes.calorias < metaCalorias) score += 5
        break
      case 'ganhar_massa':
        if (receita.tags.includes('proteico')) score += 15
        if (receita.nutrientes.proteinas > 20) score += 10
        break
      case 'low_carb':
        if (receita.tags.includes('low_carb')) score += 20
        if (receita.nutrientes.carboidratos < 20) score += 10
        break
      case 'mais_proteina':
        if (receita.tags.includes('proteico')) score += 15
        if (receita.nutrientes.proteinas > 25) score += 15
        break
    }
  }

  // Ajuste por tempo disponível
  if (perfil.tempoMaximo) {
    const tempoTotal = receita.tempoPreparo + receita.tempoCozimento
    if (tempoTotal > perfil.tempoMaximo) {
      score -= 30 // Penaliza se excede tempo
    } else if (tempoTotal <= perfil.tempoMaximo * 0.5) {
      score += 10 // Bônus se é bem rápido
    }
  }

  // Ajuste por dificuldade
  if (perfil.dificuldadeMaxima) {
    const niveis: Dificuldade[] = ['facil', 'medio', 'dificil']
    const nivelMax = niveis.indexOf(perfil.dificuldadeMaxima)
    const nivelReceita = niveis.indexOf(receita.dificuldade)

    if (nivelReceita > nivelMax) {
      score -= 25
    } else if (nivelReceita < nivelMax) {
      score += 5 // Leve bônus para receitas mais fáceis
    }
  }

  // Bônus por variedade de nutrientes
  if (receita.nutrientes.fibras > 5) score += 5
  if (receita.nutrientes.agua > 200) score += 3

  // ========================================
  // AJUSTES POR FAIXA ETÁRIA E FASE HORMONAL
  // ========================================

  // Bônus para receitas com tags apropriadas para a faixa etária
  if (perfil.faixaEtaria) {
    const perfilIdade = PERFIS_IDADE[perfil.faixaEtaria]

    // 40+ anos: prioriza cálcio e vitamina D (osteoporose)
    if (['40-49', '50-59', '60-69', '70+'].includes(perfil.faixaEtaria)) {
      if (receita.tags.includes('rico_calcio')) score += 15
      if (receita.tags.includes('rico_vitamina_d')) score += 12
      if (receita.tags.includes('rico_magnesio')) score += 10
    }

    // 50+ anos: prioriza anti-sarcopenia (alta proteína + leucina)
    if (['50-59', '60-69', '70+'].includes(perfil.faixaEtaria)) {
      if (receita.tags.includes('anti_sarcopenia')) score += 20
      if (receita.tags.includes('proteico') && receita.nutrientes.proteinas > 25) score += 15
      if (receita.tags.includes('rico_b12')) score += 10
    }

    // 60+ anos: prioriza baixo sódio e fácil digestão
    if (['60-69', '70+'].includes(perfil.faixaEtaria)) {
      if (receita.tags.includes('baixo_sodio')) score += 12
      if (receita.tags.includes('rico_fibras')) score += 10
      if (receita.dificuldade === 'facil') score += 5 // Prático para idosos
    }

    // 30-40 anos: prioriza termogênicos (metabolismo mais lento)
    if (['30-39', '40-49'].includes(perfil.faixaEtaria)) {
      if (receita.tags.includes('termogenico')) score += 12
      if (receita.tags.includes('anti_inflamatorio')) score += 8
    }

    // Alta proteína ajustada por idade (PROT-AGE study)
    if (perfil.proteinaAlvo && receita.nutrientes.proteinas > 0) {
      const proteinaPorRefeicao = perfil.proteinaAlvo / 5 // 5 refeições
      if (receita.nutrientes.proteinas >= proteinaPorRefeicao * 0.8) {
        score += 10 // Atinge meta proteica
      }
    }
  }

  // Bônus para fase hormonal específica
  if (perfil.faseHormonal) {
    // Menopausa: fitoestrogênios, cálcio, magnésio
    if (['pre_menopausa', 'perimenopausa', 'menopausa'].includes(perfil.faseHormonal)) {
      if (receita.tags.includes('fitoestrogenos')) score += 20
      if (receita.tags.includes('rico_calcio')) score += 15
      if (receita.tags.includes('rico_magnesio')) score += 12
      if (receita.tags.includes('rico_omega3')) score += 10 // Ondas de calor
    }

    // Andropausa: zinco, vitamina D, proteína
    if (['andropausa_inicial', 'andropausa'].includes(perfil.faseHormonal)) {
      if (receita.tags.includes('rico_zinco')) score += 18
      if (receita.tags.includes('rico_vitamina_d')) score += 15
      if (receita.tags.includes('proteico')) score += 12
      if (receita.tags.includes('anti_inflamatorio')) score += 10
    }
  }

  // Bônus geral para receitas anti-inflamatórias (benefício universal 40+)
  if (perfil.idade && perfil.idade >= 40) {
    if (receita.tags.includes('anti_inflamatorio')) score += 8
    if (receita.tags.includes('rico_omega3')) score += 8
  }

  return score
}

function mapearRestricaoParaTag(restricao: TagReceita): TagReceita | null {
  const mapa: Record<string, TagReceita> = {
    vegetariano: 'vegetariano',
    vegano: 'vegano',
    sem_gluten: 'sem_gluten',
    sem_lactose: 'sem_lactose',
  }
  return mapa[restricao] || null
}

// ========================================
// SELEÇÃO DE RECEITAS
// ========================================

/**
 * Seleciona a melhor receita para uma refeição
 */
function selecionarReceita(
  tipoRefeicao: TipoRefeicao,
  perfil: PerfilCardapio,
  metaCalorias: number,
  receitasUsadas: Set<string>
): Receita | null {
  const receitasDisponiveis = getReceitasPorTipo(tipoRefeicao)

  if (receitasDisponiveis.length === 0) {
    return null
  }

  // Calcula score para cada receita
  const receitasComScore = receitasDisponiveis.map(receita => ({
    receita,
    score: calcularScoreReceita(receita, perfil, metaCalorias, receitasUsadas)
  }))

  // Filtra receitas eliminadas (score negativo muito alto)
  const receitasValidas = receitasComScore.filter(r => r.score > -500)

  if (receitasValidas.length === 0) {
    // Se não houver receitas válidas, tenta ignorar repetição
    const receitasMenosPenalizadas = receitasComScore.filter(r => r.score > -1000)
    if (receitasMenosPenalizadas.length > 0) {
      receitasMenosPenalizadas.sort((a, b) => b.score - a.score)
      return receitasMenosPenalizadas[0].receita
    }
    return receitasDisponiveis[0] // Fallback
  }

  // Ordena por score (maior primeiro)
  receitasValidas.sort((a, b) => b.score - a.score)

  // Adiciona um pouco de aleatoriedade entre os top 3
  const topReceitas = receitasValidas.slice(0, Math.min(3, receitasValidas.length))
  const randomIndex = Math.floor(Math.random() * topReceitas.length)

  return topReceitas[randomIndex].receita
}

/**
 * Calcula porções necessárias para atingir meta calórica
 */
function calcularPorcoes(receita: Receita, metaCalorias: number): number {
  const caloriasPorPorcao = receita.nutrientes.calorias
  if (caloriasPorPorcao === 0) return 1

  const porcoes = metaCalorias / caloriasPorPorcao
  // Arredonda para 0.5 mais próximo
  return Math.max(0.5, Math.round(porcoes * 2) / 2)
}

// ========================================
// GERAÇÃO DE CARDÁPIO
// ========================================

/**
 * Gera cardápio de um dia
 */
export function gerarCardapioDia(
  data: Date,
  perfil: PerfilCardapio,
  receitasUsadasGlobal: Set<string>
): CardapioDiaReceitas {
  const refeicoes: RefeicaoCardapio[] = []
  const receitasUsadasHoje = new Set<string>()

  // Tipos de refeição do dia
  const tiposRefeicao: TipoRefeicao[] = ['cafe_manha', 'lanche', 'almoco', 'lanche', 'jantar']

  // Se calorias > 1800, adiciona ceia
  if (perfil.caloriasAlvo > 1800) {
    tiposRefeicao.push('ceia')
  }

  for (let i = 0; i < tiposRefeicao.length; i++) {
    const tipo = tiposRefeicao[i]
    const metaCalorias = perfil.caloriasAlvo * DISTRIBUICAO_CALORIAS[tipo]

    // Combina receitas usadas globalmente com as de hoje
    const todasUsadas = new Set([...receitasUsadasGlobal, ...receitasUsadasHoje])

    const receita = selecionarReceita(tipo, perfil, metaCalorias, todasUsadas)

    if (receita) {
      const porcoes = calcularPorcoes(receita, metaCalorias)

      const refeicao: RefeicaoCardapio = {
        tipo,
        nome: i === 3 ? 'Lanche da Tarde' : (i === 1 ? 'Lanche da Manhã' : NOMES_REFEICOES[tipo]),
        horarioSugerido: HORARIOS_REFEICOES[tipo],
        receita,
        porcoes,
        nutrientes: {
          calorias: Math.round(receita.nutrientes.calorias * porcoes),
          proteinas: Math.round(receita.nutrientes.proteinas * porcoes * 10) / 10,
          carboidratos: Math.round(receita.nutrientes.carboidratos * porcoes * 10) / 10,
          gorduras: Math.round(receita.nutrientes.gorduras * porcoes * 10) / 10,
          fibras: Math.round(receita.nutrientes.fibras * porcoes * 10) / 10,
          agua: Math.round(receita.nutrientes.agua * porcoes),
        },
      }

      refeicoes.push(refeicao)
      receitasUsadasHoje.add(receita.id)
    }
  }

  // Calcula totais
  const totais = refeicoes.reduce(
    (acc, ref) => ({
      calorias: acc.calorias + ref.nutrientes.calorias,
      proteinas: acc.proteinas + ref.nutrientes.proteinas,
      carboidratos: acc.carboidratos + ref.nutrientes.carboidratos,
      gorduras: acc.gorduras + ref.nutrientes.gorduras,
      fibras: acc.fibras + ref.nutrientes.fibras,
      agua: acc.agua + ref.nutrientes.agua,
    }),
    { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, agua: 0 }
  )

  const diaSemana = DIAS_SEMANA[data.getDay()]
  const dataStr = data.toISOString().split('T')[0]

  return {
    data: dataStr,
    diaSemana,
    refeicoes,
    totais,
    metaCalorias: perfil.caloriasAlvo,
    percentualMeta: Math.round((totais.calorias / perfil.caloriasAlvo) * 100),
  }
}

/**
 * Gera cardápio semanal (7 dias)
 */
export function gerarCardapioSemanal(
  dataInicio: Date,
  perfil: PerfilCardapio
): CardapioDiaReceitas[] {
  const dias: CardapioDiaReceitas[] = []
  const receitasUsadas = new Set<string>()

  for (let i = 0; i < 7; i++) {
    const data = new Date(dataInicio)
    data.setDate(data.getDate() + i)

    // Limpa receitas usadas a cada 3 dias para permitir alguma repetição
    if (i % 4 === 0 && i > 0) {
      receitasUsadas.clear()
    }

    const cardapioDia = gerarCardapioDia(data, perfil, receitasUsadas)
    dias.push(cardapioDia)

    // Adiciona receitas do dia ao conjunto global
    cardapioDia.refeicoes.forEach(ref => receitasUsadas.add(ref.receita.id))
  }

  return dias
}

/**
 * Gera cardápio mensal (30 dias) SEM REPETIÇÃO
 */
export function gerarCardapioMensal(
  dataInicio: Date,
  perfil: PerfilCardapio
): CardapioMensal {
  const dias: CardapioDiaReceitas[] = []
  const receitasUsadas = new Set<string>()
  const contadorTags: Record<string, number> = {}

  for (let i = 0; i < 30; i++) {
    const data = new Date(dataInicio)
    data.setDate(data.getDate() + i)

    // Limpa receitas apenas a cada 10 dias para máxima variedade
    if (i % 10 === 0 && i > 0) {
      // Limpa apenas metade das receitas para manter alguma variedade
      const receitasArray = Array.from(receitasUsadas)
      const metade = Math.floor(receitasArray.length / 2)
      for (let j = 0; j < metade; j++) {
        receitasUsadas.delete(receitasArray[j])
      }
    }

    const cardapioDia = gerarCardapioDia(data, perfil, receitasUsadas)
    dias.push(cardapioDia)

    // Conta tags usadas
    cardapioDia.refeicoes.forEach(ref => {
      receitasUsadas.add(ref.receita.id)
      ref.receita.tags.forEach(tag => {
        contadorTags[tag] = (contadorTags[tag] || 0) + 1
      })
    })
  }

  // Calcula estatísticas
  const estatisticas = calcularEstatisticas(dias, contadorTags)

  const dataFim = new Date(dataInicio)
  dataFim.setDate(dataFim.getDate() + 29)

  return {
    mes: `${dataInicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    dataInicio: dataInicio.toISOString().split('T')[0],
    dataFim: dataFim.toISOString().split('T')[0],
    dias,
    estatisticas,
    perfil,
    geradoEm: new Date().toISOString(),
  }
}

function calcularEstatisticas(
  dias: CardapioDiaReceitas[],
  contadorTags: Record<string, number>
): EstatisticasCardapio {
  const totalDias = dias.length
  const receitasUnicas = new Set<string>()
  let totalReceitas = 0

  let somaCalories = 0
  let somaProteinas = 0
  let somaCarbos = 0
  let somaGorduras = 0

  for (const dia of dias) {
    somaCalories += dia.totais.calorias
    somaProteinas += dia.totais.proteinas
    somaCarbos += dia.totais.carboidratos
    somaGorduras += dia.totais.gorduras

    for (const refeicao of dia.refeicoes) {
      receitasUnicas.add(refeicao.receita.id)
      totalReceitas++
    }
  }

  return {
    mediaCaloriasDiaria: Math.round(somaCalories / totalDias),
    mediaProteinasDiaria: Math.round(somaProteinas / totalDias),
    mediaCarbosDiaria: Math.round(somaCarbos / totalDias),
    mediaGordurasDiaria: Math.round(somaGorduras / totalDias),
    receitasUnicas: receitasUnicas.size,
    totalReceitas,
    distribuicaoTags: contadorTags,
    variedade: Math.round((receitasUnicas.size / totalReceitas) * 100),
  }
}

// ========================================
// LISTA DE COMPRAS INTELIGENTE
// ========================================

const CATEGORIAS_MERCADO = {
  proteina: 'Carnes e Proteínas',
  carboidrato: 'Grãos e Cereais',
  vegetal: 'Hortifruti',
  fruta: 'Hortifruti',
  gordura: 'Óleos e Gorduras',
  tempero: 'Temperos e Condimentos',
  laticinio: 'Laticínios',
  outros: 'Outros',
}

/**
 * Gera lista de compras inteligente a partir de um cardápio
 */
export function gerarListaComprasInteligente(
  dias: CardapioDiaReceitas[]
): ListaComprasInteligente {
  const ingredientesMap = new Map<string, ItemListaCompras>()

  // Agrupa todos os ingredientes
  for (const dia of dias) {
    for (const refeicao of dia.refeicoes) {
      const porcoes = refeicao.porcoes

      for (const ingrediente of refeicao.receita.ingredientes) {
        const chave = `${ingrediente.nome.toLowerCase()}-${ingrediente.unidade}`

        if (ingredientesMap.has(chave)) {
          const item = ingredientesMap.get(chave)!
          item.quantidadeTotal += ingrediente.quantidade * porcoes
          if (!item.receitas.includes(refeicao.receita.nome)) {
            item.receitas.push(refeicao.receita.nome)
          }
        } else {
          ingredientesMap.set(chave, {
            ingrediente: ingrediente.nome,
            quantidadeTotal: ingrediente.quantidade * porcoes,
            unidade: ingrediente.unidade,
            categoria: CATEGORIAS_MERCADO[ingrediente.categoria] || 'Outros',
            receitas: [refeicao.receita.nome],
          })
        }
      }
    }
  }

  // Converte para array e arredonda quantidades
  const itens = Array.from(ingredientesMap.values()).map(item => ({
    ...item,
    quantidadeTotal: Math.ceil(item.quantidadeTotal * 10) / 10, // Arredonda para cima
  }))

  // Agrupa por categoria
  const porCategoria: Record<string, ItemListaCompras[]> = {}
  for (const item of itens) {
    if (!porCategoria[item.categoria]) {
      porCategoria[item.categoria] = []
    }
    porCategoria[item.categoria].push(item)
  }

  // Ordena cada categoria alfabeticamente
  for (const categoria of Object.keys(porCategoria)) {
    porCategoria[categoria].sort((a, b) => a.ingrediente.localeCompare(b.ingrediente))
  }

  // Gera dicas de compra
  const dicasCompra = gerarDicasCompra(itens, dias.length)

  const semanaStr = dias.length === 7
    ? `${dias[0].data} a ${dias[6].data}`
    : `${dias[0].data} a ${dias[dias.length - 1].data}`

  return {
    semana: semanaStr,
    itens: itens.sort((a, b) => a.categoria.localeCompare(b.categoria)),
    totalItens: itens.length,
    porCategoria,
    dicasCompra,
  }
}

function gerarDicasCompra(itens: ItemListaCompras[], dias: number): string[] {
  const dicas: string[] = []

  // Dica sobre quantidade de proteínas
  const proteinas = itens.filter(i => i.categoria === 'Carnes e Proteínas')
  if (proteinas.length > 0) {
    dicas.push(`Compre proteínas suficientes para ${dias} dias. Considere congelar porções.`)
  }

  // Dica sobre vegetais
  const vegetais = itens.filter(i => i.categoria === 'Hortifruti')
  if (vegetais.length > 5) {
    dicas.push('Compre vegetais frescos em 2 etapas para manter o frescor.')
  }

  // Dica sobre ovos
  const ovos = itens.find(i => i.ingrediente.toLowerCase().includes('ovo'))
  if (ovos && ovos.quantidadeTotal > 12) {
    dicas.push(`Você precisará de ${Math.ceil(ovos.quantidadeTotal / 12)} dúzias de ovos.`)
  }

  // Dica geral
  dicas.push('Verifique o que já tem em casa antes de ir ao mercado.')
  dicas.push('Prefira comprar a granel para temperos e grãos.')

  return dicas
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Substitui uma refeição específica por outra receita
 */
export function substituirRefeicao(
  cardapioDia: CardapioDiaReceitas,
  indiceRefeicao: number,
  perfil: PerfilCardapio,
  receitaAtualId?: string
): CardapioDiaReceitas {
  if (indiceRefeicao < 0 || indiceRefeicao >= cardapioDia.refeicoes.length) {
    return cardapioDia
  }

  const refeicaoAtual = cardapioDia.refeicoes[indiceRefeicao]
  const metaCalorias = perfil.caloriasAlvo * DISTRIBUICAO_CALORIAS[refeicaoAtual.tipo]

  // Marca receita atual como usada para evitar selecioná-la novamente
  const receitasUsadas = new Set<string>()
  if (receitaAtualId) {
    receitasUsadas.add(receitaAtualId)
  }
  receitasUsadas.add(refeicaoAtual.receita.id)

  const novaReceita = selecionarReceita(refeicaoAtual.tipo, perfil, metaCalorias, receitasUsadas)

  if (!novaReceita) {
    return cardapioDia
  }

  const porcoes = calcularPorcoes(novaReceita, metaCalorias)

  const novaRefeicao: RefeicaoCardapio = {
    ...refeicaoAtual,
    receita: novaReceita,
    porcoes,
    nutrientes: {
      calorias: Math.round(novaReceita.nutrientes.calorias * porcoes),
      proteinas: Math.round(novaReceita.nutrientes.proteinas * porcoes * 10) / 10,
      carboidratos: Math.round(novaReceita.nutrientes.carboidratos * porcoes * 10) / 10,
      gorduras: Math.round(novaReceita.nutrientes.gorduras * porcoes * 10) / 10,
      fibras: Math.round(novaReceita.nutrientes.fibras * porcoes * 10) / 10,
      agua: Math.round(novaReceita.nutrientes.agua * porcoes),
    },
  }

  const novasRefeicoes = [...cardapioDia.refeicoes]
  novasRefeicoes[indiceRefeicao] = novaRefeicao

  // Recalcula totais
  const totais = novasRefeicoes.reduce(
    (acc, ref) => ({
      calorias: acc.calorias + ref.nutrientes.calorias,
      proteinas: acc.proteinas + ref.nutrientes.proteinas,
      carboidratos: acc.carboidratos + ref.nutrientes.carboidratos,
      gorduras: acc.gorduras + ref.nutrientes.gorduras,
      fibras: acc.fibras + ref.nutrientes.fibras,
      agua: acc.agua + ref.nutrientes.agua,
    }),
    { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, agua: 0 }
  )

  return {
    ...cardapioDia,
    refeicoes: novasRefeicoes,
    totais,
    percentualMeta: Math.round((totais.calorias / cardapioDia.metaCalorias) * 100),
  }
}

/**
 * Busca receitas similares para substituição
 */
export function buscarReceitasSimilares(
  receitaAtual: Receita,
  limite: number = 5
): Receita[] {
  const receitasDoMesmoTipo = RECEITAS.filter(
    r => r.id !== receitaAtual.id &&
    r.tipoRefeicao.some(t => receitaAtual.tipoRefeicao.includes(t))
  )

  // Calcula similaridade baseado em tags
  const receitasComSimilaridade = receitasDoMesmoTipo.map(r => {
    const tagsComuns = r.tags.filter(t => receitaAtual.tags.includes(t)).length
    const diferencaCalorias = Math.abs(r.nutrientes.calorias - receitaAtual.nutrientes.calorias)

    return {
      receita: r,
      score: tagsComuns * 10 - (diferencaCalorias / 20)
    }
  })

  return receitasComSimilaridade
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map(r => r.receita)
}

/**
 * Gera perfil de cardápio baseado no perfil do usuário
 */
export function criarPerfilCardapio(
  caloriasAlvo: number,
  restricoesUsuario: string[],
  objetivo: 'perder_peso' | 'ganhar_massa' | 'manter_peso' = 'perder_peso',
  dadosIdade?: {
    idade?: number
    sexo?: 'masculino' | 'feminino'
    peso?: number
    faseHormonal?: FaseHormonal
  }
): PerfilCardapio {
  const restricoes: TagReceita[] = []
  const preferencias: TagReceita[] = []
  const objetivos: ObjetivoNutricional[] = [objetivo]

  // Mapeia restrições do usuário
  for (const restricao of restricoesUsuario) {
    const restricaoLower = restricao.toLowerCase()
    if (restricaoLower.includes('vegetarian') || restricaoLower.includes('vegetariano')) {
      restricoes.push('vegetariano')
    }
    if (restricaoLower.includes('vegan') || restricaoLower.includes('vegano')) {
      restricoes.push('vegano')
    }
    if (restricaoLower.includes('gluten') || restricaoLower.includes('celiac')) {
      restricoes.push('sem_gluten')
    }
    if (restricaoLower.includes('lactose') || restricaoLower.includes('leite') || restricaoLower.includes('lactea')) {
      restricoes.push('sem_lactose')
    }
  }

  // Define preferências baseadas no objetivo
  switch (objetivo) {
    case 'perder_peso':
      preferencias.push('leve', 'saciedade', 'low_carb')
      objetivos.push('perder_peso')
      break
    case 'ganhar_massa':
      preferencias.push('proteico', 'fitness')
      objetivos.push('ganhar_massa', 'mais_proteina')
      break
    case 'manter_peso':
      preferencias.push('leve', 'saciedade')
      objetivos.push('equilibrado')
      break
  }

  // Calcula dados relacionados à idade
  let faixaEtaria: FaixaEtaria | undefined
  let faseHormonal: FaseHormonal | undefined
  let proteinaAlvo: number | undefined

  if (dadosIdade?.idade) {
    faixaEtaria = getFaixaEtaria(dadosIdade.idade)

    // Adiciona preferências por faixa etária
    if (['40-49', '50-59', '60-69', '70+'].includes(faixaEtaria)) {
      preferencias.push('rico_calcio', 'rico_vitamina_d')
    }
    if (['50-59', '60-69', '70+'].includes(faixaEtaria)) {
      preferencias.push('anti_sarcopenia', 'proteico')
    }
    if (['60-69', '70+'].includes(faixaEtaria)) {
      preferencias.push('baixo_sodio', 'rico_fibras')
    }

    // Calcula proteína alvo por idade
    if (dadosIdade.peso) {
      const nivelAtividade = objetivo === 'ganhar_massa' ? 'moderado' : 'leve'
      const proteinas = calcularProteinaIdade(
        dadosIdade.peso,
        dadosIdade.idade,
        objetivo === 'ganhar_massa' ? 'ganhar_massa' : 'perder_peso',
        nivelAtividade as 'sedentario' | 'leve' | 'moderado' | 'intenso'
      )
      proteinaAlvo = proteinas.ideal
    }

    // Define fase hormonal
    if (dadosIdade.faseHormonal) {
      faseHormonal = dadosIdade.faseHormonal
    } else if (dadosIdade.sexo) {
      faseHormonal = sugerirFaseHormonal(dadosIdade.idade, dadosIdade.sexo)
    }

    // Adiciona preferências por fase hormonal
    if (faseHormonal) {
      if (['pre_menopausa', 'perimenopausa', 'menopausa'].includes(faseHormonal)) {
        preferencias.push('fitoestrogenos', 'rico_magnesio', 'rico_omega3')
      }
      if (['andropausa_inicial', 'andropausa'].includes(faseHormonal)) {
        preferencias.push('rico_zinco', 'proteico', 'anti_inflamatorio')
      }
    }
  }

  return {
    caloriasAlvo,
    restricoes,
    preferencias,
    objetivos,
    tempoMaximo: 60, // 1 hora padrão
    dificuldadeMaxima: 'medio',
    idade: dadosIdade?.idade,
    sexo: dadosIdade?.sexo,
    faixaEtaria,
    faseHormonal,
    proteinaAlvo,
  }
}

/**
 * Gera perfil de cardápio completo com cálculos automáticos de TMB por idade
 */
export function criarPerfilCardapioCompleto(
  peso: number,
  altura: number,
  idade: number,
  sexo: 'masculino' | 'feminino',
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'intenso',
  restricoesUsuario: string[],
  objetivo: 'perder_peso' | 'ganhar_massa' | 'manter_peso' = 'perder_peso',
  faseHormonal?: FaseHormonal
): PerfilCardapio {
  // Calcula TMB ajustada por idade
  const tmb = calcularTMBAjustada(peso, altura, idade, sexo)

  // Fatores de atividade
  const fatoresAtividade = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
  }

  // Calcula gasto total
  const gastoTotal = Math.round(tmb * fatoresAtividade[nivelAtividade])

  // Define calorias alvo baseado no objetivo
  let caloriasAlvo: number
  switch (objetivo) {
    case 'perder_peso':
      caloriasAlvo = Math.round(gastoTotal - 400) // Déficit moderado
      break
    case 'ganhar_massa':
      caloriasAlvo = Math.round(gastoTotal + 300) // Superávit
      break
    default:
      caloriasAlvo = gastoTotal
  }

  return criarPerfilCardapio(caloriasAlvo, restricoesUsuario, objetivo, {
    idade,
    sexo,
    peso,
    faseHormonal,
  })
}
