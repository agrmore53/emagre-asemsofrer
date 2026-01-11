// Mercado Pago Client Configuration

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Inicializa o cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 },
})

// Instâncias das APIs
export const preference = new Preference(client)
export const payment = new Payment(client)

// Configuração dos planos
export const PLANOS = {
  basico: {
    id: 'basico',
    nome: 'Plano Básico',
    preco: 29.9,
    precoOriginal: 49.9,
    descricao: 'Acesso completo ao conteúdo',
    recursos: [
      'Todos os 8 capítulos do método',
      'Tracker de peso ilimitado',
      'Gráficos de evolução',
      'Calculadora de calorias',
      'Suporte por email',
    ],
    naoInclui: [
      'Cardápios personalizados',
      'Lista de compras automática',
      'Suporte prioritário',
    ],
    cor: 'blue',
    popular: false,
  },
  premium: {
    id: 'premium',
    nome: 'Plano Premium',
    preco: 49.9,
    precoOriginal: 79.9,
    descricao: 'Experiência completa',
    recursos: [
      'Tudo do plano Básico',
      'Cardápios personalizados semanais',
      'Lista de compras automática',
      'Regenerar refeições ilimitado',
      'Suporte prioritário WhatsApp',
      'Novos recursos primeiro',
    ],
    naoInclui: [],
    cor: 'green',
    popular: true,
  },
} as const

export type PlanoId = keyof typeof PLANOS

// Cria uma preferência de pagamento para assinatura
export async function criarPreferenciaPagamento({
  plano,
  userId,
  userEmail,
  userName,
}: {
  plano: PlanoId
  userId: string
  userEmail: string
  userName?: string
}) {
  const planoConfig = PLANOS[plano]

  const preferenceData = await preference.create({
    body: {
      items: [
        {
          id: planoConfig.id,
          title: `${planoConfig.nome} - Emagreça Sem Sofrer`,
          description: planoConfig.descricao,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: planoConfig.preco,
        },
      ],
      payer: {
        email: userEmail,
        name: userName || undefined,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/erro`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/pendente`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({ userId, plano }),
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'EMAGRECA SEM SOFRER',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    },
  })

  return preferenceData
}

// Busca detalhes de um pagamento
export async function buscarPagamento(paymentId: string) {
  try {
    const paymentData = await payment.get({ id: paymentId })
    return paymentData
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    throw error
  }
}

// Tipos de status de pagamento
export type StatusPagamento = 'approved' | 'pending' | 'rejected' | 'refunded' | 'cancelled'

// Mapeia status do Mercado Pago para nosso sistema
export function mapearStatusPagamento(status: string): StatusPagamento {
  const mapeamento: Record<string, StatusPagamento> = {
    approved: 'approved',
    authorized: 'approved',
    pending: 'pending',
    in_process: 'pending',
    in_mediation: 'pending',
    rejected: 'rejected',
    cancelled: 'cancelled',
    refunded: 'refunded',
    charged_back: 'refunded',
  }

  return mapeamento[status] || 'pending'
}

// Calcula data de expiração do plano (30 dias)
export function calcularDataExpiracao(): Date {
  const data = new Date()
  data.setDate(data.getDate() + 30)
  return data
}
