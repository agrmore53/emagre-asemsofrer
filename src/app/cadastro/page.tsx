'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function CadastroPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Conta criada com sucesso! Bem-vindo(a)!')

      // Envia email de boas-vindas (em background)
      fetch('/api/email/boas-vindas', { method: 'POST' }).catch(() => {
        // Ignora erro - não é crítico
      })

      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Emagreça Sem Sofrer</h1>
          <p className="text-muted-foreground mt-2">Comece sua transformação hoje</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar conta grátis</CardTitle>
            <CardDescription>
              Preencha seus dados para começar sua jornada
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleCadastro}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta grátis'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Fazer login
                </Link>
              </p>

              <p className="text-xs text-center text-muted-foreground">
                Ao criar uma conta, você concorda com nossos{' '}
                <Link href="/termos" className="underline hover:text-primary">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link href="/privacidade" className="underline hover:text-primary">
                  Política de Privacidade
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Link para voltar */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  )
}
