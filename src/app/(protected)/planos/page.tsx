'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Check,
  X,
  Crown,
  Star,
  Loader2,
  Sparkles,
  Shield,
  CreditCard,
} from 'lucide-react'
import { PLANOS, type PlanoId } from '@/lib/mercadopago/client'

interface AssinaturaInfo {
  planoAtual: string
  statusAssinatura: string
}

export default function PlanosPage() {
  const [loading, setLoading] = useState<PlanoId | null>(null)
  const [assinatura, setAssinatura] = useState<AssinaturaInfo | null>(null)

  useEffect(() => {
    fetch('/api/assinatura')
      .then((res) => res.json())
      .then(setAssinatura)
      .catch(console.error)
  }, [])

  const handleAssinar = async (planoId: PlanoId) => {
    setLoading(planoId)

    try {
      const response = await fetch('/api/assinatura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: planoId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar')
      }

      const data = await response.json()

      // Redireciona para o Mercado Pago
      if (data.initPoint) {
        window.location.href = data.initPoint
      } else if (data.sandboxInitPoint) {
        // Em desenvolvimento, usa sandbox
        window.location.href = data.sandboxInitPoint
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(null)
    }
  }

  const isPlanoAtivo = (planoId: string) => {
    return assinatura?.planoAtual === planoId && assinatura?.statusAssinatura === 'ativo'
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="text-sm px-4 py-1">
          <Sparkles className="h-3 w-3 mr-1" />
          Oferta de Lançamento
        </Badge>
        <h1 className="text-4xl font-bold">Escolha seu plano</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Invista na sua saúde. Nossos planos oferecem tudo que você precisa
          para emagrecer de forma saudável e definitiva.
        </p>
      </div>

      {/* Status atual */}
      {assinatura?.statusAssinatura === 'ativo' && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Assinatura Ativa</p>
                <p className="text-sm text-green-600">
                  Você está no plano {PLANOS[assinatura.planoAtual as PlanoId]?.nome || assinatura.planoAtual}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de planos */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(PLANOS).map(([id, plano]) => (
          <Card
            key={id}
            className={`relative overflow-hidden ${
              plano.popular
                ? 'border-primary shadow-lg scale-[1.02]'
                : 'border-border'
            }`}
          >
            {plano.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <Star className="h-3 w-3" />
                MAIS POPULAR
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                {plano.popular ? (
                  <Crown className="h-5 w-5 text-primary" />
                ) : (
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                )}
                <CardTitle className="text-xl">{plano.nome}</CardTitle>
              </div>
              <CardDescription>{plano.descricao}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Preço */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    R${plano.preco.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                {plano.precoOriginal > plano.preco && (
                  <p className="text-sm text-muted-foreground">
                    <span className="line-through">
                      R${plano.precoOriginal.toFixed(2).replace('.', ',')}
                    </span>
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {Math.round(((plano.precoOriginal - plano.preco) / plano.precoOriginal) * 100)}% OFF
                    </Badge>
                  </p>
                )}
              </div>

              {/* Recursos incluídos */}
              <ul className="space-y-3">
                {plano.recursos.map((recurso) => (
                  <li key={recurso} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{recurso}</span>
                  </li>
                ))}
              </ul>

              {/* Recursos não incluídos */}
              {plano.naoInclui.length > 0 && (
                <ul className="space-y-2 pt-2 border-t">
                  {plano.naoInclui.map((recurso) => (
                    <li key={recurso} className="flex items-start gap-2 text-muted-foreground">
                      <X className="h-5 w-5 shrink-0 mt-0.5" />
                      <span className="text-sm">{recurso}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                variant={plano.popular ? 'default' : 'outline'}
                disabled={loading !== null || isPlanoAtivo(id)}
                onClick={() => handleAssinar(id as PlanoId)}
              >
                {loading === id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : isPlanoAtivo(id) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Plano Atual
                  </>
                ) : (
                  'Assinar Agora'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Garantia */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Garantia de 7 dias</h3>
              <p className="text-sm text-muted-foreground">
                Se não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ rápido */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Perguntas Frequentes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Posso cancelar quando quiser?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode cancelar a qualquer momento direto pelo painel. Sem multas ou taxas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quais formas de pagamento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cartão de crédito, boleto bancário e Pix. Processamos via Mercado Pago.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
