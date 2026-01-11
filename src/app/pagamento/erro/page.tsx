import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react'

export default function PagamentoErroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-red-50 to-white">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento Não Aprovado</CardTitle>
          <CardDescription className="text-base mt-2">
            Infelizmente não conseguimos processar seu pagamento
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Isso pode acontecer por alguns motivos. Não se preocupe, você pode tentar novamente.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-red-800 mb-2">Possíveis causas:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Limite insuficiente no cartão</li>
              <li>• Dados do cartão incorretos</li>
              <li>• Cartão bloqueado para compras online</li>
              <li>• Problema temporário no banco</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4 text-left">
            <h4 className="font-medium mb-2">Sugestões:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verifique os dados do cartão</li>
              <li>• Tente outro cartão ou método de pagamento</li>
              <li>• Entre em contato com seu banco</li>
              <li>• Tente novamente em alguns minutos</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/planos">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Link>
          </Button>
          <div className="flex gap-2 w-full">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="mailto:suporte@emagreçasemsofrer.com.br">
                <MessageCircle className="h-4 w-4 mr-1" />
                Suporte
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
