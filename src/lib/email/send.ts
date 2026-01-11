// Funções de envio de email

import { enviarEmail } from './client'
import {
  templateBoasVindas,
  templateLembretePeso,
  templateConquista,
  templateDicaSemanal,
  templateAssinaturaAtiva,
  templateResumoSemanal,
} from './templates'

/**
 * Envia email de boas-vindas para novo usuário
 */
export async function enviarEmailBoasVindas(email: string, nome: string) {
  return enviarEmail({
    to: email,
    subject: '🎉 Bem-vindo(a) ao Emagreça Sem Sofrer!',
    html: templateBoasVindas(nome),
  })
}

/**
 * Envia lembrete para registrar peso
 */
export async function enviarEmailLembretePeso(
  email: string,
  nome: string,
  diasSemRegistro: number
) {
  return enviarEmail({
    to: email,
    subject: `⚖️ ${nome}, hora de registrar seu peso!`,
    html: templateLembretePeso(nome, diasSemRegistro),
  })
}

/**
 * Envia notificação de nova conquista
 */
export async function enviarEmailConquista(
  email: string,
  nome: string,
  conquista: { titulo: string; descricao: string; icone: string }
) {
  return enviarEmail({
    to: email,
    subject: `🏆 ${nome}, você desbloqueou: ${conquista.titulo}!`,
    html: templateConquista(nome, conquista),
  })
}

/**
 * Envia dica semanal
 */
export async function enviarEmailDicaSemanal(
  email: string,
  nome: string,
  dica: { titulo: string; conteudo: string; capitulo?: string }
) {
  return enviarEmail({
    to: email,
    subject: `💡 ${nome}, sua dica da semana`,
    html: templateDicaSemanal(nome, dica),
  })
}

/**
 * Envia confirmação de assinatura
 */
export async function enviarEmailAssinaturaAtiva(
  email: string,
  nome: string,
  plano: string
) {
  return enviarEmail({
    to: email,
    subject: `🎉 Assinatura ${plano} confirmada!`,
    html: templateAssinaturaAtiva(nome, plano),
  })
}

/**
 * Envia resumo semanal
 */
export async function enviarEmailResumoSemanal(
  email: string,
  nome: string,
  stats: {
    pesoAtual?: number
    variacaoSemana?: number
    diasRegistrados: number
    capitulosLidos: number
    streak: number
  }
) {
  return enviarEmail({
    to: email,
    subject: `📊 ${nome}, seu resumo semanal chegou!`,
    html: templateResumoSemanal(nome, stats),
  })
}
