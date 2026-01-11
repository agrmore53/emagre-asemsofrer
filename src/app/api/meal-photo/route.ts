import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MEAL_ANALYSIS_PROMPT, gerarAnaliseSimulada, MealAnalysis } from '@/lib/meal-photo'

// GET - Buscar histórico de fotos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('meal_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (data) {
      query = query.eq('data', data)
    }

    const { data: photos, error } = await query

    if (error) throw error

    // Calcular estatísticas do dia
    const hoje = new Date().toISOString().split('T')[0]
    const refeicoesHoje = photos?.filter((p) => p.data === hoje) || []
    const caloriasHoje = refeicoesHoje.reduce(
      (sum, p) => sum + (p.analise?.calorias_estimadas || 0),
      0
    )

    return NextResponse.json({
      photos: photos || [],
      estatisticas_hoje: {
        total_refeicoes: refeicoesHoje.length,
        calorias_total: caloriasHoje,
        macros: {
          proteinas: refeicoesHoje.reduce(
            (sum, p) => sum + (p.analise?.macros_estimados?.proteinas || 0),
            0
          ),
          carboidratos: refeicoesHoje.reduce(
            (sum, p) => sum + (p.analise?.macros_estimados?.carboidratos || 0),
            0
          ),
          gorduras: refeicoesHoje.reduce(
            (sum, p) => sum + (p.analise?.macros_estimados?.gorduras || 0),
            0
          ),
        },
      },
    })
  } catch (error) {
    console.error('Erro ao buscar fotos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fotos' },
      { status: 500 }
    )
  }
}

// POST - Analisar foto de refeição
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { image_base64, tipo_refeicao, notas } = body

    if (!image_base64) {
      return NextResponse.json(
        { error: 'Imagem é obrigatória' },
        { status: 400 }
      )
    }

    // Analisar com IA
    let analise: MealAnalysis

    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    if (openaiKey) {
      // Usar GPT-4 Vision
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: MEAL_ANALYSIS_PROMPT },
                  {
                    type: 'image_url',
                    image_url: {
                      url: image_base64.startsWith('data:')
                        ? image_base64
                        : `data:image/jpeg;base64,${image_base64}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 1000,
          }),
        })

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (content) {
          // Parse JSON da resposta
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            analise = JSON.parse(jsonMatch[0])
          } else {
            analise = gerarAnaliseSimulada()
          }
        } else {
          analise = gerarAnaliseSimulada()
        }
      } catch (error) {
        console.error('Erro GPT-4 Vision:', error)
        analise = gerarAnaliseSimulada()
      }
    } else if (anthropicKey) {
      // Usar Claude Vision
      try {
        const imageData = image_base64.startsWith('data:')
          ? image_base64.split(',')[1]
          : image_base64
        const mediaType = image_base64.includes('png') ? 'image/png' : 'image/jpeg'

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: mediaType,
                      data: imageData,
                    },
                  },
                  { type: 'text', text: MEAL_ANALYSIS_PROMPT },
                ],
              },
            ],
          }),
        })

        const data = await response.json()
        const content = data.content?.[0]?.text

        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            analise = JSON.parse(jsonMatch[0])
          } else {
            analise = gerarAnaliseSimulada()
          }
        } else {
          analise = gerarAnaliseSimulada()
        }
      } catch (error) {
        console.error('Erro Claude Vision:', error)
        analise = gerarAnaliseSimulada()
      }
    } else {
      // Sem API configurada
      analise = gerarAnaliseSimulada()
    }

    // Salvar no banco (sem a imagem, apenas referência)
    // Em produção, salvar imagem no Supabase Storage
    const { data: photo, error } = await supabase
      .from('meal_photos')
      .insert({
        user_id: user.id,
        url: 'local', // Em produção: URL do storage
        tipo_refeicao,
        data: new Date().toISOString().split('T')[0],
        analise,
        notas,
        aprovado_usuario: false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      photo,
      analise,
    })
  } catch (error) {
    console.error('Erro ao analisar foto:', error)
    return NextResponse.json(
      { error: 'Erro ao analisar foto' },
      { status: 500 }
    )
  }
}

// PUT - Aprovar/corrigir análise
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { photo_id, analise_corrigida, aprovado } = body

    const { error } = await supabase
      .from('meal_photos')
      .update({
        analise: analise_corrigida,
        aprovado_usuario: aprovado,
      })
      .eq('id', photo_id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar' },
      { status: 500 }
    )
  }
}
