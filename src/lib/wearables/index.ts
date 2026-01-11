// Sistema de Integração com Wearables - Apple Watch, Mi Band, Fitbit, etc.

export interface WearableDevice {
  id: string
  tipo: TipoWearable
  nome: string
  modelo?: string
  conectado: boolean
  ultima_sincronizacao?: string
  bateria?: number
}

export type TipoWearable =
  | 'apple_watch'
  | 'mi_band'
  | 'fitbit'
  | 'samsung_watch'
  | 'garmin'
  | 'google_fit'
  | 'outro'

export interface DadosWearable {
  id: string
  user_id: string
  device_id: string
  data: string
  passos: number
  calorias_queimadas: number
  distancia_km: number
  minutos_ativos: number
  frequencia_cardiaca_media?: number
  frequencia_cardiaca_max?: number
  frequencia_cardiaca_repouso?: number
  sono_horas?: number
  sono_qualidade?: number
  peso_kg?: number
  created_at: string
}

export interface MetasWearable {
  passos_diarios: number
  calorias_diarias: number
  minutos_ativos: number
  sono_horas: number
}

// Configurações dos wearables suportados
export const WEARABLES_SUPORTADOS: Record<TipoWearable, {
  nome: string
  icone: string
  cor: string
  descricao: string
  recursos: string[]
  requer_app: boolean
  link_app?: string
}> = {
  apple_watch: {
    nome: 'Apple Watch',
    icone: '⌚',
    cor: 'bg-gray-900',
    descricao: 'Integração via Apple Health',
    recursos: ['Passos', 'Calorias', 'Frequência cardíaca', 'Sono', 'Exercícios'],
    requer_app: false,
  },
  mi_band: {
    nome: 'Mi Band / Xiaomi',
    icone: '📿',
    cor: 'bg-orange-500',
    descricao: 'Via app Mi Fitness',
    recursos: ['Passos', 'Calorias', 'Frequência cardíaca', 'Sono'],
    requer_app: true,
    link_app: 'https://play.google.com/store/apps/details?id=com.xiaomi.wearable'
  },
  fitbit: {
    nome: 'Fitbit',
    icone: '💪',
    cor: 'bg-teal-500',
    descricao: 'Integração oficial Fitbit',
    recursos: ['Passos', 'Calorias', 'Frequência cardíaca', 'Sono', 'Peso'],
    requer_app: false,
  },
  samsung_watch: {
    nome: 'Samsung Galaxy Watch',
    icone: '⌚',
    cor: 'bg-blue-600',
    descricao: 'Via Samsung Health',
    recursos: ['Passos', 'Calorias', 'Frequência cardíaca', 'Sono', 'Composição corporal'],
    requer_app: false,
  },
  garmin: {
    nome: 'Garmin',
    icone: '🏃',
    cor: 'bg-blue-400',
    descricao: 'Integração Garmin Connect',
    recursos: ['Passos', 'Calorias', 'GPS', 'Frequência cardíaca', 'VO2 Max'],
    requer_app: false,
  },
  google_fit: {
    nome: 'Google Fit',
    icone: '❤️',
    cor: 'bg-red-500',
    descricao: 'Agregador de dados de saúde',
    recursos: ['Passos', 'Calorias', 'Frequência cardíaca', 'Sono'],
    requer_app: false,
  },
  outro: {
    nome: 'Outro dispositivo',
    icone: '📱',
    cor: 'bg-gray-500',
    descricao: 'Dispositivo genérico',
    recursos: ['Passos'],
    requer_app: true,
  },
}

// Metas padrão
export const METAS_PADRAO: MetasWearable = {
  passos_diarios: 10000,
  calorias_diarias: 500,
  minutos_ativos: 30,
  sono_horas: 8,
}

// Calcular score de atividade diária
export function calcularScoreAtividade(dados: DadosWearable, metas: MetasWearable): {
  score: number
  detalhes: { categoria: string; percentual: number; icone: string }[]
} {
  const detalhes = [
    {
      categoria: 'Passos',
      percentual: Math.min(100, (dados.passos / metas.passos_diarios) * 100),
      icone: '👣'
    },
    {
      categoria: 'Calorias',
      percentual: Math.min(100, (dados.calorias_queimadas / metas.calorias_diarias) * 100),
      icone: '🔥'
    },
    {
      categoria: 'Minutos ativos',
      percentual: Math.min(100, (dados.minutos_ativos / metas.minutos_ativos) * 100),
      icone: '⏱️'
    },
  ]

  if (dados.sono_horas) {
    detalhes.push({
      categoria: 'Sono',
      percentual: Math.min(100, (dados.sono_horas / metas.sono_horas) * 100),
      icone: '😴'
    })
  }

  const score = Math.round(
    detalhes.reduce((sum, d) => sum + d.percentual, 0) / detalhes.length
  )

  return { score, detalhes }
}

// Calcular calorias queimadas estimadas
export function calcularCaloriasPassos(passos: number, pesoKg: number): number {
  // Aproximação: 0.04 kcal por passo por kg de peso
  return Math.round(passos * 0.04 * (pesoKg / 70))
}

// Calcular distância estimada dos passos
export function calcularDistanciaPassos(passos: number, alturaM: number = 1.7): number {
  // Comprimento médio do passo: 0.415 * altura
  const comprimentoPasso = 0.415 * alturaM
  return Math.round((passos * comprimentoPasso / 1000) * 10) / 10
}

// Classificar frequência cardíaca
export function classificarFrequenciaCardiaca(bpm: number, idade: number): {
  zona: string
  cor: string
  descricao: string
} {
  const fcMax = 220 - idade
  const percentual = (bpm / fcMax) * 100

  if (percentual < 50) {
    return { zona: 'Repouso', cor: 'text-gray-500', descricao: 'Frequência de repouso' }
  }
  if (percentual < 60) {
    return { zona: 'Leve', cor: 'text-blue-500', descricao: 'Aquecimento / Recuperação' }
  }
  if (percentual < 70) {
    return { zona: 'Queima de gordura', cor: 'text-green-500', descricao: 'Zona ideal para emagrecer' }
  }
  if (percentual < 80) {
    return { zona: 'Aeróbico', cor: 'text-yellow-500', descricao: 'Melhora condicionamento' }
  }
  if (percentual < 90) {
    return { zona: 'Anaeróbico', cor: 'text-orange-500', descricao: 'Alta intensidade' }
  }
  return { zona: 'Máximo', cor: 'text-red-500', descricao: 'Esforço máximo' }
}

// Classificar qualidade do sono
export function classificarSono(horas: number, qualidade?: number): {
  classificacao: string
  cor: string
  dica: string
} {
  if (horas < 5) {
    return {
      classificacao: 'Insuficiente',
      cor: 'text-red-500',
      dica: 'Tente dormir mais cedo. Sono afeta diretamente o metabolismo.'
    }
  }
  if (horas < 6) {
    return {
      classificacao: 'Ruim',
      cor: 'text-orange-500',
      dica: 'Procure estabelecer uma rotina de sono mais consistente.'
    }
  }
  if (horas < 7) {
    return {
      classificacao: 'Regular',
      cor: 'text-yellow-500',
      dica: 'Está quase lá! Mais 1 hora faria diferença.'
    }
  }
  if (horas <= 9) {
    return {
      classificacao: 'Ótimo',
      cor: 'text-green-500',
      dica: 'Excelente! Sono adequado otimiza a perda de peso.'
    }
  }
  return {
    classificacao: 'Excessivo',
    cor: 'text-blue-500',
    dica: 'Dormir demais também pode afetar o metabolismo.'
  }
}

// Insights baseados nos dados
export function gerarInsights(dados: DadosWearable[], metas: MetasWearable): string[] {
  if (dados.length === 0) return []

  const insights: string[] = []
  const ultimosDados = dados.slice(-7) // Últimos 7 dias

  // Média de passos
  const mediaPassos = Math.round(ultimosDados.reduce((sum, d) => sum + d.passos, 0) / ultimosDados.length)
  if (mediaPassos < metas.passos_diarios * 0.5) {
    insights.push('📉 Sua média de passos está baixa. Tente adicionar caminhadas curtas durante o dia.')
  } else if (mediaPassos >= metas.passos_diarios) {
    insights.push('🎉 Parabéns! Você está atingindo sua meta de passos consistentemente!')
  }

  // Tendência de calorias
  const mediaCalorias = Math.round(ultimosDados.reduce((sum, d) => sum + d.calorias_queimadas, 0) / ultimosDados.length)
  if (mediaCalorias > metas.calorias_diarias) {
    insights.push('🔥 Ótimo trabalho! Sua queima calórica está acima da meta.')
  }

  // Sono
  const dadosComSono = ultimosDados.filter(d => d.sono_horas)
  if (dadosComSono.length > 0) {
    const mediaSono = dadosComSono.reduce((sum, d) => sum + (d.sono_horas || 0), 0) / dadosComSono.length
    if (mediaSono < 7) {
      insights.push('😴 Sua média de sono está abaixo do ideal. Priorize o descanso.')
    }
  }

  // Frequência cardíaca em repouso
  const dadosComFC = ultimosDados.filter(d => d.frequencia_cardiaca_repouso)
  if (dadosComFC.length > 0) {
    const mediaFC = dadosComFC.reduce((sum, d) => sum + (d.frequencia_cardiaca_repouso || 0), 0) / dadosComFC.length
    if (mediaFC < 60) {
      insights.push('❤️ Excelente! Sua frequência cardíaca de repouso indica boa condição física.')
    }
  }

  return insights.slice(0, 3) // Máximo 3 insights
}

// Formatar dados para gráfico
export function formatarDadosGrafico(dados: DadosWearable[]): {
  labels: string[]
  passos: number[]
  calorias: number[]
} {
  return {
    labels: dados.map(d => new Date(d.data).toLocaleDateString('pt-BR', { weekday: 'short' })),
    passos: dados.map(d => d.passos),
    calorias: dados.map(d => d.calorias_queimadas),
  }
}

// Verificar suporte Web Bluetooth (para conexão direta)
export function verificarSuporteBluetooth(): boolean {
  if (typeof navigator === 'undefined') return false
  return 'bluetooth' in navigator
}
