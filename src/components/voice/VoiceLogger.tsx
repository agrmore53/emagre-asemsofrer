'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  verificarSuporteVoz,
  criarReconhecimentoVoz,
  processarVoz,
  RESPOSTAS_VOZ,
  EXEMPLOS_COMANDOS,
  VoiceCommand,
} from '@/lib/voice'

// Type para Web Speech API
type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T } ? T : never

export function VoiceLogger() {
  const [suportado, setSuportado] = useState(true)
  const [gravando, setGravando] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [resultado, setResultado] = useState<{
    comando: VoiceCommand
    mensagem: string
    sucesso: boolean
  } | null>(null)
  const [processando, setProcessando] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    setSuportado(verificarSuporteVoz())
    const rec = criarReconhecimentoVoz()
    if (rec) {
      setRecognition(rec)
    }
  }, [])

  const executarComando = useCallback(async (comando: VoiceCommand, dados: Record<string, unknown>) => {
    setProcessando(true)
    try {
      switch (comando) {
        case 'registrar_peso':
          await fetch('/api/tracker', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ peso_kg: dados.peso })
          })
          break

        case 'registrar_agua':
          // Poderia adicionar endpoint de água
          break

        case 'perguntar_coach':
          // Redirecionar para coach
          window.location.href = `/coach?pergunta=${encodeURIComponent(dados.pergunta as string)}`
          return

        case 'ver_progresso':
          window.location.href = '/tracker'
          return
      }

      setResultado({
        comando,
        mensagem: RESPOSTAS_VOZ[comando](dados),
        sucesso: true
      })
    } catch (error) {
      setResultado({
        comando,
        mensagem: 'Erro ao processar comando',
        sucesso: false
      })
    } finally {
      setProcessando(false)
    }
  }, [])

  const iniciarGravacao = useCallback(() => {
    if (!recognition) return

    setTranscript('')
    setResultado(null)
    setGravando(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1]
      const transcriptText = result[0].transcript
      setTranscript(transcriptText)

      if (result.isFinal) {
        const processed = processarVoz(transcriptText)
        if (processed.comando !== 'desconhecido') {
          executarComando(processed.comando, processed.dados_extraidos)
        } else {
          setResultado({
            comando: 'desconhecido',
            mensagem: RESPOSTAS_VOZ.desconhecido({}),
            sucesso: false
          })
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Erro de reconhecimento:', event.error)
      setGravando(false)
      if (event.error === 'not-allowed') {
        setResultado({
          comando: 'desconhecido',
          mensagem: 'Permissão de microfone negada',
          sucesso: false
        })
      }
    }

    recognition.onend = () => {
      setGravando(false)
    }

    recognition.start()
  }, [recognition, executarComando])

  const pararGravacao = useCallback(() => {
    if (recognition) {
      recognition.stop()
    }
    setGravando(false)
  }, [recognition])

  if (!suportado) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-4xl mb-4">🎤</p>
          <p className="font-medium">Comando de voz não suportado</p>
          <p className="text-sm text-muted-foreground mt-2">
            Use um navegador compatível (Chrome, Edge, Safari)
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Botão principal */}
      <Card>
        <CardContent className="py-8 text-center">
          <Button
            size="lg"
            variant={gravando ? 'destructive' : 'default'}
            className={`w-24 h-24 rounded-full text-4xl ${
              gravando ? 'animate-pulse' : ''
            }`}
            onClick={gravando ? pararGravacao : iniciarGravacao}
            disabled={processando}
          >
            {gravando ? '⏹️' : '🎤'}
          </Button>
          <p className="mt-4 text-lg font-medium">
            {gravando
              ? 'Ouvindo...'
              : processando
              ? 'Processando...'
              : 'Toque para falar'}
          </p>
          {transcript && (
            <p className="mt-2 text-muted-foreground italic">"{transcript}"</p>
          )}
        </CardContent>
      </Card>

      {/* Resultado */}
      {resultado && (
        <Card className={resultado.sucesso ? 'border-green-500' : 'border-amber-500'}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {resultado.sucesso ? '✅' : '⚠️'}
              </span>
              <div>
                <p className="font-medium">{resultado.mensagem}</p>
                {resultado.comando !== 'desconhecido' && (
                  <Badge variant="secondary" className="mt-1">
                    {resultado.comando.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exemplos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Exemplos de Comandos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {EXEMPLOS_COMANDOS.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <span className="text-sm">"{ex.texto}"</span>
                <Badge variant="outline">{ex.comando}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dicas */}
      <Card>
        <CardContent className="py-4">
          <h3 className="font-medium mb-2">Dicas</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Fale de forma clara e natural</li>
            <li>• Use palavras-chave como "peso", "bebi", "comi"</li>
            <li>• Especifique unidades: kg, copos, ml</li>
            <li>• Para perguntas, comece com "Coach" ou "Doutora"</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default VoiceLogger
