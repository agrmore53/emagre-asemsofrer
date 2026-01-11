'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CheckCircle, Circle } from 'lucide-react'

interface MarcarConcluidoButtonProps {
  capituloId: string
  jaConcluido: boolean
}

export function MarcarConcluidoButton({ capituloId, jaConcluido }: MarcarConcluidoButtonProps) {
  const [loading, setLoading] = useState(false)
  const [concluido, setConcluido] = useState(jaConcluido)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Você precisa estar logado')
        return
      }

      if (concluido) {
        // Desmarcar como concluído
        await supabase
          .from('conteudo_progresso')
          .update({ concluido: false, data_conclusao: null })
          .eq('user_id', user.id)
          .eq('capitulo_id', capituloId)

        setConcluido(false)
        toast.success('Capítulo desmarcado')
      } else {
        // Marcar como concluído
        const { error } = await supabase
          .from('conteudo_progresso')
          .upsert({
            user_id: user.id,
            capitulo_id: capituloId,
            concluido: true,
            data_conclusao: new Date().toISOString(),
          }, {
            onConflict: 'user_id,capitulo_id'
          })

        if (error) throw error

        setConcluido(true)
        toast.success('Capítulo concluído! 🎉')
      }

      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error)
      toast.error('Erro ao atualizar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={concluido ? 'outline' : 'default'}
      size="lg"
      className={`${concluido ? 'border-green-500 text-green-600 hover:bg-green-50' : ''}`}
    >
      {loading ? (
        'Salvando...'
      ) : concluido ? (
        <>
          <CheckCircle className="mr-2 h-5 w-5" />
          Lido ✓
        </>
      ) : (
        <>
          <Circle className="mr-2 h-5 w-5" />
          Marcar como lido
        </>
      )}
    </Button>
  )
}
