import { createBrowserClient } from '@supabase/ssr'
import { createMockClient, DEMO_MODE } from './mock-client'

console.log('[CLIENT] client.ts carregado, DEMO_MODE:', DEMO_MODE)

export function createClient() {
  console.log('[CLIENT] createClient() chamado, DEMO_MODE:', DEMO_MODE)

  // Modo demonstracao - usa dados fake
  if (DEMO_MODE) {
    console.log('[CLIENT] Usando mock client')
    return createMockClient() as ReturnType<typeof createBrowserClient>
  }

  console.log('[CLIENT] Usando Supabase real')
  console.log('[CLIENT] URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
