// Calculadora de Calorias - TMB e Necessidades Diárias

export type Sexo = 'masculino' | 'feminino'
export type NivelAtividade = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso'
export type ObjetivoEmagrecimento = 'manter' | 'perder_lento' | 'perder_moderado' | 'perder_rapido'

interface DadosPessoa {
  peso: number // kg
  altura: number // cm
  idade: number
  sexo: Sexo
  nivelAtividade: NivelAtividade
}

// Fatores de atividade
const FATORES_ATIVIDADE: Record<NivelAtividade, { fator: number; descricao: string }> = {
  sedentario: { fator: 1.2, descricao: 'Pouco ou nenhum exercício' },
  leve: { fator: 1.375, descricao: 'Exercício leve 1-3 dias/semana' },
  moderado: { fator: 1.55, descricao: 'Exercício moderado 3-5 dias/semana' },
  intenso: { fator: 1.725, descricao: 'Exercício intenso 6-7 dias/semana' },
  muito_intenso: { fator: 1.9, descricao: 'Exercício muito intenso ou trabalho físico' },
}

// Déficits calóricos por objetivo
const DEFICITS_CALORICOS: Record<ObjetivoEmagrecimento, { deficit: number; descricao: string }> = {
  manter: { deficit: 0, descricao: 'Manter peso atual' },
  perder_lento: { deficit: 250, descricao: 'Perder ~0.25kg/semana' },
  perder_moderado: { deficit: 500, descricao: 'Perder ~0.5kg/semana' },
  perder_rapido: { deficit: 750, descricao: 'Perder ~0.75kg/semana' },
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) usando a fórmula de Mifflin-St Jeor
 * Considerada a mais precisa para a maioria das pessoas
 */
export function calcularTMB(dados: DadosPessoa): number {
  const { peso, altura, idade, sexo } = dados

  if (sexo === 'masculino') {
    // TMB = (10 × peso em kg) + (6.25 × altura em cm) - (5 × idade) + 5
    return 10 * peso + 6.25 * altura - 5 * idade + 5
  } else {
    // TMB = (10 × peso em kg) + (6.25 × altura em cm) - (5 × idade) - 161
    return 10 * peso + 6.25 * altura - 5 * idade - 161
  }
}

/**
 * Calcula o Gasto Energético Total Diário (GETD/TDEE)
 * TMB multiplicado pelo fator de atividade
 */
export function calcularGETD(dados: DadosPessoa): number {
  const tmb = calcularTMB(dados)
  const fator = FATORES_ATIVIDADE[dados.nivelAtividade].fator
  return Math.round(tmb * fator)
}

/**
 * Calcula as calorias diárias recomendadas com base no objetivo
 */
export function calcularCaloriasObjetivo(
  dados: DadosPessoa,
  objetivo: ObjetivoEmagrecimento
): number {
  const getd = calcularGETD(dados)
  const deficit = DEFICITS_CALORICOS[objetivo].deficit

  // Garante um mínimo saudável
  const minimo = dados.sexo === 'masculino' ? 1500 : 1200
  return Math.max(minimo, getd - deficit)
}

/**
 * Calcula a distribuição de macronutrientes recomendada
 * Baseado em percentuais moderados para emagrecimento saudável
 */
export function calcularMacros(calorias: number): {
  proteinas: { gramas: number; calorias: number; percentual: number }
  carboidratos: { gramas: number; calorias: number; percentual: number }
  gorduras: { gramas: number; calorias: number; percentual: number }
} {
  // Distribuição: 30% proteína, 40% carboidratos, 30% gordura
  const percentuais = {
    proteinas: 0.3,
    carboidratos: 0.4,
    gorduras: 0.3,
  }

  // Calorias por grama: Proteína=4, Carb=4, Gordura=9
  return {
    proteinas: {
      gramas: Math.round((calorias * percentuais.proteinas) / 4),
      calorias: Math.round(calorias * percentuais.proteinas),
      percentual: 30,
    },
    carboidratos: {
      gramas: Math.round((calorias * percentuais.carboidratos) / 4),
      calorias: Math.round(calorias * percentuais.carboidratos),
      percentual: 40,
    },
    gorduras: {
      gramas: Math.round((calorias * percentuais.gorduras) / 9),
      calorias: Math.round(calorias * percentuais.gorduras),
      percentual: 30,
    },
  }
}

/**
 * Calcula a distribuição de calorias por refeição
 */
export function calcularCaloriasPorRefeicao(caloriasDiarias: number): {
  cafe_manha: number
  lanche_manha: number
  almoco: number
  lanche_tarde: number
  jantar: number
  ceia: number
} {
  return {
    cafe_manha: Math.round(caloriasDiarias * 0.2), // 20%
    lanche_manha: Math.round(caloriasDiarias * 0.1), // 10%
    almoco: Math.round(caloriasDiarias * 0.3), // 30%
    lanche_tarde: Math.round(caloriasDiarias * 0.1), // 10%
    jantar: Math.round(caloriasDiarias * 0.25), // 25%
    ceia: Math.round(caloriasDiarias * 0.05), // 5%
  }
}

/**
 * Calcula o IMC
 */
export function calcularIMC(peso: number, alturaCm: number): number {
  const alturaM = alturaCm / 100
  return peso / (alturaM * alturaM)
}

/**
 * Classifica o IMC
 */
export function classificarIMC(imc: number): {
  classificacao: string
  cor: string
  descricao: string
} {
  if (imc < 18.5) {
    return {
      classificacao: 'Abaixo do peso',
      cor: 'text-blue-600',
      descricao: 'Considere consultar um nutricionista para ganhar peso de forma saudável.',
    }
  } else if (imc < 25) {
    return {
      classificacao: 'Peso normal',
      cor: 'text-green-600',
      descricao: 'Você está na faixa ideal! Mantenha seus hábitos saudáveis.',
    }
  } else if (imc < 30) {
    return {
      classificacao: 'Sobrepeso',
      cor: 'text-yellow-600',
      descricao: 'Pequenas mudanças nos hábitos podem fazer grande diferença.',
    }
  } else if (imc < 35) {
    return {
      classificacao: 'Obesidade grau I',
      cor: 'text-orange-600',
      descricao: 'Recomendamos acompanhamento profissional para melhores resultados.',
    }
  } else if (imc < 40) {
    return {
      classificacao: 'Obesidade grau II',
      cor: 'text-red-500',
      descricao: 'Importante buscar acompanhamento médico e nutricional.',
    }
  } else {
    return {
      classificacao: 'Obesidade grau III',
      cor: 'text-red-700',
      descricao: 'Acompanhamento médico especializado é essencial.',
    }
  }
}

/**
 * Estima o tempo para alcançar a meta de peso
 */
export function estimarTempoParaMeta(
  pesoAtual: number,
  pesoMeta: number,
  objetivo: ObjetivoEmagrecimento
): { semanas: number; meses: number } | null {
  if (pesoAtual <= pesoMeta || objetivo === 'manter') {
    return null
  }

  const pesoAPerder = pesoAtual - pesoMeta

  // kg por semana baseado no déficit
  const perdaPorSemana: Record<ObjetivoEmagrecimento, number> = {
    manter: 0,
    perder_lento: 0.25,
    perder_moderado: 0.5,
    perder_rapido: 0.75,
  }

  const semanas = Math.ceil(pesoAPerder / perdaPorSemana[objetivo])
  const meses = Math.round(semanas / 4.33)

  return { semanas, meses }
}

// Exporta constantes para uso em outros componentes
export { FATORES_ATIVIDADE, DEFICITS_CALORICOS }
