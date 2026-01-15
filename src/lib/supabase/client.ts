import { createBrowserClient } from '@supabase/ssr'
import { createMockClient, DEMO_MODE } from './mock-client'

export function createClient() {
  // Modo demonstracao - usa dados fake
  if (DEMO_MODE) {
    return createMockClient() as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
