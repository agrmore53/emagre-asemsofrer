// Sistema de Leaderboard Semanal

export interface LeaderboardEntry {
  id: string
  user_id: string
  user_nome: string
  user_foto?: string
  peso_inicial_semana: number
  peso_final_semana: number
  percentual_perdido: number
  posicao: number
  semana_inicio: string
  semana_fim: string
  streak_dias: number
}

export interface LeaderboardSummary {
  entries: LeaderboardEntry[]
  minha_posicao?: LeaderboardEntry
  total_participantes: number
  semana_atual: {
    inicio: string
    fim: string
    numero: number
  }
}

// Badges por posição
export const LEADERBOARD_BADGES = {
  1: { emoji: '👑', label: 'Campeão da Semana', cor: 'text-yellow-500', bg: 'bg-yellow-100' },
  2: { emoji: '🥈', label: '2º Lugar', cor: 'text-gray-500', bg: 'bg-gray-100' },
  3: { emoji: '🥉', label: '3º Lugar', cor: 'text-amber-600', bg: 'bg-amber-100' },
}

// Badges de streak
export const STREAK_BADGES = [
  { dias: 7, emoji: '🔥', label: '1 Semana' },
  { dias: 14, emoji: '💪', label: '2 Semanas' },
  { dias: 30, emoji: '⭐', label: '1 Mês' },
  { dias: 60, emoji: '🌟', label: '2 Meses' },
  { dias: 90, emoji: '🏆', label: '3 Meses' },
  { dias: 180, emoji: '💎', label: '6 Meses' },
  { dias: 365, emoji: '👑', label: '1 Ano' },
]

export function getStreakBadge(dias: number) {
  // Retorna o maior badge alcançado
  for (let i = STREAK_BADGES.length - 1; i >= 0; i--) {
    if (dias >= STREAK_BADGES[i].dias) {
      return STREAK_BADGES[i]
    }
  }
  return null
}

// Calcular início e fim da semana atual (Segunda a Domingo)
export function getSemanaAtual(): { inicio: Date; fim: Date; numero: number } {
  const hoje = new Date()
  const diaSemana = hoje.getDay()
  const diffParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana

  const inicio = new Date(hoje)
  inicio.setDate(hoje.getDate() + diffParaSegunda)
  inicio.setHours(0, 0, 0, 0)

  const fim = new Date(inicio)
  fim.setDate(inicio.getDate() + 6)
  fim.setHours(23, 59, 59, 999)

  // Número da semana no ano
  const primeiroJan = new Date(hoje.getFullYear(), 0, 1)
  const dias = Math.floor((hoje.getTime() - primeiroJan.getTime()) / (24 * 60 * 60 * 1000))
  const numero = Math.ceil((dias + primeiroJan.getDay() + 1) / 7)

  return { inicio, fim, numero }
}

// Formatar data para exibição
export function formatarDataCurta(data: string | Date): string {
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

// Calcular percentual de perda
export function calcularPercentualPerda(pesoInicial: number, pesoFinal: number): number {
  if (!pesoInicial || pesoInicial === 0) return 0
  return ((pesoInicial - pesoFinal) / pesoInicial) * 100
}

// Formatar percentual para exibição
export function formatarPercentualLeaderboard(valor: number): string {
  const sinal = valor > 0 ? '-' : valor < 0 ? '+' : ''
  return `${sinal}${Math.abs(valor).toFixed(2)}%`
}

// Mensagens motivacionais baseadas na posição
export function getMensagemMotivacional(posicao: number, totalParticipantes: number): string {
  if (posicao === 1) {
    return 'Você está liderando! Continue assim! 🏆'
  } else if (posicao <= 3) {
    return 'Você está no pódio! Não desista! 💪'
  } else if (posicao <= 10) {
    return 'Ótimo trabalho! Você está no top 10! ⭐'
  } else if (posicao <= Math.ceil(totalParticipantes / 4)) {
    return 'Você está entre os 25% melhores! 📈'
  } else if (posicao <= Math.ceil(totalParticipantes / 2)) {
    return 'Você está na metade de cima! Continue! 💪'
  } else {
    return 'Cada pequeno passo conta! Você consegue! 🌟'
  }
}

// Categorias de peso para filtros
export type CategoriaLeaderboard = 'geral' | 'masculino' | 'feminino' | 'minha_idade'

export const CATEGORIAS_LEADERBOARD = [
  { value: 'geral', label: 'Geral' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'minha_idade', label: 'Minha Faixa Etária' },
]
