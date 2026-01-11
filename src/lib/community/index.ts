// Sistema de Comunidades e Grupos Temáticos

export type CategoriaGrupo =
  | 'geral'
  | 'iniciantes'
  | 'maes'
  | 'menopausa'
  | 'glp1'
  | 'vegetariano'
  | 'low_carb'
  | 'jejum'
  | 'exercicios'
  | 'emocional'

export interface CommunityGroup {
  id: string
  nome: string
  descricao: string
  categoria: CategoriaGrupo
  icone: string
  cor: string
  privado: boolean
  membros_count: number
  posts_count: number
  criador_id: string
  created_at: string
}

export interface CommunityPost {
  id: string
  group_id: string
  user_id: string
  user_nome: string
  conteudo: string
  tipo: 'texto' | 'conquista' | 'duvida' | 'motivacao' | 'receita'
  likes_count: number
  comments_count: number
  liked_by_me: boolean
  created_at: string
}

export interface CommunityComment {
  id: string
  post_id: string
  user_id: string
  user_nome: string
  conteudo: string
  created_at: string
}

// Configuração de categorias
export const CATEGORIAS_GRUPO: Record<CategoriaGrupo, {
  nome: string
  descricao: string
  icone: string
  cor: string
}> = {
  geral: {
    nome: 'Geral',
    descricao: 'Discussões gerais sobre emagrecimento',
    icone: '💬',
    cor: 'bg-gray-100 text-gray-800',
  },
  iniciantes: {
    nome: 'Iniciantes',
    descricao: 'Para quem está começando a jornada',
    icone: '🌱',
    cor: 'bg-green-100 text-green-800',
  },
  maes: {
    nome: 'Mães',
    descricao: 'Emagrecimento pós-parto e rotina de mães',
    icone: '👶',
    cor: 'bg-pink-100 text-pink-800',
  },
  menopausa: {
    nome: 'Menopausa',
    descricao: 'Desafios hormonais e estratégias',
    icone: '🌸',
    cor: 'bg-purple-100 text-purple-800',
  },
  glp1: {
    nome: 'Usuários GLP-1',
    descricao: 'Ozempic, Wegovy, Mounjaro',
    icone: '💉',
    cor: 'bg-blue-100 text-blue-800',
  },
  vegetariano: {
    nome: 'Vegetarianos',
    descricao: 'Emagrecimento sem carne',
    icone: '🥗',
    cor: 'bg-emerald-100 text-emerald-800',
  },
  low_carb: {
    nome: 'Low Carb / Keto',
    descricao: 'Estratégias de baixo carboidrato',
    icone: '🥩',
    cor: 'bg-red-100 text-red-800',
  },
  jejum: {
    nome: 'Jejum Intermitente',
    descricao: 'Protocolos e experiências',
    icone: '⏰',
    cor: 'bg-amber-100 text-amber-800',
  },
  exercicios: {
    nome: 'Exercícios',
    descricao: 'Treinos e atividades físicas',
    icone: '💪',
    cor: 'bg-orange-100 text-orange-800',
  },
  emocional: {
    nome: 'Apoio Emocional',
    descricao: 'Fome emocional e autoestima',
    icone: '❤️',
    cor: 'bg-rose-100 text-rose-800',
  },
}

// Tipos de post
export const TIPOS_POST = [
  { id: 'texto', nome: 'Texto', icone: '📝' },
  { id: 'conquista', nome: 'Conquista', icone: '🏆' },
  { id: 'duvida', nome: 'Dúvida', icone: '❓' },
  { id: 'motivacao', nome: 'Motivação', icone: '💪' },
  { id: 'receita', nome: 'Receita', icone: '🍳' },
]

// Grupos padrão do sistema
export const GRUPOS_PADRAO: Omit<CommunityGroup, 'id' | 'membros_count' | 'posts_count' | 'criador_id' | 'created_at'>[] = [
  {
    nome: 'Boas-vindas',
    descricao: 'Apresente-se e conheça a comunidade',
    categoria: 'geral',
    icone: '👋',
    cor: 'bg-blue-500',
    privado: false,
  },
  {
    nome: 'Primeiros Passos',
    descricao: 'Dúvidas e dicas para iniciantes',
    categoria: 'iniciantes',
    icone: '🌱',
    cor: 'bg-green-500',
    privado: false,
  },
  {
    nome: 'Vitórias do Dia',
    descricao: 'Compartilhe suas conquistas!',
    categoria: 'geral',
    icone: '🎉',
    cor: 'bg-yellow-500',
    privado: false,
  },
  {
    nome: 'Receitas Fit',
    descricao: 'Compartilhe receitas saudáveis',
    categoria: 'geral',
    icone: '🍳',
    cor: 'bg-orange-500',
    privado: false,
  },
  {
    nome: 'Clube do GLP-1',
    descricao: 'Para usuários de Ozempic, Wegovy, etc',
    categoria: 'glp1',
    icone: '💉',
    cor: 'bg-purple-500',
    privado: false,
  },
  {
    nome: 'Menopausa e Emagrecimento',
    descricao: 'Estratégias para essa fase',
    categoria: 'menopausa',
    icone: '🌸',
    cor: 'bg-pink-500',
    privado: false,
  },
]

// Formatar tempo relativo
export function formatarTempoRelativo(data: string): string {
  const agora = new Date()
  const postDate = new Date(data)
  const diffMs = agora.getTime() - postDate.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHora = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDia = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min`
  if (diffHora < 24) return `${diffHora}h`
  if (diffDia < 7) return `${diffDia}d`
  return postDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}
