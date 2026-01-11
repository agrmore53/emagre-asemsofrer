'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CBTLesson, CBTContent, CATEGORIAS_CBT } from '@/lib/cbt'

interface CBTData {
  licao_do_dia: CBTLesson
  completou_hoje: boolean
  estatisticas: {
    total_completadas: number
    streak_dias: number
    progresso_por_categoria: Record<string, number>
    total_licoes: number
  }
}

export function DailyLesson() {
  const [data, setData] = useState<CBTData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [showExercise, setShowExercise] = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/cbt')
      const result = await response.json()
      if (response.ok) {
        setData(result)
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!data) return
    setCompleting(true)
    try {
      const response = await fetch('/api/cbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: data.licao_do_dia.id,
        }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setCompleting(false)
    }
  }

  const renderContent = (content: CBTContent) => {
    const baseClasses = 'p-4 rounded-lg mb-3'

    switch (content.tipo) {
      case 'texto':
        return <p className="text-muted-foreground mb-3">{content.conteudo}</p>
      case 'exemplo':
        return (
          <div className={`${baseClasses} bg-muted`}>
            <span className="text-xl mr-2">{content.emoji}</span>
            <span>{content.conteudo}</span>
          </div>
        )
      case 'dica':
        return (
          <div className={`${baseClasses} bg-blue-50 border-l-4 border-blue-500`}>
            <span className="text-xl mr-2">{content.emoji}</span>
            <span>{content.conteudo}</span>
          </div>
        )
      case 'alerta':
        return (
          <div className={`${baseClasses} bg-amber-50 border-l-4 border-amber-500`}>
            <span className="text-xl mr-2">{content.emoji}</span>
            <span className="font-medium">{content.conteudo}</span>
          </div>
        )
      case 'citacao':
        return (
          <blockquote
            className={`${baseClasses} bg-purple-50 border-l-4 border-purple-500 italic`}
          >
            <span className="text-xl mr-2">{content.emoji}</span>
            <span>{content.conteudo}</span>
          </blockquote>
        )
      default:
        return <p>{content.conteudo}</p>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Carregando...
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  const licao = data.licao_do_dia
  const categoria = CATEGORIAS_CBT[licao.categoria]
  const totalSteps = licao.conteudo.length + (licao.exercicio ? 1 : 0) + 1

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{data.estatisticas.streak_dias}</p>
            <p className="text-xs text-muted-foreground">Dias de streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{data.estatisticas.total_completadas}</p>
            <p className="text-xs text-muted-foreground">Lições completas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">
              {Math.round(
                (data.estatisticas.total_completadas / data.estatisticas.total_licoes) *
                  100
              )}
              %
            </p>
            <p className="text-xs text-muted-foreground">Progresso total</p>
          </CardContent>
        </Card>
      </div>

      {/* Lição do dia */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={categoria.cor}>
              {categoria.emoji} {categoria.nome}
            </Badge>
            <Badge variant="outline">{licao.duracao_minutos} min</Badge>
          </div>
          <CardTitle className="text-xl">{licao.titulo}</CardTitle>
          <p className="text-muted-foreground">{licao.subtitulo}</p>
        </CardHeader>

        <CardContent>
          {data.completou_hoje ? (
            <div className="text-center py-8">
              <span className="text-6xl">✅</span>
              <h3 className="text-xl font-semibold mt-4">Lição do dia concluída!</h3>
              <p className="text-muted-foreground mt-2">
                Volte amanhã para uma nova lição.
              </p>
            </div>
          ) : (
            <div>
              {/* Barra de progresso */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Conteúdo */}
              {currentStep < licao.conteudo.length && (
                <div>
                  {renderContent(licao.conteudo[currentStep])}
                </div>
              )}

              {/* Exercício */}
              {currentStep === licao.conteudo.length && licao.exercicio && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    Exercício: {licao.exercicio.titulo}
                  </h3>
                  <p className="text-muted-foreground">
                    {licao.exercicio.instrucoes}
                  </p>
                  {licao.exercicio.perguntas && (
                    <ul className="space-y-2">
                      {licao.exercicio.perguntas.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Reflexão final */}
              {currentStep === totalSteps - 1 && licao.reflexao && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-2">Reflexão Final:</p>
                  <p className="italic">{licao.reflexao}</p>
                </div>
              )}

              {/* Navegação */}
              <div className="flex gap-2 mt-6">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Anterior
                  </Button>
                )}
                <div className="flex-1" />
                {currentStep < totalSteps - 1 ? (
                  <Button onClick={() => setCurrentStep(currentStep + 1)}>
                    Próximo
                  </Button>
                ) : (
                  <Button onClick={handleComplete} disabled={completing}>
                    {completing ? 'Salvando...' : 'Concluir Lição'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DailyLesson
