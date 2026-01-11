import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  buildSystemPrompt,
  detectMessageType,
  QUICK_RESPONSES,
  type CoachContext,
} from '@/lib/ai/coach-prompts'

// Configuração para usar OpenAI ou Anthropic
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai' // 'openai' ou 'anthropic'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  conversationHistory?: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body: ChatRequest = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 })
    }

    // Buscar perfil do usuário para contexto
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Buscar último registro de peso
    const { data: lastWeight } = await supabase
      .from('tracker_registros')
      .select('peso_kg, data')
      .eq('user_id', user.id)
      .order('data', { ascending: false })
      .limit(2)

    // Buscar streak
    const { data: streak } = await supabase
      .from('usuario_streaks')
      .select('streak_atual')
      .eq('user_id', user.id)
      .single()

    // Calcular idade
    let idade: number | undefined
    if (profile?.data_nascimento) {
      idade = Math.floor(
        (Date.now() - new Date(profile.data_nascimento).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
      )
    }

    // Calcular variação de peso
    let variacaoPeso: number | undefined
    if (lastWeight && lastWeight.length >= 2) {
      variacaoPeso = lastWeight[0].peso_kg - lastWeight[1].peso_kg
    }

    // Montar contexto
    const context: CoachContext = {
      userName: profile?.nome || 'Usuário',
      idade,
      sexo: profile?.sexo,
      pesoAtual: lastWeight?.[0]?.peso_kg || profile?.peso_inicial,
      pesoMeta: profile?.peso_meta,
      faixaEtaria: idade ? getFaixaEtaria(idade) : undefined,
      faseHormonal: profile?.fase_hormonal,
      objetivoSaude: profile?.objetivo_saude,
      restricoesAlimentares: profile?.restricoes_alimentares,
      diasStreak: streak?.streak_atual,
      variacaoPeso,
      usaGLP1: profile?.usa_glp1,
      medicamentoGLP1: profile?.medicamento_glp1,
      faseCicloMenstrual: profile?.fase_ciclo,
    }

    // Detectar tipo de mensagem
    const messageType = detectMessageType(message)

    // Se não tiver API configurada, usar respostas pré-definidas
    if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
      const responses = QUICK_RESPONSES[messageType] || QUICK_RESPONSES.general
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      // Personalizar resposta
      let response = randomResponse
      if (context.userName && context.userName !== 'Usuário') {
        response = `${context.userName}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`
      }

      // Salvar conversa
      await saveConversation(supabase, user.id, message, response)

      return NextResponse.json({
        response,
        messageType,
        usingFallback: true,
      })
    }

    // Chamar API de IA
    const systemPrompt = buildSystemPrompt(context)
    let aiResponse: string

    if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
      aiResponse = await callAnthropic(systemPrompt, message, conversationHistory)
    } else if (OPENAI_API_KEY) {
      aiResponse = await callOpenAI(systemPrompt, message, conversationHistory)
    } else {
      throw new Error('Nenhuma API de IA configurada')
    }

    // Salvar conversa
    await saveConversation(supabase, user.id, message, aiResponse)

    return NextResponse.json({
      response: aiResponse,
      messageType,
      usingFallback: false,
    })
  } catch (error) {
    console.error('Erro no AI Coach:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    )
  }
}

async function callOpenAI(
  systemPrompt: string,
  message: string,
  history: Message[]
): Promise<string> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callAnthropic(
  systemPrompt: string,
  message: string,
  history: Message[]
): Promise<string> {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  return data.content[0].text
}

async function saveConversation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  userMessage: string,
  aiResponse: string
) {
  try {
    await supabase.from('coach_conversations').insert({
      user_id: userId,
      user_message: userMessage,
      ai_response: aiResponse,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Log but don't fail if conversation save fails
    console.error('Erro ao salvar conversa')
  }
}

function getFaixaEtaria(idade: number): string {
  if (idade < 30) return '18-29'
  if (idade < 40) return '30-39'
  if (idade < 50) return '40-49'
  if (idade < 60) return '50-59'
  if (idade < 70) return '60-69'
  return '70+'
}

// GET - Buscar histórico de conversas
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const { data: conversations } = await supabase
      .from('coach_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    return NextResponse.json({
      conversations: conversations?.reverse() || [],
    })
  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}
