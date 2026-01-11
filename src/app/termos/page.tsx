import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso da plataforma Emagreça Sem Sofrer',
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>

        <div className="prose prose-neutral max-w-none space-y-6">
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e usar a plataforma Emagreça Sem Sofrer, você concorda em cumprir
              e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer
              parte destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Descrição do Serviço</h2>
            <p>
              O Emagreça Sem Sofrer é uma plataforma digital que oferece:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Conteúdo educacional sobre emagrecimento saudável</li>
              <li>Ferramentas de acompanhamento de peso e medidas</li>
              <li>Sugestões de cardápios personalizados</li>
              <li>Calculadoras nutricionais</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Nosso serviço NÃO substitui acompanhamento
              médico ou nutricional profissional. Sempre consulte um profissional de
              saúde antes de iniciar qualquer programa de emagrecimento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Cadastro e Conta</h2>
            <p>
              Para acessar nossos serviços, você precisa criar uma conta fornecendo
              informações verdadeiras e completas. Você é responsável por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades que ocorrem em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Assinaturas e Pagamentos</h2>
            <p>
              Oferecemos planos de assinatura mensal. Ao assinar:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A cobrança é realizada mensalmente via Mercado Pago</li>
              <li>Você pode cancelar a qualquer momento</li>
              <li>Não há reembolso proporcional após o cancelamento</li>
              <li>Oferecemos garantia de 7 dias para novos assinantes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Uso Aceitável</h2>
            <p>Você concorda em NÃO:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usar o serviço para fins ilegais</li>
              <li>Compartilhar sua conta com terceiros</li>
              <li>Copiar, distribuir ou reproduzir nosso conteúdo</li>
              <li>Tentar acessar áreas restritas do sistema</li>
              <li>Usar automação para acessar o serviço</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma, incluindo textos, imagens, gráficos,
              logos e software, é de propriedade exclusiva do Emagreça Sem Sofrer
              ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Limitação de Responsabilidade</h2>
            <p>
              O Emagreça Sem Sofrer fornece informações gerais sobre saúde e
              emagrecimento. Não somos responsáveis por:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Resultados individuais de emagrecimento</li>
              <li>Decisões tomadas com base em nosso conteúdo</li>
              <li>Problemas de saúde decorrentes do uso da plataforma</li>
              <li>Interrupções temporárias do serviço</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Modificações</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento.
              Alterações significativas serão comunicadas por email. O uso continuado
              da plataforma após modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contato</h2>
            <p>
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <p className="font-medium">
              Email: contato@emagreçasemsofrer.com.br
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Ao usar nossa plataforma, você confirma que leu e concordou com estes termos.
          </p>
        </div>
      </div>
    </div>
  )
}
