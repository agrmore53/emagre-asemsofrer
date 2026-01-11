// Tipos principais do sistema

export type NivelAtividade = 'sedentario' | 'leve' | 'moderado' | 'intenso'
export type Sexo = 'masculino' | 'feminino'
export type PlanoAssinatura = 'free' | 'basico' | 'premium'
export type StatusAssinatura = 'ativo' | 'cancelado' | 'pendente' | 'expirado'

// Tipos para sistema de nutrição por idade
export type FaixaEtaria = '18-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70+'
export type FaseHormonal =
  | 'regular'
  | 'pre_menopausa'
  | 'perimenopausa'
  | 'menopausa'
  | 'andropausa_inicial'
  | 'andropausa'

export type ObjetivoSaude =
  | 'perder_peso'
  | 'manter_peso'
  | 'ganhar_massa'
  | 'longevidade'
  | 'energia'
  | 'saude_hormonal'

export interface Profile {
  id: string
  nome: string
  email: string
  data_nascimento: string | null
  sexo: Sexo | null
  altura_cm: number | null
  peso_inicial: number | null
  peso_meta: number | null
  nivel_atividade: NivelAtividade
  restricoes_alimentares: string[]
  plano: PlanoAssinatura
  status_assinatura: StatusAssinatura
  mercadopago_subscription_id: string | null
  // Novos campos para nutrição por idade
  fase_hormonal?: FaseHormonal | null
  objetivo_saude?: ObjetivoSaude | null
  condicoes_saude?: string[] // diabetes, hipertensao, etc.
  suplementos_atuais?: string[]
  created_at: string
  updated_at: string
}

export interface TrackerRegistro {
  id: string
  user_id: string
  data: string
  peso_kg: number
  cintura_cm: number | null
  quadril_cm: number | null
  braco_cm: number | null
  observacoes: string | null
  created_at: string
}

export interface ConteudoProgresso {
  id: string
  user_id: string
  capitulo_id: string
  concluido: boolean
  data_conclusao: string | null
}

export interface Refeicao {
  tipo: 'cafe' | 'almoco' | 'lanche' | 'jantar'
  nome: string
  alimentos: string[]
  calorias: number
}

export interface Cardapio {
  id: string
  user_id: string
  data: string
  refeicoes: Refeicao[]
  calorias_total: number
  created_at: string
}

export interface Assinatura {
  id: string
  user_id: string
  mercadopago_id: string
  plano: PlanoAssinatura
  valor: number
  status: StatusAssinatura
  data_inicio: string
  data_fim: string | null
  created_at: string
}

// Capítulos do ebook
export interface Capitulo {
  id: string
  numero: number
  titulo: string
  descricao: string
  slug: string
  tempoLeitura: number // em minutos
}

// Gamificação
export type CategoriaConquista = 'streak' | 'peso' | 'conteudo' | 'engajamento' | 'especial'

export interface Conquista {
  id: string
  titulo: string
  descricao: string
  icone: string
  categoria: CategoriaConquista
  pontos: number
  requisito: Record<string, unknown>
  ordem: number
}

export interface UsuarioConquista {
  id: string
  user_id: string
  conquista_id: string
  desbloqueada_em: string
  notificado: boolean
  conquista?: Conquista
}

export interface UsuarioStreak {
  id: string
  user_id: string
  streak_atual: number
  maior_streak: number
  ultima_atividade: string | null
  total_dias_ativos: number
}

export interface UsuarioPontos {
  id: string
  user_id: string
  pontos_totais: number
  nivel: number
}

export interface GamificacaoUsuario {
  streak: UsuarioStreak | null
  pontos: UsuarioPontos | null
  conquistas: UsuarioConquista[]
  todasConquistas: Conquista[]
}

export const CAPITULOS: Capitulo[] = [
  {
    id: 'cap-1',
    numero: 1,
    titulo: 'Por Que Toda Dieta Que Você Fez Falhou',
    descricao: 'Descubra por que as dietas tradicionais não funcionam e como quebrar o ciclo vicioso.',
    slug: 'por-que-dietas-falham',
    tempoLeitura: 8
  },
  {
    id: 'cap-2',
    numero: 2,
    titulo: 'O Único Princípio Que Realmente Funciona',
    descricao: 'Entenda o déficit calórico de forma simples e libertadora.',
    slug: 'principio-que-funciona',
    tempoLeitura: 10
  },
  {
    id: 'cap-3',
    numero: 3,
    titulo: 'Como Comer o Que Gosta e Ainda Assim Emagrecer',
    descricao: 'A regra 80/20 e o método do encaixe para comer sem culpa.',
    slug: 'comer-o-que-gosta',
    tempoLeitura: 12
  },
  {
    id: 'cap-4',
    numero: 4,
    titulo: 'O Método do Prato Inteligente',
    descricao: 'Monte suas refeições de forma visual, sem contar calorias.',
    slug: 'prato-inteligente',
    tempoLeitura: 10
  },
  {
    id: 'cap-5',
    numero: 5,
    titulo: 'Estratégias Para o Dia a Dia Real',
    descricao: 'Como lidar com festas, restaurantes e finais de semana.',
    slug: 'estrategias-dia-a-dia',
    tempoLeitura: 10
  },
  {
    id: 'cap-6',
    numero: 6,
    titulo: 'O Poder dos Pequenos Ajustes',
    descricao: 'Trocas simples que fazem grande diferença.',
    slug: 'pequenos-ajustes',
    tempoLeitura: 8
  },
  {
    id: 'cap-7',
    numero: 7,
    titulo: 'Lidando Com a Fome Emocional',
    descricao: 'Identifique seus gatilhos e encontre alternativas.',
    slug: 'fome-emocional',
    tempoLeitura: 10
  },
  {
    id: 'cap-8',
    numero: 8,
    titulo: 'Seu Plano de Ação Simples',
    descricao: 'Comece hoje com passos práticos e expectativas realistas.',
    slug: 'plano-de-acao',
    tempoLeitura: 8
  }
]
