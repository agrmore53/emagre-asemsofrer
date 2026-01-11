'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Challenge } from '@/lib/challenges'

interface JoinChallengeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (challenge: Challenge) => void
}

export function JoinChallengeModal({
  open,
  onOpenChange,
  onSuccess,
}: JoinChallengeModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [codigo, setCodigo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.toUpperCase().trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao entrar no desafio')
      }

      onSuccess?.(data.challenge)
      onOpenChange(false)
      setCodigo('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar no desafio')
    } finally {
      setLoading(false)
    }
  }

  const formatCode = (value: string) => {
    // Remove non-alphanumeric, uppercase, limit to 6 chars
    return value
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Entrar em um Desafio</DialogTitle>
          <DialogDescription>
            Digite o código de convite compartilhado pelo organizador
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="codigo">Código de Convite</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(formatCode(e.target.value))}
              placeholder="Ex: ABC123"
              className="text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              required
            />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              6 caracteres (letras e números)
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || codigo.length < 6}>
              {loading ? 'Entrando...' : 'Entrar no Desafio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default JoinChallengeModal
