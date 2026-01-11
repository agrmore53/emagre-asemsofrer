import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enviarEmailBoasVindas } from '@/lib/email/send'

// POST - Envia email de boas-vindas
export async function POST() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca dados do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('nome, email')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    // Envia email
    const resultado = await enviarEmailBoasVindas(
      profile.email,
      profile.nome || 'Usuário'
    )

    if (!resultado.success) {
      throw new Error('Falha ao enviar email')
    }

    return NextResponse.json({
      success: true,
      message: 'Email de boas-vindas enviado!',
    })
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}
