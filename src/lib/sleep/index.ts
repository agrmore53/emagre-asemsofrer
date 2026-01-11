// Sistema de Análise de Sono e Impacto no Metabolismo

export interface SleepRecord {
  id: string
  user_id: string
  data: string
  hora_dormir: string
  hora_acordar: string
  qualidade: number // 1-5
  acordou_noite: number
  latencia_minutos: number // tempo para pegar no sono
  usou_tela_antes: boolean
  cafeina_tarde: boolean
  exercicio_dia: boolean
  notas?: string
}

export interface SleepAnalysis {
  duracao_horas: number
  score: number // 0-100
  impacto_metabolismo: 'positivo' | 'neutro' | 'negativo'
  fator_fome: string
  dicas: string[]
}

export interface SleepStats {
  media_duracao: number
  media_qualidade: number
  media_score: number
  melhor_dia: string
  pior_dia: string
  padrao_detectado?: string
}

// Calcular duração do sono em horas
export function calcularDuracao(horaDormir: string, horaAcordar: string): number {
  const [hd, md] = horaDormir.split(':').map(Number)
  const [ha, ma] = horaAcordar.split(':').map(Number)

  let dormir = hd * 60 + md
  let acordar = ha * 60 + ma

  // Se acordar antes de dormir, passou da meia-noite
  if (acordar < dormir) {
    acordar += 24 * 60
  }

  return (acordar - dormir) / 60
}

// Calcular score de sono (0-100)
export function calcularSleepScore(record: SleepRecord): number {
  let score = 0
  const duracao = calcularDuracao(record.hora_dormir, record.hora_acordar)

  // Duração (40 pontos)
  if (duracao >= 7 && duracao <= 9) {
    score += 40
  } else if (duracao >= 6 && duracao < 7) {
    score += 30
  } else if (duracao >= 5 && duracao < 6) {
    score += 20
  } else if (duracao >= 9 && duracao <= 10) {
    score += 35
  } else {
    score += 10
  }

  // Qualidade subjetiva (30 pontos)
  score += record.qualidade * 6

  // Acordar à noite (10 pontos)
  if (record.acordou_noite === 0) {
    score += 10
  } else if (record.acordou_noite === 1) {
    score += 5
  }

  // Latência (10 pontos)
  if (record.latencia_minutos <= 15) {
    score += 10
  } else if (record.latencia_minutos <= 30) {
    score += 5
  }

  // Fatores negativos
  if (record.usou_tela_antes) score -= 5
  if (record.cafeina_tarde) score -= 5

  // Fator positivo
  if (record.exercicio_dia) score += 5

  return Math.max(0, Math.min(100, score))
}

// Analisar impacto no metabolismo
export function analisarImpactoMetabolismo(record: SleepRecord): SleepAnalysis {
  const duracao = calcularDuracao(record.hora_dormir, record.hora_acordar)
  const score = calcularSleepScore(record)

  let impacto: 'positivo' | 'neutro' | 'negativo'
  let fatorFome: string
  const dicas: string[] = []

  // Determinar impacto
  if (duracao < 6) {
    impacto = 'negativo'
    fatorFome =
      'Sono curto aumenta grelina (hormônio da fome) em até 15% e diminui leptina (saciedade).'
    dicas.push('Priorize ir dormir mais cedo esta noite')
    dicas.push('Evite carboidratos simples hoje - você terá mais desejos')
  } else if (duracao > 9) {
    impacto = 'neutro'
    fatorFome = 'Sono excessivo pode indicar baixa qualidade ou outras questões de saúde.'
    dicas.push('Tente manter uma rotina de horário fixo')
  } else if (score >= 80) {
    impacto = 'positivo'
    fatorFome =
      'Excelente! Seu metabolismo está otimizado. Menos desejos por açúcar hoje.'
    dicas.push('Ótimo dia para treino intenso')
    dicas.push('Aproveite a boa regulação hormonal')
  } else if (score >= 60) {
    impacto = 'neutro'
    fatorFome = 'Sono razoável. Mantenha-se hidratado para compensar.'
    dicas.push('Faça pausas durante o dia se sentir fadiga')
  } else {
    impacto = 'negativo'
    fatorFome =
      'Noite ruim. Espere mais fome e desejos por doces hoje.'
    dicas.push('Coma proteína no café da manhã para compensar')
    dicas.push('Evite decisões alimentares por impulso')
    dicas.push('Considere uma soneca de 20min se possível')
  }

  // Dicas específicas
  if (record.usou_tela_antes) {
    dicas.push('Tente desligar telas 1h antes de dormir')
  }
  if (record.cafeina_tarde) {
    dicas.push('Evite cafeína após as 14h')
  }
  if (!record.exercicio_dia) {
    dicas.push('Exercício regular melhora a qualidade do sono')
  }

  return {
    duracao_horas: Math.round(duracao * 10) / 10,
    score,
    impacto_metabolismo: impacto,
    fator_fome: fatorFome,
    dicas,
  }
}

// Cores baseadas no score
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-100'
  if (score >= 60) return 'bg-yellow-100'
  if (score >= 40) return 'bg-orange-100'
  return 'bg-red-100'
}

// Emoji baseado no score
export function getScoreEmoji(score: number): string {
  if (score >= 90) return '😴'
  if (score >= 80) return '😊'
  if (score >= 60) return '😐'
  if (score >= 40) return '😕'
  return '😫'
}

// Labels de qualidade
export const QUALIDADE_LABELS = [
  { value: 1, label: 'Péssima', emoji: '😫' },
  { value: 2, label: 'Ruim', emoji: '😕' },
  { value: 3, label: 'Regular', emoji: '😐' },
  { value: 4, label: 'Boa', emoji: '😊' },
  { value: 5, label: 'Excelente', emoji: '😴' },
]
