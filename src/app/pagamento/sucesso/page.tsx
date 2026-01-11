import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, PartyPopper } from 'lucide-react'

export default function PagamentoSucessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            Pagamento Aprovado!
            <PartyPopper className="h-6 w-6 text-yellow-500" />
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Sua assinatura foi ativada com sucesso
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Parabéns! Você agora tem acesso completo a todos os recursos da plataforma.
            Sua jornada de emagrecimento saudável começa agora!
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-green-800 mb-2">O que você pode fazer agora:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Acessar todo o conteúdo do método</li>
              <li>• Registrar seu peso no tracker</li>
              <li>• Gerar cardápios personalizados</li>
              <li>• Acompanhar sua evolução</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/dashboard">
              Ir para o Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/cardapio">
              Gerar meu primeiro cardápio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
