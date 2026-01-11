// Controle de Acesso por Plano

import type { Profile } from '@/types'

export type PlanoUsuario = 'free' | 'basico' | 'premium'
export type StatusAssinatura = 'ativo' | 'cancelado' | 'pendente' | 'inativo'

export interface RecursoAcesso {
  id: string
  nome: string
  planosPermitidos: PlanoUsuario[]
}

// Definição de recursos e quais planos têm acesso
export const RECURSOS: Record<string, RecursoAcesso> = {
  // Recursos gratuitos
  conteudo_capitulo_1: {
    id: 'conteudo_capitulo_1',
    nome: 'Capítulo 1 do Método',
    planosPermitidos: ['free', 'basico', 'premium'],
  },
  tracker_basico: {
    id: 'tracker_basico',
    nome: 'Tracker de Peso (7 dias)',
    planosPermitidos: ['free', 'basico', 'premium'],
  },

  // Recursos do plano básico
  conteudo_completo: {
    id: 'conteudo_completo',
    nome: 'Todos os Capítulos',
    planosPermitidos: ['basico', 'premium'],
  },
  tracker_ilimitado: {
    id: 'tracker_ilimitado',
    nome: 'Tracker Ilimitado',
    planosPermitidos: ['basico', 'premium'],
  },
  graficos_evolucao: {
    id: 'graficos_evolucao',
    nome: 'Gráficos de Evolução',
    planosPermitidos: ['basico', 'premium'],
  },
  calculadora_calorias: {
    id: 'calculadora_calorias',
    nome: 'Calculadora de Calorias',
    planosPermitidos: ['basico', 'premium'],
  },

  // Recursos do plano premium
  cardapio_personalizado: {
    id: 'cardapio_personalizado',
    nome: 'Cardápios Personalizados',
    planosPermitidos: ['premium'],
  },
  lista_compras: {
    id: 'lista_compras',
    nome: 'Lista de Compras Automática',
    planosPermitidos: ['premium'],
  },
  regenerar_refeicoes: {
    id: 'regenerar_refeicoes',
    nome: 'Regenerar Refeições',
    planosPermitidos: ['premium'],
  },
  suporte_prioritario: {
    id: 'suporte_prioritario',
    nome: 'Suporte Prioritário',
    planosPermitidos: ['premium'],
  },
}

/**
 * Verifica se o usuário tem acesso a um recurso específico
 */
export function temAcesso(profile: Profile | null, recursoId: string): boolean {
  if (!profile) return false

  const recurso = RECURSOS[recursoId]
  if (!recurso) return false

  const planoUsuario = (profile.plano as PlanoUsuario) || 'free'
  const statusAssinatura = profile.status_assinatura as StatusAssinatura

  // Se não é free, verifica se a assinatura está ativa
  if (planoUsuario !== 'free' && statusAssinatura !== 'ativo') {
    // Trata como free se a assinatura não estiver ativa
    return recurso.planosPermitidos.includes('free')
  }

  return recurso.planosPermitidos.includes(planoUsuario)
}

/**
 * Retorna o plano efetivo do usuário (considerando status da assinatura)
 */
export function getPlanoEfetivo(profile: Profile | null): PlanoUsuario {
  if (!profile) return 'free'

  const planoUsuario = (profile.plano as PlanoUsuario) || 'free'
  const statusAssinatura = profile.status_assinatura as StatusAssinatura

  // Se não é free e a assinatura não está ativa, trata como free
  if (planoUsuario !== 'free' && statusAssinatura !== 'ativo') {
    return 'free'
  }

  return planoUsuario
}

/**
 * Verifica se o usuário pode acessar um capítulo específico
 */
export function podeAcessarCapitulo(profile: Profile | null, numeroCapitulo: number): boolean {
  if (numeroCapitulo === 1) {
    // Capítulo 1 é gratuito
    return temAcesso(profile, 'conteudo_capitulo_1')
  }

  // Outros capítulos requerem plano básico ou premium
  return temAcesso(profile, 'conteudo_completo')
}

/**
 * Verifica se o tracker do usuário está dentro do limite gratuito
 */
export function podeRegistrarNoTracker(
  profile: Profile | null,
  totalRegistros: number
): boolean {
  // Plano básico ou premium: ilimitado
  if (temAcesso(profile, 'tracker_ilimitado')) {
    return true
  }

  // Plano free: máximo 7 registros
  const LIMITE_FREE = 7
  return totalRegistros < LIMITE_FREE
}

/**
 * Retorna mensagem para upgrade quando usuário não tem acesso
 */
export function getMensagemUpgrade(recursoId: string): {
  titulo: string
  mensagem: string
  planoMinimo: PlanoUsuario
} {
  const recurso = RECURSOS[recursoId]

  if (!recurso) {
    return {
      titulo: 'Recurso Premium',
      mensagem: 'Este recurso requer uma assinatura ativa.',
      planoMinimo: 'basico',
    }
  }

  // Encontra o plano mínimo necessário
  const planoMinimo: PlanoUsuario = recurso.planosPermitidos.includes('basico')
    ? 'basico'
    : 'premium'

  const nomePlano = planoMinimo === 'basico' ? 'Básico' : 'Premium'

  return {
    titulo: `Recurso do Plano ${nomePlano}`,
    mensagem: `${recurso.nome} está disponível no plano ${nomePlano} ou superior.`,
    planoMinimo,
  }
}

/**
 * Lista recursos disponíveis para um plano
 */
export function getRecursosDoPlano(plano: PlanoUsuario): RecursoAcesso[] {
  return Object.values(RECURSOS).filter((r) => r.planosPermitidos.includes(plano))
}
