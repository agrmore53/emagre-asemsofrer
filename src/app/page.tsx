import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="font-bold text-xl">Emagreça Sem Sofrer</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/cadastro">
            <Button>Começar Grátis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 text-center">
        <Badge className="mb-6" variant="secondary">
          ✨ Novo: Cardápios personalizados com IA
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
          Emagreça de verdade, <span className="text-primary">sem abrir mão</span> do que você ama comer
        </h1>
        <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          O método que já ajudou milhares de pessoas a perder peso sem dietas restritivas,
          sem passar fome e sem culpa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/cadastro">
            <Button size="lg" className="text-lg px-8">
              Começar Grátis →
            </Button>
          </Link>
          <Link href="#como-funciona">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Como funciona
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          ✓ Sem cartão de crédito &nbsp; ✓ Acesso imediato &nbsp; ✓ Cancele quando quiser
        </p>
      </section>

      {/* Problema */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Você já tentou de tudo para emagrecer?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { emoji: '🚫', title: 'Dietas restritivas', desc: 'Cortar carboidrato, jejum, dieta da sopa...' },
              { emoji: '😔', title: 'Efeito sanfona', desc: 'Perde peso, depois engorda tudo de volta' },
              { emoji: '😰', title: 'Culpa constante', desc: 'Se sentir mal por comer o que gosta' },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <span className="text-4xl mb-2">{item.emoji}</span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xl mt-12 font-medium">
            A boa notícia: <span className="text-primary">existe outro caminho.</span>
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          O Método Emagreça Sem Sofrer
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Uma abordagem baseada em ciência que funciona com a sua vida, não contra ela.
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Aprenda', desc: 'Entenda o único princípio que faz você emagrecer de verdade', icon: '📖' },
            { step: '2', title: 'Acompanhe', desc: 'Registre seu progresso e veja sua evolução em gráficos', icon: '📈' },
            { step: '3', title: 'Coma bem', desc: 'Receba cardápios personalizados para sua rotina', icon: '🍽️' },
            { step: '4', title: 'Transforme', desc: 'Construa hábitos que duram para a vida toda', icon: '🏆' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <Badge variant="outline" className="mb-2">Passo {item.step}</Badge>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-muted-foreground mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tudo que você precisa em um só lugar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📖', title: 'Conteúdo Interativo', desc: '8 capítulos completos sobre emagrecimento saudável' },
              { icon: '📊', title: 'Tracker de Progresso', desc: 'Registre peso e medidas, veja gráficos de evolução' },
              { icon: '🍽️', title: 'Cardápios Personalizados', desc: 'Refeições adaptadas ao seu perfil e preferências' },
              { icon: '📝', title: 'Checklist Diário', desc: 'Acompanhe suas metas do dia de forma simples' },
              { icon: '🛒', title: 'Lista de Compras', desc: 'Gerada automaticamente baseada no seu cardápio' },
              { icon: '💬', title: 'Comunidade', desc: 'Conecte-se com outras pessoas na mesma jornada' },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <span className="text-3xl mb-2">{item.icon}</span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          Escolha seu plano
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Comece grátis e faça upgrade quando quiser
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Grátis */}
          <Card>
            <CardHeader>
              <CardTitle>Grátis</CardTitle>
              <CardDescription>Para começar sua jornada</CardDescription>
              <div className="text-4xl font-bold mt-4">R$0</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Capítulo 1 completo', 'Tracker básico (7 dias)', 'Calculadora de calorias'].map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {item}
                </p>
              ))}
              <Link href="/cadastro" className="block mt-6">
                <Button variant="outline" className="w-full">Criar conta grátis</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Básico */}
          <Card className="border-primary shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Mais popular</Badge>
            <CardHeader>
              <CardTitle>Básico</CardTitle>
              <CardDescription>Para quem quer resultados</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$29</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Todo o conteúdo (8 capítulos)', 'Tracker completo ilimitado', 'Histórico de progresso', 'Bônus exclusivos'].map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {item}
                </p>
              ))}
              <Link href="/cadastro" className="block mt-6">
                <Button className="w-full">Assinar agora</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card>
            <CardHeader>
              <CardTitle>Premium</CardTitle>
              <CardDescription>Experiência completa</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$49</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Tudo do plano Básico', 'Cardápios personalizados', 'Lista de compras automática', 'Suporte prioritário'].map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span> {item}
                </p>
              ))}
              <Link href="/cadastro" className="block mt-6">
                <Button variant="outline" className="w-full">Assinar Premium</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua transformação?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram que emagrecer não precisa ser sofrimento.
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Começar Grátis Agora →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <span className="font-bold">Emagreça Sem Sofrer</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/termos" className="hover:text-primary">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-primary">Privacidade</Link>
              <Link href="/contato" className="hover:text-primary">Contato</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Emagreça Sem Sofrer
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
