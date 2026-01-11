'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, User, LogOut, Settings } from 'lucide-react'
import { toast } from 'sonner'
import type { Profile } from '@/types'

interface HeaderProps {
  profile: Profile | null
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/conteudo', label: 'Conteúdo', icon: '📖' },
  { href: '/tracker', label: 'Tracker', icon: '📈' },
  { href: '/cardapio', label: 'Cardápio', icon: '🍽️' },
  { href: '/conquistas', label: 'Conquistas', icon: '🏆' },
  { href: '/planos', label: 'Planos', icon: '⭐' },
]

export function Header({ profile }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logout realizado com sucesso!')
    router.push('/')
    router.refresh()
  }

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="font-bold text-lg hidden sm:inline-block">Emagreça Sem Sofrer</span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.nome ? getInitials(profile.nome) : <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.nome || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <hr className="my-4" />
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  Meu Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-lg font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
