import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight, Mail, FileText } from 'lucide-react'

export default function PagamentoPendentePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-yellow-50 to-white">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="pb-2">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Pagamento em Processamento</CardTitle>
          <CardDescription className="text-base mt-2">
            Estamos aguardando a confirmação do seu pagamento
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Seu pagamento foi recebido e está sendo processado. Isso pode levar alguns minutos
            (cartão) ou até 3 dias úteis (boleto/Pix).
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-yellow-800 mb-2">O que acontece agora:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Estamos verificando seu pagamento</li>
              <li>• Você receberá um email quando for confirmado</li>
              <li>• Seu acesso será liberado automaticamente</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4 text-left">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Se você pagou com boleto:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• O prazo é de até 3 dias úteis após o pagamento</li>
              <li>• Guarde o comprovante de pagamento</li>
              <li>• Verifique se o valor foi debitado da sua conta</li>
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
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Você receberá um email quando o pagamento for confirmado
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
