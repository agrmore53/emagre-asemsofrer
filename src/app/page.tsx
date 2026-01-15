import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Leaf,
  Sparkles,
  Ban,
  TrendingDown,
  Heart,
  BookOpen,
  LineChart,
  Utensils,
  Trophy,
  BarChart3,
  ClipboardList,
  ShoppingCart,
  Users,
  Check
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">Emagreca Sem Sofrer</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link href="/cadastro">
            <Button>Comecar Gratis</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 text-center">
        <Badge className="mb-6" variant="secondary">
          <Sparkles className="h-3 w-3 mr-1" />
          Novo: Cardapios personalizados com IA
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
          Emagreca de verdade, <span className="text-primary">sem abrir mao</span> do que voce ama comer
        </h1>
        <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
          O metodo que ja ajudou milhares de pessoas a perder peso sem dietas restritivas,
          sem passar fome e sem culpa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/cadastro">
            <Button size="lg" className="text-lg px-8">
              Comecar Gratis
            </Button>
          </Link>
          <Link href="#como-funciona">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Como funciona
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mt-6">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Sem cartao de credito</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Acesso imediato</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" /> Cancele quando quiser</span>
        </div>
      </section>

      {/* Problema */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Voce ja tentou de tudo para emagrecer?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Ban, title: 'Dietas restritivas', desc: 'Cortar carboidrato, jejum, dieta da sopa...' },
              { icon: TrendingDown, title: 'Efeito sanfona', desc: 'Perde peso, depois engorda tudo de volta' },
              { icon: Heart, title: 'Culpa constante', desc: 'Se sentir mal por comer o que gosta' },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xl mt-12 font-medium">
            A boa noticia: <span className="text-primary">existe outro caminho.</span>
          </p>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          O Metodo Emagreca Sem Sofrer
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Uma abordagem baseada em ciencia que funciona com a sua vida, nao contra ela.
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Aprenda', desc: 'Entenda o unico principio que faz voce emagrecer de verdade', icon: BookOpen },
            { step: '2', title: 'Acompanhe', desc: 'Registre seu progresso e veja sua evolucao em graficos', icon: LineChart },
            { step: '3', title: 'Coma bem', desc: 'Receba cardapios personalizados para sua rotina', icon: Utensils },
            { step: '4', title: 'Transforme', desc: 'Construa habitos que duram para a vida toda', icon: Trophy },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-8 w-8 text-primary" />
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
            Tudo que voce precisa em um so lugar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Conteudo Interativo', desc: '8 capitulos completos sobre emagrecimento saudavel' },
              { icon: BarChart3, title: 'Tracker de Progresso', desc: 'Registre peso e medidas, veja graficos de evolucao' },
              { icon: Utensils, title: 'Cardapios Personalizados', desc: 'Refeicoes adaptadas ao seu perfil e preferencias' },
              { icon: ClipboardList, title: 'Checklist Diario', desc: 'Acompanhe suas metas do dia de forma simples' },
              { icon: ShoppingCart, title: 'Lista de Compras', desc: 'Gerada automaticamente baseada no seu cardapio' },
              { icon: Users, title: 'Comunidade', desc: 'Conecte-se com outras pessoas na mesma jornada' },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="mb-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
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
          Comece gratis e faca upgrade quando quiser
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Gratis */}
          <Card>
            <CardHeader>
              <CardTitle>Gratis</CardTitle>
              <CardDescription>Para comecar sua jornada</CardDescription>
              <div className="text-4xl font-bold mt-4">R$0</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Capitulo 1 completo', 'Tracker basico (7 dias)', 'Calculadora de calorias'].map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> {item}
                </p>
              ))}
              <Link href="/cadastro" className="block mt-6">
                <Button variant="outline" className="w-full">Criar conta gratis</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Basico */}
          <Card className="border-primary shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Mais popular</Badge>
            <CardHeader>
              <CardTitle>Basico</CardTitle>
              <CardDescription>Para quem quer resultados</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$29</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Todo o conteudo (8 capitulos)', 'Tracker completo ilimitado', 'Historico de progresso', 'Bonus exclusivos'].map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> {item}
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
              <CardDescription>Experiencia completa</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$49</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Tudo do plano Basico', 'Cardapios personalizados', 'Lista de compras automatica', 'Suporte prioritario'].map((item, i) => (
                <p key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> {item}
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
            Pronto para comecar sua transformacao?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que ja descobriram que emagrecer nao precisa ser sofrimento.
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Comecar Gratis Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-bold">Emagreca Sem Sofrer</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/termos" className="hover:text-primary">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-primary">Privacidade</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              2025 Emagreca Sem Sofrer. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
