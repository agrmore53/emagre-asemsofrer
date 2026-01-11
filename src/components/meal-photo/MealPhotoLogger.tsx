'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  MealAnalysis,
  TIPOS_REFEICAO,
  CATEGORIAS_ALIMENTOS,
  QUALIDADE_CONFIG,
  imageToBase64,
  detectarTipoRefeicao,
} from '@/lib/meal-photo'

export function MealPhotoLogger() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [analise, setAnalise] = useState<MealAnalysis | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [tipoRefeicao, setTipoRefeicao] = useState(detectarTipoRefeicao())

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const base64 = await imageToBase64(file)
      setImagePreview(base64)

      const response = await fetch('/api/meal-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64,
          tipo_refeicao: tipoRefeicao,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setAnalise(data.analise)
        setShowResult(true)
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const tipoAtual = TIPOS_REFEICAO.find((t) => t.id === tipoRefeicao)!

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            Foto da Refeição
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de tipo de refeição */}
          <div className="flex gap-2 flex-wrap">
            {TIPOS_REFEICAO.map((tipo) => (
              <Button
                key={tipo.id}
                variant={tipoRefeicao === tipo.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTipoRefeicao(tipo.id as typeof tipoRefeicao)}
              >
                <span className="mr-1">{tipo.emoji}</span>
                {tipo.nome}
              </Button>
            ))}
          </div>

          {/* Botão de captura */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={handleCapture}
          >
            {loading ? (
              <div className="space-y-2">
                <div className="animate-spin text-4xl">⏳</div>
                <p className="text-muted-foreground">Analisando refeição...</p>
              </div>
            ) : imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Clique para tirar outra foto
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">{tipoAtual.emoji}</div>
                <p className="font-medium">Fotografar {tipoAtual.nome}</p>
                <p className="text-sm text-muted-foreground">
                  Clique para abrir a câmera
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {analise && (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowResult(true)}
            >
              Ver última análise
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Modal de resultado */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{tipoAtual.emoji}</span>
              Análise do {tipoAtual.nome}
            </DialogTitle>
          </DialogHeader>

          {analise && (
            <div className="space-y-4">
              {/* Qualidade */}
              <div
                className={`p-4 rounded-lg text-center ${
                  QUALIDADE_CONFIG[analise.qualidade].bg
                }`}
              >
                <span className="text-3xl">
                  {QUALIDADE_CONFIG[analise.qualidade].emoji}
                </span>
                <p
                  className={`font-semibold capitalize ${
                    QUALIDADE_CONFIG[analise.qualidade].cor
                  }`}
                >
                  Refeição {analise.qualidade}
                </p>
                <p className="text-sm text-muted-foreground">
                  Confiança: {analise.confianca}%
                </p>
              </div>

              {/* Calorias e macros */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-lg font-bold">{analise.calorias_estimadas}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-lg font-bold text-red-600">
                    {analise.macros_estimados.proteinas}g
                  </p>
                  <p className="text-xs text-muted-foreground">Proteína</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-lg font-bold text-amber-600">
                    {analise.macros_estimados.carboidratos}g
                  </p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-lg font-bold text-yellow-600">
                    {analise.macros_estimados.gorduras}g
                  </p>
                  <p className="text-xs text-muted-foreground">Gordura</p>
                </div>
              </div>

              {/* Alimentos detectados */}
              <div>
                <p className="font-medium mb-2">Alimentos Detectados</p>
                <div className="space-y-2">
                  {analise.alimentos_detectados.map((alimento, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {CATEGORIAS_ALIMENTOS[alimento.categoria]?.emoji || '🍽️'}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{alimento.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {alimento.porcao_estimada}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{alimento.calorias} kcal</p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            CATEGORIAS_ALIMENTOS[alimento.categoria]?.cor || ''
                          }`}
                        >
                          {CATEGORIAS_ALIMENTOS[alimento.categoria]?.nome ||
                            alimento.categoria}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sugestões */}
              {analise.sugestoes.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Sugestões</p>
                  <ul className="space-y-1">
                    {analise.sugestoes.map((sugestao, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span>💡</span>
                        <span>{sugestao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="w-full" onClick={() => setShowResult(false)}>
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MealPhotoLogger
