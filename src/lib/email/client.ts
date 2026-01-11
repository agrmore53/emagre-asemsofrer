// Cliente de Email com Resend

import { Resend } from 'resend'

// Inicializa o cliente Resend (só se a chave existir)
const apiKey = process.env.RESEND_API_KEY

// Cria cliente apenas se a chave estiver configurada
export const resend = apiKey ? new Resend(apiKey) : null

// Email padrão de envio
export const EMAIL_FROM = 'Emagreça Sem Sofrer <noreply@emagreçasemsofrer.com.br>'

// Tipos de email
export type TipoEmail =
  | 'boas_vindas'
  | 'lembrete_peso'
  | 'conquista'
  | 'dica_semanal'
  | 'assinatura_ativa'
  | 'assinatura_cancelada'

// Interface para envio
export interface EnvioEmail {
  to: string
  subject: string
  html: string
  tipo: TipoEmail
}

// Função genérica de envio
export async function enviarEmail({ to, subject, html }: Omit<EnvioEmail, 'tipo'>) {
  // Se Resend não estiver configurado, apenas loga
  if (!resend) {
    console.log('Resend não configurado. Email seria enviado para:', to)
    console.log('Assunto:', subject)
    return { success: true, id: 'mock-' + Date.now() }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return { success: false, error }
    }

    console.log('Email enviado:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}
