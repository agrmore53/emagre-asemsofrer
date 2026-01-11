import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  criarPreferenciaPagamento,
  PLANOS,
  type PlanoId,
} from '@/lib/mercadopago/client'

// GET - Busca status da assinatura do usuário
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca perfil com dados de assinatura
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('plano, status_assinatura, mercadopago_subscription_id')
      .eq('id', user.id)
      .single()

    if (error) throw error

    // Busca última assinatura
    const { data: assinatura } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      planoAtual: profile?.plano || 'free',
      statusAssinatura: profile?.status_assinatura || 'inativo',
      assinatura: assinatura || null,
      planos: PLANOS,
    })
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error)
    return NextResponse.json({ error: 'Erro ao buscar assinatura' }, { status: 500 })
  }
}

// POST - Cria uma nova preferência de pagamento
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { plano } = await request.json()

    // Valida plano
    if (!plano || !PLANOS[plano as PlanoId]) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Busca dados do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, email')
      .eq('id', user.id)
      .single()

    // Cria preferência no Mercado Pago
    const preferencia = await criarPreferenciaPagamento({
      plano: plano as PlanoId,
      userId: user.id,
      userEmail: profile?.email || user.email || '',
      userName: profile?.nome,
    })

    return NextResponse.json({
      preferenceId: preferencia.id,
      initPoint: preferencia.init_point,
      sandboxInitPoint: preferencia.sandbox_init_point,
    })
  } catch (error) {
    console.error('Erro ao criar preferência:', error)
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 })
  }
}
