// Mock do cliente Supabase para modo demonstracao
console.log('[MOCK] Carregando mock-client.ts')

import {
  DEMO_USER,
  DEMO_PROFILE,
  DEMO_TRACKER_REGISTROS,
  DEMO_CONTEUDO_PROGRESSO,
  DEMO_STREAK,
  DEMO_CONQUISTAS,
  DEMO_USUARIO_CONQUISTAS,
  DEMO_CARDAPIOS,
  DEMO_CHALLENGES,
} from './mock-data'

console.log('[MOCK] Dados importados com sucesso')

// Estado em memoria (simula banco de dados)
let mockTrackerRegistros = [...DEMO_TRACKER_REGISTROS]
let mockConteudoProgresso = [...DEMO_CONTEUDO_PROGRESSO]
let mockCardapios = [...DEMO_CARDAPIOS]

type MockData = Record<string, unknown[]>

const mockDatabase: MockData = {
  profiles: [DEMO_PROFILE],
  tracker_registros: mockTrackerRegistros,
  conteudo_progresso: mockConteudoProgresso,
  usuario_streaks: [DEMO_STREAK],
  conquistas: DEMO_CONQUISTAS,
  usuario_conquistas: DEMO_USUARIO_CONQUISTAS,
  cardapios: mockCardapios,
  challenges: DEMO_CHALLENGES,
  challenge_participantes: [],
  leaderboard_semanal: [],
  glp1_registros: [],
  ciclo_menstrual: [],
  sleep_records: [],
  apostas: [],
  video_progress: [],
  wearable_devices: [],
  coach_conversations: [],
}

// Helpers para simular queries
function filterData(data: unknown[], filters: Record<string, unknown>): unknown[] {
  return data.filter(item => {
    const record = item as Record<string, unknown>
    return Object.entries(filters).every(([key, value]) => record[key] === value)
  })
}

function sortData(data: unknown[], column: string, ascending: boolean): unknown[] {
  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[column]
    const bVal = (b as Record<string, unknown>)[column]
    if (aVal === undefined || bVal === undefined) return 0
    if (aVal < bVal) return ascending ? -1 : 1
    if (aVal > bVal) return ascending ? 1 : -1
    return 0
  })
}

// Mock Query Builder
class MockQueryBuilder {
  private tableName: string
  private data: unknown[]
  private filters: Record<string, unknown> = {}
  private sortColumn: string | null = null
  private sortAscending = true
  private limitCount: number | null = null
  private selectColumns: string = '*'
  private isSingle = false

  constructor(tableName: string) {
    this.tableName = tableName
    this.data = mockDatabase[tableName] || []
  }

  select(columns: string = '*') {
    this.selectColumns = columns
    return this
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value
    return this
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.sortColumn = column
    this.sortAscending = options.ascending !== false
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    this.isSingle = true
    return this.execute()
  }

  async execute() {
    let result = [...this.data]

    // Aplica filtros
    if (Object.keys(this.filters).length > 0) {
      result = filterData(result, this.filters)
    }

    // Aplica ordenacao
    if (this.sortColumn) {
      result = sortData(result, this.sortColumn, this.sortAscending)
    }

    // Aplica limite
    if (this.limitCount) {
      result = result.slice(0, this.limitCount)
    }

    if (this.isSingle) {
      return { data: result[0] || null, error: null }
    }

    return { data: result, error: null }
  }

  then(resolve: (value: { data: unknown; error: null }) => void) {
    this.execute().then(resolve)
  }
}

// Mock Insert Builder
class MockInsertBuilder {
  private tableName: string
  private insertData: unknown

  constructor(tableName: string, data: unknown) {
    this.tableName = tableName
    this.insertData = data
  }

  select() {
    return this
  }

  single() {
    return this.execute()
  }

  async execute() {
    const newItem = {
      ...(this.insertData as Record<string, unknown>),
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    if (!mockDatabase[this.tableName]) {
      mockDatabase[this.tableName] = []
    }
    mockDatabase[this.tableName].push(newItem)

    return { data: newItem, error: null }
  }

  then(resolve: (value: { data: unknown; error: null }) => void) {
    this.execute().then(resolve)
  }
}

// Mock Update Builder
class MockUpdateBuilder {
  private tableName: string
  private updateData: Record<string, unknown>
  private filters: Record<string, unknown> = {}

  constructor(tableName: string, data: Record<string, unknown>) {
    this.tableName = tableName
    this.updateData = data
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value
    return this
  }

  select() {
    return this
  }

  single() {
    return this.execute()
  }

  async execute() {
    const table = mockDatabase[this.tableName] || []
    let updated = null

    for (let i = 0; i < table.length; i++) {
      const item = table[i] as Record<string, unknown>
      const matches = Object.entries(this.filters).every(([key, value]) => item[key] === value)
      if (matches) {
        table[i] = { ...item, ...this.updateData }
        updated = table[i]
        break
      }
    }

    return { data: updated, error: null }
  }

  then(resolve: (value: { data: unknown; error: null }) => void) {
    this.execute().then(resolve)
  }
}

// Mock Delete Builder
class MockDeleteBuilder {
  private tableName: string
  private filters: Record<string, unknown> = {}

  constructor(tableName: string) {
    this.tableName = tableName
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value
    return this
  }

  async execute() {
    const table = mockDatabase[this.tableName] || []
    const filtered = table.filter(item => {
      const record = item as Record<string, unknown>
      return !Object.entries(this.filters).every(([key, value]) => record[key] === value)
    })
    mockDatabase[this.tableName] = filtered
    return { data: null, error: null }
  }

  then(resolve: (value: { data: null; error: null }) => void) {
    this.execute().then(resolve)
  }
}

// Mock Supabase Client
export function createMockClient() {
  console.log('[MOCK] createMockClient() chamado')
  return {
    auth: {
      getUser: async () => {
        console.log('[MOCK] auth.getUser() chamado')
        return { data: { user: DEMO_USER }, error: null }
      },
      getSession: async () => {
        console.log('[MOCK] auth.getSession() chamado')
        return { data: { session: { user: DEMO_USER } }, error: null }
      },
      signInWithPassword: async () => {
        console.log('[MOCK] auth.signInWithPassword() chamado')
        return { data: { user: DEMO_USER, session: {} }, error: null }
      },
      signUp: async () => {
        console.log('[MOCK] auth.signUp() chamado')
        return { data: { user: DEMO_USER, session: {} }, error: null }
      },
      signOut: async () => {
        console.log('[MOCK] auth.signOut() chamado')
        return { error: null }
      },
      onAuthStateChange: () => {
        console.log('[MOCK] auth.onAuthStateChange() chamado')
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
    from: (tableName: string) => {
      console.log(`[MOCK] from('${tableName}') chamado`)
      return {
        select: (columns: string = '*') => {
          console.log(`[MOCK] select('${columns}') em ${tableName}`)
          const builder = new MockQueryBuilder(tableName)
          return builder.select(columns)
        },
        insert: (data: unknown) => {
          console.log(`[MOCK] insert() em ${tableName}`)
          return new MockInsertBuilder(tableName, data)
        },
        update: (data: Record<string, unknown>) => {
          console.log(`[MOCK] update() em ${tableName}`)
          return new MockUpdateBuilder(tableName, data)
        },
        delete: () => {
          console.log(`[MOCK] delete() em ${tableName}`)
          return new MockDeleteBuilder(tableName)
        },
        upsert: (data: unknown) => {
          console.log(`[MOCK] upsert() em ${tableName}`)
          return new MockInsertBuilder(tableName, data)
        },
      }
    },
    storage: {
      from: (bucket: string) => {
        console.log(`[MOCK] storage.from('${bucket}') chamado`)
        return {
          upload: async () => ({ data: { path: 'mock-path' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '/placeholder.jpg' } }),
        }
      },
    },
  }
}

console.log('[MOCK] DEMO_MODE = true')
export const DEMO_MODE = true
