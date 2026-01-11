// Sistema de Sincronização do Ciclo Menstrual com Nutrição

export type FaseCiclo = 'menstrual' | 'folicular' | 'ovulacao' | 'lutea'

export interface ConfigCiclo {
  duracao_ciclo: number // em dias (padrão 28)
  duracao_menstruacao: number // em dias (padrão 5)
  ultima_menstruacao: string // data ISO
}

export interface FaseInfo {
  fase: FaseCiclo
  nome: string
  descricao: string
  dias_no_ciclo: string
  hormonios: string
  energia: 'baixa' | 'media' | 'alta' | 'variavel'
  metabolismo: string
  emoji: string
  cor: string
}

export interface RecomendacaoNutricional {
  fase: FaseCiclo
  calorias_ajuste: number // percentual de ajuste (-10 a +10)
  macros: {
    proteina_extra: boolean
    carboidrato_enfase: 'complexos' | 'simples' | 'normal'
    gordura_enfase: 'boa' | 'normal'
  }
  nutrientes_foco: string[]
  alimentos_recomendados: string[]
  alimentos_evitar: string[]
  dicas: string[]
  treino_recomendado: string
}

// Informações de cada fase
export const FASES_CICLO: Record<FaseCiclo, FaseInfo> = {
  menstrual: {
    fase: 'menstrual',
    nome: 'Fase Menstrual',
    descricao: 'Início do ciclo, quando ocorre a menstruação',
    dias_no_ciclo: '1-5',
    hormonios: 'Estrogênio e progesterona em níveis baixos',
    energia: 'baixa',
    metabolismo: 'Mais lento, corpo focado na renovação',
    emoji: '🌙',
    cor: 'text-red-500',
  },
  folicular: {
    fase: 'folicular',
    nome: 'Fase Folicular',
    descricao: 'Preparação para ovulação, energia crescente',
    dias_no_ciclo: '6-13',
    hormonios: 'Estrogênio subindo gradualmente',
    energia: 'media',
    metabolismo: 'Aumentando, boa resposta a carboidratos',
    emoji: '🌱',
    cor: 'text-green-500',
  },
  ovulacao: {
    fase: 'ovulacao',
    nome: 'Fase Ovulatória',
    descricao: 'Pico de energia e fertilidade',
    dias_no_ciclo: '14-16',
    hormonios: 'Pico de estrogênio e LH',
    energia: 'alta',
    metabolismo: 'No pico, melhor desempenho físico',
    emoji: '☀️',
    cor: 'text-yellow-500',
  },
  lutea: {
    fase: 'lutea',
    nome: 'Fase Lútea',
    descricao: 'Pós-ovulação, preparação para menstruação',
    dias_no_ciclo: '17-28',
    hormonios: 'Progesterona alta, depois caindo',
    energia: 'variavel',
    metabolismo: 'Aumenta 100-300 kcal/dia naturalmente',
    emoji: '🍂',
    cor: 'text-orange-500',
  },
}

// Recomendações nutricionais por fase
export const RECOMENDACOES_POR_FASE: Record<FaseCiclo, RecomendacaoNutricional> = {
  menstrual: {
    fase: 'menstrual',
    calorias_ajuste: 0,
    macros: {
      proteina_extra: false,
      carboidrato_enfase: 'complexos',
      gordura_enfase: 'boa',
    },
    nutrientes_foco: ['Ferro', 'Vitamina C', 'Vitamina B12', 'Magnésio'],
    alimentos_recomendados: [
      'Carnes vermelhas magras',
      'Folhas verde-escuras',
      'Leguminosas',
      'Chocolate amargo 70%+',
      'Banana',
      'Peixes',
      'Ovos',
    ],
    alimentos_evitar: [
      'Cafeína em excesso',
      'Álcool',
      'Alimentos muito salgados',
      'Frituras',
    ],
    dicas: [
      'Priorize descanso - seu corpo está trabalhando duro',
      'Ferro + Vitamina C ajuda na absorção',
      'Chocolate amargo ajuda com cólicas (magnésio)',
      'Hidratação extra é importante',
    ],
    treino_recomendado: 'Yoga, caminhada leve, alongamentos',
  },
  folicular: {
    fase: 'folicular',
    calorias_ajuste: 0,
    macros: {
      proteina_extra: true,
      carboidrato_enfase: 'complexos',
      gordura_enfase: 'normal',
    },
    nutrientes_foco: ['Proteína', 'Vitamina E', 'Zinco', 'Ômega-3'],
    alimentos_recomendados: [
      'Frango e peru',
      'Peixes (salmão, atum)',
      'Ovos',
      'Quinoa',
      'Aveia',
      'Castanhas',
      'Frutas frescas',
    ],
    alimentos_evitar: [
      'Açúcar refinado em excesso',
      'Processados',
    ],
    dicas: [
      'Ótima fase para iniciar novos hábitos',
      'Energia crescente - aproveite para treinos mais intensos',
      'Foco em proteínas para construção muscular',
      'Carboidratos complexos dão energia sustentada',
    ],
    treino_recomendado: 'HIIT, musculação pesada, corrida',
  },
  ovulacao: {
    fase: 'ovulacao',
    calorias_ajuste: 5, // Pode comer um pouco mais para sustentar energia
    macros: {
      proteina_extra: true,
      carboidrato_enfase: 'normal',
      gordura_enfase: 'boa',
    },
    nutrientes_foco: ['Antioxidantes', 'Fibras', 'Vitamina D', 'Cálcio'],
    alimentos_recomendados: [
      'Frutas vermelhas',
      'Vegetais coloridos',
      'Salmão',
      'Abacate',
      'Sementes de girassol',
      'Frutas cítricas',
    ],
    alimentos_evitar: [
      'Sódio em excesso',
      'Álcool',
    ],
    dicas: [
      'Seu pico de energia - desafie-se nos treinos!',
      'Antioxidantes apoiam a saúde hormonal',
      'Ótima fase para eventos sociais (mais sociável)',
      'Pode ter menos apetite - escolha alimentos nutritivos',
    ],
    treino_recomendado: 'Treinos de alta intensidade, competições, PRs',
  },
  lutea: {
    fase: 'lutea',
    calorias_ajuste: 10, // Metabolismo naturalmente mais alto
    macros: {
      proteina_extra: true,
      carboidrato_enfase: 'complexos',
      gordura_enfase: 'boa',
    },
    nutrientes_foco: ['Magnésio', 'Vitamina B6', 'Cálcio', 'Fibras'],
    alimentos_recomendados: [
      'Batata doce',
      'Arroz integral',
      'Banana',
      'Chocolate amargo',
      'Abóbora',
      'Grão de bico',
      'Sementes de abóbora',
      'Iogurte natural',
    ],
    alimentos_evitar: [
      'Cafeína em excesso',
      'Açúcar refinado',
      'Sal em excesso',
      'Álcool',
    ],
    dicas: [
      'É NORMAL ter mais fome - seu metabolismo aumentou!',
      'Carboidratos complexos ajudam com desejos',
      'Magnésio reduz TPM (chocolate amargo, banana)',
      'Não se culpe por comer mais - é fisiológico',
      'Treinos moderados são mais adequados agora',
    ],
    treino_recomendado: 'Musculação moderada, pilates, natação',
  },
}

// Calcular fase atual do ciclo
export function calcularFaseAtual(config: ConfigCiclo): {
  fase: FaseCiclo
  diaAtual: number
  diasParaProximaFase: number
  proximaFase: FaseCiclo
} {
  const ultimaMenstruacao = new Date(config.ultima_menstruacao)
  const hoje = new Date()
  const diffTime = hoje.getTime() - ultimaMenstruacao.getTime()
  const diffDias = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // Normalizar para dentro do ciclo
  const diaAtual = (diffDias % config.duracao_ciclo) + 1

  // Determinar fase
  let fase: FaseCiclo
  let diasParaProximaFase: number
  let proximaFase: FaseCiclo

  const fimMenstrual = config.duracao_menstruacao
  const fimFolicular = Math.floor(config.duracao_ciclo / 2) - 1
  const fimOvulacao = Math.floor(config.duracao_ciclo / 2) + 2

  if (diaAtual <= fimMenstrual) {
    fase = 'menstrual'
    diasParaProximaFase = fimMenstrual - diaAtual + 1
    proximaFase = 'folicular'
  } else if (diaAtual <= fimFolicular) {
    fase = 'folicular'
    diasParaProximaFase = fimFolicular - diaAtual + 1
    proximaFase = 'ovulacao'
  } else if (diaAtual <= fimOvulacao) {
    fase = 'ovulacao'
    diasParaProximaFase = fimOvulacao - diaAtual + 1
    proximaFase = 'lutea'
  } else {
    fase = 'lutea'
    diasParaProximaFase = config.duracao_ciclo - diaAtual + 1
    proximaFase = 'menstrual'
  }

  return { fase, diaAtual, diasParaProximaFase, proximaFase }
}

// Prever próxima menstruação
export function preverProximaMenstruacao(config: ConfigCiclo): Date {
  const ultimaMenstruacao = new Date(config.ultima_menstruacao)
  const proxima = new Date(ultimaMenstruacao)
  proxima.setDate(proxima.getDate() + config.duracao_ciclo)

  // Se já passou, calcular a próxima
  while (proxima < new Date()) {
    proxima.setDate(proxima.getDate() + config.duracao_ciclo)
  }

  return proxima
}

// Ajustar calorias baseado na fase
export function ajustarCaloriasPorFase(
  caloriasBase: number,
  fase: FaseCiclo
): number {
  const ajuste = RECOMENDACOES_POR_FASE[fase].calorias_ajuste
  return Math.round(caloriasBase * (1 + ajuste / 100))
}

// Sintomas comuns por fase
export const SINTOMAS_POR_FASE: Record<FaseCiclo, string[]> = {
  menstrual: [
    'Cólicas',
    'Fadiga',
    'Dor de cabeça',
    'Sensibilidade nos seios',
    'Inchaço',
  ],
  folicular: [
    'Energia crescente',
    'Melhor humor',
    'Mais focada',
    'Pele mais clara',
  ],
  ovulacao: [
    'Máxima energia',
    'Maior libido',
    'Mais sociável',
    'Possível dor na ovulação',
  ],
  lutea: [
    'TPM',
    'Desejos alimentares',
    'Inchaço',
    'Alterações de humor',
    'Insônia leve',
    'Seios sensíveis',
  ],
}
