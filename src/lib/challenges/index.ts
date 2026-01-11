// Sistema de Desafios em Grupo (Team Challenges)

export type TipoDesafio = 'peso' | 'streak' | 'passos' | 'agua' | 'refeicoes'

export interface Challenge {
  id: string
  nome: string
  descricao: string | null
  tipo: TipoDesafio
  meta_valor: number | null
  data_inicio: string
  data_fim: string
  criador_id: string | null
  codigo_convite: string | null
  premio_descricao: string | null
  premio_valor: number | null
  max_participantes: number
  privado: boolean
  created_at: string
  participantes_count?: number
  minha_posicao?: number
  meu_progresso?: number
}

export interface ChallengeParticipante {
  id: string
  challenge_id: string
  user_id: string
  peso_inicial: number | null
  peso_atual: number | null
  percentual_perdido: number
  posicao_ranking: number | null
  data_entrada: string
  ativo: boolean
  // Joined data
  user_nome?: string
  user_foto?: string
}

// Gerar código de convite único
export function gerarCodigoConvite(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let codigo = ''
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return codigo
}

// Calcular dias restantes
export function calcularDiasRestantes(dataFim: string): number {
  const fim = new Date(dataFim)
  const hoje = new Date()
  const diff = fim.getTime() - hoje.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// Calcular progresso do desafio
export function calcularProgressoDesafio(dataInicio: string, dataFim: string): number {
  const inicio = new Date(dataInicio).getTime()
  const fim = new Date(dataFim).getTime()
  const hoje = Date.now()

  if (hoje < inicio) return 0
  if (hoje > fim) return 100

  return Math.round(((hoje - inicio) / (fim - inicio)) * 100)
}

// Status do desafio
export function getStatusDesafio(dataInicio: string, dataFim: string): 'pendente' | 'ativo' | 'encerrado' {
  const hoje = new Date()
  const inicio = new Date(dataInicio)
  const fim = new Date(dataFim)

  if (hoje < inicio) return 'pendente'
  if (hoje > fim) return 'encerrado'
  return 'ativo'
}

// Formatar percentual
export function formatarPercentual(valor: number | null): string {
  if (valor === null || valor === undefined) return '0%'
  const sinal = valor > 0 ? '-' : valor < 0 ? '+' : ''
  return `${sinal}${Math.abs(valor).toFixed(1)}%`
}

// Calcular percentual perdido
export function calcularPercentualPerdido(pesoInicial: number, pesoAtual: number): number {
  if (!pesoInicial || pesoInicial === 0) return 0
  return ((pesoInicial - pesoAtual) / pesoInicial) * 100
}

// Templates de desafios populares
export const TEMPLATES_DESAFIOS = [
  {
    nome: 'Desafio 30 Dias',
    descricao: 'Perca peso em 30 dias competindo com amigos',
    tipo: 'peso' as TipoDesafio,
    duracao_dias: 30,
    meta_texto: 'Maior % de peso perdido ganha',
  },
  {
    nome: 'Maratona de Streak',
    descricao: 'Quem consegue mais dias seguidos registrando peso',
    tipo: 'streak' as TipoDesafio,
    duracao_dias: 21,
    meta_texto: 'Maior sequência de dias',
  },
  {
    nome: 'Desafio da Hidratação',
    descricao: 'Beba 2L de água por dia durante 2 semanas',
    tipo: 'agua' as TipoDesafio,
    duracao_dias: 14,
    meta_texto: 'Completar meta de água diária',
  },
  {
    nome: 'Sprint de 7 Dias',
    descricao: 'Desafio rápido de uma semana',
    tipo: 'peso' as TipoDesafio,
    duracao_dias: 7,
    meta_texto: 'Perder o máximo em 7 dias',
  },
]

// Badges para posições
export const BADGES_POSICAO = {
  1: { emoji: '🥇', label: '1º Lugar', cor: 'text-yellow-500' },
  2: { emoji: '🥈', label: '2º Lugar', cor: 'text-gray-400' },
  3: { emoji: '🥉', label: '3º Lugar', cor: 'text-amber-600' },
}
