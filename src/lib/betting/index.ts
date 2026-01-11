// Sistema de Apostas na Meta - Gamificação com compromisso financeiro

export interface Aposta {
  id: string
  user_id: string
  tipo: TipoAposta
  valor_apostado: number
  peso_inicial: number
  peso_meta: number
  data_inicio: string
  data_limite: string
  status: StatusAposta
  peso_final?: number
  ganho?: number
  created_at: string
}

export type TipoAposta =
  | 'solo' // Aposta individual
  | 'grupo' // Aposta em grupo
  | 'desafio' // Desafio entre amigos

export type StatusAposta =
  | 'ativa' // Em andamento
  | 'verificando' // Aguardando verificação de peso
  | 'ganhou' // Meta atingida
  | 'perdeu' // Meta não atingida
  | 'cancelada' // Cancelada pelo usuário
  | 'reembolsada' // Valor devolvido

// Configurações do sistema de apostas
export const CONFIG_APOSTAS = {
  valor_minimo: 20,
  valor_maximo: 500,
  taxa_plataforma: 0.1, // 10% de taxa
  multiplicador_base: 1.5, // Ganho base se atingir meta
  dias_minimos: 7,
  dias_maximos: 90,
  peso_minimo_perda: 0.5, // kg mínimo para apostar
  peso_maximo_perda: 30, // kg máximo para apostar
}

// Planos de aposta disponíveis
export const PLANOS_APOSTA = [
  {
    id: 'iniciante',
    nome: 'Iniciante',
    valor: 20,
    descricao: 'Perfeito para começar',
    multiplicador: 1.3,
    icone: '🌱'
  },
  {
    id: 'comprometido',
    nome: 'Comprometido',
    valor: 50,
    descricao: 'Compromisso sério',
    multiplicador: 1.5,
    icone: '💪'
  },
  {
    id: 'determinado',
    nome: 'Determinado',
    valor: 100,
    descricao: 'Alta motivação',
    multiplicador: 1.7,
    icone: '🔥'
  },
  {
    id: 'all_in',
    nome: 'All In',
    valor: 200,
    descricao: 'Máximo compromisso',
    multiplicador: 2.0,
    icone: '🚀'
  }
]

// Períodos de aposta
export const PERIODOS_APOSTA = [
  { semanas: 2, dias: 14, descricao: '2 semanas', multiplicadorBonus: 1.0 },
  { semanas: 4, dias: 28, descricao: '1 mês', multiplicadorBonus: 1.1 },
  { semanas: 8, dias: 56, descricao: '2 meses', multiplicadorBonus: 1.2 },
  { semanas: 12, dias: 84, descricao: '3 meses', multiplicadorBonus: 1.3 },
]

// Calcular ganho potencial
export function calcularGanhoPotencial(
  valor: number,
  multiplicadorPlano: number,
  multiplicadorPeriodo: number
): number {
  const ganhoBase = valor * multiplicadorPlano * multiplicadorPeriodo
  const taxaPlataforma = ganhoBase * CONFIG_APOSTAS.taxa_plataforma
  return Math.round((ganhoBase - taxaPlataforma) * 100) / 100
}

// Calcular perda de peso necessária por semana
export function calcularMetaSemanal(pesoInicial: number, pesoMeta: number, semanas: number): number {
  const totalPerda = pesoInicial - pesoMeta
  return Math.round((totalPerda / semanas) * 10) / 10
}

// Verificar se meta é realista (0.5-1kg por semana é saudável)
export function verificarMetaRealista(pesoInicial: number, pesoMeta: number, semanas: number): {
  realista: boolean
  mensagem: string
  perdaSemanal: number
} {
  const perdaSemanal = calcularMetaSemanal(pesoInicial, pesoMeta, semanas)

  if (perdaSemanal < 0.3) {
    return {
      realista: true,
      mensagem: 'Meta muito conservadora. Você consegue mais!',
      perdaSemanal
    }
  }

  if (perdaSemanal <= 0.5) {
    return {
      realista: true,
      mensagem: 'Meta conservadora e saudável',
      perdaSemanal
    }
  }

  if (perdaSemanal <= 1) {
    return {
      realista: true,
      mensagem: 'Meta ideal e realista',
      perdaSemanal
    }
  }

  if (perdaSemanal <= 1.5) {
    return {
      realista: true,
      mensagem: 'Meta agressiva mas possível com dedicação',
      perdaSemanal
    }
  }

  return {
    realista: false,
    mensagem: 'Meta muito agressiva. Considere mais tempo.',
    perdaSemanal
  }
}

// Status da aposta com ícone e cor
export const STATUS_APOSTA_CONFIG: Record<StatusAposta, { icone: string; cor: string; texto: string }> = {
  ativa: { icone: '⏳', cor: 'bg-blue-100 text-blue-700', texto: 'Em andamento' },
  verificando: { icone: '🔍', cor: 'bg-amber-100 text-amber-700', texto: 'Verificando' },
  ganhou: { icone: '🎉', cor: 'bg-green-100 text-green-700', texto: 'Você ganhou!' },
  perdeu: { icone: '😢', cor: 'bg-red-100 text-red-700', texto: 'Meta não atingida' },
  cancelada: { icone: '❌', cor: 'bg-gray-100 text-gray-700', texto: 'Cancelada' },
  reembolsada: { icone: '💰', cor: 'bg-purple-100 text-purple-700', texto: 'Reembolsada' },
}

// Calcular progresso da aposta
export function calcularProgressoAposta(aposta: Aposta, pesoAtual: number): {
  percentualTempo: number
  percentualPeso: number
  diasRestantes: number
  kgRestantes: number
  noTrack: boolean
} {
  const dataInicio = new Date(aposta.data_inicio)
  const dataLimite = new Date(aposta.data_limite)
  const agora = new Date()

  const diasTotais = Math.ceil((dataLimite.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
  const diasPassados = Math.ceil((agora.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
  const diasRestantes = Math.max(0, diasTotais - diasPassados)

  const pesoTotalPerder = aposta.peso_inicial - aposta.peso_meta
  const pesoPerdido = aposta.peso_inicial - pesoAtual
  const kgRestantes = Math.max(0, pesoTotalPerder - pesoPerdido)

  const percentualTempo = Math.min(100, (diasPassados / diasTotais) * 100)
  const percentualPeso = Math.min(100, (pesoPerdido / pesoTotalPerder) * 100)

  // Verificar se está no caminho certo
  const noTrack = percentualPeso >= percentualTempo

  return {
    percentualTempo: Math.round(percentualTempo),
    percentualPeso: Math.round(percentualPeso),
    diasRestantes,
    kgRestantes: Math.round(kgRestantes * 10) / 10,
    noTrack
  }
}

// Verificar se pode criar nova aposta
export function podeApostar(apostasAtivas: Aposta[]): { pode: boolean; motivo?: string } {
  if (apostasAtivas.length >= 3) {
    return { pode: false, motivo: 'Máximo de 3 apostas simultâneas' }
  }

  return { pode: true }
}

// Dicas motivacionais baseadas no progresso
export function getDicaMotivacional(progresso: ReturnType<typeof calcularProgressoAposta>): string {
  if (progresso.noTrack && progresso.percentualPeso > 50) {
    return '🔥 Incrível! Você está acelerando rumo à meta!'
  }

  if (progresso.noTrack) {
    return '💪 Ótimo trabalho! Continue assim!'
  }

  if (progresso.percentualPeso > progresso.percentualTempo - 10) {
    return '⚡ Quase lá! Um pequeno esforço extra e você recupera!'
  }

  if (progresso.diasRestantes > 14) {
    return '🎯 Ainda dá tempo! Foque nas próximas 2 semanas.'
  }

  return '🚀 Hora de intensificar! Você ainda pode conseguir!'
}

// Termos e condições resumidos
export const TERMOS_APOSTA = [
  'O valor apostado será retido até o fim do período',
  'A meta deve ser atingida na data limite para ganhar',
  'Verificação de peso obrigatória na data final',
  'Cancelamento com reembolso apenas nos primeiros 3 dias',
  'Taxa de 10% sobre o ganho (não sobre valor apostado)',
  'Metas devem ser realistas e saudáveis',
]
