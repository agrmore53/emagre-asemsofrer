'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ShareChallengeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  challengeName: string
  codigoConvite: string
}

export function ShareChallengeModal({
  open,
  onOpenChange,
  challengeName,
  codigoConvite,
}: ShareChallengeModalProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/desafios/entrar?codigo=${codigoConvite}`
    : ''

  const shareMessage = `Participe do desafio "${challengeName}" comigo! Use o código: ${codigoConvite}`

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage + '\n\n' + shareUrl)}`
    window.open(url, '_blank')
  }

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Desafio: ${challengeName}`,
          text: shareMessage,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Convidar Participantes</DialogTitle>
          <DialogDescription>
            Compartilhe o código para amigos entrarem no desafio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Código de convite */}
          <div className="text-center">
            <Label className="text-sm text-muted-foreground">Código de Convite</Label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="text-3xl font-mono font-bold tracking-widest">
                {codigoConvite}
              </p>
            </div>
          </div>

          {/* Botão copiar código */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleCopy(codigoConvite)}
          >
            {copied ? '✓ Copiado!' : 'Copiar Código'}
          </Button>

          {/* Link direto */}
          <div>
            <Label className="text-sm text-muted-foreground">Ou compartilhe o link:</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={shareUrl}
                readOnly
                className="text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(shareUrl)}
              >
                {copied ? '✓' : '📋'}
              </Button>
            </div>
          </div>

          {/* Botões de compartilhamento */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="bg-green-500 hover:bg-green-600 text-white border-0"
              onClick={handleShareWhatsApp}
            >
              WhatsApp
            </Button>
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <Button
                variant="outline"
                onClick={handleShareNative}
              >
                Mais opções
              </Button>
            )}
          </div>

          {/* Instruções */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-1">Como participar:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>O amigo acessa a plataforma</li>
              <li>Vai em Desafios &gt; Entrar com Código</li>
              <li>Digita o código <strong>{codigoConvite}</strong></li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareChallengeModal
