import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import type { Profile } from '@/types'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Busca o perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
      <Header profile={profile as Profile | null} />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Emagreça Sem Sofrer. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
