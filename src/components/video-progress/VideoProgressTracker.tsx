'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  VideoEntry,
  DICAS_GRAVACAO,
  POSES_SUGERIDAS,
  MARCOS_VIDEO,
  verificarSuporteVideo,
  getVideoConstraints,
  gerarThumbnail,
  calcularTransformacao,
  formatarDuracao,
} from '@/lib/video-progress'

export function VideoProgressTracker() {
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [gravando, setGravando] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [tipoGravacao, setTipoGravacao] = useState<'antes' | 'durante' | 'depois'>('antes')
  const [pesoAtual, setPesoAtual] = useState('')
  const [descricao, setDescricao] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [duracao, setDuracao] = useState(0)
  const [showDicas, setShowDicas] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const recordedChunks = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    carregarVideos()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const carregarVideos = async () => {
    try {
      const res = await fetch('/api/video-progress')
      const data = await res.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error)
    } finally {
      setLoading(false)
    }
  }

  const iniciarGravacao = useCallback(async () => {
    if (!verificarSuporteVideo()) {
      alert('Seu navegador não suporta gravação de vídeo')
      return
    }

    try {
      const constraints = getVideoConstraints('media')
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      recordedChunks.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setVideoPreview(url)

        // Parar stream
        mediaStream.getTracks().forEach(track => track.stop())
        setStream(null)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setGravando(true)
      setDuracao(0)

      // Timer
      timerRef.current = setInterval(() => {
        setDuracao(d => d + 1)
      }, 1000)

    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      alert('Erro ao acessar câmera. Verifique as permissões.')
    }
  }, [])

  const pararGravacao = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    setGravando(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [mediaRecorder])

  const descartarVideo = () => {
    setVideoPreview(null)
    recordedChunks.current = []
    setDuracao(0)
    setPesoAtual('')
    setDescricao('')
  }

  const salvarVideo = async () => {
    if (!videoPreview) return

    setSalvando(true)
    try {
      // Em produção, faria upload para Supabase Storage ou S3
      // Por enquanto, simula com URL local
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' })
      const thumbnail = await gerarThumbnail(new File([blob], 'video.webm'))

      // Simular URL (em produção seria upload real)
      const video_url = videoPreview

      const res = await fetch('/api/video-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: tipoGravacao,
          data: new Date().toISOString().split('T')[0],
          peso_kg: pesoAtual ? parseFloat(pesoAtual) : null,
          video_url,
          thumbnail_url: thumbnail,
          descricao,
          is_public: isPublic
        })
      })

      if (res.ok) {
        await carregarVideos()
        descartarVideo()
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar vídeo')
    } finally {
      setSalvando(false)
    }
  }

  const deletarVideo = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return

    try {
      await fetch(`/api/video-progress?id=${id}`, { method: 'DELETE' })
      setVideos(videos.filter(v => v.id !== id))
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }

  // Calcular transformação se tiver antes e depois
  const videoAntes = videos.find(v => v.tipo === 'antes')
  const videoDepois = videos.find(v => v.tipo === 'depois')
  const transformacao = videoAntes && videoDepois
    ? calcularTransformacao(videoAntes, videoDepois)
    : null

  // Próximo marco
  const diasDesdeInicio = videoAntes
    ? Math.floor((Date.now() - new Date(videoAntes.data).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>Carregando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Transformação */}
      {transformacao && (
        <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">🎉 Sua Transformação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {transformacao.dias_diferenca}
                </p>
                <p className="text-xs text-muted-foreground">dias</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  -{transformacao.peso_perdido}kg
                </p>
                <p className="text-xs text-muted-foreground">perdidos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  -{transformacao.percentual_perdido}%
                </p>
                <p className="text-xs text-muted-foreground">do peso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gravação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            Gravar Vídeo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!videoPreview ? (
            <>
              {/* Seletor de tipo */}
              <div className="flex gap-2">
                {(['antes', 'durante', 'depois'] as const).map((tipo) => (
                  <Button
                    key={tipo}
                    variant={tipoGravacao === tipo ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setTipoGravacao(tipo)}
                    disabled={gravando}
                  >
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Button>
                ))}
              </div>

              {/* Preview/Gravação */}
              <div className="relative aspect-[9/16] max-h-96 bg-black rounded-lg overflow-hidden">
                {gravando ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white font-mono">
                        {formatarDuracao(duracao)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <p className="text-4xl mb-2">📹</p>
                      <p>Toque para gravar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-2">
                {gravando ? (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={pararGravacao}
                  >
                    ⏹️ Parar ({formatarDuracao(duracao)})
                  </Button>
                ) : (
                  <Button className="w-full" onClick={iniciarGravacao}>
                    🎥 Iniciar Gravação
                  </Button>
                )}
              </div>

              {/* Dicas */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowDicas(!showDicas)}
              >
                {showDicas ? '▲ Ocultar dicas' : '▼ Ver dicas de gravação'}
              </Button>

              {showDicas && (
                <div className="grid grid-cols-2 gap-2">
                  {DICAS_GRAVACAO.map((dica, i) => (
                    <div key={i} className="p-2 bg-muted rounded-lg">
                      <p className="font-medium text-sm">
                        {dica.icone} {dica.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">{dica.dica}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Preview do vídeo gravado */}
              <div className="relative aspect-[9/16] max-h-96 bg-black rounded-lg overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Formulário */}
              <Input
                type="number"
                step="0.1"
                placeholder="Peso atual (kg)"
                value={pesoAtual}
                onChange={(e) => setPesoAtual(e.target.value)}
              />

              <Input
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <span className="text-sm">Compartilhar na comunidade</span>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={descartarVideo}
                >
                  Descartar
                </Button>
                <Button
                  className="flex-1"
                  onClick={salvarVideo}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Meus Vídeos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Meus Vídeos</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Nenhum vídeo gravado ainda. Grave seu primeiro vídeo!
            </p>
          ) : (
            <Tabs defaultValue="todos">
              <TabsList className="w-full">
                <TabsTrigger value="todos" className="flex-1">Todos</TabsTrigger>
                <TabsTrigger value="antes" className="flex-1">Antes</TabsTrigger>
                <TabsTrigger value="durante" className="flex-1">Durante</TabsTrigger>
                <TabsTrigger value="depois" className="flex-1">Depois</TabsTrigger>
              </TabsList>

              {['todos', 'antes', 'durante', 'depois'].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {videos
                      .filter(v => tab === 'todos' || v.tipo === tab)
                      .map((video) => (
                        <div
                          key={video.id}
                          className="relative rounded-lg overflow-hidden bg-muted"
                        >
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt=""
                              className="w-full aspect-[9/16] object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-[9/16] flex items-center justify-center">
                              <span className="text-3xl">🎬</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {video.tipo}
                              </Badge>
                              {video.peso_kg && (
                                <span className="text-xs text-white">
                                  {video.peso_kg}kg
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/80 mt-1">
                              {new Date(video.data).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 w-6 h-6"
                            onClick={() => deletarVideo(video.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Marcos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Marcos de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {MARCOS_VIDEO.map((marco, i) => {
              const atingido = diasDesdeInicio >= marco.dias
              const proximo = !atingido && (i === 0 || diasDesdeInicio >= MARCOS_VIDEO[i - 1].dias)

              return (
                <div
                  key={marco.dias}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    atingido
                      ? 'bg-green-50'
                      : proximo
                      ? 'bg-amber-50'
                      : 'bg-muted opacity-50'
                  }`}
                >
                  <span className="text-xl">
                    {atingido ? '✅' : proximo ? '🎯' : '⏳'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{marco.titulo}</p>
                    <p className="text-xs text-muted-foreground">{marco.descricao}</p>
                  </div>
                  <Badge variant={atingido ? 'default' : 'outline'}>
                    {marco.dias}d
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Poses Sugeridas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Poses Sugeridas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {POSES_SUGERIDAS.map((pose, i) => (
              <div key={i} className="p-2 bg-muted rounded-lg">
                <p className="font-medium text-sm">{pose.nome}</p>
                <p className="text-xs text-muted-foreground">{pose.descricao}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VideoProgressTracker
