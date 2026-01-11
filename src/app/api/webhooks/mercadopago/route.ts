import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  buscarPagamento,
  mapearStatusPagamento,
  calcularDataExpiracao,
  type PlanoId,
} from '@/lib/mercadopago/client'

// Cliente admin para operações no webhook (sem auth do usuário)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST - Recebe notificações do Mercado Pago
export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('Webhook Mercado Pago recebido:', JSON.stringify(body, null, 2))

    // Verifica tipo de notificação
    if (body.type !== 'payment') {
      console.log('Tipo de notificação ignorado:', body.type)
      return NextResponse.json({ message: 'OK' })
    }

    // Busca detalhes do pagamento
    const paymentId = body.data?.id
    if (!paymentId) {
      console.log('ID do pagamento não encontrado')
      return NextResponse.json({ error: 'Payment ID missing' }, { status: 400 })
    }

    const pagamento = await buscarPagamento(paymentId)
    console.log('Pagamento encontrado:', JSON.stringify(pagamento, null, 2))

    // Extrai dados do external_reference
    let userId: string | null = null
    let plano: PlanoId | null = null

    try {
      if (pagamento.external_reference) {
        const ref = JSON.parse(pagamento.external_reference)
        userId = ref.userId
        plano = ref.plano
      }
    } catch {
      console.error('Erro ao parsear external_reference:', pagamento.external_reference)
    }

    if (!userId || !plano) {
      console.log('userId ou plano não encontrado no external_reference')
      return NextResponse.json({ error: 'Invalid external_reference' }, { status: 400 })
    }

    // Mapeia status
    const status = mapearStatusPagamento(pagamento.status || 'pending')
    console.log(`Processando pagamento ${paymentId} - Status: ${status}`)

    // Atualiza ou cria registro de assinatura
    const { error: assinaturaError } = await supabaseAdmin
      .from('assinaturas')
      .upsert({
        user_id: userId,
        mercadopago_id: paymentId,
        plano,
        valor: pagamento.transaction_amount,
        status,
        data_inicio: new Date().toISOString(),
        data_fim: status === 'approved' ? calcularDataExpiracao().toISOString() : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'mercadopago_id',
      })

    if (assinaturaError) {
      console.error('Erro ao salvar assinatura:', assinaturaError)
    }

    // Se aprovado, atualiza perfil do usuário
    if (status === 'approved') {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          plano,
          status_assinatura: 'ativo',
          mercadopago_subscription_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError)
      }

      console.log(`Assinatura ativada para usuário ${userId} - Plano: ${plano}`)
    } else if (status === 'rejected' || status === 'cancelled' || status === 'refunded') {
      // Cancela assinatura
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          status_assinatura: 'cancelado',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (profileError) {
        console.error('Erro ao cancelar assinatura no perfil:', profileError)
      }

      console.log(`Assinatura cancelada para usuário ${userId}`)
    }

    return NextResponse.json({ message: 'Webhook processado com sucesso' })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// GET - Verifica se o webhook está funcionando
export async function GET() {
  return NextResponse.json({ status: 'Webhook ativo', timestamp: new Date().toISOString() })
}
