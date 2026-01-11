'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  ProdutoInfo,
  CATEGORIAS_PRODUTO,
  buscarProdutoLocal,
  buscarProdutoAPI,
  verificarSuporteCamera,
} from '@/lib/barcode'

export function BarcodeScanner() {
  const [codigo, setCodigo] = useState('')
  const [produto, setProduto] = useState<ProdutoInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [usandoCamera, setUsandoCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const buscarProduto = async (codigoBarra: string) => {
    if (!codigoBarra || codigoBarra.length < 8) {
      setErro('Código inválido')
      return
    }

    setLoading(true)
    setErro('')
    setProduto(null)

    try {
      // Primeiro tenta local
      let result = buscarProdutoLocal(codigoBarra)

      // Se não encontrou, tenta API
      if (!result) {
        result = await buscarProdutoAPI(codigoBarra)
      }

      if (result) {
        setProduto(result)
      } else {
        setErro('Produto não encontrado. Tente outro código.')
      }
    } catch (error) {
      setErro('Erro ao buscar produto')
    } finally {
      setLoading(false)
    }
  }

  const iniciarCamera = async () => {
    if (!verificarSuporteCamera()) {
      setErro('Câmera não suportada neste dispositivo')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setUsandoCamera(true)

      // Nota: Para scanner real, usaria biblioteca como @zxing/library
      // Aqui é uma implementação simplificada
    } catch (error) {
      setErro('Não foi possível acessar a câmera')
    }
  }

  const pararCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setUsandoCamera(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    buscarProduto(codigo)
  }

  const registrarAlimento = async () => {
    if (!produto) return

    // Aqui salvaria o alimento no diário
    alert(`${produto.nome} adicionado ao diário!`)
  }

  const catInfo = produto ? CATEGORIAS_PRODUTO[produto.categoria] : null

  return (
    <div className="space-y-4">
      {/* Scanner / Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📷</span>
            Scanner de Código de Barras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usandoCamera ? (
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-32 border-2 border-white rounded-lg opacity-50" />
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Posicione o código de barras dentro do quadro
              </p>
              <Button variant="outline" className="w-full" onClick={pararCamera}>
                Cancelar
              </Button>
            </div>
          ) : (
            <>
              <Button className="w-full" onClick={iniciarCamera}>
                📷 Escanear com Câmera
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou digite o código
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex: 7891000100103"
                  className="font-mono"
                  maxLength={14}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? '...' : 'Buscar'}
                </Button>
              </form>
            </>
          )}

          {erro && (
            <p className="text-sm text-destructive text-center">{erro}</p>
          )}
        </CardContent>
      </Card>

      {/* Resultado */}
      {produto && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{produto.nome}</CardTitle>
                {produto.marca && (
                  <p className="text-sm text-muted-foreground">{produto.marca}</p>
                )}
              </div>
              {catInfo && (
                <Badge variant="secondary">
                  {catInfo.icone} {catInfo.nome}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Porção: {produto.porcao}</p>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-lg font-bold text-amber-700">{produto.calorias}</p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-lg font-bold text-red-700">{produto.proteinas}g</p>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-700">{produto.carboidratos}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-lg font-bold text-yellow-700">{produto.gorduras}g</p>
                <p className="text-xs text-muted-foreground">Gordura</p>
              </div>
            </div>

            {(produto.fibras || produto.sodio) && (
              <div className="grid grid-cols-2 gap-2">
                {produto.fibras && (
                  <div className="p-2 bg-muted rounded text-center">
                    <span className="text-sm">Fibras: {produto.fibras}g</span>
                  </div>
                )}
                {produto.sodio && (
                  <div className="p-2 bg-muted rounded text-center">
                    <span className="text-sm">Sódio: {produto.sodio}mg</span>
                  </div>
                )}
              </div>
            )}

            <Button className="w-full" onClick={registrarAlimento}>
              Adicionar ao Diário
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Produtos populares para teste */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Códigos para Teste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { codigo: '7891000100103', nome: 'Leite Ninho' },
              { codigo: '7896045104574', nome: 'Frango Sadia' },
              { codigo: '7891149103010', nome: 'Arroz Camil' },
              { codigo: '7896036093085', nome: 'Whey Growth' },
            ].map((p) => (
              <Button
                key={p.codigo}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setCodigo(p.codigo)
                  buscarProduto(p.codigo)
                }}
              >
                <span className="truncate">{p.nome}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BarcodeScanner
