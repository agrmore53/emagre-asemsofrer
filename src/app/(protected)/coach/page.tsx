'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AICoachChat } from '@/components/coach/AICoachChat'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TOPIC_STARTERS } from '@/lib/ai/coach-prompts'

export default function CoachPage() {
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    loadUserName()
  }, [])

  const loadUserName = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nome')
        .eq('id', user.id)
        .single()
      if (profile?.nome) {
        setUserName(profile.nome.split(' ')[0])
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Coach Virtual</h1>
        <p className="text-muted-foreground mt-2">
          Converse com a Dra. Ana, sua coach de emagrecimento disponível 24/7
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat principal */}
        <div className="lg:col-span-2">
          <AICoachChat userName={userName} />
        </div>

        {/* Sidebar com dicas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sobre a Dra. Ana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">👩‍⚕️</span>
                </div>
                <div>
                  <p className="font-medium">Dra. Ana</p>
                  <p className="text-sm text-muted-foreground">
                    Coach Virtual de Emagrecimento
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Especializada em nutrição comportamental, psicologia do
                emagrecimento e suporte para mulheres na menopausa e homens na
                andropausa.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">CBT</Badge>
                <Badge variant="outline">Nutrição</Badge>
                <Badge variant="outline">Menopausa</Badge>
                <Badge variant="outline">GLP-1</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tópicos Populares</CardTitle>
              <CardDescription>
                Clique para iniciar uma conversa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {TOPIC_STARTERS.map(topic => (
                  <button
                    key={topic.id}
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors flex items-center gap-3"
                    onClick={() => {
                      // Scroll to chat and focus
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <span className="text-sm font-medium">{topic.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dicas de Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong>Seja específico:</strong> Quanto mais detalhes você
                compartilhar, melhor será o conselho.
              </p>
              <p>
                <strong>Fale sobre emoções:</strong> A Dra. Ana pode ajudar com
                fome emocional e motivação.
              </p>
              <p>
                <strong>Pergunte sobre receitas:</strong> Peça sugestões de
                refeições saudáveis.
              </p>
              <p>
                <strong>Celebre vitórias:</strong> Compartilhe suas conquistas,
                por menores que sejam!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
