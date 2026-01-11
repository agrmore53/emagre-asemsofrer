import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da plataforma Emagreça Sem Sofrer',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-neutral max-w-none space-y-6">
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introdução</h2>
            <p>
              O Emagreça Sem Sofrer está comprometido em proteger sua privacidade.
              Esta política explica como coletamos, usamos e protegemos suas informações
              pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Dados que Coletamos</h2>
            <p>Coletamos os seguintes tipos de informações:</p>

            <h3 className="text-xl font-medium mt-4">2.1 Dados de Cadastro</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome completo</li>
              <li>Email</li>
              <li>Data de nascimento</li>
              <li>Sexo</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">2.2 Dados de Saúde</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Peso atual e histórico</li>
              <li>Altura</li>
              <li>Medidas corporais (cintura, quadril, braço)</li>
              <li>Restrições alimentares</li>
              <li>Nível de atividade física</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">2.3 Dados de Uso</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Páginas acessadas</li>
              <li>Tempo de uso</li>
              <li>Progresso no conteúdo</li>
              <li>Cardápios gerados</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">2.4 Dados de Pagamento</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Histórico de transações</li>
              <li>Status de assinatura</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Dados de cartão de crédito são processados
              exclusivamente pelo Mercado Pago e não armazenamos essas informações.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Como Usamos seus Dados</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer e personalizar nossos serviços</li>
              <li>Calcular suas necessidades calóricas</li>
              <li>Gerar cardápios personalizados</li>
              <li>Acompanhar seu progresso de emagrecimento</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar comunicações importantes sobre o serviço</li>
              <li>Melhorar nossa plataforma</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Base Legal</h2>
            <p>
              Processamos seus dados com base nas seguintes bases legais da LGPD:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Execução de contrato:</strong> Para fornecer os serviços contratados</li>
              <li><strong>Consentimento:</strong> Para dados sensíveis de saúde</li>
              <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços</li>
              <li><strong>Obrigação legal:</strong> Para cumprir obrigações fiscais</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Compartilhamento de Dados</h2>
            <p>Seus dados podem ser compartilhados com:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Armazenamento de dados</li>
              <li><strong>Mercado Pago:</strong> Processamento de pagamentos</li>
              <li><strong>Vercel:</strong> Hospedagem da plataforma</li>
            </ul>
            <p className="mt-2">
              <strong>Não vendemos</strong> seus dados pessoais para terceiros.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Segurança dos Dados</h2>
            <p>Protegemos suas informações através de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Criptografia de dados em repouso</li>
              <li>Controle de acesso baseado em funções</li>
              <li>Autenticação segura</li>
              <li>Monitoramento contínuo de segurança</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acesso:</strong> Solicitar cópia de seus dados pessoais</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Retirar seu consentimento a qualquer momento</li>
              <li><strong>Informação:</strong> Saber com quem seus dados são compartilhados</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo email abaixo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Retenção de Dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa ou conforme
              necessário para fornecer nossos serviços. Após o cancelamento da conta:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dados de perfil: excluídos em até 30 dias</li>
              <li>Dados de uso: anonimizados após 90 dias</li>
              <li>Dados fiscais: mantidos por 5 anos (obrigação legal)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para o funcionamento da plataforma:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sessão:</strong> Para manter você logado</li>
              <li><strong>Preferências:</strong> Para lembrar suas configurações</li>
            </ul>
            <p className="mt-2">
              Não utilizamos cookies de rastreamento ou publicidade.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Alterações</h2>
            <p>
              Podemos atualizar esta política periodicamente. Alterações significativas
              serão comunicadas por email e/ou aviso na plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contato</h2>
            <p>
              Para dúvidas sobre privacidade ou exercer seus direitos:
            </p>
            <p className="font-medium">
              Email: privacidade@emagreçasemsofrer.com.br
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Encarregado de Proteção de Dados (DPO): A definir
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            Esta política está em conformidade com a LGPD (Lei 13.709/2018).
          </p>
          <Link href="/termos" className="text-primary hover:underline">
            Ver Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  )
}
